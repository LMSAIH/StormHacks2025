import { Hero } from "../components/ui/Hero";
import Impact from "../components/ui/Impact";
import { Navbar } from "../components/ui/Navbar";
import Solutions from "../components/ui/Solutions";
import Footer from "../components/ui/Footer";


const Home = () => {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-background text-foreground">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/60 to-background" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/8 via-transparent to-accent/8" />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-background/40 to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--background)/0.2),transparent_70%)]" />
            </div>

            <div className="relative z-10 flex flex-col">
                <Navbar />
                <Hero />
                <Solutions  />
                <Impact />
                <Footer />
            </div>
        </div>
    )
}


export default Home;