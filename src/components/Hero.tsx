import { useEffect, useState } from "react";
import heroImage from "@/assets/glauber-hero.jpg";

const Hero = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 300);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section
            id="hero"
            className="relative min-h-screen flex items-center justify-center overflow-hidden film-grain"
        >
            {/* Background cinematográfico */}
            <div
                className="absolute inset-0 bg-cover bg-center cinematic-zoom"
                style={{ backgroundImage: `url(${heroImage})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-background" />
            </div>

            {/* Conteúdo */}
            <div className={`relative z-10 text-center px-4 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}>
                <h1 className="font-stencil text-4xl md:text-6xl lg:text-8xl text-foreground mb-8 tracking-wider leading-tight camera-shake">
                    GLAUBER ROCHA
                    <span className="block text-primary mt-4">
                        título
                    </span>
                </h1>

                <div className="max-w-3xl mx-auto my-12">
                    <blockquote className="font-grotesque text-xl md:text-3xl text-foreground/90 italic border-l-4 border-primary pl-6">
                        "Uma câmera na mão e uma ideia na cabeça"
                    </blockquote>
                </div>

            </div>

            {/* Indicador de scroll */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-20">
                <div className="w-6 h-10 border-2 border-primary rounded-full flex items-start justify-center p-2">
                    <div className="w-1 h-3 bg-primary rounded-full animate-pulse" />
                </div>
            </div>

            {/* Efeito de película nas bordas */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-repeat-x opacity-20"
                style={{
                    backgroundImage: `repeating-linear-gradient(90deg, 
            transparent, 
            transparent 10px, 
            hsl(var(--primary)) 10px, 
            hsl(var(--primary)) 12px)`
                }}
            />
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-repeat-x opacity-20"
                style={{
                    backgroundImage: `repeating-linear-gradient(90deg, 
            transparent, 
            transparent 10px, 
            hsl(var(--primary)) 10px, 
            hsl(var(--primary)) 12px)`
                }}
            />
        </section >
    );
};

export default Hero;
