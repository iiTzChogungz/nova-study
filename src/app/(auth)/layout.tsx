export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
      <div className="w-full h-full flex flex-col items-center justify-center relative min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 -z-10" />
        {children}
      </div>
    </div>
  )
}
