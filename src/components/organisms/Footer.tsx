import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-orange-50 border-t border-orange-100 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* App info section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-orange-900">
              Halo Journal
            </h3>
            <p className="text-sm text-orange-700">
              Your personal space to reflect on your thoughts, track your
              emotional journey, and gain insights from your daily experiences.
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-orange-900">
              Quick Links
            </h3>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/dashboard"
                className="text-sm text-orange-700 hover:text-orange-500 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/journal/write"
                className="text-sm text-orange-700 hover:text-orange-500 transition-colors"
              >
                Write New Entry
              </Link>
            </nav>
          </div>

          {/* Legal section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-orange-900">Legal</h3>
            <nav className="flex flex-col space-y-2">
              <Link
                href="#"
                className="text-sm text-orange-700 hover:text-orange-500 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-sm text-orange-700 hover:text-orange-500 transition-colors"
              >
                Terms of Use
              </Link>
            </nav>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-orange-100 my-8"></div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-orange-700">
          <p>© {new Date().getFullYear()} Halo Journal. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Made with 💗 by Trishan</p>
        </div>
      </div>
    </footer>
  );
}
