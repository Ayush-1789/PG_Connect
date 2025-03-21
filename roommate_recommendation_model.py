import pandas as pd
import numpy as np
import os
import faiss
import pickle
import logging
from sklearn.preprocessing import StandardScaler, OneHotEncoder

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class RoommateRecommender:
    def __init__(self, data_path='Roommate_Matching_Dataset.csv'):
        """Initialize the roommate recommendation model."""
        self.data_path = data_path
        self.model_data_path = 'roommate_model_data.pkl'
        
        # These will be set during training
        self.df = None
        self.processed_df = None
        self.feature_matrix = None
        self.feature_names = None
        self.n_features = None
        self.index = None
        self.scaler = None
        
    def load_data(self):
        """Load roommate data from CSV file."""
        try:
            self.df = pd.read_csv(self.data_path)
            logger.info(f"Loaded data with {len(self.df)} roommate entries")
            return True
        except Exception as e:
            logger.error(f"Error loading data: {str(e)}")
            return False
            
    def preprocess_data(self):
        """Preprocess roommate data for the recommendation model."""
        if self.df is None:
            self.load_data()
            
        # Define numerical and categorical features based on actual CSV structure
        numerical_features = ['Budget']
        categorical_features = ['Lease Duration', 'Furnishing', 'Smoking/Drinking', 
                              'Guests Allowed', 'Daily Routine']
        
        # Create a copy to avoid modifying the original
        self.processed_df = self.df.copy()
        
        # Scale numerical features
        self.scaler = StandardScaler()
        if len(numerical_features) > 0:
            self.processed_df[numerical_features] = self.scaler.fit_transform(self.processed_df[numerical_features])
        
        # One-hot encode categorical features
        for feature in categorical_features:
            # Create dummy variables with prefix
            dummies = pd.get_dummies(self.processed_df[feature], prefix=feature)
            # Add to processed dataframe
            self.processed_df = pd.concat([self.processed_df, dummies], axis=1)
        
        # Store feature names (excluding original ones that were transformed)
        self.feature_names = [col for col in self.processed_df.columns 
                            if col not in self.df.columns or col in numerical_features]
        
        # Create feature matrix
        self.feature_matrix = self.processed_df[self.feature_names].values.astype(np.float32)
        self.n_features = len(self.feature_names)
        
        logger.info(f"Preprocessed data into {self.n_features} features")
        return self.processed_df
    
    def build_index(self):
        """Build the FAISS index for fast similarity search."""
        if self.feature_matrix is None:
            self.preprocess_data()
            
        # Create a flat L2 index (Euclidean distance)
        self.index = faiss.IndexFlatL2(self.n_features)
        
        # Add vectors to the index
        self.index.add(self.feature_matrix)
        
        # Save model data
        with open(self.model_data_path, 'wb') as f:
            pickle.dump({
                'feature_names': self.feature_names,
                'n_features': self.n_features,
                'scaler': self.scaler,
                'df': self.df
            }, f)
            
        logger.info(f"Built FAISS index with {self.index.ntotal} vectors")
        return self.index
    
    def load_model(self):
        """Load a pre-trained model."""
        try:
            # Load model data
            with open(self.model_data_path, 'rb') as f:
                model_data = pickle.load(f)
                
            self.feature_names = model_data['feature_names']
            self.n_features = model_data['n_features']
            self.scaler = model_data['scaler']
            self.df = model_data['df']
            
            # Preprocess data to get feature matrix
            self.preprocess_data()
            
            # Create a new index and add vectors
            self.index = faiss.IndexFlatL2(self.n_features)
            self.index.add(self.feature_matrix)
            
            logger.info(f"Model loaded successfully with {self.n_features} features")
            return True
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            return False
    
    def _process_user_preferences(self, preferences):
        """Convert user preferences to a feature vector matching the model's feature space."""
        # Initialize feature vector with zeros
        user_vector = np.zeros(self.n_features, dtype=np.float32)
        
        # Process numerical features - use a DataFrame with proper column names for scaling
        if 'Budget' in preferences and self.scaler:
            budget_df = pd.DataFrame({'Budget': [preferences['Budget']]})
            scaled_budget = self.scaler.transform(budget_df)[0][0]
            idx = self.feature_names.index('Budget')
            user_vector[idx] = scaled_budget
        
        # Process categorical features
        categorical_features = ['Lease Duration', 'Furnishing', 'Smoking/Drinking', 
                              'Guests Allowed', 'Daily Routine']
        
        # Set values for categorical features
        for feature in categorical_features:
            if feature in preferences:
                feature_col = f"{feature}_{preferences[feature]}"
                if feature_col in self.feature_names:
                    idx = self.feature_names.index(feature_col)
                    user_vector[idx] = 1.0
        
        return user_vector
    
    def get_recommendations(self, user_preferences, n=5, min_budget=None, max_budget=None):
        """Get roommate recommendations based on user preferences."""
        # Ensure model is loaded
        if self.index is None:
            loaded = self.load_model()
            if not loaded:
                self.build_index()
        
        # Apply pre-filtering based on budget if specified
        filtered_indices = list(range(len(self.df)))
        
        if min_budget is not None or max_budget is not None:
            min_val = min_budget if min_budget is not None else 0
            max_val = max_budget if max_budget is not None else float('inf')
            
            # Filter by budget range
            budget_mask = (self.df['Budget'] >= min_val) & (self.df['Budget'] <= max_val)
            filtered_indices = self.df[budget_mask].index.tolist()
            
            # If no matches after filtering, return empty result
            if not filtered_indices:
                logger.warning("No roommates match the budget criteria")
                return pd.DataFrame()
        
        # Convert user preferences to feature vector
        user_vector = self._process_user_preferences(user_preferences)
        
        if len(filtered_indices) < len(self.df):
            # Create a filtered feature matrix
            filtered_features = np.vstack([self.feature_matrix[i] for i in filtered_indices])
            
            # Create temporary index for the filtered features
            temp_index = faiss.IndexFlatL2(self.n_features)
            temp_index.add(filtered_features)
            
            # Search in the temporary index
            distances, local_indices = temp_index.search(user_vector.reshape(1, -1), min(n, len(filtered_indices)))
            
            # Map local indices back to original indices
            neighbor_indices = [filtered_indices[idx] for idx in local_indices[0]]
        else:
            # Search in the full index
            distances, neighbor_indices = self.index.search(user_vector.reshape(1, -1), n)
            neighbor_indices = neighbor_indices[0]  # Flatten array
        
        # Get recommendations from original dataframe
        recommendations = self.df.iloc[neighbor_indices].copy()
        
        # Calculate similarity scores (convert distances to similarity percentages)
        max_dist = np.max(distances) if distances.size > 0 else 1.0
        similarities = [(1 - (dist / (max_dist + 1e-6))) * 100 for dist in distances[0]]
        recommendations['similarity_score'] = similarities
        
        return recommendations
    
    def train(self):
        """Full training pipeline: load data, preprocess, build index."""
        self.load_data()
        self.preprocess_data()
        self.build_index()
        logger.info("Model training complete")
    
    def calculate_accuracy(self, test_ratio=0.2):
        """Calculate model accuracy using hold-out validation."""
        if self.df is None:
            self.load_data()
        
        # Shuffle and split data
        shuffled_indices = np.random.permutation(len(self.df))
        test_size = int(test_ratio * len(self.df))
        test_indices = shuffled_indices[:test_size]
        train_indices = shuffled_indices[test_size:]
        
        # Create train/test splits
        train_df = self.df.iloc[train_indices].reset_index(drop=True)
        test_df = self.df.iloc[test_indices].reset_index(drop=True)
        
        # Train on training data
        train_recommender = RoommateRecommender()
        train_recommender.df = train_df
        train_recommender.preprocess_data()
        train_recommender.build_index()
        
        # Test on test data
        correct = 0
        total = 0
        
        for _, test_user in test_df.iterrows():
            # Create user preferences from test data
            preferences = {
                'Budget': test_user['Budget'],
                'Lease Duration': test_user['Lease Duration'],
                'Furnishing': test_user['Furnishing'],
                'Smoking/Drinking': test_user['Smoking/Drinking'],
                'Guests Allowed': test_user['Guests Allowed'],
                'Daily Routine': test_user['Daily Routine']
            }
            
            # Get recommendations
            recommendations = train_recommender.get_recommendations(preferences, n=3)
            
            # Check if any recommendation has high similarity (over 80%)
            if any(rec['similarity_score'] > 80 for _, rec in recommendations.iterrows()):
                correct += 1
            total += 1
        
        accuracy = (correct / total * 100) if total > 0 else 0
        logger.info(f"Model accuracy: {accuracy:.2f}%")
        return accuracy

# Example usage
if __name__ == "__main__":
    recommender = RoommateRecommender('Roommate_Matching_Dataset.csv')
    recommender.train()
    
    # Example user preferences
    user_preferences = {
        'Budget': 10000,
        'Lease Duration': 'Short-term',
        'Furnishing': 'Furnished',
        'Smoking/Drinking': 'Occasionally',
        'Guests Allowed': 'Yes',
        'Daily Routine': 'Night Owl'
    }
    
    # Get recommendations with budget filtering
    recommendations = recommender.get_recommendations(
        user_preferences, 
        n=5,
        min_budget=10000,
        max_budget=20000
    )
    
    # Display results
    print("\nRecommended Roommates:")
    print("-" * 80)
    
    if recommendations.empty:
        print("No roommates match your criteria. Try relaxing some requirements.")
    else:
        for i, rec in enumerate(recommendations.iterrows(), 1):
            rec_data = rec[1]
            print(f"{i}. {rec_data['Name']}")
            print(f"   Budget: {rec_data['Budget']}, Lease: {rec_data['Lease Duration']}")
            print(f"   Furnishing: {rec_data['Furnishing']}")
            print(f"   Smoking/Drinking: {rec_data['Smoking/Drinking']}, Guests: {rec_data['Guests Allowed']}")
            print(f"   Daily Routine: {rec_data['Daily Routine']}")
            print("-" * 80)
    