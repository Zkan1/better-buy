import React from 'react'
import './Admin.css'
import Sidebar from '../../Components/Sidebar/Sidebar'
import { Routes,Route } from 'react-router-dom'
import AddProduct from '../../Components/AddProduct/AddProduct'
import ListProduct from '../../Components/ListProduct/ListProduct'
import Orders from '../../Components/Orders/Orders';
import UpdateProduct from '../../Components/UpdateProduct/UpdateProduct'; // UpdateProduct bileşenini import
const Admin = () => {
  return (
    <div className='admin'>
      <Sidebar/>
    <Routes>
        <Route path='/addproduct' element={<AddProduct/>}/>
        <Route path='/listproduct' element={<ListProduct/>}/>
        <Route path='/orders' element={<Orders/>}/>
        <Route path='/updateproduct' element={<UpdateProduct />} /> {/* Yeni rota */}
    </Routes>
    </div>
  )
}

export default Admin
