export default function AnimatedBackground() {
  return (
    <>
      {/* Grid */}

      <div
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e2e8f0 1px, transparent 1px),
            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
    />

      {/* Purple Glow */}

      <div
        className=" absolute left-0 top-20 h-125 w-125 rounded-full bg-primary/10 blur-[120px] animate-pulse"
      />

      <div
        className=" absolute right-0 bottom-0 h-125 w-125 rounded-full bg-primary/5 blur-[120px] animate-pulse
      "
      />
    </>
  );
}