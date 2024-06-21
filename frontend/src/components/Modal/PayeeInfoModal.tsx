/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { AppModal } from "../app/modal";

interface PayeeInfoModalProps {
  open: boolean;
  onClose: () => void;
  payee?: any; //TaxPayeeDetailsProps;
}

const PayeeInfoModal: React.FC<PayeeInfoModalProps> = ({
  open,
  onClose,
  payee,
}) => {
  return (
    <AppModal
      open={open}
      onCancel={onClose}
      okButtonProps={{ hidden: true }}
      cancelButtonProps={{ hidden: true }}
    >
      <div className="flex justify-center items-center h-fit ">
        <div className=" shadow-md  p-6 w-full max-w-lg">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Tax Payee Details
          </h2>
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-right font-medium">
                Holder Name Full Name:
              </div>
              <div className="text-left">{payee?.fullname}</div>

              <div className="text-right font-medium">Tax ID:</div>
              <div className="text-left">{payee?.userId}</div>

              <div className="text-right font-medium">Email:</div>
              <div className="text-left">{payee.email}</div>

              <div className="text-right font-medium">Phone Number:</div>
              <div className="text-left">[Phone Number]</div>

              <div className="text-right font-medium">LGA:</div>
              <div className="text-left">[LGA]</div>

              <div className="text-right font-medium">WARD:</div>
              <div className="text-left">[WARD]</div>

              <div className="text-right font-medium">TAX AREA:</div>
              <div className="text-left">[TAX AREA]</div>

              <div className="text-right font-medium">Business Name:</div>
              <div className="text-left">{payee?.businessName}</div>

              <div className="text-right font-medium">CLASSIFICATION:</div>
              <div className="text-left">{payee?.classification}</div>

              <div className="text-right font-medium">With holding Tax:</div>
              <div className="text-left">{payee?.withholdingTaxRate}</div>

              <div className="text-right font-medium">Type:</div>
              <div className="text-left">[Type]</div>

              <div className="text-right font-medium">Annual Income:</div>
              <div className="text-left">[Annual Income]</div>
              <div className="flex flex-wrap justify-between p-2">
                <div className="flex flex-col justify-around">
                  <div className="text-right font-medium">Audit Review:</div>
                  <div className="text-left text-yellow-500">Pending</div>
                  <div className="text-right font-medium">Tax Due Time:</div>
                  <div className="text-left text-yellow-500">Pending</div>
                </div>

                <div className="text-right font-medium">Payment Status:</div>
                <div className="text-left p-2 bg-red-500 text-gray-100">
                  Not Active
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </AppModal>
  );
};

export default PayeeInfoModal;
