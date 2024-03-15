import { Navbar } from './components/Navbar'
import { BrowserRouter, Switch, Route, Link, Routes } from "react-router-dom"
import Login from './components/Login';
import Register from './components/Register';
import LandingPage from './components/Landingpage'
import ContactUs from './components/ContactUs'

function App() {
  return (

        <BrowserRouter>
          <Routes>
                <Route path='/' element={<LandingPage />}></Route>
                <Route path='/sign-in' element={<Login />}></Route>
                <Route path='/sign-up' element={<Register />}></Route>
                <Route path='/contact-us' element={<ContactUs/>}></Route>
          </Routes>
        </BrowserRouter>

  );
}

export default App;
