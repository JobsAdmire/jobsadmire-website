import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { Lock, User, Briefcase, Users, UserCheck } from "lucide-react";

export default function LoginPage() {
  const { t } = useTranslation("common");
  const [selectedCategory, setSelectedCategory] = useState("agency");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const categories = [
    { id: "agency", label: t("labels.login.agency"), icon: Briefcase },
    { id: "job-provider", label: t("labels.login.jobProvider"), icon: Users },
    { id: "candidate", label: t("labels.login.candidate"), icon: UserCheck },
  ];

  const handleLogin = () => {
    console.log("Login attempt:", {
      category: selectedCategory,
      username,
      password,
      remember,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-cyan-400 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600 opacity-30 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400 opacity-20 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500 opacity-20 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Main card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header section with gradient */}
          <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-12 text-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600 opacity-20 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>

            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Logo */}
              <div className="mb-6">
                <img
                  src="https://via.placeholder.com/80x80/ffffff/4F46E5?text=LOGO"
                  alt={t("labels.login.logoAlt")}
                  className="w-20 h-20 rounded-full shadow-lg object-cover"
                />
              </div>

              <h1 className="text-3xl font-bold mb-6">
                {t("labels.login.welcomeTitle")}
                <br />
                {t("labels.login.welcomeSubtitle")}
              </h1>
            </div>
          </div>

          {/* Login section */}
          <div className="p-8 bg-white">
            <h2 className="text-center text-gray-700 text-sm font-semibold tracking-widest mb-6">
              {t("labels.login.userLoginHeading")}
            </h2>

            {/* Category Selection */}
            <div className="flex gap-2 mb-6">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex-1 flex flex-col items-center justify-center py-3 px-2 rounded-lg transition-all ${
                      selectedCategory === category.id
                        ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-1" />
                    <span className="text-xs font-medium">
                      {category.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-4">
              {/* Username input */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <User className="w-5 h-5 text-white" />
                </div>
                <input
                  type="text"
                  placeholder={t("labels.login.placeholderUsername")}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white placeholder-blue-100 pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Password input */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <input
                  type="password"
                  placeholder={t("labels.login.placeholderPassword")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white placeholder-blue-100 pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Remember me and forgot password */}
              <div className="flex items-center justify-between text-sm pt-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-600">{t("labels.login.rememberMe")}</span>
                </label>
                <a
                  href="#"
                  className="text-cyan-400 hover:text-cyan-500 transition-colors"
                >
                  {t("labels.login.forgotPassword")}
                </a>
              </div>

              {/* Login button */}
              <div className="pt-4">
                <button
                  onClick={handleLogin}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg uppercase tracking-wider text-sm"
                >
                  {t("labels.login.loginButton")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getStaticProps = async ({ locale }) => {
  const {
    serverSideTranslations,
  } = require("next-i18next/serverSideTranslations");
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};
