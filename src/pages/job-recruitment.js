import React from "react";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import Hero from "@components/jobrecruitment/hero";
import Carousel from "@components/jobrecruitment/carousel";
import Third from "@components/jobrecruitment/third";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Headline from "@components/jobrecruitment/headline";
import Fourth from "@components/jobrecruitment/fourth";
import ServicesCarousel from "@components/home/ServicesCarousel";
import Banner from "@components/home/banner";
const jobrecruitment = () => {
  const { t } = useTranslation("common");
  return (
    <div>
      <Head>
        <title>
          {" "}
          {t("labels.jobRecruitment.metaTitle")}
        </title>
        <meta
          name="description"
          content={t("labels.jobRecruitment.metaDescription")}
        />
        <meta
          name="keywords"
          content={t("labels.jobRecruitment.metaKeywords")}
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={t("labels.jobRecruitment.ogTitle")} />
        <meta property="og:description" content={t("labels.jobRecruitment.ogDescription")} />
        <meta property="og:type" content="website" />
      </Head>
      <>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Hero />
          <Carousel />
          <Third />
        </div>

        <Headline />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Fourth />
          <ServicesCarousel />
          <Banner
            title={t("labels.jobRecruitment.bannerTitle")}
            description={t("labels.jobRecruitment.bannerDescription")}
            buttonText={t("labels.jobRecruitment.bannerButtonText")}
            buttonLink="/contact-us"
            serviceLabel={t("labels.jobRecruitment.bannerServiceLabel")}
          />
        </div>
      </>
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
export default jobrecruitment;
