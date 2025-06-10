
"use client";
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
  const [visibleItems, setVisibleItems] = useState<boolean[]>([]);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
    setVisibleItems(new Array(data.length).fill(false));
  }, [ref, data.length]);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -20% 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const index = parseInt(entry.target.getAttribute('data-index') || '0');
        if (entry.isIntersecting) {
          setVisibleItems(prev => {
            const updated = [...prev];
            updated[index] = true;
            return updated;
          });
        }
      });
    }, observerOptions);

    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  const getProgressHeight = () => {
    const visibleCount = visibleItems.filter(Boolean).length;
    return (visibleCount / data.length) * 100;
  };

  return (
    <div
      className="w-full bg-white dark:bg-neutral-950 font-sans"
      ref={containerRef}
    >
      <div ref={ref} className="relative max-w-7xl mx-auto pb-12">
        {data.map((item, index) => (
          <div
            key={index}
            className={`timeline-item flex justify-start pt-8 md:pt-24 transition-all duration-700 ease-out ${
              visibleItems[index] 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
            data-index={index}
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white dark:bg-black flex items-center justify-center">
                <div className={`h-4 w-4 rounded-full border border-neutral-300 dark:border-neutral-700 p-2 transition-all duration-500 ${
                  visibleItems[index] 
                    ? 'bg-gradient-to-t from-purple-500 via-blue-500 to-transparent scale-110' 
                    : 'bg-neutral-200 dark:bg-neutral-800'
                }`} />
              </div>
              <h3 className="hidden md:block text-[30px] md:pl-20 font-bold text-neutral-500 dark:text-neutral-500">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden block text-[30px] mb-4 text-left font-bold text-neutral-500 dark:text-neutral-500">
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <div
            className="absolute inset-x-0 top-0 w-[2px] transition-all duration-1000 ease-out"
            style={{
              height: `${getProgressHeight()}%`,
              background: 'linear-gradient(to top, #8b5cf6 0%, #3b82f6 50%, transparent 100%)'
            }}
          />
        </div>
      </div>
    </div>
  );
};
