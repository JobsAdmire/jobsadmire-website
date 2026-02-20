import React from "react";
import Head from "next/head";
import Hero from "../../components/resumeservice/hero";
import CTA from "@components/resumeservice/cta";
import Service from "@components/resumeservice/service";
import Way from "@components/resumeservice/way";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Resumesect from "@components/resumeservice/resumesect";
import ServicesCarousel from "@components/home/ServicesCarousel";
import Banner from "../../components/home/banner";
// import Carousel from '@components/resumeservice/carousel'

const resumeservice = () => {
  return (
    <div>
      <Head>
        <title>
          {" "}
          Professional Resume Writing Services | Get Hired Faster – JobsAdmire
        </title>
        <meta
          name="description"
          content="Get a professionally written resume tailored for your dream job. JobsAdmire offers expert CV writing, formatting, and editing for local and international careers."
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

      {/* Main Container for all components */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Hero />
        <CTA />
        <Service />
        <Resumesect />
        <Way />
        <ServicesCarousel />
        <Banner
          title="Craft Your Perfect Resume"
          description="Get a professionally written resume that highlights your strengths and lands you interviews. Our expert writers have helped thousands secure their dream jobs with ATS-optimized resumes."
          buttonText="Order Resume"
          buttonLink="/services/resume-service"
          serviceLabel="RESUME EXPERTS"
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

export default resumeservice;
