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
                <div className="pt-24 md:pt-16"> {/* Adjusted padding to balance header clearance and bottom overlap */}
                    <h1 className="font-stencil text-3xl md:text-5xl lg:text-7xl text-foreground mb-8 tracking-wider leading-tight">

                        <span className="block text-yellow-400 mt-4">
                            GLAUBER ROCHA
                        </span>
                    </h1>

                    <div className="max-w-3xl mx-auto my-8">
                        <blockquote className="font-grotesque text-xl md:text-3xl text-foreground/90 italic border-l-4 border-primary pl-6">
                            "Uma câmera na mão e uma ideia na cabeça"
                        </blockquote>
                        <p className="mt-6 text-sm md:text-base text-foreground/80 leading-relaxed text-justify max-w-2xl mx-auto font-grotesque">
                            Glauber Rocha ainda divide o país entre quem o celebra e quem pouco o conhece. Nascido em Vitória da Conquista, levou a desigualdade brasileira às telas e moldou o Cinema Novo. Hoje, compositores como Gutemberg Vieira, Tarcísio Santos e Guigga Maraká resgatam seu lado poeta. Ao mesmo tempo, a falta de políticas de exibição impede que o cinema crítico, político e popular que Glauber defendia chegue ao público, permanecendo restrito a palcos, prêmios e discursos sobre sua importância.
                        </p>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-20">
                <div className="w-6 h-10 border-2 border-yellow-400 rounded-full flex items-start justify-center p-2">
                    <div className="w-1 h-3 bg-yellow-400 rounded-full animate-pulse" />
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
