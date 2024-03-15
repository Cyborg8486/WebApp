import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

export default function UpdatePage() {
  useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const navigate = useNavigate();

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
        
        setAuth(true);
        setData(res.data.data[0]);
        
        }else{
            
            setAuth(false)
                console.log(res.data.Error);
        }
    })
}, [])

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      const response = await fetch('http://localhost:8081/update', {
        
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'access-token' : localStorage.getItem("token")
        },
        body: JSON.stringify(data)
      });
      
      if (response.status==200) {
        navigate('/home');
      } else {
        throw new Error('Failed to update user data');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to update user data');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', width: '100%', padding: '20px', border: '1px solid', borderRadius: '5px' }}>
      <h2>Update Profile</h2>
        <div style={{ marginBottom: '15px' }}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Phone:</label>
          <input
            type="tel"
            name="phone"
            value={data.phone}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Address:</label>
          <textarea
            name="address"
            value={data.address}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          ></textarea>
        </div>
        <button type="submit" style={{ backgroundColor: '#3f51b5', color: '#fff', border: 'none', borderRadius: '5px', padding: '10px 20px', cursor: 'pointer' }}>Update</button>
      </form>
    </div>
  );
}