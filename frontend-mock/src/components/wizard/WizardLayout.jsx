import Logo from "../ui/Logo"

export default function WizardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#333333] via-[#1a4a54] to-[#3dabc4] px-4 py-10">
      <div className="mx-auto mb-8 flex max-w-4xl items-center justify-center">
        <Logo light />
      </div>
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-6 shadow-2xl sm:p-10">{children}</div>
    </div>
  )
}
