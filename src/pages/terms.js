import React from "react";
import Terms from "../components/legal/terms";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
const terms = () => {
  return (
    <div>
      <Terms />
    </div>
  );
};

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["about", "common", "terms"])),
    },
  };
};
export default terms;
