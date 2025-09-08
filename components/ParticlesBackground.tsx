"use client";

import { useCallback } from "react";
import Particles from "react-tsparticles";
import type { Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";

export default function ParticlesBackground() {
    const particlesInit = useCallback(async (engine: Engine) => {
        await loadSlim(engine); // 👈 en lugar de loadFull
    }, []);

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            options={{
                background: {
                    color: { value: "#f8fafc" }, // color de fondo (puedes dejarlo transparente)
                },
                fpsLimit: 60,
                interactivity: {
                    events: {
                        onHover: { enable: true, mode: "repulse" }, // efecto repelente al pasar mouse
                        onClick: { enable: true, mode: "push" }, // agrega partículas al hacer click
                    },
                    modes: {
                        repulse: { distance: 100 },
                        push: { quantity: 4 },
                    },
                },
                particles: {
                    color: { value: "#38bdf8" }, // color de partículas (cyan-400)
                    links: {
                        enable: true,
                        color: "#94a3b8", // color de líneas
                        distance: 150,
                    },
                    move: {
                        enable: true,
                        speed: 2,
                    },
                    number: {
                        value: 100, // cantidad de partículas
                    },
                    opacity: { value: 0.5 },
                    shape: { type: "circle" },
                    size: { value: { min: 1, max: 4 } },
                },
                detectRetina: true,
            }}
        />
    );
}
