import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-black/50 border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-white hover:text-red-500 transition-colors duration-300 uppercase italic">
            Nightkids
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/events" className="text-sm font-medium text-gray-300 hover:text-white transition-colors uppercase tracking-widest">
            Latest Events
          </Link>
          <Link href="/about" className="text-sm font-medium text-gray-300 hover:text-white transition-colors uppercase tracking-widest">
            About Us
          </Link>
          <Link href="/shop" className="text-sm font-medium text-gray-300 hover:text-white transition-colors uppercase tracking-widest opacity-50 cursor-not-allowed" title="Coming Soon">
            Shop
          </Link>
        </nav>

        {/* Mobile Menu Button place holder */}
        <div className="md:hidden">
            <button className="text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>
        </div>
      </div>
    </header>
  );
}
