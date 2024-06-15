/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { AppSelect } from "./app/select";
import { AppButton } from "./app/button";
import api from "@/api";
import { toast } from "sonner";
import { AppTable } from "./app/table";

const PolicySettingsBusiness = () => {
  const [getPreviousClassifications, setPreviousClassifications] = useState([]);
  const [getPreviousWitholdingTax, setPreviousWitholdingTax] = useState([]);
  const [getPolicySetting, setPolicySetting] = useState("");
  const [classification, setClassification] = useState("");
  const [description, setDescription] = useState("");
  const [payments, setPayments] = useState("");
  const [rate, setRate] = useState("");

  const businessPolicySettings = [
    {
      id: 1,
      label: "Classification",
      value: "classification",
    },
    {
      id: 2,
      label: "Witholding Tax",
      value: "witholding_tax",
    },
  ];

  const classifColumns: any[] = [
    {
      title: "#",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Classifications",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Status",
      key: "state",
      render: (val: any) => (
        <div className="flex items-center gap-3 text-primary text-sm">
          <button>Edit</button>
          <button>Del</button>
        </div>
      ),
    },
  ];
  const witholdingTaxColumns: any[] = [
    {
      title: "#",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Payments",
      dataIndex: "payment",
      key: "payment",
    },
    {
      title: "Tax Rate",
      dataIndex: "rate",
      key: "rate",
    },
    {
      title: "Status",
      key: "state",
      render: (val: any) => (
        <div className="flex items-center gap-3 text-primary text-sm">
          <button>Edit</button>
          <button>Del</button>
        </div>
      ),
    },
  ];

  const fetchClassifications = async () => {
    try {
      const response = await api.get(
        "/api/v1/policy_configuration/business-classifications/"
      );

      setPreviousClassifications(
        response.data.map((item: any, index: any) => ({
          ...item,
          key: index + 1,
        }))
      );
    } catch (err: any) {
      console.error(err);
    }
  };

  const fetchWitholdinTax = async () => {
    try {
      const response = await api.get(
        "/api/v1/policy_configuration/withholding-tax-rates/"
      );
      setPreviousWitholdingTax(
        response.data.map((item: any, index: any) => ({
          ...item,
          key: index + 1,
        }))
      );
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchClassifications();
    fetchWitholdinTax();
  }, []);

  const handleAddWitholdingTax = () => {
    api
      .post("/api/v1/policy_configuration/withholding-tax-rates/", {
        payment: payments,
        rate: rate,
      })
      .then((res) => {
        if (res.status === 201) {
          toast.success("Business Classification added Sucessfully");
          fetchWitholdinTax();
        } else {
          toast.error("Business Classification Not added successfully");
        }
      })
      .catch((err: any) => {
        console.error(err);
        toast.error(err.message);
      });
  };

  const handleAddBusinessClassification = () => {
    api
      .post("/api/v1/policy_configuration/business-classifications/", {
        name: classification,
        description,
      })
      .then((res) => {
        if (res.status === 201) {
          toast.success("Business Classification added Sucessfully");
          fetchClassifications();
        } else {
          toast.error("Business Classification Not added successfully");
        }
      })
      .catch((err: any) => {
        toast.error(err.message);
      });
  };

  const reset = () => {
    setPolicySetting("");
    setClassification("");
    setDescription("");
    setPayments("");
    setRate("");
  };

  return (
    <>
      <div className="flex flex-col items-start gap-3 bg-white border mb-4 border-gray-200 shadow-sm rounded-xl p-4 md:p-5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400">
        <p>Business Conditions</p>
        <div className="flex flex-col place-content-center w-full">
          <form>
            <div className="mb-3">
              <AppSelect
                width="w-full"
                options={businessPolicySettings}
                placeholder="Select  Setting"
                label="Select Business Policy Setting"
                onChangeValue={(e: any) => setPolicySetting(e.target.value)}
                selectValue={getPolicySetting}
              />
            </div>

            {getPolicySetting === "classification" ? (
              <>
                <div className="w-full px-3 mb-6 md:mb-0">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="classification"
                  >
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                      id="classification"
                      type="text"
                      placeholder="New Classification"
                      value={classification}
                      onChange={(e) => setClassification(e.target.value)}
                    />
                  </label>
                </div>

                <div className="w-full px-3">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="description"
                  >
                    <textarea
                      className="appearance-none block w-full h-20 bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="description"
                      placeholder="Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </label>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={reset}
                    type="reset"
                    className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded-sm transition duration-200 ease-in-out w-full "
                  >
                    Cancel
                  </button>
                  <AppButton
                    onClick={() => handleAddBusinessClassification()}
                    type="button"
                    label="Save"
                  />
                </div>
              </>
            ) : getPolicySetting === "witholding_tax" ? (
              <>
                <div className="w-full px-3 mb-6 md:mb-0">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="payments"
                  >
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                      type="text"
                      placeholder="Payment Tax"
                      value={payments}
                      onChange={(e) => setPayments(e.target.value)}
                    />
                  </label>
                </div>

                <div className="w-full px-3">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="rate"
                  >
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                      type="text"
                      placeholder="Rate"
                      value={rate}
                      // onChange={(e) => setRate(e.target.value)}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Regular expression to match numbers and decimal points
                        const regex = /^[0-9]*\.?[0-9]*$/;
                        if (regex.test(value) || value === "") {
                          setRate(value);
                        }
                      }}
                    />
                  </label>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={reset}
                    type="reset"
                    className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded-sm transition duration-200 ease-in-out w-full "
                  >
                    Cancel
                  </button>
                  <AppButton
                    onClick={() => handleAddWitholdingTax()}
                    type="button"
                    label="Save"
                  />
                </div>
              </>
            ) : null}
          </form>
        </div>
      </div>
      <div className="flex flex-col items-start gap-3 bg-white border mt-4 border-gray-200 shadow-sm rounded-xl p-4 md:p-5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400">
        <div className="flex flex-col place-content-center w-full">
          {getPolicySetting === "classification" ? (
            <>
              <h3>Classifications</h3>
              <AppTable
                columns={classifColumns}
                dataSource={getPreviousClassifications}
                pagination={false}
              />
            </>
          ) : getPolicySetting === "witholding_tax" ? (
            <>
              <h3>Witholding Tax</h3>
              <AppTable
                columns={witholdingTaxColumns}
                dataSource={getPreviousWitholdingTax}
                pagination={false}
              />
            </>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default PolicySettingsBusiness;
