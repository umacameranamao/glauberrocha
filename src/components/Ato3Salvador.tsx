import { useEffect, useRef, useState } from "react";
import { useAudio } from "@/contexts/AudioContext";
import tristezaAudio from "@/assets/11-Tristeza.mp3";


import GraficoCinema from "./GraficoCinema";
import mostraCinema from "@/assets/‘Mostra-Cinema-Conquista-20221010.webp";
import CustomAudioPlayer from "./ui/CustomAudioPlayer";
import mariliaAudio from "@/assets/fala-marilia-hughes.mp3";

const Ato3Salvador = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  const { currentAudioId, playAudio, pauseAudio, isThemeMuted } = useAudio();
  const themeAudioId = "ato3-theme";

  // Sync with global mute preference
  useEffect(() => {
    setIsMuted(isThemeMuted);
  }, [isThemeMuted]);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          console.log('[ATO3] Intersection changed:', entry.isIntersecting, 'ratio:', entry.intersectionRatio);
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

    if (isIntersecting && !autoplayBlocked) {
      if (fadeOutInterval) clearInterval(fadeOutInterval);
      audio.volume = 1;
      attemptPlay();
    } else {
      fadeOut();
    }

    return () => {
      if (fadeOutInterval) clearInterval(fadeOutInterval);
    };
  }, [isIntersecting, autoplayBlocked, currentAudioId, playAudio, pauseAudio]);

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

  return (
    <section
      id="ato3"
      ref={sectionRef}
      className="relative min-h-screen bg-background py-20 overflow-hidden"
    >
      <audio ref={audioRef} src={tristezaAudio} loop preload="auto" playsInline />
      {/* Background texture */}
      <div className="absolute inset-0 film-grain opacity-10" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="font-stencil text-xl md:text-5xl lg:text-7xl text-accent mb-6 tracking-wider leading-tight">
              Desafios do cinema
            </h2>
            <div className="w-32 h-1 bg-accent mx-auto mt-8" />
          </div>

          {/* Texto Introdutório */}
          <div className="max-w-4xl mx-auto mb-16 text-left space-y-6">
            <div className="prose prose-lg prose-invert mx-auto">
              <p className="font-grotesque text-lg text-foreground/90 leading-relaxed text-justify max-w-3xl mx-auto mb-8">
                Hoje, o cenário é o mesmo: a principal batalha do audiovisual baiano é descentralizar recursos para que os filmes existam e garantir o alcance às pessoas.
              </p>
              <p className="font-grotesque text-lg text-foreground/80 leading-relaxed text-justify max-w-3xl mx-auto mb-8">
                Por décadas, o financiamento para produção se concentrou no eixo Rio–São Paulo e, na Bahia, quase exclusivamente em Salvador.
              </p>
              <p className="font-grotesque text-lg text-foreground/80 leading-relaxed text-justify max-w-3xl mx-auto mb-8">
                A Lei Paulo Gustavo permitiu que cidades sem políticas culturais próprias, ou que nunca acessaram o <a href="https://www.gov.br/ancine/pt-br/fsa/institucional/sobre-o-fsa" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity"><span className="italic text-primary">Fundo Setorial do Audiovisual (FSA)</span></a>, passassem a financiar filmes produzidos localmente, como é o caso do cineasta Pedro Rodrigues, que revela que a lei foi a possibilidade de produzir o seu documentário “DIA 11”.
              </p>
              <div className="bg-card/50 backdrop-blur-sm border-l-4 border-primary p-6 rounded-r-xl my-8 max-w-3xl mx-auto">
                <p className="font-grotesque text-lg text-foreground italic mb-4">
                  “Eles divulgaram o edital, as datas, o prazo e o formulário para inscrição. Preenchi tudo explicando o projeto, a ideia, o desenvolvimento, a questão de acessibilidade, detalhando exatamente como o recurso seria utilizado, desde limitações até composição de equipe”
                </p>
                <p className="text-sm text-accent font-stencil tracking-widest uppercase">
                  — Pedro Rodrigues
                </p>
              </div>
              <p className="font-grotesque text-lg text-foreground/80 leading-relaxed text-justify max-w-3xl mx-auto mb-8">
                Por outro lado, Daniel Leite, presidente da Associação do Setor Audiovisual do Sudoeste da Bahia (SASB) e diretor de <a href="https://www.youtube.com/watch?v=S_1DjClQsFs" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity"><span className="italic text-primary">Alice dos Anjos (2021)</span></a>, premiado no 54º Festival de Brasília, viveu a ironia de ser celebrado internacionalmente e, mesmo assim, a demora em exibir o filme em Vitória da Conquista, onde foi produzido.
              </p>
              <p className="font-grotesque text-lg text-foreground/80 leading-relaxed text-justify max-w-3xl mx-auto mb-8">
                Em 2022, quando finalmente chegou à Mostra Cinema Conquista, festival organizado pela UESB, o público precisou “sentar no chão”, segundo o diretor. “Quer sessão lotada? Passe filme que foi feito aqui!”, anuncia. O problema, diz ele, não é falta de interesse, mas as barreiras econômicas, geográficas e de distribuição.
              </p>
              <div className="mt-8 mb-16 flex flex-col items-center">
                <img
                  src={mostraCinema}
                  alt="Público sentado no chão durante a Mostra Cinema Conquista"
                  className="w-full max-w-3xl rounded-lg shadow-xl"
                />
                <p className="mt-4 text-sm text-center text-muted-foreground italic font-grotesque max-w-3xl">
                  Há 16 anos, o evento Mostra Cinema Conquista movimenta Vitória da Conquista com exibições, formações e reflexões sobre o cinema brasileiro. Foto: Micael Aquillah
                </p>
              </div>
              <p className="font-grotesque text-lg text-foreground/80 leading-relaxed text-justify max-w-3xl mx-auto mb-8">
                O gargalo se repete em escala nacional. Como alerta a cineasta e gestora do Cine Glauber Rocha, Marília Hughes, o Brasil vive uma “crise de exibição”: há recursos para produzir filmes, mas faltam políticas para distribuí-los, isto é, garantir que cheguem às salas para que o público possa assisti-los, além de despertar interesse pelo cinema nacional.
              </p>
              <div className="max-w-3xl mx-auto mt-8 mb-16">
                <CustomAudioPlayer
                  src={mariliaAudio}
                  caption="Marília Hughes comenta a crise de exibição no cinema brasileiro"
                />
              </div>
              <p className="font-grotesque text-lg text-foreground/80 leading-relaxed text-justify max-w-3xl mx-auto mb-8">
                Por essas questões, o cinema brasileiro leva desvantagem na exibição quando grandes distribuidoras internacionais oferecem pacotes de lançamentos e ocupam salas por semanas.
              </p>
            </div>
            {/* Gráfico de Dados */}
            <div className="mt-16">
              <GraficoCinema />
            </div>
          </div>

          {/* Mapa interativo */}
          {/* Mapa interativo */}
          {/* Mapa interativo */}





        </div>
      </div>

    </section >
  );
};

export default Ato3Salvador;
