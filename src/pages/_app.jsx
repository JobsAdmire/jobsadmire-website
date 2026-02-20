import Script from "next/script";
import { ConfigProvider } from "antd";
import { Toaster } from "react-hot-toast";
import { appWithTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Header, Footer } from "@components/app";
import WhatsAppButton from "@components/whatsapp/whatsapp";

import "@styles/globals.css";
import "@styles/select.css";
import "@styles/collapse.css";
import "@styles/header.css";
import "@styles/phone.css";

function App({ Component, pageProps }) {
  const router = useRouter();
  const { locale } = router;

  // Check if current locale is RTL
  const isRTL = locale === "ar" || locale === "fa";

  // Set document direction and language
  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = locale;
  }, [locale, isRTL]);

  // Global link handling for locale preservation
  useEffect(() => {
    const handleLinkClick = (e) => {
      // Find the clicked link
      const target = e.target.closest('a[href^="/"]');

      if (target) {
        const href = target.getAttribute("href");

        // Skip if it's already localized or if it's the default locale
        if (href.includes(`/${locale}`) || locale === "en") {
          return; // Let the link work normally
        }

        // Skip external links, anchors, or special paths
        if (
          href.startsWith("http") ||
          href.startsWith("#") ||
          href.startsWith("mailto:") ||
          href.startsWith("tel:")
        ) {
          return;
        }

        // Prevent default navigation
        e.preventDefault();

        // Create localized URL
        const localizedHref = `/${locale}${href}`;

        // Navigate to localized URL
        window.location.href = localizedHref;
      }
    };

    // Add event listener to document
    document.addEventListener("click", handleLinkClick);

    // Cleanup
    return () => document.removeEventListener("click", handleLinkClick);
  }, [locale]);

  // Antd locale configuration for different languages
  const getAntdLocale = () => {
    switch (locale) {
      case "ar":
        // You can import Arabic locale from antd if needed
        // import arEG from 'antd/locale/ar_EG'
        // return arEG
        return undefined; // Use default for now
      case "fr":
        // import frFR from 'antd/locale/fr_FR'
        // return frFR
        return undefined;
      case "es":
        // import esES from 'antd/locale/es_ES'
        // return esES
        return undefined;
      default:
        return undefined; // English (default)
    }
  };

  return (
    <ConfigProvider
      direction={isRTL ? "rtl" : "ltr"}
      locale={getAntdLocale()}
      theme={{
        components: {
          Typography: {
            titleMarginTop: 0,
            titleMarginBottom: 0,
          },
          Select: {
            optionActiveBg: "#91d9f7",
            optionSelectedColor: "#ffffff",
            optionSelectedBg: "#51bae7",
            optionPadding: "5px 6px",
            optionSelectedFontWeight: 500,
          },
          Dropdown: {
            paddingBlock: "6px",
          },
        },
        token: {
          fontFamily: isRTL
            ? "Noto Sans Arabic, Poppins, sans-serif"
            : "Poppins, sans-serif",
          colorText: "#2e2e2e",
          colorPrimaryBg: "#51bae7",
          colorBgLayout: "#51bae7",
          colorPrimary: "#51bae7",
        },
      }}
    >
      <div className={isRTL ? "rtl-layout" : "ltr-layout"}>
        {/* Google Analytics - gtag.js */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-77Y5KBV97L"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-77Y5KBV97L');
            `,
          }}
        />

        <WhatsAppButton phoneNumber="905011240340" message="hello." />

        <Header />
        {/* <Socials/> */}

        <main className="min-h-screen">
          <Component {...pageProps} />
        </main>


        <Footer />
        <Toaster
          position={isRTL ? "top-left" : "top-right"}
          toastOptions={{
            style: {
              fontFamily: isRTL
                ? "Noto Sans Arabic, Poppins, sans-serif"
                : "Poppins, sans-serif",
              direction: isRTL ? "rtl" : "ltr",
            },
          }}
        />
      </div>
    </ConfigProvider>
  );
}

export default appWithTranslation(App);
