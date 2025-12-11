import { useRef, useState, useEffect } from "react";
import { Camera } from "lucide-react";
import { useAudio } from "@/contexts/AudioContext";
import saudadeAudio from "@/assets/03-Saudade.mp3";
import cineMadrigal from "@/assets/cine-madrigal.png";
import cineGlauberExterior from "@/assets/cine-glauber-exterior.jpg";
import MapaCinemas from "./MapaCinemas";

const Ato4Revolucao = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [sliderValue, setSliderValue] = useState(50);

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  const { currentAudioId, playAudio, pauseAudio, isThemeMuted } = useAudio();
  const themeAudioId = "ato4-theme";

  // Sync with global mute preference
  useEffect(() => {
    setIsMuted(isThemeMuted);
  }, [isThemeMuted]);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          console.log('[ATO4] Intersection changed:', entry.isIntersecting, 'ratio:', entry.intersectionRatio);
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

  // Audio Logic
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let fadeOutInterval: number | undefined;

    const attemptPlay = async () => {
      try {
        audio.volume = 1;
        playAudio(themeAudioId); // Always register this audio
        await audio.play();
        setAutoplayBlocked(false);
      } catch (err) {
        console.warn("Autoplay blocked:", err);
        setAutoplayBlocked(true);
      }
    };

    const fadeOut = () => {
      if (fadeOutInterval) clearInterval(fadeOutInterval);
      if (audio.paused) return;

      fadeOutInterval = window.setInterval(() => {
        if (audio.volume > 0.1) {
          audio.volume -= 0.1;
        } else {
          audio.pause();
          audio.volume = 1;
          if (currentAudioId === themeAudioId) {
            pauseAudio();
          }
        }
      }, 100);
    };

    // Allow this Act to take over from other Act theme music
    const isOtherActPlaying = currentAudioId && !currentAudioId.includes('custom-audio') && currentAudioId !== themeAudioId;

    // Only play if:
    // 1. No audio is playing
    // 2. This Act's theme is playing
    // 3. Another Act's theme is playing (transition)
    // 4. BUT NOT if a specific manual audio is playing OR if Acervo audio is playing AND we are scrolling down
    const shouldPlay = isIntersecting && !autoplayBlocked && (
      !currentAudioId ||
      currentAudioId === themeAudioId ||
      // Allow taking over Acervo ONLY if scrolling UP
      (currentAudioId.includes('theme') && (!currentAudioId.includes('acervo') || scrollDirection === 'up')) ||
      currentAudioId.includes('ato') // catch-all for other acts
    ) && !(currentAudioId && !currentAudioId.includes('theme') && !currentAudioId.includes('ato'));

    if (shouldPlay) {
      if (fadeOutInterval) clearInterval(fadeOutInterval);
      audio.volume = 1;
      attemptPlay();
    } else {
      fadeOut();
    }

    return () => {
      if (fadeOutInterval) clearInterval(fadeOutInterval);
    };
  }, [isIntersecting, autoplayBlocked, currentAudioId, playAudio, pauseAudio, scrollDirection]);

  // Retry on interaction if blocked
  useEffect(() => {
    if (autoplayBlocked) {
      const handleInteraction = () => {
        const audio = audioRef.current;
        if (audio && isIntersecting && (!currentAudioId || currentAudioId === themeAudioId)) {
          audio.play().then(() => {
            setAutoplayBlocked(false);
            if (currentAudioId !== themeAudioId) {
              playAudio(themeAudioId);
            }
          }).catch(err => console.warn("Retry failed:", err));
        }
      };

      const events = ['click', 'keydown', 'touchstart', 'scroll', 'wheel'];
      events.forEach(event => window.addEventListener(event, handleInteraction, { once: true }));

      return () => {
        events.forEach(event => window.removeEventListener(event, handleInteraction));
      };
    }
  }, [autoplayBlocked, isIntersecting, currentAudioId, playAudio, pauseAudio]);

  // Sync Mute State
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const chartData = [
    { year: '1955', films: 10, label: "Pré-CN" },
    { year: '1960', films: 30, label: "Início" },
    { year: '1964', films: 80, label: "Golpe" },
    { year: '1968', films: 45, label: "AI-5" },
    { year: '1970', films: 20, label: "Exílio" },
    { year: '1980', films: 60, label: "Retomada" },
  ];

  return (
    <section
      id="ato4"
      ref={sectionRef}
      className="relative min-h-screen bg-background py-20 overflow-hidden"
    >
      {/* Background texture */}
      <div className="absolute inset-0 film-grain opacity-10" />

      <audio
        ref={audioRef}
        src={saudadeAudio}
        loop
        preload="auto"
        playsInline
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <h2 className="font-stencil text-2xl md:text-5xl lg:text-7xl text-primary mb-6 tracking-wider">
              O contraste de cinemas
            </h2>
          </div>

          {/* Texto Jornalístico */}
          <div className="prose prose-lg prose-invert mx-auto space-y-8">
            <p className="font-grotesque text-lg text-foreground/90 leading-relaxed text-justify max-w-3xl mx-auto">
              Sem salas ativas e com distribuição desigual, o cinema brasileiro corre o risco de existir apenas como catálogo, sem público e sem impacto. Como reforça <a href="https://rollingstone.com.br/cinema/kleber-mendonca-filho-nao-quer-fazer-filmes-para-o-streaming-melhor-nos-cinemas/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity"><span className="italic text-primary">Kleber Mendonça Filho</span></a>, é a sala que constrói “o caráter e a história de um filme”.

            </p>

            {/* Mapa de Cinemas */}
            <div className="my-16 max-w-4xl mx-auto">
              <h3 className="font-stencil text-2xl text-center text-primary mb-6">
                CIRCUITO DE CINEMAS EM SALVADOR
              </h3>
              {/* Mapa Interativo */}
              <div className="w-full max-w-4xl mx-auto my-12">
                <MapaCinemas />
                <p className="text-center text-muted-foreground mt-4 font-grotesque text-sm">
                  Mapa interativo das salas de cinema ativas e inativas na capital. Fonte: <a href="https://cinemafalda.blogspot.com/2010/02/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity"><span className="italic text-primary">Cinema Falda</span></a>.
                </p>
              </div>
            </div>

            <p className="font-grotesque text-lg text-foreground/80 leading-relaxed text-justify max-w-3xl mx-auto">
              Em Vitória da Conquista, o nome de Glauber Rocha estampa aeroportos, teatro e casa, mas o Cine Madrigal, histórico cinema de rua fundado em 1968, está fechado e sem expectativas de recuperação. Ali ocorreu a pré-estreia de Central do Brasil, com a presença de Walter Salles, como lembra o diretor Daniel Leite.
            </p>

            <p className="font-grotesque text-lg text-foreground/80 leading-relaxed text-justify max-w-3xl mx-auto">
              A Prefeitura de Vitória da Conquista informou, em resposta à Lei de Acesso à Informação, que o Cine Madrigal está sob responsabilidade da Secretaria Municipal de Educação. O ofício revela que "a edificação apresenta necessidade de intervenções físicas e, por essa razão, foram iniciadas ações preliminares visando a requalificação do espaço", mas indica que "até o momento, não há edital ou contrato finalizados, razão pela qual não há empresa contratada, valores definitivos ou cronograma consolidado." O município também busca recursos federais para viabilizar futuras intervenções no imóvel.
            </p>

            <p className="font-grotesque text-lg text-foreground/80 leading-relaxed text-justify max-w-3xl mx-auto">
              Hoje, Conquista apenas conta com dois cinemas, ambos em shoppings. Filmes produzidos na cidade raramente conseguem entrar em cartaz. A cidade preserva o nome de Glauber, mas abandona o que o tornaria vivo: a experiência em sala.
            </p>

            <p className="font-grotesque text-lg text-foreground/80 leading-relaxed text-justify max-w-3xl mx-auto">
              Por outro lado, o cinema que leva seu nome, o Cine Glauber Rocha em Salvador, se destaca em meio à hegemonia das salas de shoppings. Ir ao Glauber, afirma Hughes, é também “se relacionar com a cidade: ver o pôr do sol na Praça Castro Alves, tomar um café, caminhar pela Rua Chile. Shopping não tem isso, pois são todos iguais”.
            </p>

            <p className="font-grotesque text-lg text-foreground/80 leading-relaxed text-justify max-w-3xl mx-auto">
              Ele está localizado no Centro Histórico de Salvador e conta com uma curadoria que abrange desde produções independentes até filmes comerciais. Os ingressos são acessíveis à população, geralmente entre 5 e até 15 reais.
            </p>

            <p className="font-grotesque text-lg text-foreground/80 leading-relaxed text-justify max-w-3xl mx-auto">
              A permanência do cinema só foi possível por iniciativa de Cláudio Marques, sócio-fundador do espaço, que conduziu o processo de captação de recursos e reforma do antigo Cine Guarani.
            </p>

            <div className="bg-card/50 backdrop-blur-sm border-l-4 border-primary p-6 rounded-r-xl my-8 max-w-3xl mx-auto">
              <p className="font-grotesque text-lg text-foreground italic mb-4">
                “Não foi o poder público que revitalizou o espaço. Foi sonho, persistência e trabalho”
              </p>
              <p className="text-sm text-accent font-stencil tracking-widest uppercase">
                — Marília Hughes
              </p>
            </div>



            {/* Comparativo Visual: Slider */}
            <div className="w-full max-w-4xl mx-auto my-16 not-prose">
              <h3 className="font-stencil text-2xl text-center text-primary mb-6">
                REALIDADES OPOSTAS
              </h3>
              <div className="relative w-full aspect-video rounded-lg overflow-hidden border-4 border-primary/30 shadow-2xl group">
                {/* Imagem Direita (Fundo - Cine Glauber) */}
                <img
                  src={cineGlauberExterior}
                  alt="Cine Glauber Rocha"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Imagem Esquerda (Sobreposta - Cine Madrigal) */}
                <div
                  className="absolute inset-0 w-full h-full overflow-hidden"
                  style={{ clipPath: `inset(0 ${100 - sliderValue}% 0 0)` }}
                >
                  <img
                    src={cineMadrigal}
                    alt="Cine Madrigal"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                </div>

                {/* Slider Control */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderValue}
                  onChange={(e) => setSliderValue(parseInt(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                />

                {/* Linha Divisória */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-primary z-10 pointer-events-none shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                  style={{ left: `${sliderValue}%` }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                    <Camera className="w-4 h-4 text-black" />
                  </div>
                </div>

                {/* Labels */}
                {/* Labels */}
                <div className="absolute top-4 left-4 bg-accent px-2 md:px-3 py-1 rounded text-white font-grotesque text-xs md:text-sm font-bold shadow-lg z-10 pointer-events-none max-w-[45%] truncate">
                  Cine Madrigal (2025)
                </div>
                <div className="absolute bottom-4 right-4 md:top-4 md:bottom-auto bg-accent px-2 md:px-3 py-1 rounded text-white font-grotesque text-xs md:text-sm font-bold shadow-lg z-10 pointer-events-none max-w-[45%] truncate">
                  Cine Glauber Rocha (2025)
                </div>
              </div>
              <p className="text-center text-muted-foreground mt-4 font-grotesque text-sm">
                Arraste para comparar as realidades dos cinemas. Imagens: Júlio César Santos (Madrigal) e Adilton Venegeroles / Ag. A TARDE (Glauber Rocha).
              </p>
            </div>

            <p className="font-grotesque text-lg text-foreground/80 leading-relaxed text-justify max-w-3xl mx-auto">
              Ela defende que é preciso incentivar a experiência coletiva da sala escura.
            </p>

            {/* Fechamento Destacado */}
            <div className="mt-16 p-8 border-l-4 border-primary bg-primary/5 rounded-r-xl">
              <p className="font-grotesque text-xl text-foreground italic leading-relaxed">
                “Nas telas individuais, cada um vê sozinho. A gente perde o diálogo e a troca. A sala ainda é insubstituível”.
              </p>
              <p className="text-sm text-accent font-stencil tracking-widest uppercase mt-4">
                — Marília Hughes
              </p>
            </div>
          </div>
        </div>
      </div>

    </section >
  );
};

export default Ato4Revolucao;
