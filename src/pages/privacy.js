import React from "react";
import Privacy from "../components/legal/privacy";
const privacy = () => {
  return (
    <div>
      <Privacy />
    </div>
  );
};

export const getStaticProps = async ({ locale }) => {
  const {
    serverSideTranslations,
  } = require("next-i18next/serverSideTranslations");
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "privacy"])),
    },
  };
};

export default privacy;
