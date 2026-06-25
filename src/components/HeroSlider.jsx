'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, ArrowRight, Bus, Train, Ship, Plane } from 'lucide-react';

const transportTypes = [
  { label: 'All', value: '', icon: Search },
  { label: 'Bus', value: 'bus', icon: Bus },
  { label: 'Train', value: 'train', icon: Train },
  { label: 'Launch', value: 'launch', icon: Ship },
  { label: 'Plane', value: 'plane', icon: Plane },
];

const slides = [
  {
    id: 1,
    title: 'Explore Bangladesh',
    highlight: 'with Ghurni',
    subtitle: "From the beaches of Cox's Bazar to the hills of Bandarban — book your journey in minutes.",
    image: 'https://images.unsplash.com/photo-1608958435020-e8a7109ba809?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y294cyUyMGJhemFyfGVufDB8fDB8fHww',
  },
  //https://images.unsplash.com/photo-1619177383949-f03975e50b19?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
  {
    id: 2,
    title: 'Fast & Secure',
    highlight: 'Ticket Booking',
    subtitle: 'Book bus, train, launch, and plane tickets seamlessly with real-time availability.',
    image: 'https://images.pexels.com/photos/1430676/pexels-photo-1430676.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    id: 3,
    title: 'Your Journey,',
    highlight: 'Our Priority',
    subtitle: 'Real-time tracking, secure Stripe payments, and 24/7 customer support — always with you.',
    image: 'https://d2u0ktu8omkpf6.cloudfront.net/deab5d531957d73a0057d50d32f3babf269ef1c1fca30044.jpg',
  },
  {
    id: 4,
    title: 'Discover the',
    highlight: 'Sundarbans',
    subtitle: "Witness the world's largest mangrove forest. Book your launch ticket today.",
    image: 'https://images.pexels.com/photos/975771/pexels-photo-975771.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
  {
    id: 5,
    title: 'Adventure',
    highlight: 'Awaits You',
    subtitle: 'Start your next adventure with just a few clicks. Affordable tickets, every destination.',
    image: 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
];

const HeroSlider = () => {
  const router = useRouter();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [transport, setTransport] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    if (transport) params.set('type', transport);
    router.push(`/tickets?${params.toString()}`);
  };

  return (
    <div className="relative w-full h-[680px] md:h-[780px] overflow-hidden">

      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="w-full h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative w-full h-full">
            <div className="absolute inset-0 w-full h-full">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="absolute inset-0 z-20 flex flex-col md:justify-center justify-start px-6 sm:px-12 lg:px-20 pt-24 md:pt-0 pb-32 md:pb-0">
        <div className="max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-2xl space-y-4"
            >

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/80 text-xs font-medium"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Bangladesh&apos;s #1 Ticket Platform
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
              >
                {slides[activeIndex]?.title}{' '}
                <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                  {slides[activeIndex]?.highlight}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-base md:text-lg text-gray-300 max-w-lg leading-relaxed"
              >
                {slides[activeIndex]?.subtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex items-center gap-3 pt-2"
              >
                <button
                  onClick={() => router.push('/tickets')}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-violet-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all duration-300"
                >
                  Browse Tickets
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => router.push('/about')}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold hover:bg-white/20 transition-all duration-300"
                >
                  Learn More
                </button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute bottom-10 left-0 right-0 z-30 px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-2 mb-3 px-1">
            {transportTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setTransport(type.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${transport === type.value
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                  : 'bg-white/10 backdrop-blur-md text-white/70 hover:bg-white/20 border border-white/10'
                  }`}
              >
                <type.icon className="w-3 h-3" />
                {type.label}
              </button>
            ))}
          </div>

          <div className="bg-white/95 dark:bg-[#0f1117]/90 backdrop-blur-xl rounded-2xl p-3 shadow-2xl shadow-black/30 border border-white/20 dark:border-gray-800">
            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row items-center gap-2"
            >

              <div className="flex-1 w-full relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <MapPin className="w-4 h-4 text-indigo-500" />
                </div>
                <input
                  type="text"
                  placeholder="From (e.g. Dhaka)"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all"
                />
              </div>

              <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 flex-shrink-0">
                <ArrowRight className="w-3.5 h-3.5 text-indigo-500" />
              </div>

              <div className="flex-1 w-full relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <MapPin className="w-4 h-4 text-cyan-500" />
                </div>
                <input
                  type="text"
                  placeholder="To (e.g. Cox's Bazar)"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:from-indigo-500 hover:to-violet-400 transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </form>
          </div>
        </motion.div>
      </div>

      <div className="absolute top-20 right-6 z-40 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white text-xs font-medium">
        <span className="text-indigo-400">{activeIndex + 1}</span>
        <span className="text-white/30">/</span>
        <span>{slides.length}</span>
      </div>

    </div>
  );
};

export default HeroSlider;