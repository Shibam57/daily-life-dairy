import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Signup from './pages/Signup'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login'
import Navbar from './pages/Navbar'
import AddNote from './components/AddNote'
import Home from './pages/Home'
import Footer from './pages/Footer'
import { Outlet } from 'react-router'
import EditNote from './components/Cards/EditNote'


function App() {
  const [searchResults, setSearchResults] = useState([]);

  return (
    <>
      <Navbar onSearchResults={setSearchResults}/>
      <div className='main-content'>
        <Outlet context={{ searchResults, setSearchResults }} />
      </div>
      <Footer/>
      <ToastContainer autoClose={3000}/>
    </>
  )
}

export default App
