import React, { useContext, useEffect, useState } from 'react'
import {BsCart3, BsPersonCircle} from 'react-icons/bs'
import {FcSearch} from 'react-icons/fc'
import '../styles/Navbar.css'
import { Link, useNavigate } from 'react-router-dom'
import { GeneralContext } from '../context/GeneralContext'
import {ImCancelCircle} from 'react-icons/im'
import axios from 'axios'

const Navbar = () => {


  const navigate = useNavigate();

  const usertype = localStorage.getItem('userType');
  const username = localStorage.getItem('username');

  const {logout} = useContext(GeneralContext);

  const [productSearch, setProductSearch] = useState('');

  const [noResult, setNoResult] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(()=>{
    fetchData();
  }, [])

  const fetchData = async() =>{

    await axios.get('http://localhost:6001/fetch-categories').then(
      (response)=>{
        setCategories(response.data);
      }
    )
  }

  const handleSearch = () =>{
    if (categories.includes(productSearch)){
      navigate(`/category/${productSearch}`);
    }else{
      setNoResult(true);
    }
  }

  return (

    <>
      {/* user navbar */}

      {!usertype ?

          <div className="navbar">
          <h3 onClick={()=> navigate('')}>SB Bidzz</h3>
          <div className="nav-content">
            <div className="nav-search">
              <input type="text" name="nav-search" id="nav-search" placeholder='Search Art, Antiques, Automobiles, etc.,' onChange={(e)=>setProductSearch(e.target.value)} />
              <FcSearch className="nav-search-icon" onClick={handleSearch} />
              {
                noResult === true ?
                  <div className='search-result-data'>no items found.... try searching for Art, Antiques, Automobiles, etc., <ImCancelCircle className='search-result-data-close-btn' onClick={()=> setNoResult(false)}  /></div>
                :
                ""
              }
            </div>


            <button className='btn' onClick={()=> navigate('/auth')}>Login</button>

          </div>
          </div>

        : <>

            {usertype === 'customer' ?
            
                <div className="navbar">
                  <h3 onClick={()=> navigate('')}>SB Bidzz</h3>
                  <div className="nav-content">
                    <div className="nav-search">
                      <input type="text" name="nav-search" id="nav-search" placeholder='Search Art, Antiques, Automobiles, etc.,' onChange={(e)=>setProductSearch(e.target.value)} />
                      <FcSearch className="nav-search-icon" onClick={handleSearch} />
                      {
                        noResult === true ?
                          <div className='search-result-data'>no items found.... try searching for Art, Antiques, Automobiles, etc., <ImCancelCircle className='search-result-data-close-btn' onClick={()=> setNoResult(false)}  /></div>
                        :
                        ""
                      }
                    </div>

                    <div className='nav-content-icons' >
                      <div className="nav-profile" onClick={()=> navigate('/profile')}>
                        <BsPersonCircle className='navbar-icons' data-bs-toggle="tooltip" data-bs-placement="bottom" title="Profile" />
                        <p>{username}</p>
                      </div>
                    </div>
                  </div>
                </div>

              :

              ""

            }

            { usertype === 'admin'?
            
              <div className="navbar-admin">
                <h3 onClick={()=> navigate('/admin')}>SB Bidzz (admin)</h3>
                
                <ul>
                  <li onClick={()=> navigate('/admin')}>Home</li>
                  <li onClick={()=> navigate('/all-users')}>Users</li>
                  <li onClick={()=> navigate('/all-bids')}>Biddings</li>
                  <li onClick={()=> navigate('/all-products')}>Products</li>
                  <li onClick={logout}>Logout</li>
                </ul>
              </div>
              
            :""}


            { usertype === 'seller'?
            
            <div className="navbar-admin">
              <h3 onClick={()=> navigate('/seller')}>SB Bidzz (Seller)</h3>
              
              <ul>
                <li onClick={()=> navigate('/seller')}>Home</li>
                <li onClick={()=> navigate('/my-products')}>Products</li>
                <li onClick={()=> navigate('/new-product')}>Add product</li>
                <li onClick={logout}>Logout</li>
              </ul>
            </div>
            
          :""}
        
          </>

          
      }
        
    </>
  )
}

export default Navbar