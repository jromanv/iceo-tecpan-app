export default function Header({ title, userType }) {
  return (
    <header className="bg-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Liceo Tecpán</h1>
          <p className="text-sm text-indigo-200">{title}</p>
        </div>
        {userType && (
          <div className="bg-indigo-700 px-4 py-2 rounded-lg">
            <span className="text-sm">{userType}</span>
          </div>
        )}
      </div>
    </header>
  )
}