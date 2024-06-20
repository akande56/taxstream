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

const AuditReviewModal: React.FC<BusinessInfoModalProps> = ({
  open,
  onClose,
  business,
}) => {
  const [assesmentDetail, setAssesmentDetail] = useState(""); // Step 2

  const handleDataUpdate = (e: any) => {
    const { name, value } = e.target;
  if (name === "assesment_detail") {
      setAssesmentDetail(value);
    }
  };

  const updateBusiness = async () => {
    try {
      const response = await fetch(
        `/api/v1/assessments/audit_officer/query_update/${business.id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: assesmentDetail }),
        }
      );

      if (response.ok) {
        toast.success("Business updated successfully");
        onClose();
      } else {
        const errorData = await response.json();
        toast.error(`Error updating business: ${errorData.error}`);
      }
    } catch (error) {
      toast.error(`Error updating business: ${error}`);
    }
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
                Assesment Detail:
              </label>
              <input
                name="assesment_detail"
                className="appearance-none rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 bg-white"
                value={assesmentDetail}
                onChange={handleDataUpdate}
                type="text"
              />
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

export default AuditReviewModal;
