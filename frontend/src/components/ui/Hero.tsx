import { lazy, Suspense } from "react"
import { H1, Lead, P } from "./typography"
import { Button } from "./button"

// Lazy load the DottedMap component
const DottedMap = lazy(() => import("./dotted-map").then(module => ({ default: module.DottedMap })))

const Hero = () => {
  return (
    <section
      id="platform"
      className="relative min-h-screen w-full overflow-hidden scroll-mt-28 bg-background lg:scroll-mt-36"
    >
      {/* Single Beautiful Dotted Map with Global Markers */}
      <div className="pointer-events-none absolute inset-0">
        <Suspense fallback={<div className="absolute inset-0" />}>
          <div className="animate-fade-in-dots">
            <DottedMap
              width={280}
              height={140}
              mapSamples={8000}
              dotRadius={0.50}
              className="text-foreground/30 transition-all duration-700"
              markers={[
                // Vancouver (Home - Featured)
                { lat: 49.2827, lng: -123.1207, size: 2 },
                
                // North America
                { lat: 37.7749, lng: -122.4194, size: 1 }, // San Francisco
                { lat: 40.7128, lng: -74.006, size: 1 },   // New York
                { lat: 43.6532, lng: -79.3832, size: 1 },  // Toronto
                { lat: 19.4326, lng: -99.1332, size: 1 },  // Mexico City
                
                // Europe
                { lat: 51.5074, lng: -0.1278, size: 1 },   // London
                { lat: 48.8566, lng: 2.3522, size: 1 },    // Paris
                { lat: 52.52, lng: 13.405, size: 1 },      // Berlin
                { lat: 41.9028, lng: 12.4964, size: 1 },   // Rome
                
                // Asia
                { lat: 35.6762, lng: 139.6503, size: 1.9 },  // Tokyo
                { lat: 37.5665, lng: 126.978, size: 1.7 },   // Seoul
                { lat: 22.3193, lng: 114.1694, size: 1.6 },  // Hong Kong
                { lat: 1.3521, lng: 103.8198, size: 1.6 },   // Singapore
                { lat: 28.6139, lng: 77.209, size: 1.5 },    // New Delhi
                
                // Oceania
                { lat: -33.8688, lng: 151.2093, size: 1 }, // Sydney
                { lat: -37.8136, lng: 144.9631, size: 1 }, // Melbourne
                
                // South America
                { lat: -23.5505, lng: -46.6333, size: 1 }, // São Paulo
                { lat: -34.6037, lng: -58.3816, size: 1 }, // Buenos Aires
                
                // Africa
                { lat: -33.9249, lng: 18.4241, size: 1 },  // Cape Town
                { lat: -1.2921, lng: 36.8219, size: 1 },   // Nairobi
              ]}
              markerColor="#64B5F6"
            />
          </div>
        </Suspense>
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto text-center max-w-3xl">
          {/* Badge or Tag */}
          <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-black/50 px-5 py-2 shadow-[0_12px_34px_-18px_rgba(0,0,0,0.75)] backdrop-blur-md">
            <div className="h-2 w-2 rounded-full bg-sky-300" />
            <P className="text-xs font-medium tracking-wide text-white/85 sm:text-sm">
              Powered by Public Data
            </P>
          </div>

          {/* Main Heading */}
          <H1 className="mb-6 text-white drop-shadow-[0_18px_40px_rgba(15,23,42,0.6)]">
            Understand how
            <br />
            <span className="text-[#64B5F6]">
              development projects <span className="font-bold">impact</span> communities
            </span>
          </H1>

          {/* Lead Paragraph */}
          <Lead className="mx-auto mb-12 max-w-2xl rounded-3xl bg-black/45 px-6 py-4 text-white shadow-[0_18px_45px_-22px_rgba(0,0,0,0.75)] backdrop-blur-md">
            We analyze public data to reveal the real impact of development projects on neighborhoods and communities.
          </Lead>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="group relative overflow-hidden rounded-full px-8 py-6 text-base font-semibold text-black shadow-lg transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_30px_70px_-28px_rgba(100,181,246,0.85)]"
            >
              <span className="relative z-10 tracking-wide">Start Analyzing</span>
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="border-2 rounded-full bg-background/50 px-8 py-6 text-base font-semibold backdrop-blur-sm transition-all hover:bg-accent/10"
            >
              Learn More
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-5 text-sm text-white/80">
            <div className="flex items-center gap-3 rounded-full bg-black/45 px-4 py-2 shadow-[0_12px_32px_-20px_rgba(0,0,0,0.75)] backdrop-blur-md">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <P className="text-xs font-medium text-white/85 sm:text-sm">Real-time Data</P>
            </div>
            <div className="flex items-center gap-3 rounded-full bg-black/45 px-4 py-2 shadow-[0_12px_32px_-20px_rgba(0,0,0,0.75)] backdrop-blur-md">
              <div className="h-2 w-2 rounded-full bg-accent" />
              <P className="text-xs font-medium text-white/85 sm:text-sm">Clear Insights</P>
            </div>
            <div className="flex items-center gap-3 rounded-full bg-black/45 px-4 py-2 shadow-[0_12px_32px_-20px_rgba(0,0,0,0.75)] backdrop-blur-md">
              <div className="h-2 w-2 rounded-full bg-chart-1" />
              <P className="text-xs font-medium text-white/85 sm:text-sm">Community First</P>
            </div>
          </div>
        </div>
      </div>

        </section>
    )
}

export { Hero }