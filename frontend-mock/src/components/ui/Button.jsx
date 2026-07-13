import { Link } from "react-router-dom"

const variants = {
  primary: "bg-[#3dabc4] text-white hover:bg-[#2f8ea3] focus-visible:ring-[#3dabc4]",
  accent: "bg-[#bc0001] text-white hover:bg-[#8f0001] focus-visible:ring-[#bc0001]",
  outline:
    "border border-[#3dabc4] text-[#3dabc4] hover:bg-[#ebfbff] focus-visible:ring-[#3dabc4]",
  "outline-white": "border border-white text-white hover:bg-white/10 focus-visible:ring-white",
  ghost: "text-[#3dabc4] hover:bg-[#ebfbff]",
  white: "bg-white text-[#3dabc4] hover:bg-gray-100",
}

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  to,
  href,
  className = "",
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
