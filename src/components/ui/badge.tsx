import React from "react";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "outline";
  className?: string;
};

export function Badge({
  variant = "default",
  className = "",
  ...props
}: BadgeProps) {
  const base =
    "inline-block px-2 py-1 rounded text-xs font-semibold " +
    (variant === "outline"
      ? "border border-green-600 bg-transparent text-green-800"
      : "bg-red-100 text-red-800");
  return <span className={`${base} ${className}`} {...props} />;
}
