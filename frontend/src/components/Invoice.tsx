import React from "react";
import remita from "@/assets/remita.png";
import bank from "@/assets/banks.png";

const Invoice = () => {
  return (
    <div className="min-h-screen w-full m-2 flex items-start justify-start p-4 ">
      <div className="bg-white p-8 max-width-md">
        <h2 className="text-2xl font-semibold mb-6">Select Payment Method</h2>

        <div className="mb-8">
          <button className="w-full bg-green-600 text-white py-2 rounded-md font-medium mb-4 hover:bg-green-700 transition duration-300">
            Pay with Remita
          </button>
          <div className="flex justify-center">
            <img
              src={remita}
              alt="Remita Payment Logos"
              className="w-3/4 object-contain"
            />
          </div>
        </div>

        <div>
          <button className="w-full bg-green-600 text-white py-2 rounded-md font-medium mb-4 hover:bg-green-700 transition duration-300">
            Bank Payment
          </button>
          <div className="flex justify-center">
            <img
              src={bank}
              alt="Bank Payment Logos"
              className="w-3/4 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
