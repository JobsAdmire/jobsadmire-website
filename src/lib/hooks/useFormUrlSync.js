import { useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/router";

/**
 * Custom hook to sync form state with URL query parameters
 *
 * @param {Object} options - Configuration options
 * @param {Function} options.onFormOpen - Callback when form should open (receives serviceType)
 * @param {Function} options.onFormClose - Callback when form should close
 * @param {string} options.queryParamName - Name of the query parameter (default: 'form')
 * @returns {Object} - { openForm, closeForm, getFormFromUrl }
 */
export const useFormUrlSync = ({
  onFormOpen,
  onFormClose,
  queryParamName = "form",
}) => {
  const router = useRouter();
  const isInternalUpdate = useRef(false);

  const serviceTypeToUrlParam = {
    migrate: "migrate",
    work: "work",
    visit: "e-invitation",
    "e-invitation": "e-invitation",
  };

  const urlParamToServiceType = {
    migrate: "migrate",
    work: "work",
    "e-invitation": "visit",
  };

  const getFormFromUrl = useCallback(() => {
    const formParam = router.query[queryParamName];
    if (formParam && urlParamToServiceType[formParam]) {
      return urlParamToServiceType[formParam];
    }
    return null;
  }, [router.query, queryParamName]);

  const openForm = useCallback(
    (serviceType) => {
      const urlParam = serviceTypeToUrlParam[serviceType];
      if (!urlParam) {
        console.warn(`Unknown service type: ${serviceType}`);
        return;
      }

      isInternalUpdate.current = true;

      if (onFormOpen) {
        onFormOpen(serviceType);
      }

      router.push(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            [queryParamName]: urlParam,
          },
        },
        undefined,
        { shallow: true }
      );

      setTimeout(() => {
        isInternalUpdate.current = false;
      }, 100);
    },
    [router, queryParamName, onFormOpen]
  );

  const closeForm = useCallback(() => {
    const { [queryParamName]: formParam, ...restQuery } = router.query;

    isInternalUpdate.current = true;

    if (onFormClose) {
      onFormClose();
    }

    if (formParam) {
      router.push(
        {
          pathname: router.pathname,
          query: restQuery,
        },
        undefined,
        { shallow: true }
      );
    }

    setTimeout(() => {
      isInternalUpdate.current = false;
    }, 100);
  }, [router, queryParamName, onFormClose]);

  useEffect(() => {
    if (!router.isReady) return;
    if (isInternalUpdate.current) return;

    const formType = getFormFromUrl();

    if (formType) {
      if (onFormOpen) {
        onFormOpen(formType);
      }
    } else {
      if (onFormClose) {
        onFormClose();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query[queryParamName], router.isReady]);

  return {
    openForm,
    closeForm,
    getFormFromUrl,
  };
};
