import React from "react";
import Head from "next/head";
import Hero from "@components/tap/Hero";
import Second from "@components/tap/second";
import Thirds from "@components/tap/thirds";
import ServicesCarousel from "@components/home/ServicesCarousel";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Banner from "../../components/home/banner";
const talentacquisitionprocess = () => {
  return (
    <div>
      <Head>
        <title>
          {" "}
          Talent Acquisition Services | Expert Hiring Solutions – JobsAdmire
        </title>
        <meta
          name="description"
          content="Hire the best talent with JobsAdmire. Our strategic talent acquisition services offer customized recruitment solutions for startups and enterprises."
        />
        <meta
          name="keywords"
          content="Talent Acquisition Services, Expert Hiring Solutions – JobsAdmire"
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
    getServiceBySlug("talent-acquisition", locale),
    getPageAndLayoutContent("services/talent-acquisition", locale),
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
export default talentacquisitionprocess;
