
import {createContext, useEffect } from 'react'
import { useState } from 'react'
import { toast } from 'react-toastify'
export const AppContext = createContext()
import axios from 'axios'

export const AppContextProvider = (props) => {

    axios.defaults.withCredentials = true;
    const backendUrL = import.meta.env.VITE_BACKEND_URL
    const [isLoggedin,setIsLoggedIn] = useState(false)
    const [userData,setUserData] = useState(false)

    const getAuthState=async()=>{
        const {data} =await axios.get(backendUrL+'/api/user/data')
        if(data.success){
            setIsLoggedIn(true)
            getUserData()
        }
    }

    const getUserData = async()=>{
       try{
            const {data} =await axios.get(backendUrL + '/api/user/data')
            data.success ? setUserData(data.userData) : toast.error(data.message)
       }
       catch(error){
           toast.error(data.message)
       }
    }

    useEffect(()=>{
        getAuthState()
    },[])
    const value = {
        backendUrL,
        isLoggedin,setIsLoggedIn ,
        userData, setUserData ,
        getUserData
    }

    return (
    <AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>
    )
}