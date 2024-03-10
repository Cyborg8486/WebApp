import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Home(){
    const navigate= useNavigate();
    const handleAuth=()=>{
        axios.get('http://localhost:8081/checkAuth', {
            headers:{
                'access-token': localStorage.getItem("token")
            }
        })
        .then(res=> console.log(res))
        .catch(err=> console.log(err));
    }
    const handleLogout= ()=>{
        axios.get('http://localhost:8081/logout')
        .then(res=>{
           window.location.reload(true);
        }).catch(err=>console.log(err));
    }

    const [auth, setAuth]= useState(false);
    const [message, setMessage]=useState('');

axios.defaults.withCredentials=true;

    useEffect(()=>{
        axios.get('http://localhost:8081')
        .then(res=> {
            if(res.data.Status==="Success"){
                setAuth(true)
            }else{
                setAuth(false)
                setMessage(res.data.Error)
            }
        }
        )
        .then(err=>console.log(err));
    }, [])
    
    return(
        <div className="container mt-4">
{
        auth ?
<div className="d-flex justify-content-between">
    <h1>HOME</h1>
    <button onClick={handleAuth} className="btn btn-primary">CheckAuth</button>
    <Link to="/my_account" className="btn btn-success">My Account</Link>
    <button onClick={handleLogout} className="btn btn-danger">Logout</button>
</div>
:
<div>
    <h3>{message}</h3>
    <h3>Login Now</h3>
    <Link to="/" className="btn btn-primary">Login</Link>
    </div>
}
</div>
    )
}

export default Home;