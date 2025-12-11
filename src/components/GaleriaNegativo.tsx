import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import idadeDaTerra from "@/assets/idade-da-terra.jpg";
import leaoSeteCabecas from "@/assets/leao-sete-cabecas.jpg";
import dragaoMaldade from "@/assets/dragao-maldade.jpg";
import terraEmTranse from "@/assets/terra-em-transe.jpg";

import { useAudio } from "@/contexts/AudioContext";
import acervoAudio from "@/assets/acervo-theme.mp3";

import deusEOdiabo from "@/assets/deus-e-o-diabo.jpg";
import barravento from "@/assets/barravento.jpg";
import aliceDosAnjos from "@/assets/alice-dos-anjos.jpg";
import depoisDaChuva from "@/assets/depois-da-chuva.jpg";
import dia11 from "@/assets/dia-11.jpg";

// Placeholder data - replace with actual images and info
const productions = [
    {
        id: 1,
        title: "Terra em Transe",
        role: "Direção: Glauber Rocha",
        year: "1967",
        description: "Uma alegoria política sobre o poder e a corrupção em Eldorado.",
        image: terraEmTranse,
    },
    {
        id: 2,
        title: "Deus e o Diabo na Terra do Sol",
        role: "Direção: Glauber Rocha",
        year: "1964",
        description: "O marco do Cinema Novo que desafiou as convenções estéticas.",
        image: deusEOdiabo,
    },
    {
        id: 3,
        title: "Barravento",
        role: "Direção: Glauber Rocha",
        year: "1962",
        description: "A estreia que revelou a força mística e social da Bahia.",
        image: barravento,
    },
    {
        id: 4,
        title: "O Dragão da Maldade",
        role: "Direção: Glauber Rocha",
        year: "1969",
        description: "A cor explode na tela como arma revolucionária.",
        image: dragaoMaldade,
    },
    {
        id: 5,
        title: "A Idade da Terra",
        role: "Direção: Glauber Rocha",
        year: "1980",
        description: "O testamento cinematográfico e profético de Glauber.",
        image: idadeDaTerra,
    },
    {
        id: 6,
        title: "O Leão de Sete Cabeças",
        role: "Direção: Glauber Rocha",
        year: "1970",
        description: "Uma reflexão sobre o colonialismo e a revolução na África.",
        image: leaoSeteCabecas,
    },
    {
        id: 7,
        title: "Alice dos Anjos",
        role: "Direção: Daniel Leite Almeida",
        year: "2021",
        description: "Releitura de Alice no País das Maravilhas no sertão nordestino.",
        image: aliceDosAnjos,
    },
    {
        id: 8,
        title: "Depois da Chuva",
        role: "Direção: Marilia Hughes Guerreiro, Cláudio Marques",
        year: "2013",
        description: "Jovem de 16 anos vivencia a efervescência política das Diretas Já em Salvador (1984).",
        image: depoisDaChuva,
    },
    {
        id: 9,
        title: "Dia 11",
        role: "Direção: Pedro Rodrigues",
        year: "2024",
        description: "A tragédia de Santo Antonio de Jesus",
        image: dia11,
    },
];

const GaleriaNegativo = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const lastInteractionRef = useRef(0);
    const isHoveredRef = useRef(false);
    const isFocusedRef = useRef(false);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    // Audio Logic
    const { currentAudioId, playAudio, pauseAudio, isThemeMuted } = useAudio();
    const themeAudioId = "acervo-theme";
    const [isIntersecting, setIsIntersecting] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isMuted, setIsMuted] = useState(false);

    // Sync with global mute preference
    useEffect(() => {
        setIsMuted(isThemeMuted);
    }, [isThemeMuted]);

    // Intersection Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    setIsIntersecting(entry.isIntersecting);
                });
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) observer.unobserve(sectionRef.current);
        };
    }, []);

    // Scroll Direction Tracking
    const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY.current) {
                setScrollDirection('down');
            } else {
                setScrollDirection('up');
            }
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Audio Playback Logic
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        // If this section is visible and we aren't playing our theme yet, start it
        // This will take over from Ato4 or others
        // But if Act 4 is playing, ONLY take over if scrolling DOWN
        if (isIntersecting && currentAudioId !== themeAudioId) {
            const isAto4Playing = currentAudioId && currentAudioId.includes('ato4');
            const shouldTakeOver = !isAto4Playing || scrollDirection === 'down';

            if (shouldTakeOver) {
                playAudio(themeAudioId);
            }
        }
    }, [isIntersecting, playAudio, currentAudioId, scrollDirection]);

    // React to AudioContext changes
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (currentAudioId === themeAudioId) {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Audio play prevented:", error);
                });
            }
        } else {
            // If another audio took over (e.g. user scrolled back up to Ato 4), pause.
            // Or if Global Pause was triggered.
            audio.pause();
        }
    }, [currentAudioId]);

    // Sync Mute State
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.muted = isMuted;
        }
    }, [isMuted]);

    // Interval auto-scroll
    useEffect(() => {
        const interval = setInterval(() => {
            // Pause if user interacted recently OR is floating/focusing content
            if (
                Date.now() - lastInteractionRef.current < 4000 ||
                isHoveredRef.current ||
                isFocusedRef.current
            ) {
                return;
            }

            if (scrollContainerRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
                const maxScroll = scrollWidth - clientWidth;

                // Determine card width based on screen size (must match CSS: 85vw mobile, 600px desktop)
                // We add a small buffer or just use the exact logic
                const isMobile = window.innerWidth < 768;
                const scrollAmount = isMobile ? window.innerWidth * 0.85 : 600;

                // If currently at the end (within tolerance), reset to start
                if (Math.ceil(scrollLeft) >= maxScroll - 10) {
                    scrollContainerRef.current.scrollTo({
                        left: 0,
                        behavior: "smooth",
                    });
                } else {
                    // Otherwise, scroll forward but don't overshoot max
                    const newScrollLeft = Math.min(scrollLeft + scrollAmount, maxScroll);

                    scrollContainerRef.current.scrollTo({
                        left: newScrollLeft,
                        behavior: "smooth",
                    });
                }
            }
        }, 3000); // 3 seconds

        return () => clearInterval(interval);
    }, []);

    const scroll = (direction: "left" | "right") => {
        lastInteractionRef.current = Date.now();
        if (scrollContainerRef.current) {
            const scrollAmount = 400; // Adjust scroll amount
            const newScrollLeft =
                direction === "left"
                    ? scrollContainerRef.current.scrollLeft - scrollAmount
                    : scrollContainerRef.current.scrollLeft + scrollAmount;

            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: "smooth",
            });
        }
    };

    return (
        <section ref={sectionRef} className="relative bg-black py-20 overflow-hidden select-none">
            <audio
                ref={audioRef}
                src={acervoAudio}
                loop
                preload="auto"
                playsInline
            />
            {/* Light Table Effect Background */}
            <div className="absolute inset-0 bg-white/5 opacity-50 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none z-10" />

            <div className="container mx-auto px-4 mb-12 relative z-20 text-center">
                <h2 className="font-stencil text-4xl md:text-6xl text-accent mb-4 tracking-wider uppercase">
                    ACERVO GLAUBER & CONVIDADOS
                </h2>
                <p className="font-grotesque text-white/60 text-lg max-w-2xl mx-auto">
                    A cinematografia de Glauber Rocha e o catálogo de obras dos artistas que ele influenciou.
                </p>
            </div>

            {/* Film Strip Container */}
            <div className="relative w-full max-w-[1920px] mx-auto">
                {/* Navigation Arrows */}
                {showLeftArrow && (
                    <button
                        onClick={() => scroll("left")}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-primary/80 text-white p-3 rounded-full backdrop-blur-sm transition-all border border-white/20"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft size={32} />
                    </button>
                )}
                {showRightArrow && (
                    <button
                        onClick={() => scroll("right")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-primary/80 text-white p-3 rounded-full backdrop-blur-sm transition-all border border-white/20"
                        aria-label="Scroll right"
                    >
                        <ChevronRight size={32} />
                    </button>
                )}

                {/* The Film Strip */}
                <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    onMouseEnter={() => (isHoveredRef.current = true)}
                    onMouseLeave={() => (isHoveredRef.current = false)}
                    className="flex overflow-x-auto gap-0 pb-8 pt-8 px-4 md:px-20 hide-scrollbar snap-x snap-mandatory"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {/* Perforations Top */}
                    <div className="absolute top-0 left-0 right-0 h-8 bg-repeat-x z-20 pointer-events-none"
                        style={{
                            backgroundImage: `radial-gradient(circle, transparent 25%, black 26%)`,
                            backgroundSize: "20px 32px",
                            backgroundPosition: "0 0",
                            backgroundColor: "black"
                        }}
                    />

                    {/* Perforations Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-repeat-x z-20 pointer-events-none"
                        style={{
                            backgroundImage: `radial-gradient(circle, transparent 25%, black 26%)`,
                            backgroundSize: "20px 32px",
                            backgroundPosition: "0 0",
                            backgroundColor: "black"
                        }}
                    />

                    {productions.map((item) => (
                        <div
                            key={item.id}
                            className="relative flex-shrink-0 w-[85vw] md:w-[600px] snap-center group outline-none"
                            tabIndex={0}
                            onFocus={() => (isFocusedRef.current = true)}
                            onBlur={() => (isFocusedRef.current = false)}
                        >
                            {/* Frame Border (The Negative) */}
                            <div className="bg-black p-6 md:p-8 mx-[-1px] border-y-[16px] border-black relative">

                                {/* Perforation Holes Visuals (Pseudo-holes on the strip itself for continuity) */}
                                <div className="absolute top-[-16px] left-0 right-0 h-[16px] flex justify-between px-2 overflow-hidden">
                                    {Array.from({ length: 20 }).map((_, i) => (
                                        <div key={i} className="w-3 h-4 bg-white/10 rounded-sm" />
                                    ))}
                                </div>
                                <div className="absolute bottom-[-16px] left-0 right-0 h-[16px] flex justify-between px-2 overflow-hidden">
                                    {Array.from({ length: 20 }).map((_, i) => (
                                        <div key={i} className="w-3 h-4 bg-white/10 rounded-sm" />
                                    ))}
                                </div>


                                {/* Content Container (The Image Area) */}
                                <div className="relative aspect-video bg-zinc-900 overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_50px_rgba(255,255,255,0.1)] group-focus:shadow-[0_0_50px_rgba(255,255,255,0.1)] transition-all duration-500">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-500 grayscale group-hover:grayscale-0 group-focus:grayscale-0"
                                    />

                                    {/* Overlay Info */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 md:p-6">
                                        <div className="transform translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 md:group-focus:translate-y-0 transition-transform duration-300">
                                            <span className="inline-block px-1.5 py-0.5 md:px-2 md:py-1 bg-primary text-black text-[10px] md:text-xs font-bold mb-1 md:mb-2 font-stencil">
                                                {item.year}
                                            </span>
                                            <h3 className="text-sm md:text-3xl font-stencil text-white mb-0.5 md:mb-1 leading-tight">
                                                {item.title}
                                            </h3>
                                            <p className="text-yellow-400 font-grotesque text-[10px] md:text-sm mb-1 md:mb-2 uppercase tracking-widest line-clamp-1">
                                                {item.role}
                                            </p>
                                            <p className="text-white/80 font-grotesque text-[10px] md:text-base line-clamp-2 md:line-clamp-3 leading-snug">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Frame Number */}
                                <div className="absolute top-2 right-4 text-white/30 font-mono text-xs rotate-90 origin-right">
                                    {item.id}A
                                </div>
                                <div className="absolute bottom-2 left-4 text-white/30 font-mono text-xs -rotate-90 origin-left">
                                    KODAK 400
                                </div>

                            </div>
                        </div>
                    ))}

                    {/* Empty spacer for end of scroll */}
                    <div className="w-[10vw] flex-shrink-0 bg-black" />
                </div>
            </div>

            <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </section>
    );
};

export default GaleriaNegativo;
