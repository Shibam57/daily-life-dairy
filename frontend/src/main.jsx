import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {RouterProvider, createBrowserRouter, Navigate} from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import AddNote from './components/AddNote.jsx'
import EditNote from './components/Cards/EditNote.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Home from './pages/Home.jsx'
import NoteDetails from './components/Cards/NoteDetails.jsx'
import Profile from './components/Cards/Profile.jsx'
import ChangePassword from './components/ChangePassword.jsx'
import VerifyEmail from './pages/VerifyEmail.jsx'
import UpdateAccount from './components/Cards/UpdateAccount.jsx'
import AboutUs from './components/AboutUs.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    children: [
      {index: true, element: <Navigate to="/Home" />},
      {path: 'add-note', element: <AddNote/>},
      {path: 'update-note/:noteId', element: <EditNote/>},
      {path: "get-note/:noteId", element: <NoteDetails/>},
      {path: "profile", element: <Profile/>},
      {path: "change-password", element:<ChangePassword/>},
      {path: "update-account", element: <UpdateAccount/>},
      {path: "about-us", element: <AboutUs/>},
      {path: 'home', element: <Home/>}
    ]
  },
  {
    path: '/login',
    element: <Login/>
  },
  {
    path: '/signup',
    element: <Signup/>
  },
  {
    path: '/verify-email/:token',
    element: <VerifyEmail/>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)