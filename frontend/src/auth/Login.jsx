import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppIcon from "../components/common/AppIcon";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Extract name from email (part before @)
    const emailName = email.split("@")[0];
    const salesmanName = emailName.charAt(0).toUpperCase() + emailName.slice(1);

    // TEMP (replace with backend API later)
    const response = {
      token: "dummy-token",
      role: email === "admin@test.com" ? "ADMIN" : "SALES",
      name: salesmanName
    };

    login(response);

    if (response.role === "ADMIN") navigate("/admin");
    else navigate("/sales");
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
          
          <div className="mb-10 relative z-10">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary-700 to-accent-600 bg-clip-text text-transparent tracking-tight mb-2">Sign In</h2>
            <div className="h-1 bg-gradient-to-r from-primary-500 to-accent-500 w-20 rounded-full"></div>
          </div>

            <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-3 uppercase tracking-widest">
                Email Address
              </label>
              <input
                className="input-modern"
                type="email"
                placeholder="your.email@company.com"
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
              className="w-full btn-primary py-3 text-sm uppercase tracking-widest font-medium"
            >
              Sign In →
            </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                <span className="uppercase tracking-widest">Demo Mode</span><br />
                <span className="mt-1 block">Use any email • admin@test.com for Admin</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
