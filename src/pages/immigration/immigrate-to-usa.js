import React from "react";
import Hero from "@components/i-us/hero";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import First from "@components/i-us/first";
const immigrateus = () => {
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
export default immigrateus;
