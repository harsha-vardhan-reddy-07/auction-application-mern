import React, { useEffect, useState } from 'react'
import '../../styles/AllProducts.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyProducts = () => {

    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [visibleProducts, setVisibleProducts] = useState([]);

    useEffect(()=>{
        fetchData();
      }, [])
    
      const fetchData = async() =>{

        await axios.get('http://localhost:6001/fetch-products').then(
          (response)=>{ 
            setProducts(response.data.filter((product)=> product.sellerId === localStorage.getItem("userId")));
            setVisibleProducts(response.data.filter((product)=> product.sellerId === localStorage.getItem("userId")));
          }
        )
        await axios.get('http://localhost:6001/fetch-categories').then(
          (response)=>{
            setCategories(response.data);
          }
        )
      }

      const [sortFilter, setSortFilter] = useState('popularity');
      const [categoryFilter, setCategoryFilter] = useState([]);
      const [genderFilter, setGenderFilter] = useState([]);


      const handleCategoryCheckBox = (e) =>{
        const value = e.target.value;
        if(e.target.checked){
            setCategoryFilter([...categoryFilter, value]);
        }else{
            setCategoryFilter(categoryFilter.filter(size=> size !== value));
        }
      }

      const handleGenderCheckBox = (e) =>{
        const value = e.target.value;
        if(e.target.checked){
            setGenderFilter([...genderFilter, value]);
        }else{
            setGenderFilter(genderFilter.filter(size=> size !== value));
        }
      }

      const handleSortFilterChange = (e) =>{
        const value = e.target.value;
        setSortFilter(value);
        if(value === 'low-price'){
            setVisibleProducts(visibleProducts.sort((a,b)=>  a.price - b.price))
        } else if (value === 'high-price'){
            setVisibleProducts(visibleProducts.sort((a,b)=>  b.price - a.price))
        }else if (value === 'discount'){
            setVisibleProducts(visibleProducts.sort((a,b)=>  b.discount - a.discount))
        }
      }
    
      useEffect(()=>{
        if (categoryFilter.length > 0 && genderFilter.length > 0){
            setVisibleProducts(products.filter(product=> categoryFilter.includes(product.category) && genderFilter.includes(product.gender) ));
        }else if(categoryFilter.length === 0 && genderFilter.length > 0){
            setVisibleProducts(products.filter(product=> genderFilter.includes(product.gender) ));
        } else if(categoryFilter.length > 0 && genderFilter.length === 0){
            setVisibleProducts(products.filter(product=> categoryFilter.includes(product.category)));
        }else{
            setVisibleProducts(products);
        }
      }, [categoryFilter, genderFilter])





      const findRemainingTime = (closingTime) =>{

        const totalSec = (new Date(closingTime).getTime() - new Date().getTime())/1000;
    
        const formatTime = (time) =>{
            return time < 10 ? `0${time}` : time
        }
        const totalDays = formatTime(Math.floor(totalSec/3600/24));
        const totalHrs = Math.floor(totalSec/3600) %24;
        const totalMins = Math.floor(totalSec/60) %60;
        const remaining = `${totalDays}D - ${totalHrs}Hr - ${totalMins}Min`
    
        return remaining
    }


  return (
    <div className="all-products-page">
        <div className="all-products-container">
        <div className="all-products-filter">
            <h4>Categories</h4>
            <div className="all-product-filters-body">

                
                <div className="all-product-filter-categories">
                    <div className="all-product-filter-categories-body all-product-sub-filter-body">
                        
                        {categories.map((category)=>{
                            return(
                                <div class="form-check" key={category}>
                                    <input class="form-check-input" type="checkbox" value={category} id={'productCategory'+ category} checked={categoryFilter.includes(category)} onChange={handleCategoryCheckBox} />
                                    <label class="form-check-label" for={'productCategory'+ category}>
                                        {category}
                                    </label>
                                </div>
                            )
                        })}
 
                    </div>
                </div>
                
            </div>
        </div>


        <div className="all-products-body">
            <h3>All Products</h3>
            <div className="all-products">

                {visibleProducts.map((product)=>{
                    return(
                        <div className='all-product-item' key={product._id}>
                            <div className="all-product">
                                <img src={product.mainImg} alt="" />
                                <div className="all-product-data">
                                    <h6>{product.title.slice(0,20) + '....'}</h6>
                                    <p>{product.description.slice(0,30) + '....'}</p>
                                    <h6><p>Start Price:</p>  &#8377; {product.startPrice}</h6>
                                    <h6><p>Top bid:</p>  &#8377; {product.topBid.amount}</h6>
                                    {product.status === "Available" ?
                                        <h6><p>Ends In: </p> {findRemainingTime(product.auctionCloseTime)} </h6>
                                    :""}

                                    {product.status === "sold" ?
                                        <h6><p>Sold to: </p> {product.topBid.bidderName} </h6>
                                    :""}

                                    {product.status === "Unsold" ?
                                        <h6 style={{color: "red"}} >Product Unsold</h6>
                                    :""}
                                </div>
                                {/* <button onClick={()=> navigate(`/update-product/${product._id}`)}>Update</button> */}
                                <button onClick={()=> navigate(`/my-product/${product._id}`)}>View</button>
                            </div>
                        </div>
                    )
                })}

            </div>
        </div>
    </div>
    </div>
  )
}

export default MyProducts