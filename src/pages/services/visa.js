import React from "react";
import Head from "next/head";
import Hero from "@components/visa/hero";
import Page from "@components/visa/page";
import Last from "@components/visa/last";
import ServicesCarousel from "@components/home/ServicesCarousel";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Banner from "@components/home/banner";
const visa = () => {
  return (
    <div>
      <Head>
        <title>
          {" "}
          Visa Assistance Services | Work & Study Visa Support – JobsAdmire
        </title>
        <meta
          name="description"
          content="Get expert help with your work or study visa. JobsAdmire provides complete visa support, documentation assistance, and relocation guidance for international careers."
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
        <Page />
        <Last />
        <ServicesCarousel />
        <Banner
          title="Navigate Your Visa Journey"
          description="Navigate the complex visa application process with expert guidance. We provide complete assistance for work visas, documentation, and legal requirements to help you work abroad successfully."
          buttonText="Get Visa Help"
          buttonLink="/contact-us"
          serviceLabel="VISA SPECIALISTS"
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
export default visa;
