export default function Card({ children, className = "", hover = false, ...props }) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 shadow-sm ${
        hover ? "transition-shadow duration-200 hover:shadow-lg" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
