import React, { useContext, useEffect, useState } from 'react'
import '../../styles/AllBiddings.css'
import {HiOutlineArrowSmLeft} from 'react-icons/hi'
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';

const AllBiddings = () => {

  const navigate = useNavigate();
  const [bids, setBids] = useState([]);
    
  useEffect(()=>{
      fetchBids();
  },[])
  
  const fetchBids = async () =>{
      await axios.get(`http://localhost:6001/fetch-bids`).then(
          (response)=>{
              setBids(response.data.reverse());
          }
      )
  }


  return (
    <div className='all-biddings-page' >
         {bids.length > 0 ? 
    
    <div className="all-biddings-container">
        <h3>All Biddings</h3>
        <div className="all-biddings">

            {bids.map((bid)=>(
                <div className="all-bidding" key={bid._id}>
                    <span>
                        <b>Product Id</b>
                        <p>{bid.productId}</p>
                    </span>
                    <span>
                        <b>Bidder Id</b>
                        <p>{bid.bidderId}</p>
                    </span>
                    <span>
                        <b>Bidder Name</b>
                        <p>{bid.bidderName}</p>
                    </span>
                    <span>
                        <b>Bidding Amount</b>
                        <p>&#8377; {bid.bidAmount}</p>
                    </span>
                    <span>
                        <b>Time</b>
                        <p>{bid.bidTime.slice(0,10)} -- {bid.bidTime.slice(11,19)}</p>
                    </span>
                    <button className='btn btn-outline-info' onClick={()=> navigate(`/view-product/${bid.productId}`)} >View Product</button>
                </div>
            ))}

        </div>
    </div>

    :""}

    </div>
  )
}

export default AllBiddings