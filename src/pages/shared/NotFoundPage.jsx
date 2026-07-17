import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-xl text-gray-600 mt-4">Page not found</p>
      <Link to="/" className="text-blue-600 hover:underline mt-6 inline-block">
        Go home
      </Link>
    </div>
  );
};

export default NotFoundPage;
