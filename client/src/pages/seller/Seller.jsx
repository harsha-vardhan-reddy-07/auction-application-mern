import React, { useEffect, useState } from 'react'
import '../../styles/Seller.css'
import {useNavigate} from 'react-router-dom'
import axios from 'axios';

const Seller = () => {

  const navigate = useNavigate();

  const [userData, setUserData] = useState();

  const [Products, setProducts] = useState([]);
  const [soldProducts, setSoldProducts] = useState([]);

  const [bidsCount, setBidsCount] = useState(0);
  

  useEffect(()=>{
    fetchUserData();
    fetchProducts();
    fetchBids();
  }, [])



  const fetchUserData = async() =>{
    await axios.get(`http://localhost:6001/fetch-user/${localStorage.getItem('userId')}`).then(
      (response)=>{
        setUserData(response.data);
      }
    )
  }



  const fetchProducts = async() =>{
    await axios.get('http://localhost:6001/fetch-products').then(
      (response)=>{
        const pros = response.data.filter((product)=> product.sellerId === localStorage.getItem("userId"));
        setProducts(pros.length);
        const sold = response.data.filter((product)=> product.sellerId === localStorage.getItem("userId") && product.status === "sold");
        setSoldProducts(sold.length);
      }
    )
  }


const fetchBids = async () =>{
    await axios.get(`http://localhost:6001/fetch-bids`).then(
        (response)=>{
          const data = response.data.filter((bid)=> bid.sellerId === localStorage.getItem("userId"))
          setBidsCount(data.length);
        }
    )
}



const handleWithdraw = async()=>{
  await axios.get(`http://localhost:6001/seller-fund-withdraw/${localStorage.getItem('userId')}`).then(
    (response)=>{
      alert("Funds withdrawn successfully!!");
      fetchUserData();
    }
)
}


  return (

    <>
    {
      userData ?
      <>
      {userData.approval === "Pending" ? 
        <div className="admin-page">
           <div className="admin-approval-required">
            <h3>Approval required!!</h3>
            <p>Admin needs to verify you to make this work. Please be patient!!!</p>
          </div>

         </div>
      :

      ""}

      {userData.approval === "Rejected" ? 
        <div className="admin-page">
           <div className="admin-approval-required">
            <h3>Sorry!!</h3>
            <p>We are sorry to inform you that your request has been rejected!!!</p>
          </div>

         </div>
      :

      ""}

        {userData.approval === "Accepted" ? 
      
          <div className="admin-page">

            <div>
              <div className="admin-home-card">
                <h5>All Products</h5>
                <p>{Products}</p>
                <button onClick={()=> navigate('/my-products')}>View all</button>
              </div>
            </div>
            

            <div>
              <div className="admin-home-card">
                <h5>Sold items</h5>
                <p>{soldProducts}</p>
                <button onClick={()=> navigate('/my-products')}>View all</button>
              </div>
            </div>

            <div>
              <div className="admin-home-card">
                <h5>All biddings</h5>
                <p>{bidsCount}</p>
                <button onClick={()=> navigate('/my-products')}>View all</button>
              </div>
            </div>

            <div>
              <div className="admin-home-card">
                <h5>Total Funds</h5>
                <p>&#8377; {userData.funds}</p>
                <button onClick={handleWithdraw} >Withdraw</button>
              </div>
            </div>

          </div>

          :""
        }
    </>
      :""
    }
    </>

    
  )
}

export default Seller