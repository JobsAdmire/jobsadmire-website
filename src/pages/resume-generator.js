// src/pages/resume-generator.jsx
import React from "react";
import ResumeBuilder from "../components/resume/ResumeBuilder";

const ResumeGeneratorPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <ResumeBuilder />
    </div>
  );
};

export const getStaticProps = async ({ locale }) => {
  const {
    serverSideTranslations,
  } = require("next-i18next/serverSideTranslations");
  const { getPageAndLayoutContent } = require("@/lib/api/cmsContent");

  const cmsPageContent = await getPageAndLayoutContent("services/resume-generator", locale);

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "resume-generator"])),
      cmsPageContent,
    },
    revalidate: 60,
  };
};

export default ResumeGeneratorPage;
