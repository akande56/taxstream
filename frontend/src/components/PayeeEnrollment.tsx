/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "lucide-react";
import { AppButton } from "./app/button";
import { AppInput } from "./app/input";
import { AppSelect, IOption } from "./app/select";
import { AppTable } from "./app/table";
import PayeeEnrollmentModal from "./PayeeEnrolmentModal";
import api from "@/api";

const PayeeEnrollment = () => {
  const [payees, setPayees] = useState<any[]>([]);
  const [showAddPayeeModal, setShowAddPayeeModal] = useState(false);
  const [showUpdatePayeeModal, setShowUpdatePayeeModal] = useState(false);
  const [selectedPayee, setSelectedPayee] = useState<any>({});
  const [getFilterValue, setFilterValue] = useState<any>("");
  const [getSearch, setSearch] = useState<any>("");

  const handleAddPayee = () => {};

  const handleFilterChange = (value: any) => {};

  const handleSearchChange = (e: any) => {};
  const handleView = (staff: any) => {
    // console.log(staff);
    // setSelectedStaff(staff);
    // setShowStaffInfoModal(!showStaffInfoModal);
  };

  const handleEdit = (staff: any) => {
    // console.log(staff);
    // setSelectedStaff(staff);
    // setShowUpdateStaffModal(!showUpdateStaffModal);
  };

  useEffect(() => {
    const payeeData = [
      {
        key: "1",
        fullname: "John Doe",
        taxId: "123-45-6789",
        classification: "Individual",
        taxArea: "Area 1",
        email: "johndoe@example.com",
        type: "Type 1",
        state: 1,
      },
      {
        key: "2",
        fullname: "Jane Doe",
        taxId: "987-65-4321",
        classification: "Company",
        taxArea: "Area 2",
        email: "janedoe@example.com",
        type: "Type 2",
        state: 0,
      },
      {
        key: "3",
        fullname: "Bob Smith",
        taxId: "456-78-9123",
        classification: "Individual",
        taxArea: "Area 3",
        email: "bobsmith@example.com",
        type: "Type 3",
        state: 1,
      },
      {
        key: "4",
        fullname: "Alice Johnson",
        taxId: "321-98-7654",
        classification: "Company",
        taxArea: "Area 4",
        email: "alicejohnson@example.com",
        type: "Type 4",
        state: 0,
      },
      {
        key: "5",
        fullname: "Charlie Brown",
        taxId: "654-32-1987",
        classification: "Individual",
        taxArea: "Area 5",
        email: "charliebrown@example.com",
        type: "Type 5",
        state: 1,
      },
    ];
    const getBusinesses = async () => {
      try {
        const response = await api.get("/api/v1/user/tax-payer/");
        const { data } = response.data;
        const taxArea = await api.get(
          "/api/v1/policy_configuration/tax-areas/"
        );
        const taxAreaData = taxArea.data;

        const payeeData = data.map((item: any, index: any) => {
          const matchedTaxArea = taxAreaData.find(
            (taxArea: any) => taxArea.id === item.tax_area
          );
          const taxAreaOffice = matchedTaxArea
            ? matchedTaxArea.tax_area_office
            : "N/A";

          return {
            key: String(index + 1),
            fullname: `${item.user.first_name} ${item.user.last_name}`,
            taxId: item.user.username,
            classification:
              item.classification === 0 ? "Company" : "Individual",
            taxArea: taxAreaOffice,
            email: item.user.email,
            type: item.type,
            state: item.business_status,
          };
        });

        setPayees(payeeData);
      } catch (error) {
        console.error(error);
      }
    };
    getBusinesses();
  }, []);
  const columns = [
    {
      title: "#",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Holder Full Name",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Tax ID",
      dataIndex: "taxId",
      key: "taxId",
    },
    {
      title: "Classification",
      dataIndex: "classification",
      key: "classification",
    },
    {
      title: "Tax Area",
      dataIndex: "taxArea",
      key: "taxArea",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Status",
      key: "state",
      render: (val: any, record: any) => (
        <div className="flex items-center gap-3 text-primary text-sm">
          <button className={`${val.state === 0 ? "text-red-500" : ""}`}>
            {val.state === 0 ? "Inactive" : "Active"}
          </button>
          <button
            className=" border rounded-sm py-2 px-4"
            onClick={() => handleEdit(record)}
          >
            Edit
          </button>
          <button
            className=" border rounded-sm py-2 px-4"
            onClick={() => handleView(record)}
          >
            View
          </button>
        </div>
      ),
    },
  ];
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-primary">
          Payee Enrollment
        </h1>
      </div>
      <PayeeEnrollmentModal
        open={showAddPayeeModal}
        onClose={() => setShowAddPayeeModal(false)}
        onUpdate={handleAddPayee}
      />
      <div>
        <div className="flex flex-row px-5 py-3 border-b justify-center gap-1">
          <AppButton
            width="2/4"
            label="Enrol Business"
            icon={<PlusIcon />}
            onClick={() => setShowAddPayeeModal(!showAddPayeeModal)}
          />
          <AppSelect
            placeholder="Filter By"
            selectValue={getFilterValue}
            onChangeValue={handleFilterChange}
            options={[
              { label: "Test 1", value: "test-1" },
              { label: "Test 2", value: "test-2" },
            ]}
          />
          <AppInput
            placeholder="Search"
            inputValue={getSearch}
            onChangeValue={handleSearchChange}
          />
        </div>
        <AppTable columns={columns} dataSource={payees} pagination={false} />
      </div>
    </div>
  );
};

export default PayeeEnrollment;
