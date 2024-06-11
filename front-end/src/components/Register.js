import React, { useRef } from 'react';
import { API_ENDPOINT } from '../api/endpoint.js';
import { Link, useNavigate } from "react-router-dom";

export default function Register () {

    const inputRef0 = useRef();
    const inputRef1 = useRef();
    const inputRef2 = useRef();

    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const name = await inputRef0.current.value;
        const email = await inputRef1.current.value;
        const password = await inputRef2.current.value;

        fetch(`${API_ENDPOINT}/register`,{
            method: 'POST',
            mode: 'cors', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        })
        .then(() =>{
            console.log('success');
            navigate('/login');
        })       
        .catch(error => console.log('problem with fetch', error)); 
        
      };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input type="text" name="name" ref={inputRef0}/>
                </label>
                <label>
                    Email:
                    <input type="text" name="email" ref={inputRef1} />
                </label>
                <label>
                    Password:
                    <input type="text" name="password" ref={inputRef2}/>
                </label>
                <input type="submit" value="Submit" />
            </form>
            <Link to="/login">Already have an account?</Link>
        </>
    )
}