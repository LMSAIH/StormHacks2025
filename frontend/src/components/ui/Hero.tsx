import { DottedMap } from "./dotted-map"
import { H1, Lead, P } from "./typography"
import { Button } from "./button"

const Hero = () => {
  return (
    <section
      id="platform"
      className="relative min-h-screen w-full overflow-hidden scroll-mt-28 lg:scroll-mt-36"
    >
      {/* Single Beautiful Dotted Map with Global Markers */}
      <div className="pointer-events-none absolute inset-0 opacity-100 transition-all duration-700">
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
          markerColor="#1976D2"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-3xl px-4 text-center sm:px-8">
          <div className="relative flex flex-col items-center text-center space-y-6">
            {/* Badge or Tag */}
            <div className="inline-flex items-center rounded-full border border-white/30 bg-background/20 px-4 py-1.5 backdrop-blur-sm shadow-[0_10px_30px_rgba(8,12,34,0.4)]">
              <P className="text-xs font-medium text-white/80 drop-shadow-[0_6px_18px_rgba(7,12,32,0.55)] sm:text-sm hover:cursor-default">
                Powered by Public Data
              </P>
            </div>

            {/* Main Heading */}
            <H1 className="leading-tight text-white drop-shadow-[0_18px_40px_rgba(15,23,42,0.6)] hover:cursor-default">
              Understand how
              <br />
              <span className="text-sky-200 drop-shadow-[0_12px_32px_rgba(15,23,42,0.65)] hover:cursor-default">
                building projects <span className="text-[#1976D2]">impact</span> communities
              </span>
            </H1>

            {/* Lead Paragraph */}
            <Lead className="mx-auto max-w-xl text-white/85 drop-shadow-[0_12px_28px_rgba(10,16,38,0.6)] hover:cursor-default">
              We analyze public data to reveal the real impact of building projects on neighborhoods and communities.
            </Lead>

            {/* Call-to-Action Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row">
              <Button
                size="lg"
                className="group relative overflow-hidden bg-primary px-8 py-6 text-base font-semibold text-primary-foreground shadow-lg transition-all hover:shadow-xl hover:shadow-primary/20"
              >
                <span className="relative z-10">Start Analyzing</span>
                <div className="absolute inset-0 -z-0 bg-gradient-to-r from-primary to-accent opacity-0 transition-opacity group-hover:opacity-100" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/60 bg-white/10 px-8 py-6 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                Learn More
              </Button>
            </div>

            {/* Additional Info */}
            <div className="pt-10 text-white/70 drop-shadow-[0_10px_24px_rgba(10,14,32,0.55)]">
              <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <P className="text-xs text-white/80 sm:text-sm">Real-time Data</P>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-accent" />
                  <P className="text-xs text-white/80 sm:text-sm">Clear Insights</P>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-chart-1" />
                  <P className="text-xs text-white/80 sm:text-sm">Community First</P>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

   </section>
  )
}

export { Hero }