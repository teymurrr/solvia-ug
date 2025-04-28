
"use client";
import {
  useMotionValueEvent,
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ 
  data
}: { 
  data: TimelineEntry[]
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  // Adjusted scroll trigger points to start earlier and end at bottom third
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 33%"], // Start earlier, end when last item is 1/3 from bottom
  });

  // Smoother height transform with more interpolation points
  const heightTransform = useTransform(
    scrollYProgress,
    [0, 0.1, 0.9, 1],
    [0, height * 0.2, height * 0.95, height]
    // Removed the invalid ease: "linear" option that was causing the TypeScript error
  );

  return (
    <div
      ref={containerRef}
      className="w-full bg-white dark:bg-neutral-950 font-sans"
    >
      <div ref={ref} className="relative max-w-7xl mx-auto pb-12">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start gap-12 pt-12 md:pt-24"
          >
            {/* Static title container - removed sticky positioning */}
            <div className="hidden md:flex flex-col items-start min-w-[200px]">
              <h3 className="text-[30px] font-bold text-neutral-500 dark:text-neutral-500">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 md:pl-4 pr-4 w-full">
              {/* Mobile title - static */}
              <h3 className="md:hidden text-[30px] mb-4 text-left font-bold text-neutral-500 dark:text-neutral-500">
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}

        {/* Progress bar with smooth animation */}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute left-8 md:left-[116px] top-0 w-[2px] bg-neutral-200 dark:bg-neutral-700"
        >
          <motion.div
            style={{
              height: heightTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full"
            transition={{ duration: 0.1 }} // Quick response to scroll
          />
        </div>
      </div>
    </div>
  );
};
