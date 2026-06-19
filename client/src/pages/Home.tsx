import AnimatedBackground from "../components/home/AnimatedBackground";
import Hero from "../components/home/Hero";
import Navbar from "../components/home/Navbar";

export default function Home() {
  return (
    <div className=" relative min-h-screen overflow-hidden bg-linear-to-br from-background via-background to-primary/5 text-foreground ">
      <AnimatedBackground />
      {/* <Navbar /> */}
      <main
        className=" relative z-10 mx-auto max-w-7xl px-8 "
      >
        <Hero />
      </main>
    </div>
  );
}