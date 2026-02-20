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
        <Banner
          title="Master Your Next Interview"
          description="Build confidence and ace your interviews with personalized coaching sessions. Our experienced coaches help you practice answers and excel in any interview scenario to land your dream job."
          buttonText="Book Coaching"
          buttonLink="/contact-us"
          serviceLabel="INTERVIEW MASTERY"
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
export default interviewcoachingservice;
