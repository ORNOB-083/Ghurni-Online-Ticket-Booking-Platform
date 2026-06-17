import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, ExternalLink, Lock } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-50 dark:bg-[#0f1117] border-t border-gray-200 dark:border-gray-800 pt-12 pb-6 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">

                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-3">
                            <Image
                                src="/Image/Logo.png"
                                alt="Ghurni Logo"
                                width={32}
                                height={32}
                                className="rounded-lg object-contain"
                            />
                            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
                                Ghurni
                            </span>
                        </Link>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            Book bus, train, launch & flight tickets easily with Ghurni. Your journey, our priority.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/tickets" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                    All Tickets
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                    About
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                            Contact Info
                        </h3>
                        <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                            <li className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                                <span>support@ghurni.com</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                                <span>+880 1234 567890</span>
                            </li>
                            <li>
                                <Link
                                    href="https://facebook.com"
                                    target="_blank"
                                    className="flex items-center gap-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                >
                                    <ExternalLink className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                                    <span>Facebook Page</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                            Payment Methods
                        </h3>
                        <div className="flex items-center gap-2">
                            <Lock className="w-4 h-4 text-green-500 dark:text-green-400" />
                            <span className="px-3 py-1 bg-gray-200 dark:bg-gray-800 rounded text-xs font-medium text-gray-700 dark:text-gray-300">
                                Stripe
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-600 mt-2">
                            Secure payments via Stripe. We do not store your card details.
                        </p>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                        © {new Date().getFullYear()} Ghurni. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <Link href="/privacy" className="text-xs text-gray-500 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-xs text-gray-500 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;