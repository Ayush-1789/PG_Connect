import numpy as np
import pandas as pd
import faiss
import logging
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

class PGRecommender:
    def __init__(self, data_path):
        self.data_path = data_path
        self.raw_df = None
        self.processed_df = None
        self.index = None
        self.feature_vectors = None
        self.load_data()
        
    def load_data(self):
        """Load the PG data from CSV file"""
        self.raw_df = pd.read_csv(self.data_path)
        self.processed_df = self.raw_df.copy()
        logging.info(f"Loaded data with {len(self.raw_df)} PG entries")
        
    def preprocess_data(self):
        """Preprocess the PG data for recommendation"""
        # Define features based on actual column names in the CSV
        numerical_features = ['Age', 'Rating']
        categorical_features = ['Occupation', 'Gender', 'Location', 'Room Type', 'Hostel Availability']
        
        # Preprocess numerical features
        scaler = StandardScaler()
        self.processed_df[numerical_features] = scaler.fit_transform(self.processed_df[numerical_features])
        
        # Preprocess categorical features
        for feature in categorical_features:
            dummies = pd.get_dummies(self.processed_df[feature], prefix=feature, drop_first=True)
            self.processed_df = pd.concat([self.processed_df, dummies], axis=1)
            
        # Select only the processed features
        feature_columns = [col for col in self.processed_df.columns 
                          if col not in self.raw_df.columns or col in numerical_features]
        
        self.feature_vectors = self.processed_df[feature_columns].values.astype(np.float32)
        logging.info(f"Processed data into {self.feature_vectors.shape[1]} features")
        
        # Build FAISS index
        self.build_index()
    
    def build_index(self):
        """Build FAISS index for fast similarity search"""
        dimension = self.feature_vectors.shape[1]
        self.index = faiss.IndexFlatL2(dimension)
        self.index.add(self.feature_vectors)
        logging.info(f"Built FAISS index with {self.index.ntotal} vectors")
    
    def get_recommendations(self, user_preferences, top_n=5, rating_weight=3.0):
        """Get PG recommendations based on user preferences with weighted rating importance"""
        # First, apply hard filters for exact matches on critical attributes
        filtered_df = self.raw_df.copy()
        
        # Filter by Location - must match exactly
        if 'Location' in user_preferences:
            filtered_df = filtered_df[filtered_df['Location'] == user_preferences['Location']]
        
        # Filter by Room Type - must match exactly
        if 'Room Type' in user_preferences:
            filtered_df = filtered_df[filtered_df['Room Type'] == user_preferences['Room Type']]
        
        # Filter by Hostel Availability - must match exactly
        if 'Hostel Availability' in user_preferences:
            filtered_df = filtered_df[filtered_df['Hostel Availability'] == user_preferences['Hostel Availability']]
        
        # Filter by Rating - must be greater than or equal to user preference
        if 'Rating' in user_preferences:
            filtered_df = filtered_df[filtered_df['Rating'] >= user_preferences['Rating']]
        
        logging.info(f"Found {len(filtered_df)} PGs matching basic criteria")
        
        # If no matches, return empty list or optionally relax some criteria
        if len(filtered_df) == 0:
            logging.warning("No exact matches found. Consider relaxing some criteria.")
            return []
        
        # If matches are fewer than requested, adjust top_n
        top_n = min(top_n, len(filtered_df))
        
        # Get indices of the filtered properties in the original dataframe
        filtered_indices = filtered_df.index.tolist()
        
        # Process the query to match the vector space
        query_df = pd.DataFrame([user_preferences])
        processed_query = query_df.copy()
        
        # Process numerical features
        numerical_features = ['Age', 'Rating']
        scaler = StandardScaler()
        scaler.fit(self.raw_df[numerical_features])
        processed_query[numerical_features] = scaler.transform(query_df[numerical_features])
        
        # Process categorical features
        categorical_features = ['Occupation', 'Gender', 'Location', 'Room Type', 'Hostel Availability']
        for feature in categorical_features:
            dummies = pd.get_dummies(query_df[feature], prefix=feature, drop_first=True)
            for col in dummies.columns:
                processed_query[col] = dummies[col].values
        
        # Select only the processed features
        feature_columns = [col for col in self.processed_df.columns 
                          if col not in self.raw_df.columns or col in numerical_features]
        
        # Handle missing columns
        for col in feature_columns:
            if col not in processed_query.columns:
                processed_query[col] = 0
        
        # Create the query vector
        query_vector = processed_query[feature_columns].values.astype(np.float32)
        
        # Get filtered vectors
        filtered_vectors = np.vstack([self.feature_vectors[i] for i in filtered_indices])
        
        # Create a temporary index
        temp_index = faiss.IndexFlatL2(self.feature_vectors.shape[1])
        temp_index.add(filtered_vectors)
        
        # Search in the temporary index
        distances, local_indices = temp_index.search(query_vector, top_n)
        
        # Map local indices back to original dataframe indices
        original_indices = [filtered_indices[idx] for idx in local_indices[0]]
        
        # Get PG details with improved scoring that prioritizes ratings
        recommendations = []
        for i, idx in enumerate(original_indices):
            pg_info = self.raw_df.iloc[idx].to_dict()
            
            # Calculate base similarity from distance
            base_similarity = np.exp(-distances[0][i])
            
            # Add a rating bonus to prioritize higher-rated properties
            # This ensures 5-star properties rank above 4-star ones with similar other attributes
            rating = pg_info['Rating']
            rating_bonus = (rating - user_preferences.get('Rating', 0)) * 0.1
            
            # Combine base similarity with rating bonus
            pg_info['similarity_score'] = min(1.0, base_similarity + rating_bonus)
            recommendations.append(pg_info)
        
        # Sort by combination of rating and similarity score
        recommendations.sort(key=lambda x: (x['Rating'], x['similarity_score']), reverse=True)
        
        return recommendations[:top_n]

if __name__ == "__main__":
    recommender = PGRecommender("PG_Matching_Dataset_Unique_Hostel_Names.csv")
    recommender.preprocess_data()
    
    # Example user preferences
    user_preferences = {
        'Age': 25,
        'Occupation': 'Software Engineer',
        'Gender': 'Male',
        'Location': 'Ahmedabad',
        'Room Type': 'Shared',
        'Hostel Availability': 'Yes',
        'Rating': 4
    }
    
    # Get recommendations
    recommendations = recommender.get_recommendations(user_preferences, top_n=5)
    
    # Display results
    print("\nRecommended PGs/Hostels:")
    print("-" * 80)
    
    if not recommendations:
        print("No PGs match your criteria. Try relaxing some requirements.")
    else:
        for i, rec in enumerate(recommendations, 1):
            print(f"{i}. {rec['Name']}")
            print(f"   Location: {rec['Location']}, Room Type: {rec['Room Type']}")
            print(f"   Rating: {rec['Rating']}/5, Availability: {rec['Hostel Availability']}")
            print("-" * 80)