import { useEffect, useRef, useState } from "react";


declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}

const Ato1Bahia = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isIntersecting, setIsIntersecting] = useState(false);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true); // Start muted to avoid autoplay issues

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const playerRef = useRef<any>(null);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 300);
        return () => clearTimeout(timer);
    }, []);

    // Initialize Audio
    useEffect(() => {
        audioRef.current = new Audio("/audio/theme.mp3");
        audioRef.current.loop = true;
        audioRef.current.volume = 0;

        return () => {
            audioRef.current?.pause();
            audioRef.current = null;
        };
    }, []);

    // Intersection Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    setIsIntersecting(entry.isIntersecting);
                });
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) observer.unobserve(sectionRef.current);
        };
    }, []);

    // Load YouTube API
    useEffect(() => {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        }

        window.onYouTubeIframeAPIReady = () => {
            initializePlayer();
        };

        if (window.YT && window.YT.Player) {
            initializePlayer();
        }

        function initializePlayer() {
            playerRef.current = new window.YT.Player('youtube-player', {
                events: {
                    'onStateChange': onPlayerStateChange
                }
            });
        }

        function onPlayerStateChange(event: any) {
            // 1 = Playing, 2 = Paused, 0 = Ended
            if (event.data === 1) {
                setIsVideoPlaying(true);
            } else if (event.data === 2 || event.data === 0) {
                setIsVideoPlaying(false);
            }
        }
    }, []);

    // Manage Audio Volume
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isIntersecting && !isVideoPlaying && !isMuted) {
            audio.play().catch(() => {
                console.log("Autoplay blocked");
                setIsMuted(true); // Force mute state if autoplay fails
            });
            fadeAudio(audio, 1);
        } else {
            // Fade out if not intersecting OR if video is playing OR if muted
            fadeAudio(audio, 0, () => {
                if (!isIntersecting || isMuted) audio.pause();
            });
        }
    }, [isIntersecting, isVideoPlaying, isMuted]);

    const fadeAudio = (audio: HTMLAudioElement | null, targetVolume: number, callback?: () => void) => {
        if (!audio) return;

        const step = 0.1;
        const interval = setInterval(() => {
            if (!audio) {
                clearInterval(interval);
                return;
            }
            const current = audio.volume;
            if (Math.abs(current - targetVolume) < step) {
                audio.volume = targetVolume;
                clearInterval(interval);
                if (callback) callback();
            } else if (current < targetVolume) {
                audio.volume = Math.min(1, current + step);
            } else {
                audio.volume = Math.max(0, current - step);
            }
        }, 100);
    };

    return (
        <section
            ref={sectionRef}
            id="ato1"
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background py-20"
        >
            {/* Audio Control */}
            <button
                onClick={() => setIsMuted(!isMuted)}
                className="fixed bottom-8 right-8 z-50 p-4 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-110 transition-transform"
                title={isMuted ? "Ativar som" : "Desativar som"}
            >
                {isMuted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>
                )}
            </button>
            {/* Background texture */}
            <div className="absolute inset-0 film-grain opacity-10" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="mb-16 text-center">
                        <h2 className="font-stencil text-5xl md:text-7xl text-primary mb-6 tracking-wider">
                            A CENA POP
                        </h2>
                    </div>

                    {/* Conteúdo Principal */}
                    <div className="space-y-24">

                        {/* Seção Bahia */}
                        {/* Seção Bahia */}
                        <div className="space-y-12">
                            <div className="max-w-3xl mx-auto space-y-6">
                                <p className="font-grotesque text-lg text-foreground/80 leading-relaxed text-justify">
                                    O Bahia, conhecido por incorporar elementos da cultura baiana em suas ações e uniformes,
                                    lançou em agosto de 2025 o terceiro uniforme da temporada 2025/26 em homenagem a Glauber Rocha.
                                </p>
                                <p className="font-grotesque text-lg text-foreground/80 leading-relaxed text-justify">
                                    A camisa, em tom vinho, é inspirada no clássico <span className="italic text-primary">Deus e o Diabo na Terra do Sol</span> (1964)
                                    e traz sóis estampados na parte frontal, acompanhados do slogan:
                                    <span className="block mt-4 pl-4 border-l-2 border-primary italic text-foreground text-left">
                                        "O que a Bahia filmou eu carrego no passo. Arte é revolução e o Sol tá do meu lado."
                                    </span>
                                </p>
                            </div>
                            <div className="relative group w-full max-w-4xl mx-auto aspect-video rounded-xl overflow-hidden shadow-2xl border-2 border-primary/30">
                                <iframe
                                    id="youtube-player"
                                    className="w-full h-full"
                                    src="https://www.youtube.com/embed/aOz4mtnuKrI?enablejsapi=1"
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>

                        {/* Seção BaianaSystem */}
                        {/* Seção BaianaSystem */}
                        <div className="space-y-8">
                            <div className="max-w-3xl mx-auto text-left space-y-6">
                                <div className="prose prose-lg prose-invert">
                                    <p className="font-grotesque text-lg text-foreground/80 leading-relaxed text-justify">
                                        A conexão com Glauber também aparece na música <span className="font-bold text-accent">“A Mosca”</span>,
                                        parceria de BaianaSystem com Tropkillaz, Dog Murras e Vandal. A letra cita diretamente o filme —
                                        <span className="italic"> “Come on! Era Deus e o diabo na terra do sol”</span> — e mais adiante menciona o próprio
                                        Glauber ao relacioná-lo a um cenário de caos e revolução:
                                        <span className="italic"> “Com um louva-a-deus abrindo os braços soltando um rojão, eu me lembro de Glauber Rocha.”</span>
                                    </p>
                                </div>
                            </div>

                            {/* Citação Destacada */}
                            <div className="max-w-4xl mx-auto">
                                <div className="bg-card/50 backdrop-blur-sm border-l-4 border-primary p-6 rounded-r-xl">
                                    <p className="font-grotesque text-xl text-foreground italic mb-2">
                                        "Quero a nossa cultura em primeiro lugar. Primeiro lugar."
                                    </p>
                                    <p className="text-sm text-accent font-stencil tracking-widest uppercase">
                                        — Baiana System
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Seção Reportagem/Análise */}
                        <div className="max-w-3xl mx-auto text-left space-y-6">
                            <h3 className="font-stencil text-3xl text-primary mb-6 tracking-wider">Perspectivas</h3>
                            <div className="prose prose-lg prose-invert">
                                <p className="font-grotesque text-lg text-foreground/80 leading-relaxed">
                                    Uma possibilidade de abordagem para a reportagem é entrevistar os compositores e intérpretes da música,
                                    para entender o que motivou essas referências e como eles enxergam a relação entre BaianaSystem e os ideais glauberianos.
                                    Nomes acessíveis seriam Roberto Barreto, compositor da banda, ou Vandal, que interpreta a faixa.
                                </p>
                                <p className="font-grotesque text-lg text-foreground/80 leading-relaxed">
                                    Outra linha possível é entrevistar o filho de Glauber Rocha, para compreender como ele interpreta essas homenagens
                                    e até que ponto elas refletem a visão e o legado do diretor.
                                </p>
                                <p className="font-grotesque text-lg text-foreground/80 leading-relaxed font-semibold text-accent">
                                    Os trechos da música reforçam valores que dialogam com o pensamento de Glauber Rocha.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default Ato1Bahia;
