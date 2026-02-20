import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import {
  CheckCircleIcon,
  ArrowLeftIcon,
  ShieldCheckIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const ThankYouPage = () => {
  const { t } = useTranslation(["thankyou", "common"]);
  const router = useRouter();
  const isRTL = router.locale === "ar" || router.locale === "fa";

  return (
    <div
      className={`min-h-screen bg-slate-50 ${isRTL ? "font-arabic" : ""}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Head>
        <title>{t("thankyou:title")}</title>
        {/* Event snippet for Submit lead form conversion page */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              gtag('event', 'conversion', {
                  'send_to': 'AW-17096273578/-ZnBCJypnNcbEKrdkdg_',
                  'value': 1.0,
                  'currency': 'TRY'
              });
            `,
          }}
        />
      </Head>

      <main className="pt-[186px] xs:pt-[166px] lg:pt-[172px] pb-[50px] px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-8">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircleIcon className="w-16 h-16 text-green-600" />
            </div>
          </div>

          {/* Headings */}
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            {t("thankyou:heading")}
          </h1>
          <p className="mb-12 text-xl text-slate-600">
            {t("thankyou:subheading")}
          </p>

          {/* Main Content Card */}
          <div className="overflow-hidden bg-white rounded-2xl">
            <div className="p-8 sm:p-10">
              <div className="space-y-6 text-left">
                <p
                  className="text-lg text-slate-700"
                  dangerouslySetInnerHTML={{ __html: t("thankyou:content.p1") }}
                />
                <p className="text-slate-600">{t("thankyou:content.p2")}</p>

                <ul className="space-y-4">
                  {t("thankyou:content.list", { returnObjects: true }).map(
                    (item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="mt-1 bg-blue-100 rounded-full p-0.5">
                          <CheckCircleIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-slate-700">{item}</span>
                      </li>
                    )
                  )}
                </ul>

                <div className="flex items-center gap-3 p-4 mt-8 border border-blue-100 rounded-lg bg-blue-50">
                  <ClockIcon className="flex-shrink-0 w-6 h-6 text-blue-600" />
                  <p className="text-sm font-medium text-blue-800">
                    {t("thankyou:content.responseTime")}
                  </p>
                </div>

                <p className="text-slate-600">{t("thankyou:content.p3")}</p>
              </div>

              {/* Trust Line */}
              <div className="flex items-center justify-center gap-2 pt-8 mt-8 border-t border-slate-100">
                <ShieldCheckIcon className="w-5 h-5 text-green-600" />
                <p className="text-sm text-slate-500">
                  {t("thankyou:trust.confidential")}
                </p>
              </div>
            </div>
          </div>

          {/* İŞKUR Certification Section */}
          <div className="flex flex-col items-center gap-6 p-6 mt-12 bg-white border border-slate-200 rounded-xl sm:flex-row sm:text-left">
            <div className="flex-shrink-0">
              <img
                src="/logos/iskur.png"
                alt={t("labels.footer.certificationAlt")}
                className="object-contain w-20 h-20"
              />
            </div>
            <div className="text-slate-600">
              <p className="mb-2 text-sm font-bold text-primary">
                {t("thankyou:trust.iskurTitle")}
              </p>
              <p className="text-xs leading-relaxed">
                {t("thankyou:trust.iskurText")}
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 text-lg font-bold text-white transition-all duration-200 rounded-full bg-primary hover:bg-primary/90 hover:shadow-lg active:scale-95"
            >
              <ArrowLeftIcon
                className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`}
              />
              {t("thankyou:backToHome")}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["thankyou", "common"])),
    },
  };
}

export default ThankYouPage;
