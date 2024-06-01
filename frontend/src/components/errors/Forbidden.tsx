import { Link } from "react-router-dom";
import image from "../../assets/403.gif";

const Forbidden = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <img
        src={image} // Replace with your image path
        alt="404 Not Found"
        className="w-96 h-96 mb-8"
      />
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
        404 Not Found
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
        Oops! You do not have the permissons to access This page.
      </p>
      <Link
        to="/"
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default Forbidden;
