import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline";
};

export function Button({
  variant = "default",
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "px-4 py-2 rounded font-semibold transition " +
    (variant === "outline"
      ? "border border-gray-400 bg-transparent text-gray-800"
      : "bg-blue-600 text-white hover:bg-blue-700");
  return <button className={`${base} ${className}`} {...props} />;
}
