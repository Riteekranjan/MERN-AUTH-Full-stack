import React from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'  
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useEffect } from 'react'



function EmailVerify() {
   
  axios.defaults.withCredentials=true
   const {backendUrL,isLoggedIn,userData,getUserData} = React.useContext(AppContext)
   const navigate = useNavigate()

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
  const onSubmitHandler = async (e)=>{
    // Handle OTP verification logic here
    try{
            e.preventDefault();
            const otp = inputrefs.current.map(input => input.value).join('');
            const {data}= await axios.post(`${backendUrL}/api/auth/verify-email`,
              {otp}, {withCredentials: true});
              ``
            if(data.success){
               toast.success(data.message)
               getUserData()
                navigate('/')
            }
           }catch(error){
               toast.error(error.response?.data?.message || error.message);
          }
  
  }
  useEffect(()=>{
      isLoggedIn && userData.isAccountVerified && navigate('/')
  },[isLoggedIn,userData])

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
        <img onClick={() => navigate('/')} src={assets.logo} alt="" className='absolute left-5 w-28 sm:left-5 sm:w-32
                       top-5 w-28 sm:w-32 cursor-pointer' />
                       <form onSubmit={onSubmitHandler} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm' >
                            <h1 className='text-white text-2xl font-semibold text-center mb-4'>Email verify OTP</h1>
                            <p className='text-center mb-6 text-indigo-300'>Enter 6 Digit code send to your Email id </p>
                       <div  className='flex justify-between mb-8' onPaste={handlePaste}>
                            {Array(6). fill(0).map((_,index)=>(
                                <input type="text"maxLength='1' key={index}  required
                                className='w-12 h-12 bg-[#333A5C] text-center text-white text-xl rounded-md'
                                ref={e=> inputrefs.current[index]=e}
                                onInput={(e)=>handleInput(e,index)}
                                onKeyDown={(e)=>handleKeyDown(e,index)}
                                />
                                ))}
                       </div>
                       <button  className='w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-200'>Verify Email</button>
                       </form>


    </div>
  )
}

export default EmailVerify