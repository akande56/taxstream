import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import jgLogo from "@/assets/jirs-logo.png";
import jgQR from "@/assets/jirs-qr.png";
import jgSeal from "@/assets/jirs-seal.png";
import CertificateDocument from "./CertificateDocument";

const CertView: React.FC = () => {
  const props = {
    name: "Usman Kamilu",
    taxId: "JG2506240030",
    dateIssue: "June 30, 2024",
    businessAddress: "Ringim Central Market, Ringim LGA",
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 m-2 h-screen bg-gray-100">
      <div className="mx-2 my-4">
        <PDFDownloadLink
          document={<CertificateDocument {...props} />}
          fileName={`${props.taxId}-${props.dateIssue}-certificate.pdf`}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {({ loading }) =>
            loading ? (
              <span className="text-white">Loading document...</span>
            ) : (
              <span className="text-white">Download Certificate</span>
            )
          }
        </PDFDownloadLink>
      </div>
      <div
        id="certificate"
        className="relative bg-white p-10 shadow-lg rounded-lg max-w-2xl w-full border border-gray-300"
      >
        <div className="flex flex-col items-center">
          <img src={jgLogo} alt="Logo" className="h-20 mb-4" />
          <h1 className="text-xl font-bold uppercase text-center">
            Jigawa State Internal Revenue
          </h1>
          <h2 className="text-2xl font-semibold text-red-600 mt-2">
            Certificate of Tax Payment
          </h2>
          <p className="text-center mt-4">
            This certificate is issued by the Jigawa State Internal Revenue
            Service to
          </p>
        </div>
        <div className="mt-6">
          <p className="flex justify-between text-lg">
            <span>Issued to:</span>
            <span className="font-bold">{props.name}</span>
          </p>
          <p className="flex justify-between text-lg mt-2">
            <span>TAX ID:</span>
            <span className="font-bold">{props.taxId}</span>
          </p>
          <p className="flex justify-between text-lg mt-2">
            <span>Date Issue:</span>
            <span className="font-bold">{props.dateIssue}</span>
          </p>
          <p className="flex justify-between text-lg mt-2">
            <span>Business Address:</span>
            <span className="font-bold">{props.businessAddress}</span>
          </p>
        </div>
        <div className="flex justify-between items-center mt-10">
          <img src={jgQR} alt="QR Code" className="h-20 w-20" />
          <div className="text-center">
            <p className="mb-2">[Sign]</p>
            <p>Chairman's Sign</p>
          </div>
          <img src={jgSeal} alt="Seal" className="h-20 w-20" />
        </div>
      </div>
    </div>
  );
};

export default CertView;
