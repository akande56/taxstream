/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import DataCard from "./app/data-card";
import { AppInput } from "./app/input";
import { AppSelect } from "./app/select";
import { AppTable } from "./app/table";
import PieChart from "./app/piechart";
import { dashboardCard, taxPaymentActivity } from "../fakedb/dashboard";

const DashboardContent: React.FC = () => {
  //   const [getTaxPaymentActivity, setTaxPaymentActivity] = useState([]);

  const taxPaymentActivityColumns = [
    {
      title: "#",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Tax Id",
      dataIndex: "taxId",
      key: "taxId",
    },
    {
      title: "Phone No",
      dataIndex: "phoneNo",
      key: "phoneNo",
    },
    {
      title: "Area Code",
      dataIndex: "areaCode",
      key: "areaCode",
    },
    {
      title: "Holding",
      dataIndex: "holding",
      key: "holding",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
  ];

  const sampleData = [
    { value: 1048, name: "Company Haullage" },
    { value: 735, name: "Companys Consumption" },
    { value: 580, name: "Smes Consumptions" },
    { value: 300, name: "Other" },
  ];

  const colors = ["#5470C6", "#91CC75", "#FAC858", "#73C0DE"];

  useEffect(() => {
    // setTaxPaymentActivity(taxPaymentActivity);
  }, []);

  return (
    <>
      <div className="flex p-4 text-start">
        <h3 className="text-2xl font-bold">JIgawa Internal Revenue Service</h3>
      </div>

      <div className="flex items-center gap-4 justify-center p-4 flex-wrap md:flex-nowrap min-h-screen bg-gray-100">
        <div className="flex flex-col place-content-center">
          <div className="grid grid-cols-2 gap-2 grid-flow-row">
            {dashboardCard &&
              dashboardCard.map((data, idx) => (
                <DataCard
                  key={idx}
                  title={data.title}
                  percentage={data.percentage}
                  color={data.color}
                  patternColor={data.patternColor}
                />
              ))}
          </div>
          <div className="flex place-content-center">
            <div className="p-4 shadow-md rounded-md m-4 ">
              <PieChart
                title="  Overall Payment Income Review"
                data={sampleData}
                colors={colors}
              />
            </div>
          </div>
          <div className="flex place-content-center"></div>
        </div>
        <div className="flex flex-col place-content-center">
          <div className="">
            <div className="flex flex-col gap-4 overflow-auto">
              <div className="flex flex-row place-content-center mb-4 gap-4">
                <p className=" text-nowrap font-bold">Tax Payment Activity</p>
                <AppSelect
                  placeholder="By LGA"
                  options={[
                    { label: "Option 1", value: "1" },
                    { label: "Option 2", value: "2" },
                    { label: "Option 3", value: "3" },
                  ]}
                />
                <AppSelect
                  placeholder="By Type"
                  options={[
                    { label: "Option 1", value: "1" },
                    { label: "Option 2", value: "2" },
                    { label: "Option 3", value: "3" },
                  ]}
                />
                <AppSelect
                  placeholder="By Holding"
                  options={[
                    { label: "Option 1", value: "1" },
                    { label: "Option 2", value: "2" },
                    { label: "Option 3", value: "3" },
                  ]}
                />
              </div>

              <AppTable
                columns={taxPaymentActivityColumns}
                dataSource={taxPaymentActivity}
                pagination={false}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardContent;
