import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'react-toastify';

const VerifyEmail = () => {
    const {token} = useParams();
    const navigate = useNavigate();

    useEffect(()=>{
        const verify = async()=>{
            try {
                const res = await fetch(`/api/v1/users/verify-email/${token}`)
                const data = await res.json();

                if(data.success){
                    toast.success("Email verified! You can now login.");
                    navigate('/login');
                }
                else{
                    toast.error(data.message || "Verification failed.")
                    navigate('/signup')
                }
            } catch (error) {
                console.log("Verification error: ", error);
                toast.error("Something went wrong.");
                navigate("/signup");
            }
        }
        if(token) verify();
    },[token, navigate]);

  return (
    <div className="h-screen flex items-center justify-center text-white bg-gradient-to-r from-purple-500 to-blue-500">
      <h1 className="text-xl">Verifying your email...</h1>
    </div>
  )
}

export default VerifyEmail;
