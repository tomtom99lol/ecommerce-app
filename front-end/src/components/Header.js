import React from "react";
import { API_ENDPOINT } from '../api/endpoint.js';
import {useState, useEffect} from 'react';
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Header () {

  const [loggedIn, setLoggedIn] = useState(false);
  const [name, setName] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_ENDPOINT}/loggedInInfo`, {credentials:"include"})
    .then( res =>{
        console.log(res);
        return res.json();
    })
    .then( data => {
      if(data.message === 'logged in'){
        setLoggedIn(true)
      }
    })
  },[]);

  const handleClick = () =>{
    fetch(`${API_ENDPOINT}/logout`, {credentials:"include"})
    .then((res =>{
      return res.json()
    }))
    .then(data =>{
      console.log(data)
    });

    navigate('/login');
  }

  return (
    <>
      <div className="header">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/products">Products</NavLink>
        <NavLink to="/carts">Carts</NavLink>
        <NavLink to="/orders">Orders</NavLink>
       
        {
          loggedIn ?
          <div>
            <a onClick={handleClick}>Logout</a>
          </div>
          :
          <div>
            <NavLink to="/register">Register</NavLink>
            <NavLink to="/login">Login</NavLink>
          </div>
        }
      </div>
    </>
  )
}