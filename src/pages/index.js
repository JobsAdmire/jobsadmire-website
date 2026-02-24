import React from "react";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useCmsContent } from "@/lib/context/CmsContentContext";

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
  const { c } = useCmsContent();
  const router = useRouter();
  const isRTL = router.locale === "ar" || router.locale === "fa";

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={isRTL ? "font-arabic" : ""}>
      <Head>
        <title>{c("meta.title", t("meta.title"))}</title>
        <meta name="description" content={c("meta.description", t("meta.description"))} />
        <meta name="keywords" content={c("meta.keywords", t("meta.keywords"))} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={c("meta.ogTitle", t("meta.ogTitle"))} />
        <meta property="og:description" content={c("meta.ogDescription", t("meta.ogDescription"))} />
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
        title={c("banner.title", t("banner.title"))}
        description={c("banner.description", t("banner.description"))}
        buttonText={c("banner.buttonText", t("banner.buttonText"))}
        buttonLink="/contact-us"
        serviceLabel={c("banner.serviceLabel", t("banner.serviceLabel"))}
      />
        <DisclaimerBanner />
    </div>
  );
};

export async function getStaticProps({ locale }) {
  const { getLayoutCmsProps, getHomeCmsProps } = require("@/lib/api/cmsHelper");
  const { getPageAndLayoutContent } = require("@/lib/api/cmsContent");

  const [layoutProps, homeProps, cmsPageContent] = await Promise.all([
    getLayoutCmsProps(locale),
    getHomeCmsProps(locale),
    getPageAndLayoutContent("home", locale),
  ]);

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "blogcarousel"])),
      ...layoutProps,
      ...homeProps,
      cmsPageContent,
    },
    revalidate: 60,
  };
}

export default ComponentName;
