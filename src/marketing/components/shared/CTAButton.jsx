import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const variants = {
  primary: "gradient-brand text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40",
  secondary: "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50",
  outline: "bg-transparent text-white border-2 border-white/60 hover:bg-white/10",
  ghost: "bg-transparent text-blue-600 hover:bg-blue-50",
  dark: "bg-slate-900 text-white hover:bg-slate-800",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm font-semibold",
  lg: "px-8 py-4 text-base font-semibold",
  xl: "px-10 py-5 text-lg font-bold",
};

export default function CTAButton({
  variant = "primary",
  size = "md",
  href,
  onClick,
  children,
  className = "",
  external = false,
}) {
  const base = cn(
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 cursor-pointer",
    variants[variant],
    sizes[size],
    className
  );

  const motionProps = {
    whileHover: { scale: 1.03 },
    whileTap: { scale: 0.98 },
    transition: { type: "spring", stiffness: 400, damping: 17 },
  };

  if (href && external) {
    return (
      <motion.a href={href} target="_blank" rel="noopener noreferrer" className={base} {...motionProps}>
        {children}
      </motion.a>
    );
  }

  if (href) {
    return (
      <motion.div {...motionProps} className="inline-flex">
        <Link to={href} className={base} onClick={onClick}>
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button className={base} onClick={onClick} {...motionProps}>
      {children}
    </motion.button>
  );
}
