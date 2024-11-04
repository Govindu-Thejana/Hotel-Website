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

import AdminAppointment from "./components/AdminAppointment";
import Accomadation from "./pages/Accomadation";
import WeddingPage from "./pages/weddingpage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Adminpackage from "./pages/Adminpackage";
import PropTypes from 'prop-types';
import BookingManagement from "./pages/BookingManagement";

const MainLayout = ({ children }) => (
  <div>
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
    <div>
      <Routes>
        {/* Website Routes */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
        <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
        <Route path="/accommodation" element={<MainLayout><Accomadation /></MainLayout>} />
        <Route path="/roomDetails/:roomId" element={<MainLayout><RoomDetails /></MainLayout>} />
        <Route path="/weddings" element={<MainLayout><WeddingPage /></MainLayout>} />

        {/* Admin Routes (Separate from the main website layout) */}
        <Route path="/add-rooms" element={<AdminLayout><AddRooms /></AdminLayout>} />
        <Route path="/admin-dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/room-management" element={<AdminLayout><RoomManagement /></AdminLayout>} />
        <Route path="/edit-room/:roomId" element={<AdminLayout><EditRoom /></AdminLayout>} />
        <Route path="/admin-appointment" element={<AdminLayout><AdminAppointment /></AdminLayout>} />
        <Route path="/admin-package" element={<AdminLayout><Adminpackage /></AdminLayout>} />
        <Route path="/admin-bookings" element={<AdminLayout><BookingManagement /></AdminLayout>} />

      </Routes>
    </div>
  );
}


export default App;
