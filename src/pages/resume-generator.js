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
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "resume-generator"])),
    },
  };
};

export default ResumeGeneratorPage;
