import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Dashboard from './pages/DashboardPage'
import Login from './pages/LoginPage'
import Signup from './pages/SignupPage'
import Home from './pages/HomePage'
import ProgramPage from './pages/ProgramsPage'
import Submissions from './pages/SubmissionsPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<Home/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path="/login" element={<Login />} />
        <Route path='/dashboard' element = {<Dashboard/>} />
        <Route path='/programs' element = {<ProgramPage/>} />
        <Route path='/submissions' element = {<Submissions/>}/>
        </Routes>
        </Router>
  )
}

export default App
