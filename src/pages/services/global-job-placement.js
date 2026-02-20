import React from "react";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Hero from "../../components/globaljob/hero";
import Second from "../../components/globaljob/second";
import Thirds from "../../components/globaljob/thirds";
import ServicesCarousel from "@components/home/ServicesCarousel";
import Banner from "../../components/home/banner";
const globaljobplacement = () => {
  return (
    <div>
      <Head>
        <title>
          {" "}
          Global Job Placement Services | Work Abroad with Expert Support –
          JobsAdmire
        </title>
        <meta
          name="description"
          content="Explore global job placement opportunities with JobsAdmire. Get expert support for overseas job applications, visa guidance, and international career success."
        />
        <meta
          name="keywords"
          content="Global Job Placement Services, Work Abroad with Expert Support – JobsAdmire"
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
        <Banner
          title="Unlock Global Career Opportunities"
          description="Access exclusive job opportunities across the globe. Our extensive network of international employers helps you find the perfect position that matches your skills and career aspirations worldwide."
          buttonText="Find Jobs"
          buttonLink="/job"
          serviceLabel="GLOBAL PLACEMENT"
        />
      </div>
    </div>
  );
};

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["about", "common"])),
    },
  };
};
export default globaljobplacement;
