import React from "react";
import { AppModal } from "../app/modal";

interface StaffInfoModalProps {
  open: boolean;
  onClose: () => void;
  staff: {
    fullname: string;
    staffId: string;
    role: string;
    lga: string;
    email: string;
    phoneNumber: string;
    state: number;
  };
}

const StaffInfoModal: React.FC<StaffInfoModalProps> = ({
  open,
  onClose,
  staff,
}) => {
  if (!staff) {
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
      <div className="mt-4">
        <p>
          <strong>Full Name:</strong> {staff.fullname}
        </p>
        <p>
          <strong>Staff ID:</strong> {staff.staffId}
        </p>
        <p>
          <strong>Role:</strong> {staff.role}
        </p>
        <p>
          <strong>LGA:</strong> {staff.lga}
        </p>
        <p>
          <strong>Email:</strong> {staff.email}
        </p>
        <p>
          <strong>Phone Number:</strong> {staff.phoneNumber}
        </p>
        <p>
          <strong>Status:</strong> {staff.state === 0 ? "Inactive" : "Active"}
        </p>
      </div>
    </AppModal>
  );
};

export default StaffInfoModal;
