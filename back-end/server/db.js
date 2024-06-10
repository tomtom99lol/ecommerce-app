
const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ecommerce-app',
  password: 'postgres',
  port: 5432,
})

const getUsers = (request, response) => {
	pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
	  if (error) {
		throw error
	  }
	  response.status(200).json(results.rows)
	})
};

const getUserById = (request, response) => {
	const id = parseInt(request.params.id)
  
	pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
	  if (error) {
		throw error
	  }
	  response.status(200).json(results.rows)
	})
};

const createUser = (request, response) => {
	const { name, email, password  } = request.body;
  
	pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *', 
	[name, email, password], (error, results) => {
	  if (error) {
		throw error
	  }
	  response.status(201).send(`User added with ID: ${results.rows[0].id}`)
	})
};

const updateUser = (request, response) => {
	const id = parseInt(request.params.id)
	const { name, email, password } = request.body;
  
	pool.query(
	  'UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4',
	  [name, email, password, id],
	  (error, results) => {
		if (error) {
		  throw error
		}
		response.status(200).send(`User modified with ID: ${id}`)
	  }
	)
};

const deleteUser = (request, response) => {
	const id = parseInt(request.params.id)
  
	pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
	  if (error) {
		throw error
	  }
	  response.status(200).send(`User deleted with ID: ${id}`)
	})
};

const getProducts = (req, res) =>{		
		if (!req.query.category){
			pool.query('SELECT * FROM products ORDER BY id ASC', (err, results) =>{
				if (err) {
					throw err
				}
				res.status(200).send(results.rows);
		})} else {
			const {category} = req.query;
			pool.query('SELECT * FROM products WHERE category = $1 ORDER BY id ASC', [category], (err, results) =>{
				if (err){
					throw err;
				}
				res.status(200).send(results.rows);
		})}
}
	
const getProductById = (req, res) =>{
	const id = parseInt(req.params.id);
	pool.query('SELECT * FROM products WHERE id = $1', [id], (err, results) =>{
		if (err){
			throw err
		}
		res.status(200).send(results.rows)
	})
}

const createProduct = (req, res) =>{
	const {name, price, category} = req.body;
	pool.query('INSERT INTO products (name, price, category) VALUES ($1, $2, $3) RETURNING *', 
	[name, price, category], (err, results) =>{
		if (err){
			throw err
		}
		res.status(200).send(`Created product with ID: ${results.rows[0].id}`)
	})
};

const getCartById = (req, res) =>{
	const id = parseInt(req.params.id);
	pool.query('SELECT * FROM carts WHERE id = $1', [id], (err, results) =>{
		if (err){
			throw err;
		}
		res.status(200).send(results.rows);
	})
}

const addProductToCart = (req, res) =>{
	const id = parseInt(req.params.id);
	const {product1_id, product2_id, product3_id} = req.body;
	pool.query('INSERT INTO carts (id, product1_id, product2_id, product3_id) VALUES ($1, $2, $3, $4)',
	[id, product1_id, product2_id, product3_id], (err, results) =>{
		if (err){
			throw err;
		}
		res.status(200).send(`Products added to cart with ID: ${id}`)
	})
}

//const messages = [];
//res.locals.msg = [];
const checkoutCart = (req, res, next) =>{
	const id = parseInt(req.params.id);
	pool.query('SELECT product1_id, product2_id, product3_id FROM carts WHERE id = $1', [id], async(err, results) =>{
		if (err){
			throw err;
		}
		
		const getPrice1 = () =>{return new Promise((resolve,reject) =>{
			pool.query('SELECT * FROM products WHERE id = $1', [results.rows[0].product1_id], (err, Result) =>{
				if (err){
					return reject(err);
				}
				
				const price1 = Result.rows[0].price;
				return resolve(price1);
			})
		})};

		const getPrice2 = () =>{return new Promise((resolve,reject) =>{
			pool.query('SELECT * FROM products WHERE id = $1', [results.rows[0].product2_id], (err, Result) =>{
				if (err){
					return reject(err);
				}
				
				const price2 = Result.rows[0].price;
				return resolve(price2);
			})
		})};

		const getPrice3 = () =>{return new Promise((resolve,reject) =>{
			pool.query('SELECT * FROM products WHERE id = $1', [results.rows[0].product3_id], (err, Result) =>{
				if (err){
					return reject(err);
				}
				
				const price3 = Result.rows[0].price;
				return resolve(price3);
			})
		})};

		const getTotalPrice = async () =>{
			let totalPrice;
			const price1 = await getPrice1();
			const price2 = await getPrice2();
			const price3 = await getPrice3();

			totalPrice =  await (Number(price1) + Number(price2) + Number(price3));
			
			return totalPrice;
		}
		const totalPrice = await getTotalPrice();
		
		//console.log(totalPrice);
		res.locals.msg = [`Your total is ${totalPrice}`];
		next();
	}) 
}

const addCartToOrder = (req, res, next) =>{
	const id = parseInt(req.params.id);
	pool.query(
		'WITH prev AS(SELECT * FROM carts WHERE id = $1) \
		INSERT INTO orders (user_id, product1_id, product2_id, product3_id) \
		SELECT prev.id, prev.product1_id, prev.product2_id, prev.product3_id FROM prev \
		RETURNING *', [id],
		(err, results) =>{
			if (err){
				throw err;
			}
			res.locals.msg.push(`Order created with ID: ${results.rows[0].id} for user with ID: ${id}`);
			res.status(200).send(res.locals.msg.join('\n'));
		} 
	)
}

const getAllOrders = (req, res) =>{
	pool.query('SELECT * FROM orders ORDER BY id ASC', (err, results) =>{
		if (err){
			throw err;
		}
		res.status(200).json(results.rows);
	})
}

const getOrderById = (req, res) =>{
	const id = parseInt(req.params.id);
	pool.query('SELECT * FROM orders WHERE id = $1', [id], (err, results) =>{
		if (err){
			throw err;
		}
		res.status(200).json(results.rows[0]);
	})
}

module.exports = {
	getUsers,
	getUserById,
	createUser,
	updateUser,
	deleteUser,
	getProducts,
	getProductById,
	createProduct,
	getCartById,
	addProductToCart,
	checkoutCart,
	addCartToOrder,
	getAllOrders,
	getOrderById,
	pool
};