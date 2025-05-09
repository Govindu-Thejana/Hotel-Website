import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RoomDetails from "./pages/RoomDetails";
import AddRooms from "./pages/AddRooms";
import AdminDashboard from "./pages/AdminDashBoard";
import Navbar from "./components/AdminNavbar";
import RoomManagement from "./pages/RoomManagement";
import EditRoom from "./pages/EditRoom";
import Event from "./pages/Event";
import GalleryPage from "./components/gallery/GalleryPage";

import AdminAppointment from "./components/AdminAppointment";
import Accomadation from "./pages/Accomadation";
import WeddingPage from "./pages/weddingpage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Adminpackage from "./pages/Adminpackage";
import PropTypes from 'prop-types';
import BookingManagement from "./components/booking/BookingManagement";
import RoomCreationForm from "./components/room/RoomCreationForm";
import AdminRoomView from "./components/room/AdminRoomView";

import BookingDetails from "./components/booking/BookingDetails";
import { ToastContainer } from 'react-toastify';
import BookingPage from "./pages/bookingProcess/BookingPage";
import CheckoutPage from "./pages/bookingProcess/CheckoutPage";
import AddonsPage from "./pages/bookingProcess/AddonsPage";
import CompleteBooking from "./pages/bookingProcess/CompleteBooking";
import CartProvider from "./contexts/CartContext";

import AdminGalleryView from "./components/gallery/AdminGalleryView";
import AddImages from "./components/gallery/AddImages"
import MyBookings from "./pages/bookingProcess/MyBookings";


const MainLayout = ({ children }) => (
  <div>
    <ToastContainer />
    <Header />
    {children}
    <Footer />
  </div>
);
MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

const AdminLayout = ({ children }) => (
  <div className="flex">
    <ToastContainer />
    <Navbar />
    <div className="flex-grow p-4 ml-64">
      {children}
    </div>
  </div>
);
AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};





const App = () => {
  return (
    <CartProvider>
      <div>
        <Routes>
          {/* Website Routes */}
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
          <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
          <Route path="/accommodation" element={<MainLayout><Accomadation /></MainLayout>} />
          <Route path="/roomDetails/:roomId" element={<MainLayout><RoomDetails /></MainLayout>} />
          <Route path="/weddings" element={<MainLayout><WeddingPage /></MainLayout>} />
          <Route path="/reservation" element={<MainLayout><BookingPage /></MainLayout>} />
          <Route path="/checkout" element={<MainLayout><CheckoutPage /></MainLayout>} />
          <Route path="/addons" element={<MainLayout><AddonsPage /></MainLayout>} />
          <Route path="/CompleteBooking" element={<MainLayout><CompleteBooking /></MainLayout>} />
          <Route path="/event" element={<MainLayout><Event /></MainLayout>} />
          <Route path="/gallery" element={<MainLayout><GalleryPage /></MainLayout>} />
          <Route path="/myBookings" element={<MainLayout><MyBookings /></MainLayout>} />


          {/* Admin Routes (Separate from the main website layout) */}
          <Route path="/add-rooms" element={<AdminLayout><AddRooms /></AdminLayout>} />
          <Route path="/admin-dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/room-management" element={<AdminLayout><RoomManagement /></AdminLayout>} />
          <Route path="/edit-room/:roomId" element={<AdminLayout><EditRoom /></AdminLayout>} />
          <Route path="/admin-appointment" element={<AdminLayout><AdminAppointment /></AdminLayout>} />
          <Route path="/admin-package" element={<AdminLayout><Adminpackage /></AdminLayout>} />
          <Route path="/admin-bookings" element={<AdminLayout><BookingManagement /></AdminLayout>} />
          <Route path="/add-newrooms" element={<AdminLayout><RoomCreationForm /></AdminLayout>} />
          <Route path="/admin-roomview/:roomId" element={<AdminLayout><AdminRoomView /></AdminLayout>} />
          <Route path="/admin-test" element={<AdminLayout><BookingDetails /></AdminLayout>} />


          <Route path="/gallery-test" element={<AdminLayout><AdminGalleryView /></AdminLayout>} />
          <Route path="/add-newimages" element={<AdminLayout><AddImages /></AdminLayout>} />

        </Routes>
      </div>
    </CartProvider>

  );
}


export default App;
