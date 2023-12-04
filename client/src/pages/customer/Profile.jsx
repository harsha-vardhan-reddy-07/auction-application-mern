import React, { useContext, useEffect, useState } from 'react'
import '../../styles/Profile.css';
import {RiRefund2Line, RiHistoryLine, RiAuctionLine} from 'react-icons/ri'
import {GiCash} from 'react-icons/gi'
import {HiOutlineCurrencyRupee} from 'react-icons/hi'
import {FiCreditCard} from 'react-icons/fi'
import { FaRegMoneyBill1 } from "react-icons/fa6";
import axios from 'axios';
import {GeneralContext} from '../../context/GeneralContext'
import { useNavigate } from 'react-router-dom';

const Profile = () => {

  const navigate = useNavigate();

  const {logout} = useContext(GeneralContext);

  const [actionType, setActionType] = useState('Transactions');
  const [userData, setUserData] = useState([]);
  

 const userId = localStorage.getItem('userId');
 const username = localStorage.getItem('username');


 useEffect(()=>{
  fetchUser();
 },[])

 const fetchUser = async() =>{
  await axios.get(`http://localhost:6001/fetch-user/${userId}`).then(
    (response)=>{
      setUserData(response.data);
    }
  ).catch((err)=>{
    console.log(err);
  })
 }


  const [depositAmount, setDepositAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [depositMode, setDepositMode] = useState('');
  const [withdrawMode, setWithdrawMode] = useState('');

  const [transactions, setTransactions] = useState([]);


  const deposit = async (e)=>{
    e.preventDefault();
    await axios.post('http://localhost:6001/deposit', {userId: localStorage.getItem('userId'), depositAmount, depositMode}).then(
      (response)=>{
        alert("Deposit successful!!");
        fetchUser();
        fetchTransactions();
        setActionType('Transactions');
        setDepositAmount(0);
        setDepositMode('');
      }
    ).catch((err)=>{
      alert('Transaction failed!!');
    })
  }


  const withdraw = async (e)=>{
    e.preventDefault();
    if(withdrawAmount <= userData.funds){

        await axios.post('http://localhost:6001/user-withdraw', {userId: localStorage.getItem('userId'), withdrawAmount, withdrawMode}).then(
          (response)=>{
            fetchTransactions();
            setActionType('Transactions');
            setWithdrawAmount(0);
            setWithdrawMode('');
            fetchUser();  
          }
        ).catch((err)=>{
          alert('Transaction failed!!');
        })
    }else{
      alert("Insufficient funds!!");
    }
  }


  useEffect(()=>{
    fetchTransactions();
  }, [])

  const fetchTransactions = async()=>{
    await axios.get('http://localhost:6001/fetch-transactions').then(
      (response)=>{
        setTransactions(response.data.reverse());
      }
    )
  }


  const [bids, setBids] = useState([]);

  useEffect(()=>{
    fetchBids();
    fetchProducts();
},[])

const fetchBids = async () =>{
    await axios.get(`http://localhost:6001/fetch-bids`).then(
        (response)=>{
            const data = response.data.filter((res)=> res.bidderId === localStorage.getItem("userId"));
            setBids(data.reverse());
        }
    )
}

const [products, setProducts] = useState([]);

const fetchProducts = async () =>{
  await axios.get(`http://localhost:6001/fetch-products`).then(
      (response)=>{
          const data = response.data.filter((res)=> res.topBid.bidderId === localStorage.getItem("userId") && res.status === "sold" );
          setProducts(data.reverse());
      }
  )
}



  return (

    <>
         {userData ? 

        <div className="profilePage">

      
          {/* <h2>My Account</h2> */}
          <div className="profileBox">
            <div className="profileBox-head">
                <span>
                  <b>Username:</b>
                  <p>{username}</p>
                </span>
                <button className='btn btn-outline-dark' onClick={()=>logout()} >logout</button>
            </div>
            <div className="profileBox-body">
                <span>
                  <p>Available funds</p>
                  <h6>&#8377; {userData.funds}</h6>
                </span>
                <div className="cash-actions">
                  <button className={actionType === 'AddFunds' ? 'cash-actions-active' : 'cash-actions-inactive'} onClick={()=>setActionType('AddFunds')}><RiRefund2Line  className='cash-action-icons'/>  Add Funds</button>
                  <button className={actionType === 'Withdraw' ? 'cash-actions-active' : 'cash-actions-inactive'} onClick={()=>setActionType('Withdraw')}><GiCash className='cash-action-icons'/> Withdraw</button>
                  <button className={actionType === 'Transactions' ? 'cash-actions-active' : 'cash-actions-inactive'} onClick={()=>setActionType('Transactions')}><RiHistoryLine className='cash-action-icons'/> Transactions</button>
                  <button className={actionType === 'Biddings' ? 'cash-actions-active' : 'cash-actions-inactive'} onClick={()=>setActionType('Biddings')}><FaRegMoneyBill1 className='cash-action-icons'/> Biddings</button>
                  <button className={actionType === 'BidsWon' ? 'cash-actions-active' : 'cash-actions-inactive'} onClick={()=>setActionType('BidsWon')}><RiAuctionLine className='cash-action-icons'/> Bids won</button>
                </div>
            </div> 
          </div>


          <div>
            {actionType === 'AddFunds' ?
            <div className="ProfileFunds">
              <h3>Add funds</h3>

              <form>
                <div class="mb-3">
                  <label htmlFor="amountInput" class="form-label"><HiOutlineCurrencyRupee /> Amount</label>
                  <input type="number" class="form-control" id="amountInput" placeholder='Enter amount' onChange={(e)=>setDepositAmount(e.target.value)} value={depositAmount} />
                </div>
                <div class="mb-3">
                  <label htmlFor="selectInput" class="form-label"><FiCreditCard /> Payment mode</label>
                  <select class="form-select" id='selectInput' aria-label="Default select example" onChange={(e)=>setDepositMode(e.target.value)} value={depositMode}>
                    <option value="" selected>Choose payment mode</option>
                    <option value="upi">UPI Payment</option>
                    <option value="net banking">Net Banking</option>
                    <option value="card">Credit/Debit Card</option>
                  </select>
                </div>
                <button class="btn btn-primary" onClick={deposit}>Proceed</button>
              </form>
            </div>
            :
            ""
            }

          {actionType === 'Withdraw' ?
            <div className="ProfileFunds">
              <h3>Withdraw</h3>

              <form>
                <div class="mb-3">
                  <label htmlFor="amountInput" class="form-label"><HiOutlineCurrencyRupee /> Amount</label>
                  <input type="number" class="form-control" id="amountInput" placeholder='Enter amount' onChange={(e)=>setWithdrawAmount(e.target.value)} value={withdrawAmount} />
                </div>
                <div class="mb-3">
                  <label htmlFor="selectInput" class="form-label"><FiCreditCard /> Withdraw mode</label>
                  <select class="form-select" id='selectInput' aria-label="Default select example" onChange={(e)=>setWithdrawMode(e.target.value)} value={withdrawMode}>
                    <option value="" selected>Choose withdraw mode</option>
                    <option value="upi">UPI Payment</option>
                    <option value="NEFT">NEFT</option>
                    <option value="IMPS">IMPS</option>
                  </select>
                </div>
                <button class="btn btn-primary" onClick={withdraw}>Proceed</button>
              </form>
            </div>
            :
            ""
            }


          {actionType === 'Transactions' ?
            <div className="ProfileFunds">
              <h3>Transactions</h3>

              <div className="profileTransactions">


              {transactions.filter(transaction=> transaction.userId === userId).map((transaction)=>{
                return(
                  <div className="profileTransaction">
                    <span>
                      <h6>Amount</h6>
                      <p> &#8377; {transaction.amount}</p>
                    </span>
                    <span>
                      <h6>Action</h6>
                      <p> {transaction.transactionType} </p>
                    </span>
                    <span>
                      <h6>Payment mode</h6>
                      <p>{transaction.paymentMethod}</p>
                    </span>
                    <span>
                      <h6>Time</h6>
                      <p>{transaction.time.slice(0,24)}</p>
                    </span>
                  </div>
                )
              })}

                 
                

              </div>
            </div>
            :
            ""
            }




            {actionType === 'Biddings' ?

            <>
              {bids.length > 0 ? 

                  <div className="user-profile-biddings-container">
                      <h3>Biddings</h3>
                      <div className="user-profile-biddings">

                          {bids.map((bid)=>(
                              <div className="user-profile-bidding" key={bid._id}>
                                  <span>
                                      <b>Product Id</b>
                                      <p>{bid.productId}</p>
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
                                      <p>{bid.bidTime.slice(0,10)} -- {bid.bidTime.slice(11,19)} </p>
                                  </span>
                                  <button className='btn btn-outline-info' onClick={()=> navigate(`/product/${bid.productId}`)}>View product</button>
                              </div>
                          ))}

                      </div>
                  </div>

                :""}
            
            </>
            
            :""}


            {actionType === 'BidsWon' ?

            <>
              {bids.length > 0 ? 

                  <div className="user-profile-biddings-container">
                      <h3>Biddings Won</h3>
                      <div className="user-profile-biddings">

                          {products.map((product)=>(
                              <div className="user-profile-bidding" key={product._id}>
                                  <span>
                                      <b>Product Id</b>
                                      <p>{product._id}</p>
                                  </span>
                                  <span>
                                      <b>Seller Name</b>
                                      <p>{product.sellerName}</p>
                                  </span>
                                  <span>
                                      <b>Start price</b>
                                      <p>&#8377; {product.startPrice}</p>
                                  </span>
                                  <span>
                                      <b>Bidding Amount</b>
                                      <p>&#8377; {product.topBid.amount}</p>
                                  </span>
                                  <button className='btn btn-outline-info' onClick={()=> navigate(`/product/${product._id}`)}>View product</button>
                              </div>
                          ))}

                      </div>
                  </div>

                :""}

            </>

            :""}


          </div>



        </div>
         :""}
    </>
  )
}

export default Profile