import react from 'react'
import { Route,Routes } from 'react-router-dom'
import Login from './pages/Login'
import HomePage from './pages/HomePage'
import EmailVerify from './pages/EmailVerify'
import ResetPassword from './pages/resetPassword'
import { ToastContainer } from 'react-toastify'

const App = () => {
  return (
    <div>
      <ToastContainer/>
      <Routes> 
          <Route path='/' element={<HomePage/>} />
          <Route path='/login' element={<Login />} />
          <Route path="/emailverify" element={<EmailVerify />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
      </Routes>
    </div>
  )
}

export default App