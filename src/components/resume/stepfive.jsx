import { useTranslation } from "next-i18next";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

const ProjectsSection = forwardRef(
  ({ data, updateData, nextStep, prevStep }, ref) => {
    const { t } = useTranslation("resume-generator");
    const [projectsList, setProjectsList] = useState(() => {
      const initialData = data?.experience;

      if (Array.isArray(initialData)) {
        return initialData;
      }

      if (initialData && typeof initialData === "object") {
        return Object.values(initialData);
      }

      return [
        {
          name: "",
          link: "",
          description: "",
        },
      ];
    });

    // Load data from localStorage on component mount
    useEffect(() => {
      const savedData = localStorage.getItem("project_information");
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          const dataArray = Array.isArray(parsedData)
            ? parsedData
            : Object.values(parsedData);

          setProjectsList(dataArray);
        } catch (error) {
          console.error("Error parsing saved data:", error);
        }
      }
    }, []);

    const [errors, setErrors] = useState({});

    // Handle input changes
    const handleChange = (index, e) => {
      const { name, value } = e.target;
      const updatedList = [...projectsList];
      updatedList[index] = {
        ...updatedList[index],
        [name]: value,
      };
      setProjectsList(updatedList);
    };

    // Add new project entry
    const addProject = () => {
      setProjectsList([
        ...projectsList,
        {
          name: "",
          link: "",
          description: "",
        },
      ]);
    };

    // Remove project entry
    const removeProject = (index) => {
      if (projectsList.length > 1) {
        const updatedList = projectsList.filter((_, i) => i !== index);
        setProjectsList(updatedList);
      }
    };

    // Validate URL
    const validateUrl = (url) => {
      if (!url) return true; // Empty URLs are allowed

      try {
        new URL(url);
        return true;
      } catch (error) {
        return false;
      }
    };

    // Validate form
    const validateForm = () => {
      let isValid = true;
      let newErrors = {};

      projectsList.forEach((project, index) => {
        if (!project.name.trim()) {
          newErrors[`name_${index}`] = t("step5.projectNameRequired");
          isValid = false;
        }

        if (project.link && !validateUrl(project.link)) {
          newErrors[`link_${index}`] = t("step5.projectLinkInvalid");
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
        updateData({ projects: projectsList });
      }

      // Save to localStorage instead of using server cookies
      try {
        const dataToSave = { ...projectsList };
        console.log(dataToSave);
        localStorage.setItem("project_information", JSON.stringify(dataToSave));
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
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-transparent bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text break-words">
              {t("step5.title")}
            </h2>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 sm:space-y-7 md:space-y-8"
          >
            {projectsList.map((project, index) => (
              <div
                key={index}
                className="p-4 sm:p-5 md:p-6 border shadow-sm bg-gradient-to-br from-white to-sky-50 rounded-xl sm:rounded-2xl border-sky-100"
              >
                {index > 0 && (
                  <div className="flex justify-end mb-3 sm:mb-4">
                    <button
                      type="button"
                      onClick={() => removeProject(index)}
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
                  {t("step5.projectEntry", { index: index + 1 })}
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <label
                      htmlFor={`name_${index}`}
                      className="block text-sm font-medium text-sky-800"
                    >
                      {t("step5.projectName")}
                    </label>
                    <input
                      type="text"
                      id={`name_${index}`}
                      name="name"
                      value={project.name}
                      onChange={(e) => handleChange(index, e)}
                      placeholder={t("step5.projectNamePlaceholder")}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors[`name_${index}`]
                          ? "border-red-500 bg-red-50"
                          : "border-sky-200 focus:border-sky-400"
                      } outline-none focus:ring-2 focus:ring-sky-200 transition-all duration-300`}
                    />
                    {errors[`name_${index}`] && (
                      <p className="mt-1 text-xs font-medium text-red-500">
                        {errors[`name_${index}`]}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor={`link_${index}`}
                      className="block text-sm font-medium text-sky-800"
                    >
                      {t("step5.projectLink")}{" "}
                      <span className="text-sky-400">
                        {t("step5.projectLinkOptional")}
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
                            d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        id={`link_${index}`}
                        name="link"
                        value={project.link}
                        onChange={(e) => handleChange(index, e)}
                        placeholder={t("step5.projectLinkPlaceholder")}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                          errors[`link_${index}`]
                            ? "border-red-500 bg-red-50"
                            : "border-sky-200 focus:border-sky-400"
                        } outline-none focus:ring-2 focus:ring-sky-200 transition-all duration-300`}
                      />
                    </div>
                    {errors[`link_${index}`] && (
                      <p className="mt-1 text-xs font-medium text-red-500">
                        {errors[`link_${index}`]}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-3">
                    <label
                      htmlFor={`description_${index}`}
                      className="block text-sm font-medium text-sky-800"
                    >
                      {t("step5.description")}
                    </label>
                    <textarea
                      id={`description_${index}`}
                      name="description"
                      value={project.description}
                      onChange={(e) => handleChange(index, e)}
                      rows="3"
                      placeholder={t("step5.descriptionPlaceholder")}
                      className="w-full px-4 py-3 transition-all duration-300 border outline-none rounded-xl border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
                    ></textarea>
                    <p className="text-xs text-sky-500">
                      {t("step5.descriptionTip")}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-center">
              <button
                type="button"
                onClick={addProject}
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
                {t("buttons.addAnotherProject")}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
);

export default ProjectsSection;
