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
  const { getLayoutCmsProps } = require("@/lib/api/cmsHelper");
  const { getPageAndLayoutContent } = require("@/lib/api/cmsContent");

  const [layoutProps, cmsPageContent] = await Promise.all([
    getLayoutCmsProps(locale),
    getPageAndLayoutContent("immigration/canada", locale),
  ]);

  return {
    props: {
      ...(await serverSideTranslations(locale, ["about", "common"])),
      ...layoutProps,
      cmsPageContent,
    },
    revalidate: 60,
  };
};
export default immigratetoturkey;
