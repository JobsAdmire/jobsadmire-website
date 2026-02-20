import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

const SkillsSection = forwardRef(
  ({ data, updateData, nextStep, prevStep }, ref) => {
    const { t } = useTranslation("resume-generator");
    const [skillsList, setSkillsList] = useState(() => {
      const initialData = data?.skills;

      if (Array.isArray(initialData)) {
        return initialData;
      }

      if (initialData && typeof initialData === "object") {
        return Object.values(initialData);
      }

      return [{ name: "" }];
    });

    const router = useRouter();
    // Load data from localStorage on component mount
    useEffect(() => {
      const savedData = localStorage.getItem("skill_information");
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          const dataArray = Array.isArray(parsedData)
            ? parsedData
            : Object.values(parsedData);

          setSkillsList(dataArray);
        } catch (error) {
          console.error("Error parsing saved data:", error);
        }
      }
    }, []);

    const [errors, setErrors] = useState({});

    // Handle input changes
    const handleChange = (index, e) => {
      const { value } = e.target;
      const updatedList = [...skillsList];
      updatedList[index] = { name: value };
      setSkillsList(updatedList);
    };

    // Add new skill entry
    const addSkill = () => {
      setSkillsList([...skillsList, { name: "" }]);
    };

    // Remove skill entry
    const removeSkill = (index) => {
      if (skillsList.length > 1) {
        const updatedList = skillsList.filter((_, i) => i !== index);
        setSkillsList(updatedList);
      }
    };

    // Validate form
    const validateForm = () => {
      let isValid = true;
      let newErrors = {};

      skillsList.forEach((skill, index) => {
        if (!skill.name.trim()) {
          newErrors[`skill_${index}`] = t("step6.skillRequired");
          isValid = false;
        }
      });

      setErrors(newErrors);
      return isValid;
    };

    // Submit form
    const handleSubmit = (e) => {
      if (e) e.preventDefault();

      if (validateForm()) {
        updateData({ skills: skillsList });
      }

      // Save to localStorage instead of using server cookies
      try {
        const dataToSave = { ...skillsList };
        console.log(dataToSave);
        localStorage.setItem("skill_information", JSON.stringify(dataToSave));
      } catch (error) {
        console.error("Error saving data to localStorage:", error);
      }
      nextStep();
    };

    useImperativeHandle(ref, () => ({
      submitForm: handleSubmit,
    }));

    return (
      <div className="relative w-full">
        {/* Animated background elements */}
        <div className="absolute w-40 h-40 rounded-full -top-10 -right-10 bg-sky-200 opacity-20 blur-3xl"></div>
        <div className="absolute w-40 h-40 bg-blue-200 rounded-full -bottom-10 -left-10 opacity-20 blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex items-center pb-4 sm:pb-5 md:pb-6 mb-6 sm:mb-7 md:mb-8 border-b border-sky-100">
            <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 mr-3 sm:mr-4 text-white rounded-full shadow-md bg-gradient-to-r from-sky-400 to-blue-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 sm:w-5 sm:h-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-transparent bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text break-words">
              {t("step6.title")}
            </h2>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 sm:space-y-7 md:space-y-8"
          >
            <div className="p-4 sm:p-5 md:p-6 border shadow-sm bg-gradient-to-br from-white to-sky-50 rounded-xl sm:rounded-2xl border-sky-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
                <h3 className="text-base sm:text-lg font-medium text-sky-700">
                  {t("step6.skillsTitle")}
                </h3>
                <p className="text-xs sm:text-sm text-sky-500">
                  {t("step6.skillsDescription")}
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {Object.values(skillsList).map((skill, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-grow">
                      <div className="relative">
                        <input
                          type="text"
                          name={`skill_${index}`}
                          value={skill.name}
                          onChange={(e) => handleChange(index, e)}
                          placeholder={t("step6.skillPlaceholder")}
                          className={`w-full px-4 py-3 pl-10 rounded-xl border ${
                            errors[`skill_${index}`]
                              ? "border-red-500 bg-red-50"
                              : "border-sky-200 focus:border-sky-400"
                          } outline-none focus:ring-2 focus:ring-sky-200 transition-all duration-300`}
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 text-sky-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 011.12-2.38l-.724-1.447A1 1 0 0011 2H9a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" />
                          </svg>
                        </div>
                      </div>
                      {errors[`skill_${index}`] && (
                        <p className="mt-1 text-xs font-medium text-red-500">
                          {errors[`skill_${index}`]}
                        </p>
                      )}
                    </div>

                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 transition-colors duration-300 bg-red-100 rounded-full hover:bg-red-200"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-4 sm:mt-5 md:mt-6">
                <button
                  type="button"
                  onClick={addSkill}
                  className="flex items-center justify-center px-4 sm:px-5 py-2 font-medium transition-colors duration-300 bg-white border rounded-lg shadow-sm text-sky-600 border-sky-300 hover:bg-sky-50 text-sm sm:text-base w-full sm:w-auto"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {t("buttons.addAnotherSkill")}
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-5 md:p-6 border shadow-sm bg-gradient-to-br from-white to-sky-50 rounded-xl sm:rounded-2xl border-sky-100">
              <h3 className="mb-3 sm:mb-4 text-base sm:text-lg font-medium text-sky-700">
                {t("step6.tipsTitle")}
              </h3>

              <div className="space-y-2 sm:space-y-3 text-sky-800">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 mt-0.5 sm:mt-1 mr-2 text-sky-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-sm">{t("step6.tip1")}</p>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 mt-1 mr-2 text-sky-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-sm">{t("step6.tip2")}</p>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 mt-1 mr-2 text-sky-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-sm">{t("step6.tip3")}</p>
                </div>
              </div>
            </div>

            <div className="relative sm:absolute bottom-4 sm:bottom-6 ltr:right-4 rtl:left-4 sm:ltr:right-6 sm:rtl:left-6 mt-6 sm:mt-0">
              <button
                className="px-4 sm:px-5 py-2.5 sm:py-3 font-medium text-sm sm:text-base text-white bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center w-full sm:w-auto"
                onClick={() => {
                  router.push(`/templates`);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 ltr:mr-2 rtl:ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
                {t("buttons.viewTemplates")}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
);

export default SkillsSection;
