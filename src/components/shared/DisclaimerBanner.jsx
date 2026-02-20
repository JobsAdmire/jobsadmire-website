import React, { useState } from "react";
import { useTranslation } from "next-i18next";

const DisclaimerBanner = () => {
  const { t } = useTranslation("common");
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed left-4 right-4 bottom-4 z-50 flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl shadow-lg bg-white border border-sky-100">
      <div className="flex-1 text-sm text-sky-900 leading-snug">
        <strong className="block font-semibold mb-1">
          {t("labels.disclaimer.title")}
        </strong>
        {t("labels.disclaimer.body")}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={handleClose}
          className="ml-auto px-4 py-2 text-sm font-semibold text-sky-700 bg-sky-100 rounded-md hover:bg-sky-200 transition"
          aria-label={t("labels.disclaimer.dismissAria")}
        >
          {t("labels.disclaimer.dismissButton")}
        </button>
      </div>
    </div>
  );
};

export default DisclaimerBanner;
