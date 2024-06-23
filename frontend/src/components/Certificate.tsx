import React from "react";
import { Link } from "react-router-dom";

interface Certificate {
  id: number;
  date: string;
}

const certificates: Certificate[] = [
  { id: 1, date: "[Date]" },
  { id: 2, date: "[Date]" },
  { id: 3, date: "[Date]" },
  { id: 4, date: "[Date]" },
];

const Certificate: React.FC = () => {
  return (
    <div className=" p-4 min-h-screen w-full">
      <div className=" w-full mx-auto flex flex-col justify-start items-start  overflow-hidden">
        {/* Payment Status */}
        <div className="bg-red-500 mb-2 text-white text-center p-4">
          <p className="text-lg font-semibold">
            Your Payment Is not Up to Date
          </p>
        </div>

        <div className="bg-green-500 text-white text-center p-4">
          <p className="text-lg font-semibold">Your Payment Is Up to Date</p>
        </div>

        {/* Certificates Table */}
        <div className="p-4 w-full">
          <table className="w-full text-left table-auto">
            <thead>
              <tr className="text-gray-700 bg-gray-50">
                <th className="py-2">#</th>
                <th className="py-2">Certificate</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {certificates.map((certificate, index) => (
                <tr
                  key={certificate.id}
                  className={`border-t border-gray-200 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="py-2 px-4">{certificate.id}</td>
                  <td className="py-2 px-4">{certificate.date}</td>
                  <td className="py-2 px-4">
                    <Link
                      to={`/dashboard/certificate/${certificate.id}`}
                      className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
