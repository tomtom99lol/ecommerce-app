import React from "react";

import { NavLink } from "react-router-dom";

export default function Header () {

  return (
    <div className="header">
      <NavLink to="/products">Products</NavLink>
      <NavLink to="/carts">Carts</NavLink>
      <NavLink to="/orders">Orders</NavLink>
      <NavLink to="/register">Register</NavLink>
    </div>
  )
}