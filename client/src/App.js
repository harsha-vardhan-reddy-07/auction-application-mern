import { Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar'
import Home from './pages/Home';
import Authentication from './pages/Authentication';

import Profile from './pages/customer/Profile';
import CategoryProducts from './pages/customer/CategoryProducts';
import IndividualProduct from './pages/customer/IndividualProduct';

import Admin from './pages/admin/Admin';
import AllProducts from './pages/admin/AllProducts';
import AllUsers from './pages/admin/AllUsers';
import AllBiddings from './pages/admin/AllBiddings';


import NewProduct from './pages/seller/NewProduct';
import UpdateProduct from './pages/seller/UpdateProduct';
import Seller from './pages/seller/Seller';
import MyProduct from './pages/seller/MyProduct';
import MyProducts from './pages/seller/MyProducts';
import ViewProduct from './pages/ViewProduct';

function App() {
  return (
    <div className="App">
      
      <Navbar />
      
      <Routes>

        <Route exact path='' element={<Home />}/>
        <Route path='/auth' element={<Authentication />} />

        <Route path='/view-product/:id' element={<ViewProduct />} />


        <Route path='/product/:id' element={<IndividualProduct />} />
        <Route path='/category/:category' element={<CategoryProducts />} />
        <Route path='/profile' element={<Profile />} />

        <Route path='/seller' element={<Seller />} />
        <Route path='/my-products' element={<MyProducts />} />
        <Route path='/my-product/:id' element={<MyProduct />} />
        <Route path='/new-product' element={<NewProduct />} />
        <Route path='/update-product/:id' element={<UpdateProduct />} />

        <Route path='/admin' element={<Admin />} />
        <Route path='/all-products' element={<AllProducts />} />
        <Route path='/all-users' element={<AllUsers />} />
        <Route path='/all-bids' element={<AllBiddings />} />

      </Routes>

    </div>
  );
}

export default App;
