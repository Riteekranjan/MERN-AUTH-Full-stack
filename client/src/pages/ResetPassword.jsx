import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react';
import { AppContext } from '../context/AppContext'
import axios from 'axios';
import { toast } from 'react-toastify';


function ResetPassword() {

      const {backendUrL} = React.useContext(AppContext)
      axios.defaults.withCredentials=true
      const navigate = useNavigate();
      const [email,setEmail] = useState('');
      const [NewPassword,SetNewPassword] = useState('');
      const [isEmailSent,setIsEmailSent] = useState('');
      const [otp,setOpt] = useState(0);
      const [isOtpSubmitted,setIsOtpSubmitted] = useState(0);

      const inputrefs = React.useRef([])
        const handleInput = (e,index)=>{
          if(e.target.value.length>0 && index<inputrefs.current.length-1){
            inputrefs.current[index+1].focus();
          }
        }
        const handleKeyDown=(e,index)=>{
          if(e.key==='Backspace' && e.target.value=== '' && index>0){
            inputrefs.current[index-1].focus();
          }
        }
        const handlePaste = (e)=>{
          const pastedData = e.clipboardData.getData('text');
          const pastedDataArray = pastedData.split('');
          pastedDataArray.forEach((char,index)=>{
            if(index<inputrefs.current.length){
              inputrefs.current[index].value=char;
        }})
      }
      const onSubmitEmail = async (e)=>{
        try{
                e.preventDefault();
                const {data}= await axios.post(`${backendUrL}/api/auth/send-reset-otp`,
                  {email},{ withCredentials: true });
                  data.success ? toast.success(data.message) : toast.error(data.message)
                  data.success && setIsEmailSent(true)
              }catch(error){
                   toast.error(error.message)
            }
    
      }
      const onSubmitOTP = async (e)=>{
         e.preventDefault();
        const otpArray = inputrefs.current.map(input=>input.value).join('');
        setOpt(otpArray); 
        setIsOtpSubmitted(true);
      }


      const onSubmitNewPassword = async (e)=>{
            e.preventDefault();
              console.log("Sending Data:");
  console.log("Email:", email);
  console.log("OTP:", otp);
  console.log("Password:", NewPassword);
            try{
                  const {data} = await axios.post(`${backendUrL}/api/auth/reset-password`,
                  { email, otp, newPassword: NewPassword },{ withCredentials: true });
                  data.success ? toast.success(data.message) : toast.error(data.message)
                  data.success && navigate('/login')
            }catch(error){
                  toast.error(error.message)
            }
      }
  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
       <img onClick={() => navigate('/')} src={assets.logo} alt="" className='absolute left-5 w-28 sm:left-5 sm:w-32
                             top-5 w-28 sm:w-32 cursor-pointer' />
          {/*Enter your email to receive password reset instructions*/}

  {!isEmailSent &&         
           <form onSubmit={onSubmitEmail} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm' >
                  <h2 className='text-2xl font-bold mb-6 text-center text-white'>Reset Password</h2>
                  <p className='text-center mb-6 text-indigo-300'>Enter your email to receive password reset instructions</p>
                  <div className='mb-4 flex items-center gap-3 w-full py-2.5 px-5 rounded-full bg-[#333A5C]'>
                    <img src={assets.mail_icon} alt="" />
                   <input 
                    type="email"
                    placeholder='Enter your Email'
                    className='bg-transparent outline-none'
                    value={email} onChange={(e) => setEmail(e.target.value)} required
                   />
                   
                   
                   {/* <button  className='w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-200'>Send Reset Instructions</button> */}
                  </div>
                  <button className='w-full  py-2.5 bg-linear-to-r from-indigo-500 to-indigo-900 rounded-full text-white mt-1'>Send resend</button>
              
            </form>
}

             {/*input field for email and a button to send reset instructions*/}
     {!isOtpSubmitted && isEmailSent &&
             <form  onSubmit={onSubmitOTP} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm' >
                            <h1 className='text-white text-2xl font-semibold text-center mb-4'>Email verify OTP</h1>
                            <p className='text-center mb-6 text-indigo-300'>Enter 6 Digit code send to your Email id to Set Newpassword </p>
                       <div  className='flex justify-between mb-8' onPaste={handlePaste}>
                            {Array(6). fill(0).map((_,index)=>(
                                <input type="text"maxLength='1' key={index}  required
                                className='w-12 h-12 bg-[#333A5C] text-center text-white text-xl rounded-md'
                                ref={e=> inputrefs.current[index] = e}
                                onInput={(e)=>handleInput(e,index)}
                                onKeyDown={(e)=>handleKeyDown(e,index)}
                                />
                                ))}
                       </div>
                       <button  className='w-full bg-indigo-600 text-white py-2.5 rounded-md hover:bg-indigo-700 transition duration-200'>Submit</button>
             </form>
}

              {/*input field for OTP and a button to submit OTP*/}
    {isOtpSubmitted && isEmailSent &&
             <form onSubmit={onSubmitNewPassword} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm' >
                  <h2 className='text-2xl font-bold mb-6 text-center text-white'>Reset Password</h2>
                  <p className='text-center mb-6 text-indigo-300'>Set New Password</p>
                  <div className='mb-4 flex items-center gap-3 w-full py-2.5 px-5 rounded-full bg-[#333A5C]'>
                    <img src={assets.lock_icon_icon} alt="" />
                   <input 
                    type="Password"
                    placeholder='New Password'
                    className='bg-transparent outline-none'
                    value={NewPassword} onChange={(e) => SetNewPassword(e.target.value)} required
                   />
                   
                   
                   {/* <button  className='w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-200'>Send Reset Instructions</button> */}
                  </div>
                  <button className='w-full  py-2.5 bg-linear-to-r from-indigo-500 to-indigo-900 rounded-full text-white mt-1'>Send resend</button>
              
               </form> 
}          
    </div>
  )
}



export default ResetPassword