import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import validation from "./SignupValidation";
import axios from 'axios';

function SignUp(){
    const [values, setValues] =useState({
        name:'',
        username:'',
        email:'',
        password: '',
        address:'',
        phone:''
    })

    const navigate= useNavigate();

    const [errors, setErrors]= useState({})

    const handleInput= (event)=>{
        setValues(prev=>({...prev, [event.target.name]: [event.target.value]}))
    }
const handleSubmit=(event)=>{
    event.preventDefault();
setErrors(validation(values));
if(errors.username==="" && errors.name ==="" && errors.email ==="" && errors.password ==="" && errors.address ==="" && errors.phone ==="" ){
axios.post('http://localhost:8081/signup', values)
.then(res=> {
    if(res.data==="Username exists"){
        alert("Username already exists");
    }else if(res.data==="Email exists"){
    alert("Email already exists");
}if(res.data==="Username and email exists"){
    alert("Username and Email already exists");
}
else if(res.data=="Success"){
    navigate('/');
}
}
)
.catch(err=> console.log(err));
}
}
    return(
        <div className='d-flex justify-content-center align-items-center bg-dark vh-100'>
    <div className='bg-white p-3 rounded w-25'>
        <h2>Sign Up</h2>
        <form action='' onSubmit={handleSubmit}>
        <div className='mb-3'>
                <input type='text' name='name' onChange={handleInput} placeholder='Name' className='form-control rounded-0' />
                {errors.name && <span className='text-danger'>{errors.name}</span>}
            </div>
            <div className='mb-3'>
                <input type='text' name='username' onChange={handleInput} placeholder='Username' className='form-control rounded-0' />
                {errors.username && <span className='text-danger'>{errors.username}</span>}
            </div>
            <div className='mb-3'>
                <input type='email' name='email' onChange={handleInput} placeholder='Enter Email' className='form-control rounded-0' />
                {errors.email && <span className='text-danger'>{errors.email}</span>}
            </div>
            <div className='mb-3'>
                <input type='password' name='password' onChange={handleInput} placeholder='Enter Password' className='form-control rounded-0'/>
                {errors.password && <span className='text-danger'>{errors.password}</span>}
            </div>
            <div className='mb-3'>
                <input type='text' name='address' onChange={handleInput} placeholder='Address' className='form-control rounded-0' />
                {errors.address && <span className='text-danger'>{errors.address}</span>}
            </div>
            <div className='mb-3'>
                <input type='text' name='phone' onChange={handleInput} placeholder='Phone No.' className='form-control rounded-0' />
                {errors.phone && <span className='text-danger'>{errors.phone}</span>}
            </div>
            <button type='submit' className='btn btn-success w-100 rounded-0'>Sign Up</button>
            <p>Already have an account?</p>
            <Link to="/" className='btn btn-default border w-100 bg-light rounded-0 text-decoration-none'>Log In</Link>
        </form>
    </div>
    </div>
    )
}

export default SignUp;