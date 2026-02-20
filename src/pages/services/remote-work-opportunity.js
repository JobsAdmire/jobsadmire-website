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
        <Banner
          title="Discover Remote Career Freedom"
          description="Find flexible remote job opportunities from top companies worldwide. We connect talented professionals with remote positions that offer work-life balance and unlimited career growth."
          buttonText="Find Remote Jobs"
          buttonLink="/contact-us"
          serviceLabel="REMOTE CAREERS"
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
export default remoteworkopportunity;
