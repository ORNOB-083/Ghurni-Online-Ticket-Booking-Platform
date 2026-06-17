"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";

const Navbar = () => {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("ghurni-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialDark = saved === "dark" || (!saved && prefersDark);
    setIsDark(initialDark);
    if (initialDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("ghurni-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("ghurni-theme", "light");
    }
  };

  const isTransparent = pathname === "/" && !scrolled;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "All Tickets", href: "/tickets" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  return (
    <>
      <nav
        className={`
          fixed top-0 left-0 right-0 z-50 w-full
          transition-all duration-500 ease-in-out
          ${
            isTransparent
              ? "bg-transparent border-b border-white/10"
              : "bg-white dark:bg-[#0f1117] backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-800"
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/Image/Logo.png"
                alt="Ghurni Logo"
                width={36}
                height={36}
                className="rounded-lg object-contain"
              />
              <span className="text-xl md:text-4xl font-bold bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
                Ghurni
              </span>
            </Link>

            <div className="hidden md:flex items-center justify-center flex-1 mx-8">
              <div
                className={`
                  flex items-center space-x-1 rounded-full p-1
                  transition-all duration-500
                  ${isTransparent && isDark
                    ? "bg-white/10 backdrop-blur-sm"
                    : isTransparent && !isDark
                    ? "bg-black/10 backdrop-blur-sm"
                    : "bg-gray-100 dark:bg-gray-800/60"
                  }
                `}
              >
                {navLinks.map((link) => {
                  const isActive =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`
                        px-4 py-2 text-sm font-medium rounded-full transition-all duration-300
                        ${isActive
                          ? "text-white bg-gradient-to-r from-indigo-600 to-indigo-500 shadow-md shadow-indigo-300/30"
                          : isTransparent && isDark
                          ? "text-white/90 hover:text-white hover:bg-white/20"
                          : isTransparent && !isDark
                          ? "text-gray-800 hover:text-indigo-600 hover:bg-black/10"
                          : "text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-gray-700"
                        }
                      `}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="hidden md:flex items-center gap-3">

              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-all duration-200 ${
                  isTransparent && isDark
                    ? "text-white/90 hover:text-white hover:bg-white/20"
                    : isTransparent && !isDark
                    ? "text-gray-800 hover:bg-black/10"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <Link
                href="/auth/signin"
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  isTransparent && isDark
                    ? "text-white hover:bg-white/20"
                    : isTransparent && !isDark
                    ? "text-gray-800 hover:text-indigo-600 hover:bg-black/10"
                    : "text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                Login
              </Link>

              <Link
                href="/auth/signup"
                className="px-5 py-2 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-indigo-600 to-violet-500 shadow-md shadow-indigo-300/25 hover:shadow-indigo-400/40 hover:from-indigo-500 hover:to-violet-400 transition-all duration-200"
              >
                Register
              </Link>
            </div>

            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-colors ${
                  isTransparent && isDark
                    ? "text-white hover:bg-white/20"
                    : isTransparent && !isDark
                    ? "text-gray-800 hover:bg-black/10"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-full transition-colors ${
                  isTransparent && isDark
                    ? "text-white hover:bg-white/20"
                    : isTransparent && !isDark
                    ? "text-gray-800 hover:bg-black/10"
                    : "text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center gap-1.5">
                  <span className={`w-5 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
                  <span className={`w-5 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`} />
                  <span className={`w-5 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
                </div>
              </button>
            </div>

          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden bg-white dark:bg-[#0f1117] border-t border-gray-200 dark:border-gray-800 shadow-lg overflow-hidden"
            >
              <div className="px-4 py-5 space-y-2">
                {navLinks.map((link) => {
                  const isActive =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                        isActive
                          ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-l-4 border-indigo-500"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}

                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-2">
                  <Link
                    href="/auth/signin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full py-3 text-center text-sm font-medium rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full py-3 text-center text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 text-white shadow-md"
                  >
                    Register
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;