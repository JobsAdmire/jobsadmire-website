import React from "react";
import Head from "next/head";
import Hero from "@components/inteviewcoching/hero";
import Time from "@components/inteviewcoching/timeline";
import Info from "@components/inteviewcoching/info";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ServicesCarousel from "@components/home/ServicesCarousel";
import Banner from "../../components/home/banner";
const interviewcoachingservice = () => {
  return (
    <div>
      <Head>
        <title>
          {" "}
          Interview Coaching Services | Online Job Interview Training –
          JobsAdmire
        </title>
        <meta
          name="description"
          content="Be fully prepared for your next job interview. JobsAdmire offers professional coaching, mock interviews, and expert feedback to boost your confidence and success."
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
        <Time />
        <Info />
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
    getServiceBySlug("interview-coaching", locale),
    getPageAndLayoutContent("services/interview-preparation", locale),
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
export default interviewcoachingservice;
