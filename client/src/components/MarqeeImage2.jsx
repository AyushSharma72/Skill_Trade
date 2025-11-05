"use client";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { Users, Heart, Globe, MessageSquare } from "lucide-react";


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

function MarqueeImages({ teamMembers }) {
  const topRef = useRef(null);
  const bottomRef = useRef(null);
  const [scrollDirection, setScrollDirection] = useState(1); // 1 = down, -1 = up
  const lastScrollY = useRef(0);
  const tripleImages = [...teamMembers, ...teamMembers, ...teamMembers];

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
    <div className="w-full overflow-hidden py-16 bg-gray-50">
      {/* Top Marquee */}
      <div
        className="relative mb-6"
        onMouseEnter={() => setTopHover(true)}
        onMouseLeave={() => setTopHover(false)}
      >
        <div className="absolute left-0 top-0 h-full w-20 md:w-40 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 h-full w-20 md:w-40 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none z-10" />
        <div className="flex">
          <div
            ref={topRef}
            className="flex gap-6"
            style={{
              width: "300%",
              willChange: "transform",
            }}
          >
            {/* {tripleImages.map((img, idx) => (
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
            ))} */}
            {tripleImages.map((member, index) => (
              <div
                key={`team-1-${index}`}
                className="group relative flex-shrink-0 w-80 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform "
              >
                {/* Card content */}
                <div className="relative z-10 p-8">
                  {/* Profile image */}
                  <div className="relative">
                    <div className="w-24 h-24 mx-auto relative">
                      {/* Animated ring */}
                      <div className="absolute inset-0 rounded-full scale-110 opacity-0 group-hover:opacity-60 group-hover:scale-125 transition-all duration-700"></div>
                      
                      {/* Profile image */}
                      <Image 
                        src={member.image}
                        alt={member.name}
                        width={96}
                        height={96}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                      />
                      
                      {/* Status indicator */}
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-600 rounded-full border-2 border-white shadow-md">
                        <div className="w-full h-full bg-green-600 rounded-full animate-ping opacity-75"></div>
                      </div>
                    </div>
                  </div>

                  {/* Member info */}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 transition-colors duration-300">
                      {member.name}
                    </h3>
                    <p className="text-gray-600 font-semibold mb-3 transition-colors duration-300">
                      {member.role}
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed transition-colors duration-300">
                      {member.bio}
                    </p>
                  </div>

                  {/* Social links */}
                  <div className="flex justify-center space-x-4">
                    {Object.entries(member.social).map(([platform, url], socialIndex) => (
                      <a
                        key={socialIndex}
                        href={url}
                        className="w-10 h-10 bg-gray-900 hover:bg-gray-800 rounded-xl flex items-center justify-center text-white transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        {platform === 'linkedin' && <Users className="w-5 h-5" />}
                        {platform === 'twitter' && <MessageSquare className="w-5 h-5" />}
                        {platform === 'github' && <Globe className="w-5 h-5" />}
                        {platform === 'dribbble' && <Heart className="w-5 h-5" />}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full group-hover:bg-gray-200 transition-colors duration-300"></div>
                <div className="absolute bottom-4 left-4 w-6 h-6 bg-gray-50 rounded-full group-hover:bg-gray-100 transition-colors duration-300"></div>
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