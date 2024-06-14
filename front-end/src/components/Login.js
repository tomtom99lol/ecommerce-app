import React, { useRef } from 'react';
import { API_ENDPOINT } from '../api/endpoint.js';
import { useNavigate } from "react-router-dom";

export default function Login () {

    const inputRef0 = useRef();
    const inputRef1 = useRef();
    
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const name = await inputRef0.current.value;
        const password = await inputRef1.current.value;
        

        fetch(`${API_ENDPOINT}/login`,{
            method: 'POST',
            mode: 'cors', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify({
                username: name,
                password: password
            })
        })
        .then((response) =>{
            console.log(response);
            return response.json();
        })
        .then((data) =>{
            console.log(data);

            if (Array.isArray(data) === true) {
                console.log('success');
                navigate(`../users/${data[0].id}`);
            } else {
                console.log('incorrect details')
                alert('incorrect details')
            }
            
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
                    Password:
                    <input type="text" name="password" ref={inputRef1}/>
                </label>
                <input type="submit" value="Submit" />
            </form>
            <a role="button" className="button" href={`${API_ENDPOINT}/auth/google`}>Login with Google</a>
        </>
    )
}