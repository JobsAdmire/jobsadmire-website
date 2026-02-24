import React from "react";
import Cert from "@components/certifications/certification";
import Gallery from "@components/certifications/gallery";
const certifications = () => {
  return (
    <div>
      <Gallery />
      <Cert />
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
    getPage("certifications", locale),
    getPageAndLayoutContent("certifications", locale),
  ]);

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      ...layoutProps,
      cmsPage: cmsPage || null,
      cmsPageContent,
    },
    revalidate: 60,
  };
};

export default certifications;
