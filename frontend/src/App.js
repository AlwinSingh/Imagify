import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Cartoonify from './pages/cartoonify';
import BackgroundRemover from './pages/bgremover';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
return (
	<Router>
	<Navbar />
	<Routes>
		<Route path='/' exact element={<Home />} />
		<Route path='/cartoonify' element={<Cartoonify />} />
		<Route path='/bgremover' element={<BackgroundRemover />} />
	</Routes>
	</Router>
);
}

export default App;