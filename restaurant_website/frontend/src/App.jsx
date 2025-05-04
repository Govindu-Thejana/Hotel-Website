import React from 'react';
import Navbar from './components/navbar/navbar';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/home/home';
import Cart from './pages/cart/cart';
import PlaceOrder from './pages/placeOrder/PlaceOrder';
import Footer from './components/footer/Footer';
import LoginPopup from './components/LoginPopup/LoginPopup';
import { ToastContainer, toast } from 'react-toastify';

const App = () => {
  const [showLogin, setShowLogin] = React.useState(false);

  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      <div className='app'>
        <ToastContainer />
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<PlaceOrder />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
