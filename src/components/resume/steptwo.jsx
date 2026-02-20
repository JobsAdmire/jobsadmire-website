import { useTranslation } from "next-i18next";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

const Step2 = forwardRef(({ data, updateData, nextStep, prevStep }, ref) => {
  const { t } = useTranslation("resume-generator");
  const [achievements, setAchievements] = useState(data || []);
  const [currentAchievement, setCurrentAchievement] = useState({
    title: "",
    description: "",
    date: "",
  });
  const [errors, setErrors] = useState({});

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("achievement_information");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Convert object format to array if needed
        const dataArray = Array.isArray(parsedData)
          ? parsedData
          : Object.keys(parsedData).every((key) => !isNaN(key))
            ? Object.values(parsedData)
            : [parsedData];

        setAchievements(dataArray);
      } catch (error) {
        console.error("Error parsing saved data:", error);
      }
    }
  }, []);

  // Handle input changes for current achievement form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentAchievement((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add a new achievement
  const addAchievement = () => {
    if (currentAchievement.title.trim() !== "") {
      const newAchievement = {
        ...currentAchievement,
        id: Date.now(),
      };
      const updatedAchievements = [...achievements, newAchievement];

      setAchievements(updatedAchievements);
      updateData(updatedAchievements);

      // Reset the form
      setCurrentAchievement({
        title: "",
        description: "",
        date: "",
      });
    }
  };

  // Remove an achievement
  const removeAchievement = (id) => {
    const updatedAchievements = achievements.filter((item) => item.id !== id);
    setAchievements(updatedAchievements);
    updateData(updatedAchievements);
  };

  // Validate form
  const validateForm = () => {
    return true; // For now, no strict validation
  };

  // Handle submit
  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    if (validateForm()) {
      updateData(achievements);

      // Save to localStorage as array
      try {
        localStorage.setItem(
          "achievement_information",
          JSON.stringify(achievements)
        );
      } catch (error) {
        console.error("Error saving data to localStorage:", error);
      }

      nextStep();
    }
  };

  useImperativeHandle(ref, () => ({
    submitForm: handleSubmit,
  }));

  return (
    <div className="w-full p-4 sm:p-5 md:p-6 shadow-sm bg-gradient-to-br from-sky-50 to-white rounded-xl">
      <div className="pb-3 sm:pb-4 mb-4 sm:mb-5 md:mb-6 border-b border-sky-200">
        <h2 className="flex items-center text-lg sm:text-xl md:text-2xl font-bold text-sky-800">
          <span className="p-1.5 sm:p-2 mr-2 sm:mr-3 rounded-full bg-sky-100 text-sky-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
          {t("step2.title")}
        </h2>
        <p className="ml-8 sm:ml-10 md:ml-12 text-xs sm:text-sm italic text-sky-600">
          {t("step2.description")}
        </p>
      </div>

      {/* List of added achievements */}
      <div className="mb-6 sm:mb-7 md:mb-8">
        {achievements.length === 0 ? (
          <div className="py-6 sm:py-8 text-center border border-dashed rounded-lg bg-sky-50 border-sky-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 text-sky-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <p className="text-sm sm:text-base text-sky-700">
              {t("step2.noAchievements")}
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="flex flex-col sm:flex-row items-start justify-between p-4 sm:p-5 transition-all duration-200 border-l-4 rounded-lg shadow-sm bg-sky-50 border-sky-400 hover:shadow-md gap-3 sm:gap-0"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-black">
                    {achievement.title}
                  </h3>
                  <p className="mt-1 text-sm text-sky-700">
                    {achievement.description}
                  </p>
                  <div className="flex items-center mt-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 mr-1 text-sky-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-xs font-medium text-sky-500">
                      {achievement.date}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removeAchievement(achievement.id)}
                  className="flex items-center px-3 py-1.5 sm:py-1 ml-0 sm:ml-4 text-xs sm:text-sm text-white transition-colors duration-200 bg-red-400 rounded-md hover:bg-red-500 w-full sm:w-auto justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  <span className="hidden sm:inline">{t("step2.remove")}</span>
                  <span className="sm:hidden">{t("step2.delete")}</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form to add new achievement */}
      <div className="p-4 sm:p-5 md:p-6 border rounded-lg shadow-sm bg-sky-50 border-sky-200">
        <h3 className="flex items-center mb-4 sm:mb-5 text-base sm:text-lg font-medium text-sky-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-sky-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {t("step2.addNew")}
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:gap-5 mb-4 sm:mb-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="title"
              className="block mb-2 text-sm font-medium text-sky-700"
            >
              {t("step2.achievementTitle")}
            </label>
            <div className="relative">
              <input
                type="text"
                id="title"
                name="title"
                value={currentAchievement.title}
                onChange={handleChange}
                placeholder={t("step2.achievementTitlePlaceholder")}
                className="w-full pl-10 pr-3 py-2.5 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent bg-white"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-sky-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="date"
              className="block mb-2 text-sm font-medium text-sky-700"
            >
              {t("step2.date")}
            </label>
            <div className="relative">
              <input
                type="date"
                id="date"
                name="date"
                value={currentAchievement.date}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2.5 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent bg-white"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-sky-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-5">
          <label
            htmlFor="description"
            className="block mb-2 text-sm font-medium text-sky-700"
          >
            {t("step2.achievementDescription")}
          </label>
          <div className="relative">
            <textarea
              id="description"
              name="description"
              value={currentAchievement.description}
              onChange={handleChange}
              placeholder={t("step2.achievementDescriptionPlaceholder")}
              rows="3"
              className="w-full pl-10 pr-3 py-2.5 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent bg-white"
            ></textarea>
            <div className="absolute top-2.5 left-0 flex items-start pl-3 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-sky-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={addAchievement}
          className="px-4 sm:px-5 py-2 sm:py-2.5 font-medium text-sm sm:text-base text-white bg-sky-500 rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center w-full sm:w-auto"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          {t("buttons.addAchievement")}
        </button>
      </div>
    </div>
  );
});

export default Step2;
