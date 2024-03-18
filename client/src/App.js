import { Navbar } from './components/Navbar'
import { BrowserRouter, Switch, Route, Link, Routes,useParams } from "react-router-dom"
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
                <Route path='/' element={<LandingPage />}></Route>
                <Route path='/sign-in' element={<Login />}></Route>
                <Route path='/sign-up' element={<Register />}></Route>
                <Route path='/contact-us' element={<ContactUs/>}></Route>
                <Route path='/profile' element={<Profilepage/>}></Route>
                <Route path='/home' element={<Homepage/>}></Route>
                <Route path="/home/:id" element={<Roompage />} />
                {/* <Route path='/home' element={<Homepage/>}></Route> */}
          </Routes>
        </BrowserRouter>

  );
}

export default App;
