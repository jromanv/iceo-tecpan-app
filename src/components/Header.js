export default function Header({ title, userType }) {
  return (
    <header className="bg-[#570020] text-white shadow-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img 
              src="/logo-liceo.png" 
              alt="Liceo Tecpán" 
              className="w-12 h-12 object-contain bg-white rounded-full p-2"
            />
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Liceo Tecpán</h1>
              <p className="text-xs md:text-sm text-gray-200">{title}</p>
            </div>
          </div>
          {userType && (
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30">
              <span className="text-sm font-semibold">{userType}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}