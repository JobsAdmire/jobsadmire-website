import { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { Languages, Check } from "lucide-react";

const LanguageSwitcher = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Check if current language is RTL
  const isRTL = router.locale === "ar" || router.locale === "fa";

  const languages = [
    {
      code: "en",
      name: "English",
      nativeName: "English",
      flag: "🇺🇸",
      flagUrl: "https://flagcdn.com/24x18/us.png",
    },
    {
      code: "fr",
      name: "French",
      nativeName: "Français",
      flag: "🇫🇷",
      flagUrl: "https://flagcdn.com/24x18/fr.png",
    },
    {
      code: "de",
      name: "German",
      nativeName: "Deutsch",
      flag: "🇩🇪",
      flagUrl: "https://flagcdn.com/24x18/de.png",
    },
    {
      code: "tr",
      name: "Turkish",
      nativeName: "Türkçe",
      flag: "🇹🇷",
      flagUrl: "https://flagcdn.com/24x18/tr.png",
    },
    {
      code: "ar",
      name: "Arabic",
      nativeName: "عربي",
      flag: "🇸🇦",
      flagUrl: "https://flagcdn.com/24x18/sa.png",
    },
    {
      code: "ru",
      name: "Russian",
      nativeName: "Русский",
      flag: "🇷🇺",
      flagUrl: "https://flagcdn.com/24x18/ru.png",
    },
    {
      code: "fa",
      name: "Persian",
      nativeName: "فارسی",
      flag: "🇮🇷",
      flagUrl: "https://flagcdn.com/24x18/ir.png",
    },
    {
      code: "id",
      name: "Indonesian",
      nativeName: "Bahasa Indonesia",
      flag: "🇮🇩",
      flagUrl: "https://flagcdn.com/24x18/id.png",
    },
    {
      code: "fil",
      name: "Filipino",
      nativeName: "Filipino",
      flag: "🇵🇭",
      flagUrl: "https://flagcdn.com/24x18/ph.png",
    },
    {
      code: "tk",
      name: "Turkmen",
      nativeName: "Türkmen",
      flag: "🇹🇲",
      flagUrl: "https://flagcdn.com/24x18/tm.png",
    },
    {
      code: "tg",
      name: "Tajik",
      nativeName: "Тоҷикӣ",
      flag: "🇹🇯",
      flagUrl: "https://flagcdn.com/24x18/tj.png",
    },
  ];

  const currentLanguage =
    languages.find((lang) => lang.code === router.locale) || languages[0];

  const handleLanguageChange = async (languageCode) => {
    setIsOpen(false);

    // Set cookie to remember user's language preference (overrides geo-detection)
    // Cookie expires in 1 year
    document.cookie = `NEXT_LOCALE=${languageCode}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;

    // Push to the same route but with different locale
    await router.push(router.asPath, router.asPath, {
      locale: languageCode,
      scroll: false,
    });
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center justify-center p-2.5 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 bg-white hover:bg-gray-50 active:scale-95 w-10 h-10"
        aria-label={t("labels.general.selectLanguageAria")}
      >
        <Languages className="w-5 h-5 text-sky-500 group-hover:text-gray-800" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute top-full mt-1 ${isRTL ? "left-0" : "right-0"} bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[160px] max-h-[280px] overflow-y-auto`}
        >
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`group w-full text-left px-3 py-2.5 flex items-center ${isRTL ? "space-x-reverse" : ""} space-x-3 transition-all duration-150 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                router.locale === language.code
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              {/* Flag */}
              <div className="flex-shrink-0">
                <div className="w-5 h-5 rounded-sm overflow-hidden flex items-center justify-center">
                  <img
                    src={language.flagUrl}
                    alt={`${language.name} flag`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "inline";
                    }}
                  />
                  <span className="text-sm" style={{ display: "none" }}>
                    {language.flag}
                  </span>
                </div>
              </div>

              {/* Language Name */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{language.nativeName}</div>
              </div>

              {/* Check Icon for Active Language */}
              {router.locale === language.code && (
                <div className="ml-auto flex-shrink-0">
                  <Check className="w-4 h-4 text-blue-500" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      <style jsx>{`
        /* Custom scrollbar for dropdown */
        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 2px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 2px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  );
};

export default LanguageSwitcher;
