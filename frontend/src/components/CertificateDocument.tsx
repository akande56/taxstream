/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  Image,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import jgLogo from "@/assets/jirs-logo.png";
import jgQR from "@/assets/jirs-qr.png";
import jgSeal from "@/assets/jirs-seal.png";

interface CertificateProps {
  name: string;
  taxId: string;
  dateIssue: string;
  businessAddress: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  section: {
    margin: 10,
    padding: 10,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    color: "red",
    marginTop: 10,
  },
  text: {
    margin: 12,
    textAlign: "center",
    fontSize: 14,
  },
  info: {
    margin: 10,
    fontSize: 14,
  },
  image: {
    marginVertical: 15,
    alignSelf: "center",
    width: 75,
    height: 75,
  },
  qrSealContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  qrSealImage: {
    width: 60,
    height: 60,
  },
  signature: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 14,
  },
});

const CertificateDocument: React.FC<CertificateProps> = ({
  name,
  taxId,
  dateIssue,
  businessAddress,
}) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.section}>
        <Image src={jgLogo} style={styles.image} />
        <Text style={styles.title}>Jigawa State Internal Revenue</Text>
        <Text style={styles.subtitle}>Certificate of Tax Payment</Text>
        <Text style={styles.text}>
          This certificate is issued by the Jigawa State Internal Revenue
          Service to
        </Text>
        <View style={styles.info}>
          <Text>
            Issued to: <Text style={{ fontWeight: "bold" }}>{name}</Text>
          </Text>
          <Text>
            TAX ID: <Text style={{ fontWeight: "bold" }}>{taxId}</Text>
          </Text>
          <Text>
            Date Issue: <Text style={{ fontWeight: "bold" }}>{dateIssue}</Text>
          </Text>
          <Text>
            Business Address:{" "}
            <Text style={{ fontWeight: "bold" }}>{businessAddress}</Text>
          </Text>
        </View>
        <View style={styles.qrSealContainer}>
          <Image src={jgQR} style={styles.qrSealImage} />
          <Text>[Sign]</Text>
          <Image src={jgSeal} style={styles.qrSealImage} />
        </View>
        <Text style={styles.signature}>Chairman's Sign</Text>
      </View>
    </Page>
  </Document>
);

export default CertificateDocument;
