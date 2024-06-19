/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { AppButton } from "./app/button";
import { AppInput } from "./app/input";
import { AppSelect } from "./app/select";
import { AppTable } from "./app/table";
import AssesmentReviewModal from "./Modal/AssesmentReviewModal";
import api from "@/api";

const Assesment = () => {
  const [business, setBusiness] = useState<any[]>([]);

  const [showBusinessInfoModal, setShowBusinessInfoModal] =
    useState<boolean>(false);
  const [showUpdateBusinessModal, setShowUpdateBusinessModal] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<any>({});
  const [getFilterValue, setFilterValue] = useState<any>("");
  const [getSearch, setSearch] = useState<any>("");

  const handleFilterChange = () => {};

  const handleSearchChange = () => {};
  const handleView = (value: any) => {
    setShowBusinessInfoModal(!showBusinessInfoModal);
    setSelectedBusiness(value);
  };

  const handleEdit = (value: any) => {
    // console.log(staff);
    // setSelectedStaff(staff);
    // setShowUpdateStaffModal(!showUpdateStaffModal);
  };

  useEffect(() => {
    const getBusinesses = async () => {
      try {
        const response = await api.get("/api/v1/assessments/");
        // const response = await api.get("api/v1/user/tax-payer/");
        const { data } = response;
        console.log(data, "Data");

        const businessData = data.map((item: any, index: any) => {
          return {
            key: String(index + 1),
            id: item.id,
            fullname: `${item.user.user.first_name} ${item.user.user.last_name}`,
            businessName: item.user.business_name,
            email: item.user.user.email,
            classification: item.user.classification.name,
            taxArea: `${item.user.tax_area?.tax_area_office}-${item.user.tax_area?.tax_area_code}`,
            businesstatus:
              item.user.business_status.status === 1 ? "Active" : "Inactive",
            withholdingTaxRate: item.user.withholding_tax_rate.rate,
            taxId: item.user.tax_id,
            type: item.user.type,
            annualIncome: item.user.anual_income,
            phoneNumber: item.user.user.phone,
            lga: item.user.user.location?.name,
          };
        });
        setBusiness(businessData);
      } catch (error) {
        console.error(error);
      }
    };
    getBusinesses();
    console.log("business", business);
  }, []);
  // Table Columns
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
            {val.state === "Active" ? "Active" : "Inactive"}
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
      <div className="flex justify-between p-4 items-center">
        <h1 className="text-2xl font-semibold text-primary">Assesment</h1>
      </div>
      <div>
        <AssesmentReviewModal
          open={showBusinessInfoModal}
          onClose={() => setShowBusinessInfoModal(false)}
          business={selectedBusiness}
        />
        <div className="flex flex-row px-5 py-3 border-b justify-start gap-1">
          <AppSelect
            placeholder="Filter By"
            width="w-fit"
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
        <div className="overflow-auto">
          <AppTable
            columns={columns}
            dataSource={business}
            pagination={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Assesment;
