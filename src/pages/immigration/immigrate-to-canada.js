import React from "react";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import First from "@components/i-canada/first";
import Hero from "@components/i-canada/hero";

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
