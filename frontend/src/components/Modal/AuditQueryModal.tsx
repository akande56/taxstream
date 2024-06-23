import { useState } from "react";
import { AppModal } from "../app/modal";
import api from "@/api";
import { toast } from "sonner";
interface AuditQueryModalProps {
  open: boolean;
  onClose: () => void;
  businessId?: string;
}

const AuditQueryModal: React.FC<AuditQueryModalProps> = ({
  open,
  onClose,
  businessId,
}) => {
  const [query, setQuery] = useState("");

  const updateBusiness = async () => {
    const response = await api.put(
      `/api/v1/assessments/audit_officer/query_update/${businessId}/`,
      {
        query,
      }
    );
    const { data } = response;
    console.log(data, "Data");
    toast.success("Query Added Successfully");
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Submitted query:", query);

    updateBusiness();
  };

  return (
    <AppModal
      open={open}
      onCancel={onClose}
      okButtonProps={{ hidden: true }}
      cancelButtonProps={{ hidden: true }}
    >
      <div className="flex justify-center items-center h-fit">
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <textarea
                className="w-full h-40 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Make a Query for improved assessment"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="flex justify-between">
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Submit
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppModal>
  );
};

export default AuditQueryModal;
