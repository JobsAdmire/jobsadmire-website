import React from "react";
import Head from "next/head";
import Hero from "../../components/skd/hero";
import Second from "../../components/skd/second";
import ServicesCarousel from "@components/home/ServicesCarousel";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Banner from "../../components/home/banner";
const skilldevelopmenttraining = () => {
  return (
    <div>
      <Head>
        <title>
          {" "}
          Skill Development Training | Job-Ready Courses for Professionals –
          JobsAdmire
        </title>
        <meta
          name="description"
          content="Enhance your career with JobsAdmire's professional skill development training. Learn job-ready skills through expert-led courses and hands-on workshops."
        />
        <meta
          name="keywords"
          content="Skill Development Training, ob-Ready Courses for Professionals"
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Your Open Graph Title" />
        <meta property="og:description" content="Your Open Graph description" />
        <meta property="og:type" content="website" />
      </Head>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Hero />
        <Second />
        <ServicesCarousel />
        <Banner />
      </div>
    </div>
  );
};

export const getStaticProps = async ({ locale }) => {
  const { getLayoutCmsProps } = require("@/lib/api/cmsHelper");
  const { getServiceBySlug } = require("@/lib/api/cms");
  const { getPageAndLayoutContent } = require("@/lib/api/cmsContent");

  const [layoutProps, cmsService, cmsPageContent] = await Promise.all([
    getLayoutCmsProps(locale),
    getServiceBySlug("skill-development", locale),
    getPageAndLayoutContent("services/skill-development", locale),
  ]);

  return {
    props: {
      ...(await serverSideTranslations(locale, ["about", "common"])),
      ...layoutProps,
      cmsService: cmsService || null,
      cmsPageContent,
    },
    revalidate: 60,
  };
};
export default skilldevelopmenttraining;
