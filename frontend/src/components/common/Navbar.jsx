import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="border-b border-gray-300 px-6 py-4 flex justify-between bg-white">
      <h1 className="font-semibold text-gray-900 text-lg uppercase tracking-wide">
        Sales Reward Engine
      </h1>

      <div className="flex gap-6 text-sm">
        <NavLink to="/" className={({isActive}) =>
          isActive ? "text-black font-medium" : "text-gray-600 hover:text-black transition-colors"
        }>Dashboard</NavLink>

        <NavLink to="/calculator" className={({isActive}) =>
          isActive ? "text-black font-medium" : "text-gray-600 hover:text-black transition-colors"
        }>Calculator</NavLink>

        <NavLink to="/history" className={({isActive}) =>
          isActive ? "text-black font-medium" : "text-gray-600 hover:text-black transition-colors"
        }>Deal History</NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
