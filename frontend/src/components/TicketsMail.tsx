import { Link, Outlet, useLocation } from "react-router-dom";

const TicketsMail = () => {
  const location = useLocation();
  return (
    <div className="p-8 min-h-screen">
      <div className="max-w-5xl mx-auto  shadow-md rounded-lg overflow-hidden">
        {/* Tabs */}
        <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
          <div className="flex space-x-2">
            <Link
              to=""
              className={
                location.pathname === "/dashboard/ticket"
                  ? "bg-green-500 text-white px-4 py-2 rounded-l"
                  : "bg-white text-black px-4 py-2 rounded-l border"
              }
            >
              Tickets
            </Link>
            <Link
              to="mails"
              className={
                location.pathname !== "/dashboard/ticket"
                  ? "bg-green-500 text-white px-4 py-2 rounded-l"
                  : "bg-white text-black px-4 py-2 rounded-l border"
              }
            >
              MAILS
            </Link>
          </div>
          <button className="bg-green-500 text-white px-4 py-2 rounded">
            Create New Ticket
          </button>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default TicketsMail;
