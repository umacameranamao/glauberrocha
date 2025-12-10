import { useAudio } from "@/contexts/AudioContext";
import { Volume2, VolumeX } from "lucide-react";

const FloatingMuteButton = () => {
    const { isThemeMuted, setIsThemeMuted } = useAudio();

    return (
        <button
            onClick={() => setIsThemeMuted(!isThemeMuted)}
            className="fixed bottom-8 right-8 z-50 p-4 rounded-full bg-yellow-400 text-black shadow-lg hover:scale-110 transition-transform"
            title={isThemeMuted ? "Ativar som" : "Desativar som"}
        >
            {isThemeMuted ? (
                <VolumeX size={24} />
            ) : (
                <Volume2 size={24} />
            )}
        </button>
    );
};

export default FloatingMuteButton;
