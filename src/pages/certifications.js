import React from "react";
import Cert from "@components/certifications/certification";
import Gallery from "@components/certifications/gallery";
const certifications = () => {
  return (
    <div>
      <Gallery />
      <Cert />
    </div>
  );
};

export const getStaticProps = async ({ locale }) => {
  const {
    serverSideTranslations,
  } = require("next-i18next/serverSideTranslations");
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};

export default certifications;
