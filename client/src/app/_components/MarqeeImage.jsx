"use client";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";

const images = [
  { src: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e", alt: "Electrician working on wiring" },
  { src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64", alt: "Plumber fixing pipes" },
  { src: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407", alt: "Carpenter working with wood" },
  { src: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f", alt: "House painting service" },
  { src: "https://images.unsplash.com/photo-1581578731548-c64695cc6952", alt: "Home renovation work" },
  { src: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39", alt: "Professional service worker" },
  { src: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b", alt: "Home maintenance tools" },
];

const tripleImages = [...images, ...images, ...images];

function useSmoothMarquee(ref, baseDirection = "left", scrollDirection = 1) {
  // px per second at normal and slow speeds
  const baseSpeed = 80;
  const normalSpeed = (baseDirection === "left" ? -baseSpeed : baseSpeed) * scrollDirection;
  const slowSpeed = (baseDirection === "left" ? -26 : 26) * scrollDirection;

  const speed = useRef(normalSpeed);
  const targetSpeed = useRef(normalSpeed);
  const pos = useRef(0);
  const lastTime = useRef(performance.now());
  const animFrame = useRef();

  // Update speed when scroll direction changes
  useEffect(() => {
    const newNormalSpeed = (baseDirection === "left" ? -baseSpeed : baseSpeed) * scrollDirection;
    const newSlowSpeed = (baseDirection === "left" ? -26 : 26) * scrollDirection;
    
    targetSpeed.current = targetSpeed.current === speed.current ? newNormalSpeed : newSlowSpeed;
  }, [scrollDirection, baseDirection]);

  // Smoothly interpolate speed
  function animate() {
    const now = performance.now();
    const dt = (now - lastTime.current) / 1000;
    lastTime.current = now;

    // Smooth speed change
    speed.current += (targetSpeed.current - speed.current) * 0.08;

    pos.current += speed.current * dt;

    // Loop logic (assume 1/3 width is one cycle)
    if (ref.current) {
      const marqueeWidth = ref.current.offsetWidth / 3;
      
      // Handle both directions properly
      if (speed.current < 0) {
        // Moving left
        if (pos.current <= -marqueeWidth) pos.current += marqueeWidth;
      } else {
        // Moving right
        if (pos.current >= 0) pos.current -= marqueeWidth;
      }
      
      ref.current.style.transform = `translateX(${pos.current}px)`;
    }
    animFrame.current = requestAnimationFrame(animate);
  }

  useEffect(() => {
    lastTime.current = performance.now();
    animFrame.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame.current);
    // eslint-disable-next-line
  }, []);

  // Handlers
  const setHover = (hovered) => {
    const newNormalSpeed = (baseDirection === "left" ? -baseSpeed : baseSpeed) * scrollDirection;
    const newSlowSpeed = (baseDirection === "left" ? -26 : 26) * scrollDirection;
    targetSpeed.current = hovered ? newSlowSpeed : newNormalSpeed;
  };

  return setHover;
}

function MarqueeImages() {
  const topRef = useRef(null);
  const bottomRef = useRef(null);
  const [scrollDirection, setScrollDirection] = useState(1); // 1 = down, -1 = up
  const lastScrollY = useRef(0);

  // Handle scroll direction detection
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const direction = currentScrollY > lastScrollY.current ? 1 : -1;
      
      // Only update if direction actually changed
      if (direction !== scrollDirection) {
        setScrollDirection(direction);
      }
      
      lastScrollY.current = currentScrollY;
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [scrollDirection]);

  // Fixed: Top and bottom move in OPPOSITE directions
  const setTopHover = useSmoothMarquee(topRef, "left", scrollDirection);
  const setBottomHover = useSmoothMarquee(bottomRef, "left", -scrollDirection); // Notice: same baseDirection but opposite scrollDirection

  return (
    <div className="w-full overflow-hidden py-8">
      {/* Top Marquee */}
      <div
        className="relative mb-6"
        onMouseEnter={() => setTopHover(true)}
        onMouseLeave={() => setTopHover(false)}
      >
        <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
        <div className="flex">
          <div
            ref={topRef}
            className="flex gap-6"
            style={{
              width: "300%",
              willChange: "transform",
            }}
          >
            {tripleImages.map((img, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-64 h-52 sm:w-72 sm:h-56 md:w-80 md:h-60 lg:w-88 lg:h-64 rounded-xl overflow-hidden shadow-xl border border-gray-700"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-all duration-300 hover:brightness-110"
                  draggable={false}
                  width={352}
                  height={224}
                  loading="lazy"
                  quality={85}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Deleted the bottom maquee as requested */}
      
      <style jsx>{`
        .w-88 {
          width: 22rem;
        }
        .h-56 {
          height: 14rem;
        }
      `}</style>
    </div>
  );
}

export default MarqueeImages; 