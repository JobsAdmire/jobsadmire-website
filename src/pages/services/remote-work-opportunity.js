import React from "react";
import Head from "next/head";
import Hero from "@components/rwo/Hero";
import Second from "@components/rwo/second";
import Thirds from "@components/rwo/thirds";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ServicesCarousel from "@components/home/ServicesCarousel";
import Banner from "../../components/home/banner";
const remoteworkopportunity = () => {
  return (
    <div>
      <Head>
        <title>
          {" "}
          Remote Work Opportunities | Global Work-from-Home Jobs – JobsAdmire
        </title>
        <meta
          name="description"
          content="Looking for remote work? JobsAdmire connects you with international remote job opportunities tailored to your skills and career goals."
        />
        <meta
          name="keywords"
          content="Interview Coaching Services, Online Job Interview Training – JobsAdmire"
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Your Open Graph Title" />
        <meta property="og:description" content="Your Open Graph description" />
        <meta property="og:type" content="website" />
      </Head>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Hero />
        <Second />
        <Thirds />
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
    getServiceBySlug("remote-work", locale),
    getPageAndLayoutContent("services/remote-jobs", locale),
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
export default remoteworkopportunity;
