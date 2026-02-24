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
  const { getLayoutCmsProps } = require("@/lib/api/cmsHelper");
  const { getPageAndLayoutContent } = require("@/lib/api/cmsContent");

  const [layoutProps, cmsPageContent] = await Promise.all([
    getLayoutCmsProps(locale),
    getPageAndLayoutContent("immigration/usa", locale),
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
export default immigrateus;
