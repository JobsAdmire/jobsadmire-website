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
  const { getLayoutCmsProps } = require("@/lib/api/cmsHelper");
  const { getPage } = require("@/lib/api/cms");
  const { getPageAndLayoutContent } = require("@/lib/api/cmsContent");
  const {
    serverSideTranslations,
  } = require("next-i18next/serverSideTranslations");

  const [layoutProps, cmsPage, cmsPageContent] = await Promise.all([
    getLayoutCmsProps(locale),
    getPage("privacy", locale),
    getPageAndLayoutContent("privacy", locale),
  ]);

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "privacy"])),
      ...layoutProps,
      cmsPage: cmsPage || null,
      cmsPageContent,
    },
    revalidate: 60,
  };
};

export default privacy;
