import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";



function My_account(){

var name;
var email;
var phone;
var address;

var [auth, setAuth]= useState(false);
const [data, setData] = useState({});

useEffect(()=>{
    axios.get('http://localhost:8081/my_account', {
        headers:{
            'access-token': localStorage.getItem("token")
        }
    })
    
    .then(res=>{
        
        console.log(res.data.data[0].name)
        if(res.data.Status==="Success"){
            
        name= res.data.data[0].name;
        email= res.data.data[0].email;
        phone= res.data.data[0].phone;
        address= res.data.data[0].address;
        
        setAuth(true);
        setData(res.data.data[0]);
        
        }else{
            
            setAuth(false)
                console.log(res.data.Error);
        }
    })
},[])

    return(
        <div className="container mt-4">
            {
            auth ?
            
            <div className="container">
<h2 className="text-center">My Account </h2>
<h5>Name: {data.name}</h5>
<h5>Email: {data.email}</h5>
<h5>Phone: {data.phone}</h5>
<h5>Address: {data.address}</h5>

<div style={{paddingTop: "30px"}}>
<Link to="/update" className="btn btn-success">Update details</Link>
</div>
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