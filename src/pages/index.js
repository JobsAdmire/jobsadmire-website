import React from "react";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import Hero from "@components/home/HeroSection";
import Category from "@components/home/PopularCategories";
import Jobs from "@components/home/LatestJobs";
import Stat from "@components/home/stats";
import Testinomials from "@components/home/Testimonials";
import Banner from "@components/home/banner";
import Blogsec from "@components/home/BlogSection";
import ImmigrationCarousel from "@components/home/ImmigrationCarousel";
import {Footer} from "@components/app";
import DisclaimerBanner from "@components/shared/DisclaimerBanner";
import { env } from "@/lib/constants/env";

const ComponentName = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const isRTL = router.locale === "ar" || router.locale === "fa";

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={isRTL ? "font-arabic" : ""}>
      <Head>
        <title>{t("meta.title")}</title>
        <meta name="description" content={t("meta.description")} />
        <meta name="keywords" content={t("meta.keywords")} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={t("meta.ogTitle")} />
        <meta property="og:description" content={t("meta.ogDescription")} />
        <meta property="og:type" content="website" />

        {/* Language alternate links for SEO - Now includes Turkish */}
        <link
          rel="alternate"
          hrefLang="en"
          href={`${env.SITE_URL}/en`}
        />
        <link
          rel="alternate"
          hrefLang="fr"
          href={`${env.SITE_URL}/fr`}
        />
        <link
          rel="alternate"
          hrefLang="es"
          href={`${env.SITE_URL}/es`}
        />
        <link
          rel="alternate"
          hrefLang="tr"
          href={`${env.SITE_URL}/tr`}
        />
        <link
          rel="alternate"
          hrefLang="ar"
          href={`${env.SITE_URL}/ar`}
        />
        <link
          rel="alternate"
          hrefLang="x-default"
          href={env.SITE_URL}
        />
      </Head>

      <Hero />
      <Category />
      {/* <ImmigrationCarousel/> */}
      <Jobs />
      {/* <ServicesCarousel/> */}
      <Stat />
      <Testinomials />
      <Blogsec />
      <Banner
        title={t("banner.title")}
        description={t("banner.description")}
        buttonText={t("banner.buttonText")}
        buttonLink="/contact-us"
        serviceLabel={t("banner.serviceLabel")}
      />
        <DisclaimerBanner />
    </div>
  );
};

// This function runs at build time and loads the translations
export async function getStaticProps({ locale }) {
  return {
    props: {
      // Pass the translations to the page component
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default ComponentName;
