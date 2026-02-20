import toast from "react-hot-toast";
import {
  RiCheckFill,
  RiCloseCircleFill,
  RiInformationFill,
} from "react-icons/ri";
import { cn } from "./cn";

const getConfig = (
  id = "toast",
  timeout,
  icon,
  className = "",
  iconClassName = ""
) => {
  const Icon = icon;

  return {
    id: "toast",
    position: "top-center",
    icon: <Icon className={cn("w-5 h-5", iconClassName)} />,
    className: cn(
      "text-xs sm:text-sm leading-5 font-medium text-black bg-secondary lg:max-w-md 2xl:max-w-lg",
      className
    ),
    duration: timeout || 5000,
  };
};

export const showSuccess = (message = "Success", timeout = 5000) => {
  toast(
    message,
    getConfig(
      "success-toast",
      timeout,
      RiCheckFill,
      "text-green-600 bg-green-50",
      "text-green-500"
    )
  );
};

export const showError = (message = "Error", timeout = 5000) => {
  toast(
    message,
    getConfig(
      "error-toast",
      timeout,
      RiCloseCircleFill,
      "text-red-600 bg-red-50",
      "text-red-500"
    )
  );
};

export const showInfo = (message, timeout = 5000) => {
  toast(
    message,
    getConfig(
      "info-toast",
      timeout,
      RiInformationFill,
      "text-gray-600 bg-gray-100",
      "text-gray-500"
    )
  );
};

export const showWarning = (message, timeout = 5000) => {
  toast(
    message,
    getConfig(
      "warning-toast",
      timeout,
      RiInformationFill,
      "text-yellow-600 bg-yellow-50",
      "text-yellow-500"
    )
  );
};
