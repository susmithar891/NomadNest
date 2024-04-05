import { Navbar } from './components/Navbar'
import { BrowserRouter, Switch, Route, Link, Routes, useParams } from "react-router-dom"
import Login from './components/Login';
import Register from './components/Register';
import LandingPage from './components/Landingpage'
import ContactUs from './components/ContactUs'
import Profilepage from './components/Profilepage';
import { Homepage } from './components/Homepage';
import Roompage from './components/Roompage';

function App() {

	return (

		<BrowserRouter>
			<Routes>
				<Route exact path='/' element={<LandingPage />}></Route>
				<Route exact path='/sign-in' element={<Login />}></Route>
				<Route exact path='/sign-up' element={<Register />}></Route>
				<Route exact path='/contact-us' element={<ContactUs />}></Route>
				<Route exact path='/home/profile' element={<Profilepage />}></Route>
				<Route exact path='/home' element={<Homepage />}></Route>
				<Route exact path="/home/:id" element={<Roompage />} />
			</Routes>
		</BrowserRouter>

	);
}

export default App;
