import React from "react";
import Head from "next/head";
import Hero from "@components/immigration/hero";
import Migrate from "@components/immigration/migrate";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Process from "@components/immigration/process";
import Evaluated from "@components/immigration/evaluated";
import GlobalMigration from "@components/immigration/global-migration-section";
import FinalCTASection from "@components/immigration/final-cta-section";
import ServicesCarousel from "@components/home/ServicesCarousel";
import Banner from "../../components/home/banner";

const immigration = () => {
  return (
    <div>
      <Head>
        <title>
          {" "}
          Immigration Consultancy Services | Work & Study Visa Support –
          JobsAdmire
        </title>
        <meta
          name="description"
          content="Apply for international visas with confidence. JobsAdmire offers expert immigration services for professionals and students seeking global opportunities."
        />
        <meta
          name="keywords"
          content="Immigration Consultancy Services, Work & Study Visa Support – JobsAdmire"
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Your Open Graph Title" />
        <meta property="og:description" content="Your Open Graph description" />
        <meta property="og:type" content="website" />
      </Head>
      <Hero />
      <Migrate />
      <Process />
      <Evaluated />
      <GlobalMigration />
      <FinalCTASection />
      <ServicesCarousel />
      <Banner
        title="Your Immigration Success Partner"
        description="Get professional guidance for your immigration journey. Our experienced consultants provide comprehensive support for visa applications, documentation, and legal requirements for successful relocation."
        buttonText="Book Consultation"
        buttonLink="/contact-us"
        serviceLabel="IMMIGRATION PROS"
      />
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
export default immigration;
