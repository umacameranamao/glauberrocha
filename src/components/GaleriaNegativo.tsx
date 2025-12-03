import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Placeholder data - replace with actual images and info
const productions = [
    {
        id: 1,
        title: "Terra em Transe",
        role: "Direção",
        year: "1967",
        description: "Uma alegoria política sobre o poder e a corrupção em Eldorado.",
        image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop", // Placeholder
    },
    {
        id: 2,
        title: "Deus e o Diabo",
        role: "Roteiro",
        year: "1964",
        description: "O marco do Cinema Novo que desafiou as convenções estéticas.",
        image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2025&auto=format&fit=crop", // Placeholder
    },
    {
        id: 3,
        title: "Barravento",
        role: "Direção",
        year: "1962",
        description: "A estreia que revelou a força mística e social da Bahia.",
        image: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?q=80&w=2028&auto=format&fit=crop", // Placeholder
    },
    {
        id: 4,
        title: "O Dragão da Maldade",
        role: "Direção",
        year: "1969",
        description: "A cor explode na tela como arma revolucionária.",
        image: "https://images.unsplash.com/photo-1478720568477-152d9b164e63?q=80&w=2098&auto=format&fit=crop", // Placeholder
    },
    {
        id: 5,
        title: "A Idade da Terra",
        role: "Direção",
        year: "1980",
        description: "O testamento cinematográfico e profético de Glauber.",
        image: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=2056&auto=format&fit=crop", // Placeholder
    },
];

const GaleriaNegativo = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    const scroll = (direction: "left" | "right") => {
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
        <section className="relative bg-black py-20 overflow-hidden select-none">
            {/* Light Table Effect Background */}
            <div className="absolute inset-0 bg-white/5 opacity-50 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none z-10" />

            <div className="container mx-auto px-4 mb-12 relative z-20 text-center">
                <h2 className="font-stencil text-4xl md:text-6xl text-accent mb-4 tracking-wider uppercase">
                    Galeria Glauberiana
                </h2>
                <p className="font-grotesque text-white/60 text-lg max-w-2xl mx-auto">
                    Um mergulho nos frames que construíram a história do cinema nacional.
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
                            className="relative flex-shrink-0 w-[85vw] md:w-[600px] snap-center group"
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
                                <div className="relative aspect-video bg-zinc-900 overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_50px_rgba(255,255,255,0.1)] transition-all duration-500">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 grayscale group-hover:grayscale-0"
                                    />

                                    {/* Overlay Info */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            <span className="inline-block px-2 py-1 bg-primary text-black text-xs font-bold mb-2 font-stencil">
                                                {item.year}
                                            </span>
                                            <h3 className="text-2xl md:text-3xl font-stencil text-white mb-1">
                                                {item.title}
                                            </h3>
                                            <p className="text-primary font-grotesque text-sm mb-2 uppercase tracking-widest">
                                                {item.role}
                                            </p>
                                            <p className="text-white/80 font-grotesque text-sm md:text-base line-clamp-2">
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
