import { useEffect, useRef, useState } from "react";
import { useAudio } from "@/contexts/AudioContext";
import olaGalAudio from "@/assets/ola-gal.mp3";

import glauberPortrait from "@/assets/glauber-portrait.png";
import newspaperClipping from "@/assets/newspaper-clipping.png";

const Ato2Ideia = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  const { currentAudioId, playAudio, pauseAudio, isThemeMuted } = useAudio();
  const themeAudioId = "ato2-theme";

  // Sync with global mute preference
  useEffect(() => {
    setIsMuted(isThemeMuted);
  }, [isThemeMuted]);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          console.log('[ATO2] Intersection changed:', entry.isIntersecting, 'ratio:', entry.intersectionRatio);
          setIsIntersecting(entry.isIntersecting);
        });
      },
      { threshold: 0.1 } // Reduced from 0.3 to 0.1 for easier triggering
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
      console.log('[ATO2] Attempting to play. CurrentAudioId:', currentAudioId);
      try {
        audio.volume = 1;
        playAudio(themeAudioId); // Always register this audio
        await audio.play();
        console.log('[ATO2] ✅ Playing successfully');
        setAutoplayBlocked(false);
      } catch (err) {
        console.warn('[ATO2] ❌ Autoplay blocked:', err);
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

    console.log('[ATO2] Audio Logic - isIntersecting:', isIntersecting, 'autoplayBlocked:', autoplayBlocked, 'currentAudioId:', currentAudioId);

    // Only play if:
    // 1. No audio is playing
    // 2. This Act's theme is playing
    // 3. Another Act's theme is playing (transition)
    // 4. BUT NOT if a specific manual audio is playing
    const shouldPlay = isIntersecting && !autoplayBlocked && (
      !currentAudioId ||
      currentAudioId === themeAudioId ||
      currentAudioId.includes('theme') ||
      currentAudioId.includes('ato') // catch-all for other acts
    ) && !(currentAudioId && !currentAudioId.includes('theme') && !currentAudioId.includes('ato'));

    if (shouldPlay) {
      console.log('[ATO2] Conditions met, attempting play...');
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
      id="ato2"
      ref={sectionRef}
      className="relative min-h-screen bg-background py-20 overflow-hidden"
    >
      {/* Background com textura */}
      <div className="absolute inset-0 film-grain opacity-10" />

      <audio
        ref={audioRef}
        src={olaGalAudio}
        loop
        preload="auto"
        playsInline
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header com imagem */}
          <div className="mb-20 text-center">


            <h2 className="font-stencil text-xl md:text-5xl lg:text-7xl text-yellow-400 mb-6 tracking-wider leading-tight">
              Visão crítica
            </h2>
          </div>

          {/* Glauber Portrait */}
          <div className="mb-20 flex flex-col items-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary shadow-2xl grayscale hover:grayscale-0 transition-all duration-500">
              <img src={glauberPortrait} alt="Glauber Rocha" className="w-full h-full object-cover" />
            </div>
            <p className="mt-4 text-sm text-center text-muted-foreground italic font-grotesque max-w-xl">
              Glauber Rocha na antiga redação do Correio Braziliense. Crédito: Arquivo CB/D.A Press.
            </p>
          </div>

          {/* Texto Jornalístico - Parte 1 */}
          <div className="max-w-3xl mx-auto space-y-8 mb-12 text-justify">
            <div className="prose prose-lg prose-invert mx-auto">
              <p className="font-grotesque text-lg text-foreground/90 leading-relaxed text-justify mb-8 first-letter:text-5xl first-letter:font-stencil first-letter:text-primary first-letter:mr-3 first-letter:float-left">
                “Literatura e cinema tinham a mesma vontade revolucionária explícita”, afirma Glauber Lacerda, pesquisador, professor de Cinema e Audiovisual da UESB e xará do cineasta, que dedicou anos ao estudo de Glauber Rocha e de produções latino-americanas.
              </p>

              <p className="font-grotesque text-lg text-foreground/80 leading-relaxed text-justify mb-8">
                Foi no Clube de Cinema da Bahia, que o jovem Glauber se aproximou de debates políticos. Há registros de que ele, enquanto crítico de cinema, escreveu no Jornal do Brasil críticas a filmes como <a href="https://www.youtube.com/watch?v=FbcxQRuOa4o" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity"><span className="italic text-primary">Orfeu Negro (1959)</span></a>, acusando de romantizar o país para o público estrangeiro e ignorar seus problemas sociais.
              </p>
            </div>
          </div>

          {/* Bloco Explicativo: O Olhar do Outro (Full Width 4xl) */}
          <div className="w-full max-w-4xl mx-auto my-12 relative">
            <div className="absolute inset-0 bg-accent/5 blur-xl" />
            <div className="relative p-10 border-2 rounded-xl backdrop-blur-sm border-accent/50 bg-card/80">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-2 h-full bg-accent" />
                <div className="flex-1">
                  <h3 className="font-stencil text-2xl text-accent mb-4 tracking-wider leading-tight text-center">
                    O OLHAR DO OUTRO
                  </h3>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <p className="font-grotesque text-lg text-foreground/90 leading-relaxed text-justify mb-8">
                    Para Glauber, o "olhar do outro" (ou olhar estrangeiro) era uma forma de colonização cultural. Quando cineastas europeus ou americanos filmavam o Brasil, muitas vezes buscavam o exótico, transformando nossa miséria em folclore.
                  </p>
                  <p className="font-grotesque text-lg text-foreground/90 leading-relaxed text-justify mb-8">
                    O Cinema Novo rompeu com isso ao propor uma <strong>Estética da Fome</strong>: não esconder a pobreza, mas expô-la com crueza, sem filtros, forçando o público a encarar a realidade social do país.
                  </p>
                </div>
                <div className="relative h-full min-h-[200px] border-l-2 border-accent/20 pl-8 flex flex-col justify-center italic text-muted-foreground">
                  <p className="text-xl">
                    "Nossa originalidade é a nossa fome e a nossa maior miséria é que esta fome, sendo sentida, não é compreendida."
                  </p>
                  <p className="text-sm mt-4 text-accent font-bold uppercase tracking-widest">
                    — Glauber Rocha, 1965
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Texto Jornalístico - Parte 2 */}
          <div className="max-w-3xl mx-auto space-y-8 mb-12 text-justify">
            <div className="prose prose-lg prose-invert mx-auto">
              <p className="font-grotesque text-lg text-foreground/80 leading-relaxed text-justify mb-8">
                A partir desse olhar, passou a tratar a cultura não como entretenimento passivo, mas como lugar de conflito. <a href="https://www.youtube.com/watch?v=EhHThNyck1s" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity"><span className="italic text-primary">Barravento (1961)</span></a>, primeiro longa de Rocha, à época com 23 anos, retrata pescadores baianos e aborda pobreza, racismo e candomblé com uma narrativa que flertava com o marxismo.
              </p>
            </div>
          </div>

          {/* Video Godard (Full Width 4xl) */}
          <div className="w-full max-w-4xl mx-auto my-12">
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl border-2 border-primary/20 bg-black">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/0eyCA58F5tY"
                title="Glauber Rocha em Le vent d'est"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <p className="mt-4 text-sm text-center text-muted-foreground italic font-grotesque">
              Glauber Rocha participa do filme “Le vent d'est” de Jean Luc Godard em 1970 e expõe ali os princípios de seu estilo cinematográfico. Reprodução: YouTube / rubs troll
            </p>
          </div>

          {/* Texto Jornalístico - Parte 3 */}
          <div className="max-w-3xl mx-auto space-y-8 mb-20 text-justify mb-8">
            <div className="prose prose-lg prose-invert mx-auto">
              <p className="font-grotesque text-lg text-foreground/80 leading-relaxed text-justify mb-8">
                Como resultado, o artista formula a Estética da Fome (1965). Segundo Humberto Alves Silva Júnior, professor de Ciências Sociais da Universidade Federal de Rondônia, o manifesto bebeu diretamente das ideias do psiquiatra e filósofo Frantz Fanon. Glauber apresentou o manifesto em Gênova, e depois publicou no Brasil sob o título “Eztetyka da Fome”.
              </p>

              <p className="font-grotesque text-lg text-foreground/80 leading-relaxed text-justify mb-8">
                “Fanon defendia que, em situações extremas de colonização, a violência se torna um recurso necessário à transformação. Glauber traduz isso: fome e violência estão ligadas, não como ódio, mas como ‘ódio alimentado pelo amor’, desejo de transformar a sociedade em prol dos oprimidos”, explica o professor que estuda Glauber Rocha há, pelo menos, duas décadas.
              </p>

              <div className="mt-16 mb-8 flex justify-center">
                <div className="relative transform rotate-2 hover:rotate-0 transition-transform duration-500 max-w-2xl">
                  <img
                    src={newspaperClipping}
                    alt="Recorte de jornal antigo sobre o Cinema Novo e Glauber Rocha"
                    className="w-full rounded shadow-2xl sepia opacity-90 hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
                </div>
              </div>
              <p className="max-w-2xl mx-auto mt-4 text-sm text-center text-muted-foreground italic font-grotesque">
                Em entrevista publicada no Estadão em 9 de novembro de 1977, direto de Salvador, o cineasta defendeu uma postura que apostava em um cinema nacionalista e popular para tirar a produção brasileira da irrelevância. Fonte: Acervo Estadão.
              </p>

              <p className="font-grotesque text-lg text-foreground/80 leading-relaxed text-justify mb-8 mt-12">
                Ao mesmo tempo, o cineasta se frustrava com as noções que seus filmes seriam “complexos demais”. Suas obras não alcançavam o grande público, habituado a narrativas tradicionais. “Ele precisava seguir o ritual de Hollywood, buscar exibição em diferentes lugares do Brasil, sempre preocupado em alcançar o público sem abrir mão de sua linguagem. Esse era o sonho de Glauber: fazer cinema com sentido”, afirma Alves.
              </p>
            </div>
          </div>




        </div>
      </div>

    </section>
  );
};

export default Ato2Ideia;
