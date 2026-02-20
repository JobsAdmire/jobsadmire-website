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
        <Banner
          title="Build Your Dream Team"
          description="Find the right talent for your organization with our comprehensive recruitment solutions. We help companies identify, attract, and hire top professionals across all industries."
          buttonText="Hire Talent"
          buttonLink="/contact-us"
          serviceLabel="TALENT HUNTERS"
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
export default talentacquisitionprocess;
