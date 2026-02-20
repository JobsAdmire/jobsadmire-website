import React from "react";

import Description from "@components/jobdetail/description";
import { useRouter } from "next/router";

export default function jobdetail() {
  const router = useRouter();
  const { id } = router.query;

  return <div>{id && <Description job_id={id} />}</div>;
}

export const getServerSideProps = async ({ locale }) => {
  const {
    serverSideTranslations,
  } = require("next-i18next/serverSideTranslations");
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "job-detail"])),
    },
  };
};
