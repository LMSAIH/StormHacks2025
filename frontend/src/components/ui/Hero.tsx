import { lazy } from "react"
import { H1, Lead, P } from "./typography"
import { Button } from "./button"
import { Link } from "react-router-dom"

// Lazy load the DottedMap component
const DottedMap = lazy(() => import("./dotted-map").then(module => ({ default: module.DottedMap })))

const Hero = () => {
  return (
    <section id="platform" className="relative w-full overflow-hidden group">
      {/* Single Beautiful Dotted Map with Global Markers */}
      <div className="absolute inset-0">
          <div className="animate-fade-in-dots">
            <DottedMap
              width={280}
              height={140}
              mapSamples={3000}
              dotRadius={0.40}
              className="text-foreground/20 group-hover:text-foreground/60 transition-colors duration-700 scale-200 sm:scale-100"
        />
          </div>
      </div>

      {/* Radial gradient for spotlight effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_100%)] transition-all duration-700 group-hover:bg-[radial-gradient(ellipse_at_center,transparent_30%,transparent_100%)]" />

      {/* Faded gradient background at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-primary/10 via-accent/10 to-transparent pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 flex items-center justify-center px-4 pt-30 pb-10 sm:pb-30 sm:px-6 lg:px-8">
        <div className="mx-auto text-center max-w-3xl">
          {/* Badge or Tag */}
          <div className="mb-4 inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1 backdrop-blur-sm">
            <P className="text-xs font-medium text-muted-foreground sm:text-sm">
            Powered by Public Data
            </P>
          </div>

          {/* Main Heading */}
          <H1 className="mb-6 bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
            Visualize how
            <br />
            <span className="text-blue-200">
              development projects impact communities
            </span>
          </H1>

          {/* Lead Paragraph */}
          <Lead className="mx-auto mb-10 max-w-xl text-neutral-100" >
            We analyze public data to reveal the real impact of development projects on neighborhoods and communities.
          </Lead>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-row items-center justify-center gap-4 ">
            <Button
              size="lg"
              className="group relative overflow-hidden bg-primary px-6 py-4 sm:px-8 sm:py-6 text-sm sm:text-base font-semibold text-primary-foreground shadow-lg transition-all hover:shadow-xl hover:shadow-primary/20"
              asChild
            >
              <Link to="/Visualization">
                <span className="relative z-10">Start Analyzing</span>
                <div className="absolute inset-0 -z-0 bg-gradient-to-r from-primary to-accent opacity-0 transition-opacity" />
              </Link>
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="border-2 bg-background/50 px-6 py-4 sm:px-8 sm:py-6 text-sm sm:text-base font-semibold backdrop-blur-sm transition-all hover:bg-accent/10"
              asChild
            >
              <Link to="#solutions">Learn More</Link>
            </Button>
          </div>

        </div>
      </div>

   </section>
  )
}

export { Hero }