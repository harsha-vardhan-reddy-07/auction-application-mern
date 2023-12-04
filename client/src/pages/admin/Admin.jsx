import React, { useEffect, useState } from 'react'
import '../../styles/Admin.css'
import {useNavigate} from 'react-router-dom'
import axios from 'axios';

const Admin = () => {

  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [productsCount, setProductsCount] = useState(0);
  const [bidsCount, setBidsCount] = useState(0);

  useEffect(()=>{
    fetchUsers();
    fetchBids();
    fetchProducts()
    // fetchRestaurants();
    // fetchOrders();
    // fetchPromotions();
  }, [])

  const fetchUsers = async() =>{
    await axios.get('http://localhost:6001/fetch-users').then(
      (response)=>{
        setUsers(response.data);
        
      }
    )
  }

  const fetchProducts = async() =>{
    await axios.get('http://localhost:6001/fetch-products').then(
      (response)=>{
        setProductsCount(response.data.length);
        
      }
    )
  }

  
  useEffect(()=>{
      
  },[])
  
  const fetchBids = async () =>{
      await axios.get(`http://localhost:6001/fetch-bids`).then(
          (response)=>{
              setBidsCount(response.data.length);
          }
      )
  }

  const approveUser = async(id) =>{
    await axios.post('http://localhost:6001/approve-seller', {id}).then(
      (response)=>{
        alert('Seller approved!');
        fetchUsers();
      }
    )
  }

  const rejectUser = async(id) =>{
    await axios.post('http://localhost:6001/reject-seller', {id}).then(
      (response)=>{
        alert('Seller Rejected!');
        fetchUsers();
      }
    )
  }




  return (
    <div className="admin-page">

      <div>
        <div className="admin-home-card">
          <h5>Total users</h5>
          <p>{users.length - 1}</p>
          <button onClick={()=> navigate('/all-users')}>View all</button>
        </div>
      </div>
      
      <div>
        <div className="admin-home-card">
          <h5>All Products</h5>
          <p>{productsCount}</p>
          <button onClick={()=> navigate('/all-products')}>View all</button>
        </div>
      </div>

      <div>
        <div className="admin-home-card">
          <h5>All Biddings</h5>
          <p>{bidsCount}</p>
          <button onClick={()=> navigate('/all-bids')}>View all</button>
        </div>
      </div>


      

          <div className=" admin-approval-container">
            <h5>Approval Requests</h5>
            <div className="approval-restaurant-list">

              {users.filter(user=>user.approval==="Pending" && user.usertype === 'seller').length === 0 ?
              
              <p>No new requests...</p>
              :
              ""}
              
              {users.filter(user=> user.approval==="Pending" && user.usertype === 'seller' ).map((user)=>{
                return(
                  <div className="approval-request" key={user._id}>
     
                    <span>
                      <h5>Seller</h5>
                      <p>{user.username}</p>
                    </span>
                    <div>
                      <button className="btn btn-outline-primary" onClick={()=> approveUser(user._id)}>Approve</button>
                      <button className="btn btn-outline-danger" onClick={()=> rejectUser(user._id)}>Reject</button>
                    </div>
                  </div>
                )
              })}

            </div>
          </div>


      
    </div>
  )
}

export default Admin