import Navbar from "../components/common/Navbar";

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-6">{children}</div>
    </div>
  );
};

export default AdminLayout;
