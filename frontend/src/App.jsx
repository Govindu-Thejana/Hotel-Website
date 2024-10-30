import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import WeddingPage from "./pages/weddingpage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Accomadation from "./pages/Accomadation";
import RoomDetails from "./pages/RoomDetails";
import AddRooms from "./pages/AddRooms";
import AdminDashboard from "./pages/AdminDashBoard";
import Navbar from "./components/AdminNavbar";
import AdminRoom from "./pages/AdminRoom";
import AdminAppointment from "./components/AdminAppointment";
import PropTypes from 'prop-types';


// Layout for the Main Website (with Header and Footer)
const MainLayout = ({ children }) => {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
};
MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

// Layout for Admin Pages (without Header and Footer)
const AdminLayout = ({ children }) => {
  return (
    <div className="flex">
      <Navbar /> {/* Fixed Sidebar */}
      <div className="flex-grow p-4 ml-64"> {/* Main Content Area */}
        {children}
      </div>
    </div>
  );
};
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
        <Route path="/admin-rooms" element={<AdminLayout><AdminRoom /></AdminLayout>} />
        <Route path="/admin-appointment" element={<AdminLayout><AdminAppointment /></AdminLayout>} />

      </Routes>
    </div>
  );
}

export default App;
