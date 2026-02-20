import React, { useState } from "react";
import {
  Shield,
  Stethoscope,
  Truck,
  Plane,
  Factory,
  HardHat,
  Wheat,
} from "lucide-react";
import { useTranslation } from "next-i18next";

const CategoryCard = ({ icon: Icon, title, index }) => {
  const { t } = useTranslation("common");
  const [isHovered, setIsHovered] = useState(false);

  // Define different colors for each category
  const colors = [
    {
      light: "bg-blue-50",
      medium: "bg-blue-100",
      dark: "text-blue-600",
      border: "border-blue-200",
    },
    {
      light: "bg-sky-50",
      medium: "bg-sky-100",
      dark: "text-sky-600",
      border: "border-sky-200",
    },
    {
      light: "bg-indigo-50",
      medium: "bg-indigo-100",
      dark: "text-indigo-600",
      border: "border-indigo-200",
    },
    {
      light: "bg-cyan-50",
      medium: "bg-cyan-100",
      dark: "text-cyan-600",
      border: "border-cyan-200",
    },
    {
      light: "bg-teal-50",
      medium: "bg-teal-100",
      dark: "text-teal-600",
      border: "border-teal-200",
    },
    {
      light: "bg-sky-50",
      medium: "bg-sky-100",
      dark: "text-sky-600",
      border: "border-sky-200",
    },
  ];

  const color = colors[index % colors.length];

  return (
    <div
      className={`relative overflow-hidden group transition-all duration-300 transform ${isHovered ? "scale-105 -translate-y-2" : ""} bg-white rounded-xl shadow-lg hover:shadow-xl h-40 flex items-center justify-center`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background gradient that appears on hover */}
      <div
        className={`absolute inset-0 ${color.medium} opacity-0 group-hover:opacity-30 transition-opacity duration-300`}
      ></div>

      {/* Animated corners */}
      <div
        className={`absolute top-0 left-0 w-24 h-1 ${color.medium} transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500`}
      ></div>
      <div
        className={`absolute top-0 right-0 w-1 h-24 ${color.medium} transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500`}
      ></div>
      <div
        className={`absolute bottom-0 right-0 w-24 h-1 ${color.medium} transform translate-x-full group-hover:translate-x-0 transition-transform duration-500`}
      ></div>
      <div
        className={`absolute bottom-0 left-0 w-1 h-24 ${color.medium} transform translate-y-full group-hover:translate-y-0 transition-transform duration-500`}
      ></div>

      <div className="relative z-10 flex flex-col items-center w-full p-6 text-center">
        <div
          className={`mb-4 ${color.light} ${color.border} border-2 p-5 rounded-full transition-all duration-300 group-hover:shadow-md`}
        >
          <Icon
            className={`w-8 h-8 ${color.dark} group-hover:scale-110 transition-transform duration-300`}
          />
        </div>
        <h3 className="text-lg font-medium text-gray-800 transition-all duration-300 group-hover:font-semibold">
          {title}
        </h3>

        {/* Explore text that appears on hover */}
        <div className="h-0 mt-3 overflow-hidden transition-all duration-300 group-hover:h-6">
          <span
            className={`text-sm ${color.dark} font-medium flex items-center justify-center`}
          >
            {t("popularCategories.exploreJobs")}
            <svg
              className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
};

const PopularCategories = () => {
  const { t } = useTranslation("common");

  const categories = [
    {
      icon: Factory,
      title: t("popularCategories.categories.factoryWorker"),
    },

    {
      icon: Wheat,
      title: t("popularCategories.categories.informationTechnology"),
    },
    {
      icon: Plane,
      title: t("popularCategories.categories.tourismHospitality"),
    },
    {
      icon: Truck,
      title: t("popularCategories.categories.engineeringConstruction"),
    },
  ];

  return (
    <div className="relative px-6 py-20 overflow-hidden bg-gradient-to-br from-sky-50 via-white to-blue-50">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute bg-blue-100 rounded-full top-10 left-10 w-80 h-80 mix-blend-multiply opacity-20 animate-pulse"></div>
        <div
          className="absolute rounded-full bottom-10 right-20 w-96 h-96 bg-sky-100 mix-blend-multiply opacity-30 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute w-64 h-64 bg-indigo-100 rounded-full top-40 right-10 mix-blend-multiply opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute rounded-full -bottom-20 -left-10 w-72 h-72 bg-cyan-100 mix-blend-multiply opacity-20 animate-pulse"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-16 text-center">
          <div className="inline-block mb-3">
            <div className="relative">
              <div className="absolute inset-0 transform rounded-lg bg-gradient-to-r from-blue-200 to-sky-200 rotate-1"></div>
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-sky-500 to-sky-500">
              {t("popularCategories.title")}
            </span>
          </h2>
          {/* <h2 className="mb-6 text-3xl font-bold text-gray-800 md:text-4xl">{t('popularCategories.title')}</h2> */}
          <br></br>
          <p className="max-w-3xl px-4 mx-auto text-base text-gray-600 md:text-lg">
            {t("popularCategories.description")}
          </p>
        </div>

        {/* Category Grid - adjusted to 3 columns on larger screens for wider cards */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
          {categories.map((category, index) => (
            <CategoryCard
              key={index}
              icon={category.icon}
              title={category.title}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularCategories;
