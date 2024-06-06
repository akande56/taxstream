/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { AppModal } from "../app/modal";
import { AppButton } from "../app/button";
import AuditQueryModal from "./AuditQueryModal";

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

const AuditReviewModal: React.FC<BusinessInfoModalProps> = ({
  open,
  onClose,
}) => {
  const [showQueryModal, setShowQueryModal] = useState<boolean>(false);

  const handleQuery = () => {
    setShowQueryModal(!showQueryModal);
  };

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
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <AuditQueryModal
          open={showQueryModal}
          onClose={() => setShowQueryModal(false)}
        />
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Tax Payee Details</h2>
          <hr className="mb-2" />
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
            <div className="col-span-2">
              <div className="flex place-content-center">
                <AppButton
                  type="submit"
                  label="Submit Query"
                  onClick={() => handleQuery()}
                />
              </div>
            </div>
            <div className="flex w-full justify-around  gap-3">
              <AppButton width="full" type="submit" label="Save" />
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

export default AuditReviewModal;
