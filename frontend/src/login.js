import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import validation from './LoginValidation';
import axios from 'axios';

function Login(){

    const [values, setValues] =useState({
        email:'',
        password: ''
    })
const navigate= useNavigate();

    const [errors, setErrors]= useState({})

    const handleInput= (event)=>{
        setValues(prev=>({...prev, [event.target.name]: [event.target.value]}))
    }
    axios.defaults.withCredentials= true;
const handleSubmit=(event)=>{
    event.preventDefault();
setErrors(validation(values));
if(errors.email ==="" && errors.password ===""){
    axios.post('http://localhost:8081/login', values)
    .then(res=> {
        if(res.data.Login)
        {  
            localStorage.setItem("token", res.data.token);
            navigate('/home')
    }else if(res.data==="Wrong Password"){
        
alert("Wrong Password");
}else alert("No record exists")
    })
    .catch(err=> console.log(err));
    }
}

    return(
<div className='d-flex justify-content-center align-items-center bg-dark vh-100'>
    <div className='bg-white p-3 rounded w-25'>
        <h2>Log In</h2>
        <form action='' onSubmit={handleSubmit}>
            <div className='mb-3'>
                <input onChange={handleInput} type='email' name='email' placeholder='Enter Email' className='form-control rounded-0' />
            {errors.email && <span className='text-danger'>{errors.email}</span>}
            </div>
            <div className='mb-3'>
                <input onChange={handleInput} type='password' name='password' placeholder='Enter Password' className='form-control rounded-0'/>
                {errors.password && <span className='text-danger'>{errors.password}</span>}
            </div>
            <div style={{textAlign: 'right', paddingBottom: "20px"}}>
            <Link to={"/reset"} >Forgot Password?</Link>
            </div>
            <button type='submit' className='btn btn-success w-100 rounded-0'>Log In</button>
            <p>Don't have an account?</p>
            <Link to="/signup" className='btn btn-default border w-100 bg-light rounded-0 text-decoration-none'>Create Account</Link>
        </form>
    </div>
    </div>
    )
}

export default Login