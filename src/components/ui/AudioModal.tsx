import { useState, useEffect } from "react";
import { useAudio } from "@/contexts/AudioContext";

const AudioModal = () => {
    const [isOpen, setIsOpen] = useState(true);
    const { setIsThemeMuted } = useAudio();

    const handleProceed = () => {
        setIsThemeMuted(false);
        setIsOpen(false);
    };

    const handleNotNow = () => {
        setIsThemeMuted(true);
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-card border-2 border-primary/20 rounded-xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />

                <h2 className="font-stencil text-2xl text-primary mb-4">Experiência Sonora</h2>

                <p className="font-grotesque text-lg text-foreground/90 mb-8 leading-relaxed">
                    A trilha sonora é parte essencial da experiência do site. Use fones de ouvido ou ligue suas caixas de som.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={handleProceed}
                        className="px-6 py-2 rounded-lg bg-yellow-400 text-black font-stencil tracking-wide hover:opacity-90 transition-opacity shadow-lg shadow-yellow-400/20 uppercase"
                    >
                        PROSSEGUIR
                    </button>
                    <button
                        onClick={handleNotNow}
                        className="px-6 py-2 rounded-lg bg-red-600 text-white font-stencil tracking-wide hover:bg-red-700 transition-colors shadow-lg uppercase"
                    >
                        AGORA NÃO
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AudioModal;
