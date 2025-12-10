import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AudioContextType {
    currentAudioId: string | null;
    playAudio: (id: string) => void;
    pauseAudio: () => void;
    isThemeMuted: boolean;
    setIsThemeMuted: (muted: boolean) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
    const [currentAudioId, setCurrentAudioId] = useState<string | null>(null);
    const [isThemeMuted, setIsThemeMuted] = useState(false);

    const playAudio = (id: string) => {
        if (currentAudioId !== id) {
            setCurrentAudioId(id);
        }
    };

    const pauseAudio = () => {
        setCurrentAudioId(null);
    };

    return (
        <AudioContext.Provider value={{ currentAudioId, playAudio, pauseAudio, isThemeMuted, setIsThemeMuted }}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (context === undefined) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
};
