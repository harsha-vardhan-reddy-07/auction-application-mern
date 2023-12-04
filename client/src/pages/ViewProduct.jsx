import React, { useContext, useEffect, useState } from 'react'
import '../styles/IndividualProduct.css'
import {HiOutlineArrowSmLeft} from 'react-icons/hi'
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import { GeneralContext } from '../context/GeneralContext';

const ViewProduct = () => {
    const {id} = useParams();
    const navigate = useNavigate()
    
    const userId = localStorage.getItem('userId');
    
    const {fetchCartCount} = useContext(GeneralContext);
    
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productMainImg, setProductMainImg] = useState('');
    const [productCarouselImg1, setProductCarouselImg1] = useState('');
    const [productCarouselImg2, setProductCarouselImg2] = useState('');
    const [productCarouselImg3, setProductCarouselImg3] = useState('');
    const [ProductStartPrice, setProductStartPrice] = useState([]);
    const [productTopBid, setProductTopBid] = useState(0);
    const [productSeller, setProductSeller] = useState(0);

    const [auctionCloseTime, setAuctionCloseTime] = useState('');

    const [product, setProduct] = useState();
    
    
    useEffect(()=>{
        fetchProduct();
    },[])
    
    const fetchProduct = async () =>{
        await axios.get(`http://localhost:6001/fetch-product-details/${id}`).then(
            async (response)=>{
                setProduct(response.data);
                setProductName(response.data.title);
                setProductDescription(response.data.description);
                setProductMainImg(response.data.mainImg);
                setProductCarouselImg1(response.data.carousel[0]);
                setProductCarouselImg2(response.data.carousel[1]);
                setProductCarouselImg3(response.data.carousel[2]);
                setProductStartPrice(response.data.startPrice);
                setProductTopBid(response.data.topBid.amount);
                setProductSeller(response.data.sellerName);

                if(response.data.status === "Available"){

                    const remainingTime = await findRemainingTime(response.data.auctionCloseTime);
                    setAuctionCloseTime(remainingTime)
                }  
            }
        )
    }
    
  
    const findRemainingTime = async (closingTime) =>{
        const totalSec = (new Date(closingTime).getTime() - new Date().getTime())/1000;
    
        const formatTime = (time) =>{
            return time < 10 ? `0${time}` : time
        }
        const totalDays = formatTime(Math.floor(totalSec/3600/24));
        
        const totalHrs = Math.floor(totalSec/3600) %24;
        const totalMins = Math.floor(totalSec/60) %60;
        const remaining = `${totalDays} days - ${totalHrs} hours - ${totalMins} minutes`
    
        if(String(totalDays) === "0-1"){
            
            await axios.get(`http://localhost:6001/close-bidding/${id}`).then(
                (response)=>{
                    fetchProduct();
                }
            )
        }
    
        return remaining
    }
    
    const [bids, setBids] = useState([]);
    
    useEffect(()=>{
        fetchBids();
    },[])
    
    const fetchBids = async () =>{
        await axios.get(`http://localhost:6001/fetch-bids`).then(
            (response)=>{
                const data = response.data.filter((res)=> res.productId === id);
                setBids(data.reverse());
            }
        )
    }
    
    
    
    
      return (
        <>
        {product ?
        
            <div className="IndividualProduct-page">
                <span onClick={()=> navigate('/admin')}> <HiOutlineArrowSmLeft /> <p>back</p></span>
        
                <div className="IndividualProduct-body">
        
                    <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                        <div className="carousel-indicators">
                            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                        </div>
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                            <img src={productCarouselImg1} className="d-block w-100" alt="..."  />
                            </div>
                            <div className="carousel-item">
                            <img src={productCarouselImg2} className="d-block w-100" alt="..." />
                            </div>
                            <div className="carousel-item">
                            <img src={productCarouselImg3} className="d-block w-100" alt="..." />
                            </div>
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
        
        
                    <div className="IndividualProduct-data">
                        <h3>{productName}</h3>
                        <p>{productDescription}</p>
                        
                    
        
                        <span><h5><b>Current Top Bid: </b> 	&#8377; {productTopBid}  </h5></span>
                        <h6><b>Start Price:</b>  	&#8377; {ProductStartPrice} </h6>
                        
                        <h6><b>Bidding Ends In:</b> {auctionCloseTime} </h6>

                        {product.status === "Available" ?
                                <>
                                    <span><h5><b>Current Top Bid: </b> 	&#8377; {productTopBid}  </h5></span>
                                    <h6><b>Start Price:</b>  	&#8377; {ProductStartPrice} </h6>
                                    <h6><b>Seller:</b> {productSeller} </h6>
                                    <h6><b>Bidding Ends In:</b> {auctionCloseTime} </h6>

                                    
                                </>
                            :""}

                            {product.status === "sold" ?
                                <>
                                    <h6><b>Start Price:</b>  	&#8377; {ProductStartPrice} </h6>
                                    <h6><b>Seller:</b> {productSeller} </h6>
                                    <h6><b>Sold to:</b> {product.topBid.bidderName} </h6>
                                    <span><h5><b>Sold at: </b> 	&#8377; {productTopBid}  </h5></span>
                                    <button className='btn btn-success mt-3' disabled>Product sold</button>
                                </>
                            
                            :""}


                        {product.status === "Unsold" ?
                            <>
                                <h6><b>Start Price:</b>  	&#8377; {ProductStartPrice} </h6>
                                <h6><b>Seller:</b> {productSeller} </h6>
                                <button className='btn btn-danger mt-3' disabled>Product unsold</button>
                            </>
                    
                        :""}

        
                    </div>
                </div>
        
                {bids.length > 0 ? 
        
                <div className="product-biddings-container">
                    <h3>Biddings</h3>
                    <div className="product-biddings">
        
                        {bids.map((bid)=>(
                            <div className={productTopBid === bid.bidAmount ? "product-bidding top-bid" : "product-bidding"} key={bid._id}>
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
                            </div>
                        ))}
        
                    </div>
                </div>
        
                :""}
        
        
            </div>
        :""}
        </>
      )
    }

export default ViewProduct