import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store';
import websocketService from './services/websocketService';
import Navbar from './components/Navbar/Navbar';
import Sidebars from './components/Sidebar/Sidebar';
import { Routes, Route } from 'react-router-dom';
import Add from './pages/Add/Add';
import List from './pages/List/List';
import Orders from './pages/Orders/Orders';
import Overview from './pages/Overview/Overview';
import UpdateProduct from './pages/Update/Update';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AppContent = ({ url }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    websocketService.initialize(url, dispatch);
    return () => {
      websocketService.disconnect();
    };
  }, [url]);

  return (
    <div>
      <ToastContainer />
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebars />
        <Routes>
          <Route path="/" element={<Overview url={url} />} />
          <Route path="/add" element={<Add url={url} />} />
          <Route path="/list" element={<List url={url} />} />
          <Route path="/orders" element={<Orders url={url} />} />
          <Route path="/update-product/:productId" element={<UpdateProduct url={url} />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  const url = import.meta.env.VITE_BACKEND_URL;

  return (
    <Provider store={store}>
      <AppContent url={url} />
    </Provider>
  );
};

export default App;