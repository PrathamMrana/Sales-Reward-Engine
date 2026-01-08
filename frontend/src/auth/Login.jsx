import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppIcon from "../components/common/AppIcon";
import axios from "axios";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("SALES"); // SALES or ADMIN
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password
      });

      const user = res.data;

      // Role Mismatch Check
      if (selectedRole === "ADMIN" && user.role !== "ADMIN") {
        alert("Access Denied: You are not an Admin.");
        return;
      }

      if (selectedRole === "SALES" && user.role === "ADMIN") {
        // Allow Admins to log in as sales? Maybe not. Let's redirect to admin anyway or warn.
        // For now, strict check:
        // alert("Please log in as Admin.");
        // return;
        // Actually, let's just use the returned role for navigation, but the radio button sets the "Expectation".
      }

      login(user);

      if (user.role === "ADMIN") navigate("/admin");
      else navigate("/sales");

    } catch (err) {
      alert("Login Failed: " + (err.response?.data || "Server Error"));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* App Name at Top */}
      <div className="w-full border-b-2 border-primary-200 bg-gradient-to-r from-white via-blue-50/30 to-indigo-50/30 py-4 px-8 shadow-sm">
        <div className="flex items-center space-x-3">
          <AppIcon size="w-12 h-12" />
          <h1 className="font-semibold text-lg uppercase tracking-widest" style={{
            background: 'linear-gradient(to right, #1e40af, #0d9488)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Sales Reward Engine
          </h1>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white border-l-4 border-primary-500 p-10 relative shadow-xl rounded-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100 to-accent-100 opacity-50 rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent-100 to-primary-100 opacity-30 rounded-tr-full"></div>

            <div className="mb-8 relative z-10">
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary-700 to-accent-600 bg-clip-text text-transparent tracking-tight mb-2">Sign In</h2>
              <div className="h-1 bg-gradient-to-r from-primary-500 to-accent-500 w-20 rounded-full"></div>
            </div>

            {/* ROLE SELECTOR */}
            <div className="flex bg-gray-100 p-1 rounded-lg mb-6 relative z-10">
              <button
                type="button"
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${selectedRole === "ADMIN"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                  }`}
                onClick={() => setSelectedRole("ADMIN")}
              >
                Admin
              </button>
              <button
                type="button"
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${selectedRole === "SALES"
                    ? "bg-white text-teal-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                  }`}
                onClick={() => setSelectedRole("SALES")}
              >
                Sales Executive
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-3 uppercase tracking-widest">
                  Email Address
                </label>
                <input
                  className="input-modern"
                  type="email"
                  placeholder={selectedRole === "ADMIN" ? "admin@company.com" : "sales@company.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-3 uppercase tracking-widest">
                  Password
                </label>
                <input
                  className="input-modern"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className={`w-full py-3 text-sm uppercase tracking-widest font-medium text-white rounded shadow-lg transition-transform transform hover:scale-[1.02] ${selectedRole === "ADMIN" ? "bg-blue-600 hover:bg-blue-700" : "bg-teal-600 hover:bg-teal-700"
                  }`}
              >
                Login as {selectedRole === "ADMIN" ? "Admin" : "Sales"} →
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                <span className="uppercase tracking-widest">Demo Mode</span><br />
                <span className="mt-1 block">
                  {selectedRole === "ADMIN" ? "Use e.g. admin@test.com" : "Use any email to auto-register"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
