// src/components/ParticleBackground.jsx
import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function ParticleBackground() {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: false }, // Disable fullScreen to constrain to hero section
        particles: {
          number: { value: 60, density: { enable: true, value_area: 800 } },
          color: { value: ["#059669", "#34D399", "#F97316"] }, // Greenpact green and orange tones
          shape: { type: "circle" },
          size: { value: { min: 1, max: 3 }, random: true },
          move: {
            enable: true,
            speed: { min: 0.8, max: 2.5 }, // Smooth, flowing motion
            direction: "none",
            random: true,
            out_mode: "out",
          },
          opacity: {
            value: { min: 0.3, max: 0.7 },
            random: true,
            anim: { enable: true, speed: 1.5, opacity_min: 0.1 },
          },
          links: {
            enable: true,
            distance: 100,
            color: "#34D399",
            opacity: 0.5,
            width: 1,
          },
        },
        interactivity: {
          events: {
            onhover: { enable: true, mode: "grab" },
            onclick: { enable: true, mode: "push" },
            resize: true,
          },
          modes: {
            grab: { distance: 180, links: { opacity: 0.7 } },
            push: { quantity: 3 },
          },
        },
        background: {
          color: {
            value: "linear-gradient(135deg, #022c22 0%, #064e3b 100%)", // Dark green gradient
          },
        },
        retina_detect: true,
        fpsLimit: 60,
      }}
    />
  );
}
