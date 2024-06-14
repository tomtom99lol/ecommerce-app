import Root from '../components/Root';
import Products from '../components/Products';
import Register from '../components/Register';
import Login from '../components/Login';
import User from '../components/User';
import './App.css';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

const router = createBrowserRouter(createRoutesFromElements(
  <Route path="/" element={<Root/>}>
    <Route path="products" element={<Products/>}/>
    <Route path="register" element={<Register/>}/>
    <Route path="login" element={<Login/>}/>
    <Route path="users/:userId" element={<User/>}/>

  </Route>
))

function App() {
  
  return (
    
   <RouterProvider router={router}/>
  );
}

export default App;
