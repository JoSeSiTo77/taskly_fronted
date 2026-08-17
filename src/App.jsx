import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './components/home/home.jsx'
import Login from './components/login/login.jsx'
import Message from './components/message/message.jsx'
import Profile from './components/profile/profile.jsx'
import Register from './components/register/register.jsx'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Message />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
