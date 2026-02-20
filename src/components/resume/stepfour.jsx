import { useTranslation } from "next-i18next";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

const EducationSection = forwardRef(
  ({ data, updateData, nextStep, prevStep }, ref) => {
    const { t } = useTranslation("resume-generator");
    const [educationList, setEducationList] = useState(() => {
      const initialData = data?.education;

      if (Array.isArray(initialData)) {
        return initialData;
      }

      if (initialData && typeof initialData === "object") {
        return Object.values(initialData);
      }

      return [
        {
          school: "",
          degree: "",
          city: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ];
    });

    // Load data from localStorage on component mount
    useEffect(() => {
      const savedData = localStorage.getItem("education_information");
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          const dataArray = Array.isArray(parsedData)
            ? parsedData
            : Object.values(parsedData);

          setEducationList(dataArray);
        } catch (error) {
          console.error("Error parsing saved data:", error);
        }
      }
    }, []);

    const [errors, setErrors] = useState({});

    // Handle input changes
    const handleChange = (index, e) => {
      const { name, value } = e.target;
      const updatedList = [...educationList];
      updatedList[index] = {
        ...updatedList[index],
        [name]: value,
      };
      setEducationList(updatedList);
    };

    // Add new education entry
    const addEducation = () => {
      setEducationList([
        ...educationList,
        {
          school: "",
          degree: "",
          city: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ]);
    };

    // Remove education entry
    const removeEducation = (index) => {
      if (educationList.length > 1) {
        const updatedList = educationList.filter((_, i) => i !== index);
        setEducationList(updatedList);
      }
    };

    // Validate form
    const validateForm = () => {
      let isValid = true;
      let newErrors = {};

      educationList.forEach((edu, index) => {
        if (!edu.school.trim()) {
          newErrors[`school_${index}`] = t("step4.schoolRequired");
          isValid = false;
        }

        if (!edu.degree.trim()) {
          newErrors[`degree_${index}`] = t("step4.degreeRequired");
          isValid = false;
        }

        if (!edu.startDate.trim()) {
          newErrors[`startDate_${index}`] = t("step4.startDateRequired");
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
        updateData({ education: educationList });
      }

      // Save to localStorage instead of using server cookies
      try {
        const dataToSave = { ...educationList };
        console.log(dataToSave);
        localStorage.setItem(
          "education_information",
          JSON.stringify(dataToSave)
        );
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
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-transparent bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text break-words">
              {t("step4.title")}
            </h2>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 sm:space-y-7 md:space-y-8"
          >
            {educationList.map((education, index) => (
              <div
                key={index}
                className="p-4 sm:p-5 md:p-6 border shadow-sm bg-gradient-to-br from-white to-sky-50 rounded-xl sm:rounded-2xl border-sky-100"
              >
                {index > 0 && (
                  <div className="flex justify-end mb-3 sm:mb-4">
                    <button
                      type="button"
                      onClick={() => removeEducation(index)}
                      className="flex items-center justify-center w-8 h-8 text-red-500 transition-colors duration-300 bg-red-100 rounded-full hover:bg-red-200"
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
                  </div>
                )}

                <h3 className="mb-3 sm:mb-4 text-base sm:text-lg font-medium text-sky-700">
                  {t("step4.educationEntry", { index: index + 1 })}
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <label
                      htmlFor={`school_${index}`}
                      className="block text-sm font-medium text-sky-800"
                    >
                      {t("step4.school")}
                    </label>
                    <input
                      type="text"
                      id={`school_${index}`}
                      name="school"
                      value={education.school}
                      onChange={(e) => handleChange(index, e)}
                      placeholder={t("step4.schoolPlaceholder")}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors[`school_${index}`]
                          ? "border-red-500 bg-red-50"
                          : "border-sky-200 focus:border-sky-400"
                      } outline-none focus:ring-2 focus:ring-sky-200 transition-all duration-300`}
                    />
                    {errors[`school_${index}`] && (
                      <p className="mt-1 text-xs font-medium text-red-500">
                        {errors[`school_${index}`]}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor={`degree_${index}`}
                      className="block text-sm font-medium text-sky-800"
                    >
                      {t("step4.degree")}
                    </label>
                    <input
                      type="text"
                      id={`degree_${index}`}
                      name="degree"
                      value={education.degree}
                      onChange={(e) => handleChange(index, e)}
                      placeholder={t("step4.degreePlaceholder")}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors[`degree_${index}`]
                          ? "border-red-500 bg-red-50"
                          : "border-sky-200 focus:border-sky-400"
                      } outline-none focus:ring-2 focus:ring-sky-200 transition-all duration-300`}
                    />
                    {errors[`degree_${index}`] && (
                      <p className="mt-1 text-xs font-medium text-red-500">
                        {errors[`degree_${index}`]}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor={`city_${index}`}
                      className="block text-sm font-medium text-sky-800"
                    >
                      {t("step4.city")}
                    </label>
                    <input
                      type="text"
                      id={`city_${index}`}
                      name="city"
                      value={education.city}
                      onChange={(e) => handleChange(index, e)}
                      placeholder={t("step4.cityPlaceholder")}
                      className="w-full px-4 py-3 transition-all duration-300 border outline-none rounded-xl border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6 mt-4 sm:mt-5 md:mt-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <label
                      htmlFor={`startDate_${index}`}
                      className="block text-sm font-medium text-sky-800"
                    >
                      {t("step4.startDate")}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 text-sky-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        id={`startDate_${index}`}
                        name="startDate"
                        value={education.startDate}
                        onChange={(e) => handleChange(index, e)}
                        placeholder={t("step4.startDatePlaceholder")}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                          errors[`startDate_${index}`]
                            ? "border-red-500 bg-red-50"
                            : "border-sky-200 focus:border-sky-400"
                        } outline-none focus:ring-2 focus:ring-sky-200 transition-all duration-300`}
                      />
                    </div>
                    {errors[`startDate_${index}`] && (
                      <p className="mt-1 text-xs font-medium text-red-500">
                        {errors[`startDate_${index}`]}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor={`endDate_${index}`}
                      className="block text-sm font-medium text-sky-800"
                    >
                      {t("step4.endDate")}{" "}
                      <span className="text-sky-400">
                        {t("step4.endDateOptional")}
                      </span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 text-sky-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        id={`endDate_${index}`}
                        name="endDate"
                        value={education.endDate}
                        onChange={(e) => handleChange(index, e)}
                        placeholder={t("step4.endDatePlaceholder")}
                        className="w-full py-3 pl-10 pr-4 transition-all duration-300 border outline-none rounded-xl border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-3">
                    <label
                      htmlFor={`description_${index}`}
                      className="block text-sm font-medium text-sky-800"
                    >
                      {t("step4.description")}{" "}
                      <span className="text-sky-400">
                        {t("step4.descriptionOptional")}
                      </span>
                    </label>
                    <textarea
                      id={`description_${index}`}
                      name="description"
                      value={education.description}
                      onChange={(e) => handleChange(index, e)}
                      rows="3"
                      placeholder={t("step4.descriptionPlaceholder")}
                      className="w-full px-4 py-3 transition-all duration-300 border outline-none rounded-xl border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
                    ></textarea>
                    <p className="text-xs text-sky-500">
                      {t("step4.descriptionTip")}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-center">
              <button
                type="button"
                onClick={addEducation}
                className="flex items-center px-5 py-2 font-medium transition-colors duration-300 bg-white border rounded-lg shadow-sm text-sky-600 border-sky-300 hover:bg-sky-50"
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
                {t("buttons.addAnotherEducation")}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
);

export default EducationSection;
