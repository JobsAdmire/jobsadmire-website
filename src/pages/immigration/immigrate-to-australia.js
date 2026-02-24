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
  const { getLayoutCmsProps } = require("@/lib/api/cmsHelper");
  const { getPageAndLayoutContent } = require("@/lib/api/cmsContent");

  const [layoutProps, cmsPageContent] = await Promise.all([
    getLayoutCmsProps(locale),
    getPageAndLayoutContent("immigration/australia", locale),
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
export default immigrateaustralia;
