import axios from "axios";
import React, { useEffect, useState } from "react";



function My_account(){

var name;
var email;
var address;
var phone;

var [auth, setAuth]= useState(false);

useEffect(()=>{
    axios.get('http://localhost:8081/my_account', {
        headers:{
            'access-token': localStorage.getItem("token")
        }
    })
    .then(res=>{
        if(res.data.Status==="Success"){
        name= res.data.data[0].name;
        email= res.data.data[0].email;
        address= res.data.data[0].address;
        phone= res.data.data[0].phone;
        console.log(res.data.data);
        setAuth(true);
        }else{
            setAuth(false)
                console.log(res.data.Error);
        }
    })
})

    return(
        <div className="container mt-4">
            {
            auth ?
            
            <div className="container">
<h2 className="text-center">My Account </h2>
<h5>Name: {name}</h5>
<h5>Email: {email}</h5>
<h5>Address: {address}</h5>
<h5>Phone: {phone}</h5>
        </div>
        :
        <div>
            <h3>Not Authenticated</h3>
            </div>
            }
        </div>
    )
}

export default My_account;