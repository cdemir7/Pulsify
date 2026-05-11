import Sidebar from './Sidebar'

export default function Products() {
  return (
    <div className="flex min-h-screen" style={{ background: "#0A0A0F", fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#F1F1F5" }}>
      <Sidebar />
      <main className="flex flex-col flex-1 items-center justify-center">
        <p className="text-2xl font-bold">Ürünler</p>
        <p className="text-sm mt-2" style={{ color: "#4A4A5E" }}>Yakında eklenecek</p>
      </main>
    </div>
  )
}