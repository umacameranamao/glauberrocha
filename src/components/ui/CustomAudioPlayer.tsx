import { useState, useRef, useEffect } from 'react';
import { useAudio } from '@/contexts/AudioContext';

interface CustomAudioPlayerProps {
    src: string;
    caption?: string;
}

const CustomAudioPlayer = ({ src, caption }: CustomAudioPlayerProps) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    // Use global audio context to manage exclusive playback
    const { currentAudioId, playAudio, pauseAudio } = useAudio();

    // Effect to pause this player if another audio starts playing
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        // If another audio is the current one, pause this one
        if (currentAudioId && currentAudioId !== src) {
            audio.pause();
        }
    }, [currentAudioId, src]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateProgress = () => {
            setProgress(audio.currentTime);
        };

        const setAudioDuration = () => {
            setDuration(audio.duration);
        };

        const handleEnded = () => {
            pauseAudio(); // Reset global state
        };

        const handlePlayEvent = () => setIsPlaying(true);
        const handlePauseEvent = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('loadedmetadata', setAudioDuration);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('play', handlePlayEvent);
        audio.addEventListener('pause', handlePauseEvent);

        // Check if metadata is already loaded
        if (audio.readyState >= 1) {
            setDuration(audio.duration);
        }

        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('loadedmetadata', setAudioDuration);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('play', handlePlayEvent);
            audio.removeEventListener('pause', handlePauseEvent);
        };
    }, []);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
            pauseAudio(); // Notify context
        } else {
            // Stop others and play this one
            playAudio(src);
            audio.play().catch(e => console.error("Playback failed:", e));
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        if (!audio) return;
        const newTime = Number(e.target.value);
        audio.currentTime = newTime;
        setProgress(newTime);
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="w-full max-w-md mx-auto my-8">
            <audio ref={audioRef} src={src} />

            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                    <button
                        onClick={togglePlay}
                        className="p-2 rounded-full hover:bg-yellow-400/10 transition-colors text-yellow-400"
                        title={isPlaying ? "Pausar" : "Tocar"}
                    >
                        {isPlaying ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                <rect x="6" y="4" width="4" height="16"></rect>
                                <rect x="14" y="4" width="4" height="16"></rect>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                        )}
                    </button>

                    <div className="flex-1 flex flex-col">
                        <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            value={progress}
                            onChange={handleSeek}
                            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-yellow-400 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-yellow-400 [&::-webkit-slider-thumb]:rounded-full"
                        />
                        <div className="flex justify-between text-xs text-yellow-400/60 mt-1 font-mono">
                            <span>{formatTime(progress)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>
                </div>

                {caption && (
                    <p className="text-center text-sm text-yellow-400/80 font-grotesque italic mt-2">
                        {caption}
                    </p>
                )}
            </div>
        </div>
    );
};

export default CustomAudioPlayer;
