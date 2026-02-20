import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
// import Story from '../components/about-us/our-story'
import Heross from "@components/about-us/heross";
import Values from "@components/about-us/values";
import Stats from "@/components/home/stats";
import Wedo from "@components/about-us/wedo";

const About = () => {
  return (
    <div>
      <Heross />
      <Values />
      <Wedo />
      <Stats />
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

export default About;
