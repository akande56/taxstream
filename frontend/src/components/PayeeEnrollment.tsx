/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "lucide-react";
import { AppButton } from "./app/button";
import { AppInput } from "./app/input";
import { AppSelect, IOption } from "./app/select";
import { AppTable } from "./app/table";
import PayeeEnrollmentModal from "./Modal/PayeeEnrolmentModal";
import api from "@/api";
import PayeeInfoModal from "./Modal/PayeeInfoModal";

const PayeeEnrollment = () => {
  const [payees, setPayees] = useState<any[]>([]);
  const [showAddPayeeModal, setShowAddPayeeModal] = useState(false);
  const [showUpdatePayeeModal, setShowUpdatePayeeModal] = useState(false);
  const [showPayeeInfoModal, setShowPayeeInfoModal] = useState(false);
  const [selectedPayee, setSelectedPayee] = useState<any>({});
  const [getFilterValue, setFilterValue] = useState<any>("");
  const [getSearch, setSearch] = useState<any>("");

  const handleAddPayee = () => {};

  const handleFilterChange = (value: any) => {};

  const handleSearchChange = (e: any) => {};
  const handleView = (payee: any) => {
    setSelectedPayee(payee);
    setShowPayeeInfoModal(true);
  };

  const handleEdit = (staff: any) => {
    // console.log(staff);
    // setSelectedStaff(staff);
    // setShowUpdateStaffModal(!showUpdateStaffModal);
  };

  useEffect(() => {
    const getBusinesses = async () => {
      try {
        const response = await api.get("/api/v1/user/tax-payer/");
        const { data } = response;
        console.log(data, "Data");
        const taxArea = await api.get(
          "/api/v1/policy_configuration/tax-areas/"
        );
        const taxAreaData = taxArea.data;

        // const payeeData = data.map((item: any, index: any) => {
        //   const matchedTaxArea = taxAreaData.find(
        //     (taxArea: any) => taxArea.id === item.tax_area
        //   );
        //   const taxAreaOffice = matchedTaxArea
        //     ? matchedTaxArea.tax_area_office
        //     : "N/A";

        //   return {
        //     key: String(index + 1),
        //     fullname: `${item.user.first_name} ${item.user.last_name}`,
        //     taxId: item.user.username,
        //     classification:
        //       item.classification === 0 ? "Company" : "Individual",
        //     taxArea: taxAreaOffice,
        //     email: item.user.email,
        //     type: item.type,
        //     state: item.business_status,
        //   };
        // });
        const x = {
          id: 4,
          user: {
            username: "nfd@sd.hh",
            email: "nfd@sd.hh",
            first_name: "test",
            last_name: "test",
            phone: "77777",
            location: {
              id: 1,
              name: "Keffi",
              code: "Keffi-234",
              state: 2,
            },
            is_staff: false,
            is_active: true,
          },
          business_name: "biz test",
          classification: {
            id: 2,
            name: "Business Tech",
            description: "Business Tech companies",
          },
          withholding_tax_rate: {
            id: 1,
            payment: "Service Tax",
            rate: "5.00",
          },
          business_status: {
            id: 4,
            status: "0",
          },
        };
        const payeeData = data.map((item: any, index: any) => {
          return {
            key: String(index + 1),
            fullname: `${item.user.first_name} ${item.user.last_name}`,
            businessName: item.business_name,
            email: item.user.email,
            classification: item.classification.name,
            businessStatus: item.business_status.status ? "Active" : "Inactive",
            withholdingTaxRate: item.withholding_tax_rate.rate,
            userId: item.user.email,
          };
        });
        setPayees(payeeData);
      } catch (error) {
        console.error(error);
      }
    };
    getBusinesses();
    console.log("Payees", payees);
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
      <PayeeInfoModal
        open={showPayeeInfoModal}
        onClose={() => setShowPayeeInfoModal(false)}
        payee={selectedPayee}
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