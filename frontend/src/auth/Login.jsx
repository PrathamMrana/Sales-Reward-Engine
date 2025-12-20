import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // TEMP (replace with backend API later)
    const response = {
      token: "dummy-token",
      role: email === "admin@test.com" ? "ADMIN" : "SALES",
      name: "Pratham"
    };

    login(response);

    if (response.role === "ADMIN") navigate("/admin");
    else navigate("/sales");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 shadow-sm p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-black mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Sales Reward Engine</h2>
            <p className="text-sm text-gray-600">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5 uppercase tracking-wide">
                Email Address
              </label>
              <input
                className="input-modern"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <input
                className="input-modern"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full btn-primary py-2.5 text-sm uppercase tracking-wide"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            <p>Demo: Use any email to login</p>
            <p className="mt-1">admin@test.com for Admin role</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
