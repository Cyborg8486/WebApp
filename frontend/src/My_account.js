import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";



function My_account() {
    const navigate = useNavigate();
    var name;
    var email;
    var phone;
    var address;

    // var [auth, setAuth] = useState(false);
    const [data, setData] = useState({});

    const fetchData=async(token)=>{
        const response = await fetch('http://localhost:8081/my_account', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'access-token' : localStorage.getItem("token")
        }
      });

      const result = await response.json();
    //   console.log(result.data[0]);
      setData(result.data[0]);
    }

    useEffect(() => {
        const token = localStorage.getItem('token')
        if(token)
        fetchData(token);
    else
    navigate('/')
    }, [])

    return (
        <>
            {
                data ?
                    <>
                        <div className="container mt-4">
                                    <div className="container">
                                        <h2 className="text-center">My Account </h2>
                                        <h5>Name: {data.name}</h5>
                                        <h5>Email: {data.email}</h5>
                                        <h5>Phone: {data.phone}</h5>
                                        <h5>Address: {data.address}</h5>

                                        <div style={{ paddingTop: "30px" }}>
                                            <Link to="/update" className="btn btn-success">Update details</Link>
                                        </div>
                                    </div>
                        </div>
                        {/* ffff */}
                    </>
                    :
                    <>
                        Loading..
                    </>
            }
        </>

    )
}

export default My_account;