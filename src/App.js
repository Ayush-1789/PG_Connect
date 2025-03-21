import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import FindPG from './pages/FindPG';
import ListProperty from './pages/ListProperty';
import FindRoommate from './pages/FindRoommate';
import Profile from './pages/Profile';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Other routes will be added as we create the components */}
            <Route path="/find-pg" element={<FindPG />} />
            <Route path="/list-property" element={<ListProperty />} />
            <Route path="/find-roommate" element={<FindRoommate />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
