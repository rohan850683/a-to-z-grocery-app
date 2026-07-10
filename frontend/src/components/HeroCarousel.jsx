import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const slides = [
  {
    title: 'Groceries in 10 minutes',
    subtitle: 'Fresh veggies, dairy & daily essentials delivered lightning fast.',
    cta: 'Shop Groceries',
    to: '/category/groceries',
    bg: 'from-forest-500 to-forest-700',
    emoji: '🥬',
  },
  {
    title: 'Celebrate with Cakes',
    subtitle: 'Freshly baked cakes for every occasion, delivered same day.',
    cta: 'Order a Cake',
    to: '/category/cake',
    bg: 'from-chili-500 to-chili-600',
    emoji: '🎂',
  },
  {
    title: 'Chill with Cold Drinks',
    subtitle: 'Ice-cold beverages and juices at your doorstep.',
    cta: 'Grab a Drink',
    to: '/category/cold-drinks',
    bg: 'from-mango-500 to-mango-600',
    emoji: '🥤',
  },
  {
    title: 'Pamper your Pets',
    subtitle: 'Quality pet food and treats they will love.',
    cta: 'Shop Pet Food',
    to: '/category/pet-food',
    bg: 'from-forest-600 to-forest-800',
    emoji: '🐾',
  },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4200);
    return () => clearInterval(t);
  }, []);

  const slide = slides[index];

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-cardHover h-[280px] sm:h-[340px] md:h-[400px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className={`absolute inset-0 bg-gradient-to-br ${slide.bg} flex items-center`}
        >
          <div className="container-app grid grid-cols-1 md:grid-cols-2 items-center gap-4 w-full">
            <div className="text-white z-10">
              <span className="inline-block bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold mb-3">
                A to Z Exclusive
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                {slide.title}
              </h2>
              <p className="mt-3 text-white/85 max-w-md text-sm sm:text-base">{slide.subtitle}</p>
              <Link
                to={slide.to}
                className="inline-block mt-5 bg-white text-forest-700 font-bold rounded-full px-6 py-3 hover:scale-105 transition-transform"
              >
                {slide.cta}
              </Link>
            </div>
            <div className="hidden md:flex justify-center items-center">
              <span className="text-[10rem] animate-floaty drop-shadow-2xl">{slide.emoji}</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === index ? 'w-8 bg-white' : 'w-2 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
