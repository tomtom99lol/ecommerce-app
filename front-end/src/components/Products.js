import React from 'react';
import { API_ENDPOINT } from '../api/endpoint.js';
import {useState, useEffect} from 'react';


export default function Products () {
    
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch(`${API_ENDPOINT}/products`)
            .then((response) => {
                //console.log(response);
                return response.json();
            })
            .then((data) =>{
                //console.log(data);
                setProducts(data);
            })
            .catch(error => console.log('problem with fetch', error));
    }, []);

    return (
           <>
             <ul>{products.map((product) => (
                    <li key={product.id} >
                        {product.name}
                    </li>
                ))}
            </ul>              
           </>                
    )
}