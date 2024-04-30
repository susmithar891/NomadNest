import { Navbar } from './component/Navbar'
import { BrowserRouter, Switch, Route, Link, Routes, useParams } from "react-router-dom"
import Login from './component/Login';
import Register from './component/Register';
import LandingPage from './component/Landingpage'
import ContactUs from './component/ContactUs'
import Profilepage from './component/Profilepage';
import { Homepage } from './component/Homepage';
import Roompage from './component/Roompage';

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
