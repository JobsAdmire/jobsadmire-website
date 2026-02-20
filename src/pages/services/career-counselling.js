import React from "react";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Hero from "@components/careercounce/hero";
import Sectiontwo from "@components/careercounce/sectiontwo";
import Sectionthree from "@components/careercounce/sectionthree";
import Section4 from "@components/careercounce/section4";
import ServicesCarousel from "@components/home/ServicesCarousel";
import Banner from "../../components/home/banner";

const CareerCounsellingPage = () => {
  return (
    <div>
      <Head>
        <title>
          Career Counselling Services | Personalized Career Guidance –
          JobsAdmire
        </title>
        <meta
          name="description"
          content="Discover expert career counselling services to choose the right path. JobsAdmire offers tailored career guidance for students, graduates, and professionals."
        />
        <meta
          name="keywords"
          content="Career Counselling Services, Personalized Career Guidance – JobsAdmire"
        />
        <meta name="robots" content="index, follow" />
        <meta
          property="og:title"
          content="Career Counselling Services | Personalized Career Guidance – JobsAdmire"
        />
        <meta
          property="og:description"
          content="Discover expert career counselling services to choose the right path."
        />
        <meta property="og:type" content="website" />
      </Head>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Hero />
        <Sectiontwo />
        <Sectionthree />
        <Section4 />
        <ServicesCarousel />
        <Banner
          title="Shape Your Career Path"
          description="Get personalized career guidance from industry experts. We help you identify your strengths, explore career paths, and create a strategic plan to achieve your professional goals."
          buttonText="Start Counselling"
          buttonLink="/contact-us"
          serviceLabel="CAREER GUIDANCE"
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

export default CareerCounsellingPage;
