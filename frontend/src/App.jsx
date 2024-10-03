import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import WeddingPage from "./pages/WeddingPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Accomadation from "./pages/Accomadation";
import RoomDetails from "./pages/RoomDetails";
import AddRooms from "./pages/AddRooms";
import AdminDashboard from "./pages/AdminDashBoard";
import Navbar from "./components/AdminNavbar";
import AdminRoom from "./pages/AdminRoom";

// Layout for the Main Website (with Header and Footer)
const MainLayout = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </div>
  );
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

        {/* Admin Routes (Separate from the main website layout) */}
        <Route path="/add-rooms" element={<AdminLayout><AddRooms /></AdminLayout>} />
        <Route path="/admin-dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin-rooms" element={<AdminLayout><AdminRoom /></AdminLayout>} />
      </Routes>
    </div>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/weddingPage" element={<WeddingPage />} />
        <Route path="/accommodation" element={<Accomadation />} />
        <Route path="/roomDetails/:roomId" element={<RoomDetails />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;