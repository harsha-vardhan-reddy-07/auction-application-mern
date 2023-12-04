import React, { useEffect, useState } from 'react'
import '../styles/Home.css'
import Products from '../components/Products'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'

const Home = () => {

  const navigate = useNavigate();

  useEffect(()=>{

    if(localStorage.getItem("userType") === 'seller'){
      navigate('/seller');
    } else if(localStorage.getItem("userType") === 'admin'){
      navigate('/admin');
    }
  },[])



  return (
    <div className="HomePage">

      <div className="homepage-intro">
        <h3>
          Welcome to SB Bidzz...!
        </h3>
        <p>Explore the ultimate hub for a myriad of auctions! Discover the premier destination where a diverse array of auctions unfold, catering to every taste and interest. </p>
      </div>

      <div className="home-categories-container">

        <div className="home-category-card" onClick={()=>navigate('/category/Art&Collectibles')}>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREB8HakrsGb0IDN7jfRHIAr5UllXB4B0EXNXi-d2bhILa0gp03drzfax2vvniHmZUtCIg&usqp=CAU" alt="" />
          <h5>Art & Collectibles</h5>
        </div>

        <div className="home-category-card" onClick={()=>navigate('/category/Electronics')}>
          <img src="https://5.imimg.com/data5/ANDROID/Default/2023/1/SE/QC/NG/63182719/product-jpeg-500x500.jpg" alt="" />
          <h5>Electronics</h5>
        </div>

        <div className="home-category-card" onClick={()=>navigate('/category/Antiques')}>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnjrAzwYG9sO9CcnznFSySdewWuE6-4n2VGFcWtExvNj7LHhHDBU5-s0lsF11ikq0LImM&usqp=CAU" alt="" />
          <h5>Antiques</h5>
        </div>

        <div className="home-category-card" onClick={()=>navigate('/category/Automobiles')}>
          <img src="https://hips.hearstapps.com/hmg-prod/images/dw-burnett-pcoty22-8260-1671143390.jpg?crop=0.668xw:1.00xh;0.184xw,0&resize=640:*" alt="" />
          <h5>Automobiles</h5>
        </div>

        <div className="home-category-card" onClick={()=>navigate('/category/General')}>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDZKzzINSCXTfBlLoxIWls57QPN_02YgVb-w&usqp=CAU" alt="" />
          <h5>Other essentials</h5>
        </div>

      </div>


      <div id='products-body'></div>
      <Products category = 'all'  />


      <Footer />
    </div>
  )
}

export default Home