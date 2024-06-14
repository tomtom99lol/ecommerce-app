import React from 'react';
import { API_ENDPOINT } from '../api/endpoint';
import {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';

export default function User () {

    const {userId} = useParams();
    const [user, setUser] = useState();

    useEffect(() => {
        fetch(`${API_ENDPOINT}/users/${userId}`, {credentials:"include"})
            .then((response) => {
                //console.log(response);
                return response.json();
            })
            .then((data) =>{
                //console.log(data);
                //console.log(data[0].name)
                setUser(data[0]);
            })
            .catch(error => console.log('problem with fetch', error));
    }, []);

    //console.log(user);

    if (user === undefined){
        return;
    }

    
    return (
        <>
            <h1>welcome {user.name}</h1> 
        </>
    )
}