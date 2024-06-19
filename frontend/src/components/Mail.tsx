import React from "react";

const Mail: React.FC = () => {
  const tickets = [
    {
      id: 1,
      title: "Request for profile update",
      date: "01/10/2024",
      sentBy: "Abdussalam Abubakar",
    },
    {
      id: 1,
      title: "Request for profile update",
      date: "01/10/2024",
      sentBy: "Abdussalam Abubakar",
    },
    {
      id: 1,
      title: "Request for profile update",
      date: "01/10/2024",
      sentBy: "Bot",
    },
    {
      id: 1,
      title: "Request for profile update",
      date: "01/10/2024",
      sentBy: "Bot",
    },
    {
      id: 1,
      title: "Request for profile update",
      date: "01/10/2024",
      sentBy: "Bot",
    },
  ];

  return (
    <div className="p-4">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">#</th>
            <th className="px-4 py-2 border-b">Title</th>
            <th className="px-4 py-2 border-b">Date</th>
            <th className="px-4 py-2 border-b">Sent by</th>
            <th className="px-4 py-2 border-b">View</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket, index) => (
            <tr key={index} className="text-center">
              <td className="px-4 py-2 border-b">{ticket.id}</td>
              <td className="px-4 py-2 border-b">{ticket.title}</td>
              <td className="px-4 py-2 border-b">{ticket.date}</td>
              <td className="px-4 py-2 border-b">{ticket.sentBy}</td>
              <td className="px-4 py-2 border-b text-blue-500 cursor-pointer">
                View
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Mail;
