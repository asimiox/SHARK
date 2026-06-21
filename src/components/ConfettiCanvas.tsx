import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  rotationX: number;
  rotationXSpeed: number;
}

export default function ConfettiCanvas({ duration = 30000 }: { duration?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let isRunning = true;
    const particles: Particle[] = [];
    const startTime = Date.now();

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Warm luxury golds, crisp silvers, and metallic platinum shades
    const colors = [
      "rgba(255, 215, 0, ",  // Gold
      "rgba(212, 175, 55, ",  // Metallic Gold
      "rgba(197, 160, 89, ",  // Bronze Gold
      "rgba(230, 230, 230, ",  // Platinum
      "rgba(255, 255, 255, ",  // Crisp White
      "rgba(178, 190, 195, ",  // Soft Silver
    ];

    const createParticle = (): Particle => {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * -60 - 20, // slightly above the screen
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: Math.random() * 2 + 1.2, // slow, graceful descent
        speedX: Math.random() * 1.2 - 0.6,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 1.5 - 0.75,
        opacity: Math.random() * 0.4 + 0.6, // glints between 0.6 and 1.0 opacity
        rotationX: Math.random() * 360,
        rotationXSpeed: Math.random() * 2 - 1,
      };
    };

    // Populate initial screen with some falling particles too for immediate richness
    for (let i = 0; i < 40; i++) {
      const p = createParticle();
      p.y = Math.random() * canvas.height; // scatter across current view
      particles.push(p);
    }

    const tick = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const elapsed = Date.now() - startTime;
      const canGenerate = elapsed < duration;

      // Keep spawning particles to maintain a beautiful dense shower
      if (canGenerate && particles.length < 180) {
        particles.push(createParticle());
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;
        p.rotationX += p.rotationXSpeed;

        // Add physical organic movement (gentle horizontal wind)
        p.speedX += Math.sin(Date.now() / 1500 + p.y / 80) * 0.015;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);

        // Simulate 3D flipping in space
        const cosX = Math.cos((p.rotationX * Math.PI) / 180);
        ctx.scale(1, cosX);

        ctx.fillStyle = p.color + p.opacity + ")";
        ctx.beginPath();

        // 3 elegant geometric shapes: circles (stars), rectangles (ribbons), diamonds (sparkles)
        if (p.size % 3 === 0) {
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        } else if (p.size % 3 === 1) {
          ctx.fillRect(-p.size / 2, -p.size, p.size, p.size * 1.8);
        } else {
          ctx.moveTo(0, -p.size);
          ctx.lineTo(p.size, 0);
          ctx.lineTo(0, p.size);
          ctx.lineTo(-p.size, 0);
          ctx.closePath();
        }
        
        ctx.fill();
        ctx.restore();

        // Recycle particle
        if (p.y > canvas.height || p.x < -20 || p.x > canvas.width + 20) {
          if (canGenerate) {
            particles[i] = createParticle();
          } else {
            particles.splice(i, 1);
            i--;
          }
        }
      }

      if (isRunning && (particles.length > 0 || canGenerate)) {
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    tick();

    return () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [duration]);

  return (
    <canvas
      ref={canvasRef}
      id="confetti-canvas"
      className="absolute inset-0 w-full h-full pointer-events-none z-50 block"
    />
  );
}
