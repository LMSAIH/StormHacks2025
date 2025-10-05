import { lazy } from "react"
import { H1, Lead, P } from "./typography"
import { Button } from "./button"

// Lazy load the DottedMap component
const DottedMap = lazy(() => import("./dotted-map").then(module => ({ default: module.DottedMap })))

const Hero = () => {
  return (
    <section id="platform" className="relative min-h-screen w-full overflow-hidden group">
      {/* Single Beautiful Dotted Map with Global Markers */}
      <div className="absolute inset-0">
          <div className="animate-fade-in-dots">
            <DottedMap
              width={280}
              height={140}
              mapSamples={3000}
              dotRadius={0.40}
              className="text-foreground/20 group-hover:text-foreground/60 transition-colors duration-700"
        />
          </div>
      </div>

      {/* Radial gradient for spotlight effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_100%)] transition-all duration-700 group-hover:bg-[radial-gradient(ellipse_at_center,transparent_30%,transparent_100%)]" />

      {/* Content Container */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 pt-20 sm:px-6 lg:px-8">
        <div className="mx-auto text-center max-w-3xl">
          {/* Badge or Tag */}
          <div className="mb-6 inline-flex items-center rounded-full border border-border bg-muted/50 px-4 py-1.5 backdrop-blur-sm">
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
          <Lead className="mx-auto mb-10 max-w-xl text-muted-foreground border-2 bg-background/50 rounded-lg backdrop-blur-sm" >
            We analyze public data to reveal the real impact of development projects on neighborhoods and communities.
          </Lead>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="group relative overflow-hidden bg-primary px-8 py-6 text-base font-semibold text-primary-foreground shadow-lg transition-all hover:shadow-xl hover:shadow-primary/20"
            >
              <span className="relative z-10">Start Analyzing</span>
              <div className="absolute inset-0 -z-0 bg-gradient-to-r from-primary to-accent opacity-0 transition-opacity" />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="border-2 bg-background/50 px-8 py-6 text-base font-semibold backdrop-blur-sm transition-all hover:bg-accent/10"
            >
              Learn More
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <P className="text-xs sm:text-sm">Real-time Data</P>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-accent" />
              <P className="text-xs sm:text-sm">Clear Insights</P>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-chart-1" />
              <P className="text-xs sm:text-sm">Community First</P>
            </div>
          </div>
        </div>
      </div>

   </section>
  )
}

export { Hero }