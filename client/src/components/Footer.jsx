import React from 'react'
import {useNavigate} from 'react-router-dom'
import '../styles/Footer.css'

const Footer = () => {

  const navigate = useNavigate();

  return (
    <div className="Footer">
      <h4>@SB Bidzz - One Destination for all your wishes....</h4>
      <div className="footer-body">

        <ul>
          <li   onClick={()=> navigate('/')}>Home</li>
          <li  onClick={()=> navigate('/')}>Categories</li>
          <li  onClick={()=> navigate('/')}>All products</li>
        </ul>

        <ul>
          <li  onClick={()=> navigate('/category/Antiques')}>Antiques</li>
          <li  onClick={()=> navigate('/category/Art&Collectibles')}>Collectibles</li>
          <li  onClick={()=> navigate('/category/General')}>Furniture</li>
        </ul>

        <ul>
          <li  onClick={()=> navigate('/category/Electronics')}>Electronics</li>
          <li  onClick={()=> navigate('/category/Automobiles')}>Automobiles</li>
          <li  onClick={()=> navigate('/category/Art&Collectibles')}>Art pieces</li>
        </ul>

        <ul>
          <li  onClick={()=> navigate('/category/General')}>Fashion</li>
          <li  onClick={()=> navigate('/category/General')}>Essentials</li>
          <li  onClick={()=> navigate('/category/General')}>Sports</li>
        </ul>


      </div>
      <div className="footer-bottom">
        <p>@ SbBidzz.com - All rights reserved</p>
      </div>
    </div>
  )
}

export default Footer