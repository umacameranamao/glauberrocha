import { useEffect, useRef, useState } from "react";
import { useAudio } from "@/contexts/AudioContext";
import videoSrc from "@/assets/video.mp4";

const VideoDestaque = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { currentAudioId, playAudio, pauseAudio } = useAudio();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const myAudioId = "custom-video-destaque";

  // Pause video if another audio/video starts playing globally
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (currentAudioId && currentAudioId !== myAudioId && !video.paused) {
      video.pause();
      setIsPlaying(false);
    }
  }, [currentAudioId]);

  // Sync seekbar and track duration/metadata
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      setProgress(video.currentTime);
    };

    const setVideoDuration = () => {
      setDuration(video.duration);
    };

    const handlePlayEvent = () => setIsPlaying(true);
    const handlePauseEvent = () => setIsPlaying(false);

    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("loadedmetadata", setVideoDuration);
    video.addEventListener("play", handlePlayEvent);
    video.addEventListener("pause", handlePauseEvent);

    if (video.readyState >= 1) {
      setDuration(video.duration);
    }

    return () => {
      video.removeEventListener("timeupdate", updateProgress);
      video.removeEventListener("loadedmetadata", setVideoDuration);
      video.removeEventListener("play", handlePlayEvent);
      video.removeEventListener("pause", handlePauseEvent);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
      if (currentAudioId === myAudioId) {
        pauseAudio();
      }
    } else {
      playAudio(myAudioId);
      video.play().catch((e) => console.error("Video playback failed:", e));
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const newTime = Number(e.target.value);
    video.currentTime = newTime;
    setProgress(newTime);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen().catch((e) => console.error("Fullscreen failed:", e));
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <section id="audiovisual" className="relative bg-black py-20 overflow-hidden select-none">
      {/* Light Table Effect Background (matching GaleriaNegativo) */}
      <div className="absolute inset-0 bg-white/5 opacity-50 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none z-10" />

      {/* Film Strip Container (matching GaleriaNegativo max-w) */}
      <div className="relative w-full max-w-[1920px] mx-auto">
        
        {/* The Film Strip wrapper with matching padding and styling */}
        <div className="relative pb-8 pt-8 px-4 md:px-20">
          
          {/* Perforations Top */}
          <div 
            className="absolute top-0 left-0 right-0 h-8 bg-repeat-x z-20 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle, transparent 25%, black 26%)`,
              backgroundSize: "20px 32px",
              backgroundPosition: "0 0",
              backgroundColor: "black"
            }}
          />

          {/* Perforations Bottom */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-8 bg-repeat-x z-20 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle, transparent 25%, black 26%)`,
              backgroundSize: "20px 32px",
              backgroundPosition: "0 0",
              backgroundColor: "black"
            }}
          />

          {/* Centered Act Header (matching styling guidelines and act header patterns) */}
          <div className="text-center mb-16 relative z-30">
            <h2 className="font-stencil text-3xl md:text-5xl lg:text-7xl text-yellow-400 tracking-wider uppercase">
              AUDIOVISUAL
            </h2>
            <div className="w-24 h-1 bg-yellow-400 mx-auto mt-6" />
          </div>

          {/* Single Giant Film Frame (matching GaleriaNegativo but scaled up) */}
          <div className="relative w-full max-w-[820px] mx-auto group outline-none animate-fade-in">
            
            {/* Frame Border (The Negative) */}
            <div className="bg-black p-6 md:p-8 mx-[-1px] border-y-[16px] border-black relative">
              
              {/* Perforation Holes Visuals */}
              <div className="absolute top-[-16px] left-0 right-0 h-[16px] flex justify-between px-2 overflow-hidden">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="w-3 h-4 bg-white/10 rounded-sm flex-shrink-0" />
                ))}
              </div>
              
              <div className="absolute bottom-[-16px] left-0 right-0 h-[16px] flex justify-between px-2 overflow-hidden">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="w-3 h-4 bg-white/10 rounded-sm flex-shrink-0" />
                ))}
              </div>

              {/* Content Container (The Video Area) */}
              <div className="relative aspect-video bg-zinc-900 overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_50px_rgba(255,255,255,0.1)] transition-all duration-500">
                <video
                  ref={videoRef}
                  src={videoSrc}
                  preload="metadata"
                  onClick={togglePlay}
                  className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-500 cursor-pointer"
                />
              </div>

              {/* Custom Yellow Controller Bar (matching CustomAudioPlayer layout and colors) */}
              <div className="mt-6 border-t border-yellow-400/10 pt-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-4">
                    
                    {/* Play/Pause Button */}
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

                    {/* Progress Seekbar & Times */}
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

                    {/* Mute and Fullscreen Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={toggleMute}
                        className="p-2 rounded-full hover:bg-yellow-400/10 transition-colors text-yellow-400"
                        title={isMuted ? "Desativar Mudo" : "Ativar Mudo"}
                      >
                        {isMuted ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="1" y1="1" x2="23" y2="23"></line>
                            <path d="M9 9v6a3 3 0 0 0 3 3h1.586l4.707 4.707A1 1 0 0 0 20 22V4a1 1 0 0 0-1.707-.707L13.586 8H12a3 3 0 0 0-3 3z"></path>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                          </svg>
                        )}
                      </button>

                      <button
                        onClick={toggleFullscreen}
                        className="p-2 rounded-full hover:bg-yellow-400/10 transition-colors text-yellow-400"
                        title="Tela Cheia"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                        </svg>
                      </button>
                    </div>

                  </div>
                </div>
              </div>

              {/* Frame Number */}
              <div className="absolute top-2 right-4 text-white/30 font-mono text-xs rotate-90 origin-right">
                01A
              </div>
              <div className="absolute bottom-2 left-4 text-white/30 font-mono text-xs -rotate-90 origin-left">
                KODAK 400
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default VideoDestaque;
