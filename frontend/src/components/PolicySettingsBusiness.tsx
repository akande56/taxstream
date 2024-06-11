/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { AppSelect } from "./app/select";
import { AppButton } from "./app/button";

const PolicySettingsBusiness = () => {
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

  const reset = () => {
    setPolicySetting("");
    setClassification("");
    setDescription("");
    setPayments("");
    setRate("");
  };

  return (
    <>
      <div className="flex flex-col items-start gap-3 bg-white border border-gray-200 shadow-sm rounded-xl p-4 md:p-5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400">
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
                  <AppButton type="submit" label="Update" />
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
                      placeholder="Payments"
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
                      onChange={(e) => setRate(e.target.value)}
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
                  <AppButton type="submit" label="Update" />
                </div>
              </>
            ) : null}
          </form>
        </div>
      </div>
    </>
  );
};

export default PolicySettingsBusiness;
