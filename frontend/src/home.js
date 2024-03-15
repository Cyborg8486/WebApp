import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/')

    }

    const [message, setMessage] = useState('');

    axios.defaults.withCredentials = true;

    useEffect(() => {
       
        const token = localStorage.getItem('token')
        if (!token)
            navigate('/')

    }, [])

    return (
        <div className="container mt-4">
        
            <div className="d-flex justify-content-between">
                <h1>HOME</h1>
                
                <Link to="/my_account" className="btn btn-success">My Account</Link>
                <Link to="/" onClick={handleLogout} className="btn btn-danger">Logout</Link>

            </div>
           
        </div>
    )
}

export default Home;