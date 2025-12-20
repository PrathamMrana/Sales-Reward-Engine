import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md">
        <div className="card-modern p-10">
          <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h1 className="text-5xl font-semibold text-gray-900 mb-2">404</h1>
          <h2 className="text-lg font-medium text-gray-700 mb-3">Page Not Found</h2>
          <p className="text-sm text-gray-600 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <button
            onClick={() => navigate("/sales")}
            className="btn-primary text-sm uppercase tracking-wide"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

