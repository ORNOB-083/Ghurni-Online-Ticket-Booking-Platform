'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Star, Compass } from 'lucide-react';

const PopularRoutes = () => {
  const popularRoutes = [
    {
      id: 1,
      from: 'Dhaka',
      to: "Cox's Bazar",
      image: 'https://images.pexels.com/photos/1430676/pexels-photo-1430676.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Explore the longest unbroken sea beach in the world.',
    },
    {
      id: 2,
      from: 'Dhaka',
      to: 'Sylhet',
      image: 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Visit the majestic tea gardens & the shrine of Hazrat Shah Jalal.',
    },
    {
      id: 3,
      from: 'Dhaka',
      to: 'Sajek Valley',
      image: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Experience the breathtaking beauty of the hill tracts.',
    },
    {
      id: 4,
      from: 'Dhaka',
      to: 'Sundarbans',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Sundarban_Tiger.jpg/1280px-Sundarban_Tiger.jpg',
      description: "Witness the world's largest mangrove forest & Royal Bengal Tigers.",
    },
    {
      id: 5,
      from: 'Dhaka',
      to: 'Chittagong',
      image: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/06/75/bd/71.jpg',
      description: 'Discover the bustling port city and its beautiful hills.',
    },
    {
      id: 6,
      from: 'Dhaka',
      to: 'Bandarban',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcOIfGSWbZDZ7DTnHVNX-OHER8m-9IcEh5XUxhCzwHFdXSuOjSWz62b1S1&s=10',
      description: 'Find peace among the highest peaks of Bangladesh.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      },
    },
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-widest uppercase rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800">
          Top Destinations
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Popular Routes Across{' '}
          <span className="bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
            Bangladesh
          </span>
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-base">
          Discover the most loved destinations across the country and book your journey today.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {popularRoutes.map((route) => (
          <motion.div
            key={route.id}
            variants={itemVariants}
            whileHover={{ y: -6, boxShadow: "0px 16px 40px rgba(99, 102, 241, 0.15)" }}
            whileTap={{ scale: 0.96 }}
            className="group relative bg-white dark:bg-[#1a1d24] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-md cursor-pointer"
          >
            <div className="relative h-[320px] md:h-[340px] w-full overflow-hidden">
              <Image
                src={route.image}
                alt={`${route.from} to ${route.to}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-500" />

              <motion.div
                animate={{ rotate: [0, 5, 0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-amber-400 flex items-center gap-1.5 text-xs font-medium"
              >
                <Star className="w-3 h-3 fill-current" />
                Best Route
              </motion.div>

              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-auto flex items-center justify-center sm:justify-start gap-1 sm:gap-2 bg-black/50 backdrop-blur-md px-2 sm:px-3 py-1 rounded-full border border-white/10">
                <MapPin className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                <span className="text-white text-[10px] sm:text-sm font-medium truncate max-w-[45px] sm:max-w-none">
                  {route.from}
                </span>
                <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-400 flex-shrink-0" />
                <span className="text-white text-[10px] sm:text-sm font-medium truncate max-w-[45px] sm:max-w-none">
                  {route.to}
                </span>
              </div>
            </div>

            <motion.div
              initial={{ y: 60, opacity: 0 }}
              whileHover={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 bottom-0 p-5 pt-10 bg-gradient-to-t from-black/90 via-black/70 to-transparent"
            >
              <h3 className="text-white text-lg font-bold mb-1.5 flex items-center gap-2">
                <span>{route.from}</span>
                <ArrowRight className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>{route.to}</span>
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed line-clamp-2 mb-3">
                {route.description}
              </p>

              <Link
                href={`/tickets?from=${route.from}&to=${route.to}`}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors"
              >
                <Compass className="w-3 h-3" />
                Explore Route
              </Link>
            </motion.div>

            <div className="absolute bottom-4 left-4 right-4 sm:hidden group-hover:hidden block">
              <p className="text-white text-sm font-medium drop-shadow-md truncate">
                {route.from} → {route.to}
              </p>
            </div>

          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default PopularRoutes;