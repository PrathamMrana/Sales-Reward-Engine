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
    <div className="min-h-screen flex flex-col bg-bg-secondary transition-colors duration-300">
      {/* App Name at Top */}
      <div className="w-full border-b border-border-subtle bg-surface-1 py-4 px-8 shadow-sm">
        <div className="flex items-center space-x-3">
          <AppIcon size="w-12 h-12" />
          <h1 className="font-semibold text-lg uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-primary-700 to-accent-600 dark:from-primary-400 dark:to-accent-400">
            Sales Reward Engine
          </h1>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="glass-card p-10 relative shadow-xl rounded-xl border border-primary-500/30">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/20 dark:to-accent-900/20 opacity-50 rounded-bl-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent-100 to-primary-100 dark:from-accent-900/20 dark:to-primary-900/20 opacity-30 rounded-tr-full pointer-events-none"></div>

            <div className="mb-8 relative z-10">
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary-700 to-accent-600 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent tracking-tight mb-2">Sign In</h2>
              <div className="h-1 bg-gradient-to-r from-primary-500 to-accent-500 w-20 rounded-full"></div>
            </div>

            {/* ROLE SELECTOR */}
            <div className="flex bg-surface-3 p-1 rounded-lg mb-6 relative z-10">
              <button
                type="button"
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${selectedRole === "ADMIN"
                  ? "bg-surface-1 text-primary-600 shadow-sm"
                  : "text-text-muted hover:text-text-secondary"
                  }`}
                onClick={() => setSelectedRole("ADMIN")}
              >
                Admin
              </button>
              <button
                type="button"
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${selectedRole === "SALES"
                  ? "bg-surface-1 text-accent-600 shadow-sm"
                  : "text-text-muted hover:text-text-secondary"
                  }`}
                onClick={() => setSelectedRole("SALES")}
              >
                Sales Executive
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-3 uppercase tracking-widest">
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
                <label className="block text-xs font-medium text-text-secondary mb-3 uppercase tracking-widest">
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
                className={`w-full py-3 text-sm uppercase tracking-widest font-medium text-white rounded shadow-lg transition-transform transform hover:scale-[1.02] ${selectedRole === "ADMIN" ? "bg-primary-600 hover:bg-primary-700" : "bg-accent-600 hover:bg-accent-700"
                  }`}
              >
                Login as {selectedRole === "ADMIN" ? "Admin" : "Sales"} →
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-border-subtle">
              <p className="text-xs text-text-muted text-center">
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
