import { useEffect, useRef, useState } from "react";
import themeAudio from "@/assets/theme.mp3";
import CustomAudioPlayer from "@/components/ui/CustomAudioPlayer";
import glauberImage from "@/assets/glauberorcha.jpg";

declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}

import { useAudio } from "@/contexts/AudioContext"; // Import context hook
import tarcisioAudio from "@/assets/interpretacao-tarcisio.mp3";

const Ato1Bahia = () => {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [autoplayBlocked, setAutoplayBlocked] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const playerRef = useRef<any>(null);

    // Context for global audio management
    const { currentAudioId, playAudio, pauseAudio, isThemeMuted } = useAudio();
    const themeAudioId = "theme";

    const audioTriggerRef = useRef<HTMLParagraphElement | null>(null);

    // Sync with global mute preference (e.g. from Modal)
    useEffect(() => {
        setIsMuted(isThemeMuted);
    }, [isThemeMuted]);

    // Initial Fade In Animation
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 300);
        return () => clearTimeout(timer);
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

        if (audioTriggerRef.current) {
            observer.observe(audioTriggerRef.current);
        }

        return () => {
            if (audioTriggerRef.current) observer.unobserve(audioTriggerRef.current);
        };
    }, []);

    // Audio Logic
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        let fadeOutInterval: number | undefined;

        // Function to safely play audio
        const attemptPlay = async () => {
            // Only play if this is the current active audio OR no other audio is playing
            if (currentAudioId && currentAudioId !== themeAudioId) return;

            try {
                audio.volume = 1; // Prepare volume
                await audio.play();
                if (currentAudioId !== themeAudioId) {
                    playAudio(themeAudioId);
                }
                setAutoplayBlocked(false);
                // setIsMuted(false); // REMOVED: Do not force unmute. Respect user preference.
            } catch (err) {
                console.warn("Autoplay blocked:", err);
                setAutoplayBlocked(true);
                // setIsMuted(true); // REMOVED: Do not force mute on block.
            }
        };

        const fadeOut = () => {
            if (fadeOutInterval) clearInterval(fadeOutInterval);

            // Only fade out if it's actually playing
            if (audio.paused) return;

            fadeOutInterval = window.setInterval(() => {
                if (audio.volume > 0.1) {
                    audio.volume -= 0.1;
                } else {
                    audio.pause();
                    audio.volume = 1; // Reset for next play
                    clearInterval(fadeOutInterval);
                    if (currentAudioId === themeAudioId) {
                        pauseAudio();
                    }
                }
            }, 100);
        };

        // If another audio takes over, pause immediatelly (no fade for responsiveness)
        if (currentAudioId && currentAudioId !== themeAudioId) {
            console.log(`[Ato1] Pausing theme because currentAudioId is ${currentAudioId}`);
            audio.pause();
            return;
        }

        // Logic for intersection / video state / blocked state
        if (isIntersecting && !isVideoPlaying && !autoplayBlocked && (!currentAudioId || currentAudioId === themeAudioId)) {
            if (fadeOutInterval) clearInterval(fadeOutInterval);
            audio.volume = 1;
            attemptPlay();
        } else {
            fadeOut();
        }

        return () => {
            if (fadeOutInterval) clearInterval(fadeOutInterval);
        };
    }, [isIntersecting, isVideoPlaying, autoplayBlocked, currentAudioId, playAudio, pauseAudio]);

    // Retry on interaction if blocked
    useEffect(() => {
        if (autoplayBlocked) {
            const handleInteraction = () => {
                const audio = audioRef.current;
                if (audio && (isIntersecting && !isVideoPlaying && (!currentAudioId || currentAudioId === themeAudioId))) {
                    audio.play().then(() => {
                        setAutoplayBlocked(false);
                        // setIsMuted(false); // REMOVED: Respect user preference
                        if (currentAudioId !== themeAudioId) {
                            playAudio(themeAudioId);
                        }
                    }).catch(err => console.warn("Retry failed:", err));
                }
            };

            window.addEventListener('click', handleInteraction);
            window.addEventListener('keydown', handleInteraction);
            window.addEventListener('touchstart', handleInteraction);
            window.addEventListener('scroll', handleInteraction);
            window.addEventListener('wheel', handleInteraction);

            return () => {
                window.removeEventListener('click', handleInteraction);
                window.removeEventListener('keydown', handleInteraction);
                window.removeEventListener('touchstart', handleInteraction);
                window.removeEventListener('scroll', handleInteraction);
                window.removeEventListener('wheel', handleInteraction);
            };
        }
    }, [autoplayBlocked, isIntersecting, isVideoPlaying, currentAudioId, playAudio, pauseAudio]);

    // Sync Mute State
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.muted = isMuted;
        }
    }, [isMuted]);

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
            // console.log("Initializing YouTube Player");
            playerRef.current = new window.YT.Player('youtube-player', {
                events: {
                    'onStateChange': onPlayerStateChange
                }
            });
        }

        function onPlayerStateChange(event: any) {
            // console.log("YT State Change:", event.data);
            // 1 = Playing, 3 = Buffering
            if (event.data === 1 || event.data === 3) {
                setIsVideoPlaying(true);
                playAudio('youtube-ato1'); // Register as active audio to stop others
            }
            // 2 = Paused, 0 = Ended
            else if (event.data === 2 || event.data === 0) {
                setIsVideoPlaying(false);
                pauseAudio(); // Release global audio control
            }
        }
    }, []);

    return (
        <section
            ref={sectionRef}
            id="ato1"
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background py-20"
        >
            <audio
                ref={audioRef}
                src={themeAudio}
                loop
                preload="auto"
                playsInline
            />

            {/* Main Audio Toggle */}




            {/* Background texture */}
            <div className="absolute inset-0 film-grain opacity-10" />

            <div className="container mx-auto px-4 relative z-10">
                <div className={`max-w-5xl mx-auto transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                    {/* Header */}


                    {/* Conteúdo Principal */}
                    <div className="space-y-24">

                        {/* Seção Bahia */}
                        <div className="space-y-12">
                            <div ref={audioTriggerRef} className="max-w-3xl mx-auto space-y-6">
                                <p className="font-grotesque text-lg text-foreground/80 leading-relaxed text-justify">
                                    Por décadas, a Bahia se orgulhou de ter criado um cineasta reconhecido mundialmente. O que poucos sabem é que ele também deixou uma vasta produção literária. A coletânea <span className="italic text-primary">‘Poemas Eskolhydos de Glauber Rocha’</span>, organizada por Pedro Maciel, reúne os versos mais conhecidos do autor, enquanto <span className="italic text-primary">‘Cartas ao Mundo’</span>, organizada por Ivana Bentes, revela seu pensamento por meio de correspondências pessoais. O próprio Glauber defendia que seus textos fossem publicados como forma de “preservar a base literária de seus filmes”.
                                </p>
                                <div className="mb-16 text-center flex flex-col items-center">
                                    <img
                                        src={glauberImage}
                                        alt="Glauber Rocha"
                                        className="w-full rounded-lg shadow-2xl opacity-90 hover:opacity-100 transition-opacity duration-700"
                                    />
                                    <p className="mt-4 text-sm text-center text-muted-foreground italic font-grotesque max-w-3xl">
                                        Glauber Rocha fuma enquanto escreve, atento à máquina de escrever. Foto: Paula Gaitan / Divulgação.
                                    </p>
                                </div>
                                <p className="font-grotesque text-lg text-foreground/80 leading-relaxed text-justify">
                                    Para o pesquisador Glauber Lacerda, professor de Cinema e Audiovisual da Universidade Estadual do Sudoeste da Bahia (UESB) e xará do artista, é impossível dissociar o cineasta do escritor e poeta. “Desde muito jovem, ele foi ligado às letras. Isso aparece nas cartas que trocava com os tios, onde já se revelava um leitor voraz de literatura e filosofia”, explica o professor, destacando o papel fundamental de Dona Lúcia Rocha, mãe do cineasta, no incentivo constante à leitura dentro de casa.
                                </p>
                                <p className="font-grotesque text-lg text-foreground/80 leading-relaxed text-justify">
                                    Glauber se apropriou da tradição oral nordestina, especialmente da literatura de cordel, em <a href="https://www.youtube.com/watch?v=QEsoB05RjGs" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity"><span className="italic text-primary">Deus e o Diabo na Terra do Sol (1964)</span></a> e <span className="italic text-primary">O Dragão da Maldade contra o Santo Guerreiro (1969)</span>, levando para o cinema uma cadência marcada por rimas, proclamações e discursos populares. Em Deus e o Diabo, por exemplo, a parceria com Sérgio Ricardo, compositor e figura emblemática do <span className="italic text-primary">Cinema Novo</span>, transformou os poemas originais do cineasta nas canções que conduzem a história.
                                </p>
                                <p className="font-grotesque text-lg text-foreground/80 leading-relaxed text-justify">
                                    Décadas depois, os versos do diretor ganharam vida também na voz de outro conquistense, o compositor Gutemberg Vieira. Encarnando a figura de um verdadeiro ‘menestrel’ moderno, aquele que, no sertão, guarda e transmite a identidade cultural de seu povo, ele transformou os poemas do cineasta em cerca de 14 faixas gravadas em estúdio profissional. Sua qualidade técnica e poética é frequentemente comparada à de gigantes como <span className="italic text-primary">Elomar</span> e <span className="italic text-primary">Xangai</span>, ainda que Gutemberg não tenha alcançado a mesma projeção comercial.
                                </p>
                                <div className="bg-card/50 backdrop-blur-sm border-l-4 border-primary p-6 rounded-r-xl my-8">
                                    <p className="font-grotesque text-lg text-foreground italic mb-4">
                                        “Cada poema tem em si uma coisinha de época, sabe? (...) Nós temos Glauber Brasil, Glauber Cuba, Glauber Itália… É o Glauber exilado, viajando e escrevendo como suas necessidades e aspirações. (...) Tem coisas que são angustiantes. Eu tenho poemas musicados dele nesse contexto, que eu, por exemplo, quando toco, às vezes, choro.”
                                    </p>
                                    <p className="text-sm text-accent font-stencil tracking-widest uppercase">
                                        — Gutemberg Vieira
                                    </p>
                                </div>
                                <p className="font-grotesque text-lg text-foreground/80 leading-relaxed text-justify">
                                    O artista lembra que Dona Lúcia, mãe do cineasta, aprovou e incentivou o projeto após a apresentação realizada no fim dos anos noventa, no Cine Madrigal, tradicional cinema de rua de Vitória da Conquista. Já a filha, Paloma Rocha, questionou os palavrões nas letras, ao que ele respondeu que alterar “seria desonesto com o próprio poema”.
                                </p>
                                <p className="font-grotesque text-lg text-foreground/80 leading-relaxed text-justify">
                                    Após a morte da matriarca, no entanto, Paloma barrou o lançamento comercial do CD e autorizou apenas as apresentações das canções ao vivo. Procurada pela reportagem, Paloma Rocha não retornou os contatos até a publicação desta matéria.
                                </p>
                                <p className="font-grotesque text-lg text-foreground/80 leading-relaxed text-justify">
                                    Mesmo restrito, as interpretações revelam a força dos versos. Por exemplo, a poesia “Letra Fera”, descrita como um “vômito de ideias”, ganhou interpretação inédita dos artistas Tarcísio Santos e Guigga Maraká e integrou o álbum <span className="italic text-primary">“Mar Sobre Pedras” (2023)</span> da dupla. Segundo Gutemberg, a leitura “deu outra roupa para o manequim”.
                                </p>
                            </div>
                            <div className="w-full max-w-4xl mx-auto">
                                <div className="relative group w-full aspect-video rounded-xl overflow-hidden shadow-2xl border-2 border-primary/30">
                                    <iframe
                                        id="youtube-player"
                                        className="w-full h-full"
                                        src="https://www.youtube.com/embed/dSYeNwLRiig?enablejsapi=1"
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                                <p className="mt-4 text-sm text-center text-muted-foreground italic font-grotesque">
                                    ‘Letra Fera’, de Glauber Rocha, ganha música em performance ao vivo. Reprodução: YouTube / Mar Sobre Pedras.
                                </p>
                            </div>
                        </div>

                        {/* Seção BaianaSystem */}
                        <div className="space-y-8">
                            <div className="max-w-3xl mx-auto text-justify space-y-6">
                                <div className="prose prose-lg prose-invert">
                                    <p className="font-grotesque text-lg text-foreground/80 leading-relaxed text-justify">
                                        Em tempos de produções cheias de efeitos sonoros e retoques digitais, Guigga e Tarcísio seguiram o caminho oposto. O álbum foi gravado ao vivo, em estúdio, apenas com voz e violão. A decisão nasceu do bolso curto, é verdade, mas também de uma escolha estética: fazer arte com o que se tem, um princípio que lembra o <span className="italic text-primary">Cinema Novo</span> de Glauber. “É essa coisa da câmera na mão e uma ideia na cabeça... o violão na mão e uma voz falando”, aponta Tarcísio.
                                    </p>



                                    <CustomAudioPlayer
                                        src={tarcisioAudio}
                                        caption="Tarcísio Santos comenta a produção do álbum 'Mar sobre Pedras'"
                                    />

                                    <p className="font-grotesque text-lg text-foreground/80 leading-relaxed text-justify">
                                        Ele acrescenta que havia a necessidade de encontrar formas de expressar a identidade baiana e interiorana, mesmo com as fortes limitações impostas pela indústria cultural.
                                    </p>
                                </div>
                            </div>





                        </div>
                    </div>
                </div>
            </div >
        </section >
    );
};

export default Ato1Bahia;
