import React from "react";
import Hero from "@components/i-australia/hero";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import First from "@components/i-australia/first";
const immigrateaustralia = () => {
  return (
    <div>
      <Hero />
      <First />
    </div>
  );
};

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["about", "common"])),
    },
  };
};
export default immigrateaustralia;
