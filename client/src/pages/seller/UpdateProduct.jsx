import React, { useEffect, useState } from 'react'
import '../../styles/NewProducts.css'
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';

const UpdateProduct = () => {

  const {id} = useParams();

  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productMainImg, setProductMainImg] = useState('');
  const [productCarouselImg1, setProductCarouselImg1] = useState('');
  const [productCarouselImg2, setProductCarouselImg2] = useState('');
  const [productCarouselImg3, setProductCarouselImg3] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productNewCategory, setProductNewCategory] = useState('');

  const [productStartPrice, setProductStartPrice] = useState(0);
  const [auctionCloseTime, setAuctionCloseTime] = useState('');


  const [AvailableCategories, setAvailableCategories] = useState([]);


  useEffect(()=>{
    fetchCategories();
    fetchProduct();
  },[])


  const fetchProduct = async() =>{
    await axios.get(`http://localhost:6001/fetch-product-details/${id}`).then(
      (response)=>{
        setProductName(response.data.title);
        setProductDescription(response.data.description);
        setProductMainImg(response.data.mainImg);
        setProductCarouselImg1(response.data.carousel[0]);
        setProductCarouselImg2(response.data.carousel[1]);
        setProductCarouselImg3(response.data.carousel[2]);
        setProductCategory(response.data.category);
        setProductStartPrice(response.data.startPrice);
        setAuctionCloseTime(response.data.auctionCloseTime);
      }
    )
  }


  const fetchCategories = async () =>{
    await axios.get('http://localhost:6001/fetch-categories').then(
      (response)=>{
        setAvailableCategories(response.data);
      }
    )
  }




  const navigate = useNavigate();


  const handleUpdateProduct = async() =>{
    await axios.put(`http://localhost:6001/update-product/${id}`, {productName, productDescription, productMainImg, 
                                              productCarousel: [productCarouselImg1, productCarouselImg2, productCarouselImg3], 
                                              productCategory, productNewCategory, auctionCloseTime, productStartPrice}).then(
      (response)=>{
        alert("product updated");
        setProductName('');
        setProductDescription('');
        setProductMainImg('');
        setProductCarouselImg1('');
        setProductCarouselImg2('');
        setProductCarouselImg3('');
        setProductCategory('');
        setProductNewCategory('');
        setProductStartPrice(0);
        setAuctionCloseTime('');

        navigate('/all-products');
      }
    )
  }


  return (
    <div className="new-product-page">
        <div className="new-product-container">
          <h3>Update Product</h3>

          <div className="new-product-body">

              <div className="form-floating mb-3">
                <input type="text" className="form-control" id="floatingNewProduct1" value={productName} onChange={(e)=>setProductName(e.target.value)} />
                <label htmlFor="floatingNewProduct1">Product name</label>
              </div>
              <div className="form-floating mb-3 ">
                <textarea type="text" className="form-control" id="floatingNewProduct2" value={productDescription} onChange={(e)=>setProductDescription(e.target.value)} />
                <label htmlFor="floatingNewProduct2">Product Description</label>
              </div>


            <span >
                <div className="form-floating mb-3 span-21">
                  <input type="datetime-local" className="form-control" id="floatingNewProduct1" value={auctionCloseTime} onChange={(e)=>setAuctionCloseTime(e.target.value)}/>
                  <label htmlFor="floatingNewProduct1">Auction closing time</label>
                </div>

                <div className="form-floating mb-3 span-22">
                  <input type="text" className="form-control" id="floatingNewProduct1" value={productMainImg} onChange={(e)=>setProductMainImg(e.target.value)}/>
                  <label htmlFor="floatingNewProduct1">Thumbnail Img url</label>
                </div>

            </span>

            <span>
              <div className="form-floating mb-3 span-3">
                <input type="text" className="form-control" id="floatingNewProduct2" value={productCarouselImg1} onChange={(e)=>setProductCarouselImg1(e.target.value)}/>
                <label htmlFor="floatingNewProduct2">Add on img1 url</label>
              </div>
              <div className="form-floating mb-3 span-3">
                <input type="text" className="form-control" id="floatingNewProduct2" value={productCarouselImg2} onChange={(e)=>setProductCarouselImg2(e.target.value)}/>
                <label htmlFor="floatingNewProduct2">Add on img2 url</label>
              </div>
              <div className="form-floating mb-3 span-3">
                <input type="text" className="form-control" id="floatingNewProduct2" value={productCarouselImg3} onChange={(e)=>setProductCarouselImg3(e.target.value)} />
                <label htmlFor="floatingNewProduct2">Add on img3 url</label>
              </div>
            </span>


            <span>
              <div className="form-floating mb-3 span-21">
                <select className="form-select" id='floatingNewProduct5' aria-label="Default select example" value={productCategory} onChange={(e)=>setProductCategory(e.target.value)}>
                  <option value="">Choose Product category</option>
                  {AvailableCategories.map((category)=>{
                    return(
                        <option value={category}>{category}</option>
                    )
                  })}
                  <option value="new category">New category</option>
                </select>
                <label htmlFor="floatingNewProduct5">Category</label>
              </div>
              <div className="form-floating mb-3 span-22">
                <input type="number" className="form-control" id="floatingNewProduct6" value={productStartPrice} onChange={(e)=>setProductStartPrice(e.target.value)}/>
                <label htmlFor="floatingNewProduct6">Starting price</label>
              </div>
            </span>

            {productCategory === 'new category' ?
               <div className="form-floating mb-3">
               <input type="text" className="form-control" id="floatingNewProduct8" value={productNewCategory} onChange={(e)=>setProductNewCategory(e.target.value)}/>
               <label htmlFor="floatingNewProduct8">New Category</label>
           </div>
            :
                  ""
            }
           

          </div>

          <button className='btn btn-primary' onClick={handleUpdateProduct}>Update</button>
        </div>
    </div>
  )
}

export default UpdateProduct