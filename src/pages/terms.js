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
  const { getLayoutCmsProps } = require("@/lib/api/cmsHelper");
  const { getPage } = require("@/lib/api/cms");
  const { getPageAndLayoutContent } = require("@/lib/api/cmsContent");

  const [layoutProps, cmsPage, cmsPageContent] = await Promise.all([
    getLayoutCmsProps(locale),
    getPage("terms", locale),
    getPageAndLayoutContent("terms", locale),
  ]);

  return {
    props: {
      ...(await serverSideTranslations(locale, ["about", "common", "terms"])),
      ...layoutProps,
      cmsPage: cmsPage || null,
      cmsPageContent,
    },
    revalidate: 60,
  };
};
export default terms;
