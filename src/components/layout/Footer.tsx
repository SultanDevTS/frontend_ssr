export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} PortalNews. Semua hak dilindungi.
      </div>
    </footer>
  );
}
