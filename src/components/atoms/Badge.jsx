import React from "react";
import { cn } from "@/utils/cn";

const Badge = ({ children, variant = "default", className, ...props }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-gradient-to-r from-primary-500 to-secondary-500 text-white",
    secondary: "bg-gray-200 text-gray-900",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    free: "bg-gray-100 text-gray-800",
    member: "bg-blue-100 text-blue-800",
    master: "bg-purple-100 text-purple-800",
    both: "bg-gradient-to-r from-blue-500 to-purple-500 text-white",
    admin: "bg-gradient-to-r from-red-500 to-pink-500 text-white"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-all duration-200",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;