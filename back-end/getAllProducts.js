const db = require('./server/db');

const bigFunc = async () =>{
    const ProductsArray = () =>{return new Promise((reject, resolve) =>{
        db.pool.query('SELECT * FROM products ORDER BY id ASC', (error, results) =>{
            if (error){
                return reject(error);
            }
            const products = results.rows;
            //console.log(products);
            resolve(products);
        });
    })} 
    const pr = async() =>{
       
        try{
            const products = await ProductsArray();
            console.log(products);
            return products;
        } catch(e){
            return e;
        }  
    }
    const products = await pr();
    //console.log(products);
    return await products;
}

module.exports =  {bigFunc};