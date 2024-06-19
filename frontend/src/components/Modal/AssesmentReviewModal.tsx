/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { AppModal } from "../app/modal";
import { AppButton } from "../app/button";
import api from "@/api";
import { toast } from "sonner";

interface BusinessInfoModalProps {
  open: boolean;
  onClose: () => void;
  business: any;
}

const AssesmentReviewModal: React.FC<BusinessInfoModalProps> = ({
  open,
  onClose,
  business,
}) => {
  const [toBePaid, setToBePaid] = useState(0); // Step 2
  const [taxDueTime, setTaxDueTime] = useState("annually"); // Step 2

  // Step 3: Function to update the state
  const handleDataUpdate = (e: any) => {
    const { name, value } = e.target;
    if (name === "to_be_paid") {
      setToBePaid(value);
    } else if (name === "tax_due_time") {
      setTaxDueTime(value);
    }
  };
  const updateBusiness = async () => {
    const response = await api.put(
      `/api/v1/assessments/assessment_officer/update/${business.id}/`,
      {
        to_be_paid: toBePaid,
        tax_due_time: taxDueTime,
      }
    );
    const { data } = response;
    console.log(data, "Data");
    toast.success("Business updated successfully");
    onClose();
  };

  if (!business) {
    return (
      <AppModal
        open={open}
        onCancel={onClose}
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
      >
        <h1 className="text-2xl font-bold">Staff Information</h1>
        <p className="text-center">No staff information available</p>
      </AppModal>
    );
  }

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
                {business.fullname}
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Tax ID:
              </label>
              <div className="bg-gray-100 rounded-md p-2">{business.taxId}</div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Email:
              </label>
              <div className="bg-gray-100 rounded-md p-2">{business.email}</div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Phone Number:
              </label>
              <div className="bg-gray-100 rounded-md p-2">
                {business.phoneNumber}
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                LGA:
              </label>
              <div className="bg-gray-100 rounded-md p-2">{business.lga}</div>
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
              <div className="bg-gray-100 rounded-md p-2">
                {business.taxArea}
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Business Name:
              </label>
              <div className="bg-gray-100 rounded-md p-2">
                {business.businessName}
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                CONDITION:
              </label>
              <div className="bg-gray-100 rounded-md p-2">
                {business.businesstatus}
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Withholding Tax:
              </label>
              <div className="bg-gray-100 rounded-md p-2">
                {business.withholdingTaxRate}
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Type:
              </label>
              <div className="bg-gray-100 rounded-md p-2">{business.type}</div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Annual Income:
              </label>
              <div className="bg-gray-100 rounded-md p-2">
                {business.annualIncome}
              </div>
            </div>
            <div className="col-span-2 flex items-center justify-between mt-4">
              <label className="block text-sm font-medium text-gray-700">
                To be Paid:
              </label>
              <input
                type="number"
                name="to_be_paid"
                className="appearance-none rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 bg-white"
                placeholder="Enter Amount"
                value={toBePaid}
                onChange={handleDataUpdate}
              />
            </div>
            <div className="col-span-2 flex items-center justify-between mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Tax Due Time:
              </label>
              <select
                name="tax_due_time"
                className="appearance-none rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 bg-white"
                value={taxDueTime}
                onChange={handleDataUpdate}
              >
                <option value="annually">Annually</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>
            <div className="flex gap-3">
              <AppButton type="submit" onClick={updateBusiness} label="Save" />
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
