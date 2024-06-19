import React from "react";

interface Ticket {
  id: number;
  title: string;
  date: string;
  status: "Pending" | "Ongoing" | "Closed";
}

const tickets: Ticket[] = [
  {
    id: 1,
    title: "Request for profile update",
    date: "01/10/2024",
    status: "Pending",
  },
  {
    id: 2,
    title: "Request for profile update",
    date: "01/10/2024",
    status: "Ongoing",
  },
  {
    id: 3,
    title: "Request for profile update",
    date: "01/10/2024",
    status: "Closed",
  },
  {
    id: 4,
    title: "Request for profile update",
    date: "01/10/2024",
    status: "Closed",
  },
  {
    id: 5,
    title: "Request for profile update",
    date: "01/10/2024",
    status: "Closed",
  },
];

const Tickets: React.FC = () => {
  return (
    <div className="p-4">
      <table className="w-full text-left table-auto">
        <thead>
          <tr className="text-gray-700">
            <th className="py-2">#</th>
            <th className="py-2">Title</th>
            <th className="py-2">Date</th>
            <th className="py-2">Status</th>
            <th className="py-2">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {tickets.map((ticket, index) => (
            <tr
              key={ticket.id}
              className={`border-t border-gray-200 ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              <td className="py-2 px-4">{ticket.id}</td>
              <td className="py-2 px-4">{ticket.title}</td>
              <td className="py-2 px-4">{ticket.date}</td>
              <td className="py-2 px-4">
                <span
                  className={`${
                    ticket.status === "Pending"
                      ? "text-red-500"
                      : ticket.status === "Ongoing"
                      ? "text-yellow-500"
                      : "text-green-500"
                  }`}
                >
                  {ticket.status}
                </span>
              </td>
              <td className="py-2 px-4 text-blue-500">
                <a href="#">View</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Tickets;
