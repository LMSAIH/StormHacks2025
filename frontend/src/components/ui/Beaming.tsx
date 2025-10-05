"use client";
import React, { forwardRef, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/ui/shadcn-io/animated-beam";
import { FaUser, FaTree, FaNewspaper, FaPaintBrush, FaBuilding, FaBookOpen, FaChurch, FaToilet, FaTrain, FaSchool, FaFireExtinguisher } from "react-icons/fa";



const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode; label?: string }
>(({ className, children, label }, ref) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <div className="relative z-20">
      <div
        ref={ref}
        className={cn(
          "flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] cursor-pointer transition-transform hover:scale-110",
          className,
        )}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {children}
      </div>
      {showTooltip && label && (
        <div className="absolute left-1/2 -translate-x-1/2 -top-10 bg-black text-white text-sm px-3 py-1 rounded whitespace-nowrap z-50 pointer-events-none">
          {label}
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
        </div>
      )}
    </div>
  );
});
Circle.displayName = "Circle";

const Beaming = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const OpenDataRef = useRef<HTMLDivElement>(null);
    const PermitsRef = useRef<HTMLDivElement>(null);
    const ParksRef = useRef<HTMLDivElement>(null);
    const PublicArtRef = useRef<HTMLDivElement>(null);
    const CommunityCentreRef = useRef<HTMLDivElement>(null);
    const LibrariesRef = useRef<HTMLDivElement>(null);
    const CulturalSpacesRef = useRef<HTMLDivElement>(null);
    const PublicWashroomRef = useRef<HTMLDivElement>(null);
    const TransitStationsRef = useRef<HTMLDivElement>(null);
    const SchoolsRef = useRef<HTMLDivElement>(null);
    const FireHallsRef = useRef<HTMLDivElement>(null);
    const MapdRef = useRef<HTMLDivElement>(null);
    const UserRef = useRef<HTMLDivElement>(null);
  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden p-10"
      ref={containerRef}
    >
      {/* Beams layer - rendered first so they're underneath */}
      <div className="absolute inset-0 z-0">
        <AnimatedBeam
        containerRef={containerRef}
        fromRef={OpenDataRef}
        toRef={PermitsRef}
        duration={3}
        />
        <AnimatedBeam
        containerRef={containerRef}
        fromRef={OpenDataRef}
        toRef={ParksRef}
        duration={3}
        />
        <AnimatedBeam
        containerRef={containerRef}
        fromRef={OpenDataRef}
        toRef={PublicArtRef}
        duration={3}
        />
        <AnimatedBeam
        containerRef={containerRef}
        fromRef={OpenDataRef}
        toRef={CommunityCentreRef}
        duration={3}
        />
        <AnimatedBeam
        containerRef={containerRef}
        fromRef={OpenDataRef}
        toRef={LibrariesRef}
        duration={3}
        />
        <AnimatedBeam
        containerRef={containerRef}
        fromRef={OpenDataRef}
        toRef={CulturalSpacesRef}
        duration={3}
        />
        <AnimatedBeam
            containerRef={containerRef}
            fromRef={OpenDataRef}
            toRef={PublicWashroomRef}
            duration={3}
        />
        <AnimatedBeam
            containerRef={containerRef}
            fromRef={OpenDataRef}
            toRef={TransitStationsRef}
            duration={3}
        />
        <AnimatedBeam
            containerRef={containerRef}
            fromRef={OpenDataRef}
            toRef={SchoolsRef}
            duration={3}
        />
        <AnimatedBeam
            containerRef={containerRef}
            fromRef={OpenDataRef}
            toRef={FireHallsRef}
            duration={3}
        />
        <AnimatedBeam
            containerRef={containerRef}
            fromRef={PermitsRef}
            toRef={MapdRef}
            duration={3}
        />
        <AnimatedBeam
            containerRef={containerRef}
            fromRef={ParksRef}
            toRef={MapdRef}
            duration={3}
        />
        <AnimatedBeam
            containerRef={containerRef}
            fromRef={PublicArtRef}
            toRef={MapdRef}
            duration={3}
        />
        <AnimatedBeam
            containerRef={containerRef}
            fromRef={CommunityCentreRef}
            toRef={MapdRef}
            duration={3}
        />
        <AnimatedBeam
            containerRef={containerRef}
            fromRef={LibrariesRef}
            toRef={MapdRef}
            duration={3}
        />
        <AnimatedBeam
            containerRef={containerRef}
            fromRef={CulturalSpacesRef}
            toRef={MapdRef}
            duration={3}
        />
        <AnimatedBeam
            containerRef={containerRef}
            fromRef={PublicWashroomRef}
            toRef={MapdRef}
            duration={3}
        />
        <AnimatedBeam
            containerRef={containerRef}
            fromRef={TransitStationsRef}
            toRef={MapdRef}
            duration={3}
        />
        <AnimatedBeam
            containerRef={containerRef}
            fromRef={SchoolsRef}
            toRef={MapdRef}
            duration={3}
        />
        <AnimatedBeam
            containerRef={containerRef}
            fromRef={FireHallsRef}
            toRef={MapdRef}
            duration={3}
        />  
        <AnimatedBeam
            containerRef={containerRef}
            fromRef={MapdRef}
            toRef={UserRef}
            duration={3}
        />
      </div>

      {/* Circles layer - rendered on top with higher z-index */}
      <div className="flex size-full max-w-lg flex-row items-stretch justify-between gap-10 relative z-20">
        <div className="flex flex-col justify-center">
          <Circle ref={OpenDataRef} className="size-16" label="Vancouver Open Data">
            <img src="cityOfVancouver.svg" alt="City of Vancouver" className="size-full" />
          </Circle>
        </div>
        <div className="flex flex-col justify-center gap-2">
          <Circle ref={PermitsRef} label="Development Permits">
            <FaNewspaper size={75} className="text-black"/>
          </Circle>
          <Circle ref={ParksRef} label="Parks">
            <FaTree size={75} className="text-green-600"/>
          </Circle>
          <Circle ref={PublicArtRef} label="Public Art">
            <FaPaintBrush size={75} className="text-orange-900"/>
          </Circle>
          <Circle ref={CommunityCentreRef} label="Community Centres">
            <FaBuilding size={75} className="text-blue-600"/>
          </Circle>
          <Circle ref={LibrariesRef} label="Libraries">
            <FaBookOpen size={75} className="text-yellow-400"/>
          </Circle>
          <Circle ref={CulturalSpacesRef} label="Cultural Spaces">
            <FaChurch size={75} className="text-purple-600"/>
          </Circle>
          <Circle ref={PublicWashroomRef} label="Public Washrooms">
            <FaToilet size={75} className="text-gray-600"/>
          </Circle>
          <Circle ref={TransitStationsRef} label="Transit Stations">
            <FaTrain size={75} className="text-blue-600"/>
          </Circle>
          <Circle ref={SchoolsRef} label="Schools">
            <FaSchool size={75} className="text-yellow-300"/>
          </Circle>
          <Circle ref={FireHallsRef} label="Fire Halls">
            <FaFireExtinguisher size={75} className="text-red-800"/>
          </Circle>
        </div>
        <div className="flex flex-col justify-center">
          <Circle ref={MapdRef} className="size-16" label="MapD Platform">
            <img src="mapd.svg" alt="MapD Logo" className="size-full"/>
          </Circle>
        </div>
        <div className="flex flex-col justify-center">
          <Circle ref={UserRef} className="size-16" label="You">
            <FaUser size={75} className="text-black"/>
          </Circle>
        </div>
      </div>
    </div>
  );
};
export default Beaming;