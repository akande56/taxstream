import React from "react";
import { AppModal } from "../app/modal";
import { AppButton } from "../app/button";

interface BusinessInfoModalProps {
  open: boolean;
  onClose: () => void;
  //   staff: {
  //     fullname: string;
  //     staffId: string;
  //     role: string;
  //     lga: string;
  //     email: string;
  //     phoneNumber: string;
  //     state: number;
  //   };
}

const AssesmentReviewModal: React.FC<BusinessInfoModalProps> = ({
  open,
  onClose,
}) => {
  //   if (!staff) {
  //     return (
  //       <AppModal
  //         open={open}
  //         onCancel={onClose}
  //         okButtonProps={{ hidden: true }}
  //         cancelButtonProps={{ hidden: true }}
  //       >
  //         <h1 className="text-2xl font-bold">Staff Information</h1>
  //         <p className="text-center">No staff information available</p>
  //       </AppModal>
  //     );
  //   }

  return (
    <AppModal
      open={open}
      onCancel={onClose}
      okButtonProps={{ hidden: true }}
      cancelButtonProps={{ hidden: true }}
    >
      <h1 className="text-2xl font-bold">Staff Information</h1>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Tax Payee Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Holder Name Full Name:
              </label>
              <div className="bg-gray-100 rounded-md p-2">
                [Holder Name Full Name]
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Tax ID:
              </label>
              <div className="bg-gray-100 rounded-md p-2">[Tax ID]</div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Email:
              </label>
              <div className="bg-gray-100 rounded-md p-2">[Email]</div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Phone Number:
              </label>
              <div className="bg-gray-100 rounded-md p-2">[Phone Number]</div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                LGA:
              </label>
              <div className="bg-gray-100 rounded-md p-2">[LGA]</div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                WARD:
              </label>
              <div className="bg-gray-100 rounded-md p-2">[WARD]</div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                TAX AREA:
              </label>
              <div className="bg-gray-100 rounded-md p-2">[TAX AREA]</div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Business Name:
              </label>
              <div className="bg-gray-100 rounded-md p-2">[Business Name]</div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                CONDITION:
              </label>
              <div className="bg-gray-100 rounded-md p-2">[CONDITION]</div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Withholding Tax:
              </label>
              <div className="bg-gray-100 rounded-md p-2">
                [Withholding Tax]
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Type:
              </label>
              <div className="bg-gray-100 rounded-md p-2">[Type]</div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Annual Income:
              </label>
              <div className="bg-gray-100 rounded-md p-2">[Annual Income]</div>
            </div>
            <div className="col-span-2 flex items-center justify-between mt-4">
              <label className="block text-sm font-medium text-gray-700">
                To be Paid:
              </label>
              <input
                type="number"
                className="appearance-none rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 bg-white"
                placeholder="Enter Amount"
              />
            </div>
            <div className="col-span-2 flex items-center justify-between mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Tax Due Time:
              </label>
              <select className="appearance-none rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 bg-white">
                <option>Annually</option>
                <option>Monthly</option>
                <option>Quarterly</option>
              </select>
            </div>
            <div className="flex gap-3">
              <AppButton type="submit" label="Save" />
              <button
                onClick={onClose}
                className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded-sm transition duration-200 ease-in-out w-full "
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppModal>
  );
};

export default AssesmentReviewModal;
