import React from "react";
import Head from "next/head";
import First from "@components/i-turkey/first";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Hero from "@components/i-turkey/hero";
const immigratetoturkey = () => {
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
export default immigratetoturkey;
