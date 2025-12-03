import { useState, useEffect } from "react";
import salvadorMap from "@/assets/salvador-map.png";
import cineInterior from "@/assets/cine-glauber-interior.jpg";
import newspaperClipping from "@/assets/newspaper-clipping.png";
import { MapPin } from "lucide-react";

const Ato3Salvador = () => {
  const [activePoint, setActivePoint] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isLocked) {
        const target = event.target as HTMLElement;
        if (!target.closest('[data-interactive="true"]')) {
          setIsLocked(false);
          setActivePoint(null);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isLocked]);

  const locations = [
    {
      id: "pelourinho",
      name: "Pelourinho",
      x: "45%",
      y: "35%",
    },
    {
      id: "barra",
      name: "Porto da Barra",
      x: "30%",
      y: "55%",
    },
    {
      id: "unhao",
      name: "Solar do Unhão",
      x: "60%",
      y: "45%",
    },
    {
      id: "lacerda",
      name: "Elevador Lacerda",
      x: "50%",
      y: "40%",
    },
    {
      id: "cine-glauber",
      name: "Cine Glauber Rocha",
      x: "48%",
      y: "38%",
      description: "Praça Castro Alves. Templo do cinema baiano inaugurado em 1982. Prédio histórico que mantém viva a chama revolucionária do cinema de Glauber, exibindo produções independentes e clássicos do Cinema Novo.",
    },
  ];

  return (
    <section
      id="ato3"
      className="relative min-h-screen bg-background py-20 overflow-hidden"
    >
      {/* Background texture */}
      <div className="absolute inset-0 film-grain opacity-10" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="font-stencil text-5xl md:text-7xl text-accent mb-6 tracking-wider">
              COMPLEXIDADE DE GLAUBER
            </h2>
            <div className="w-32 h-1 bg-accent mx-auto mt-8" />
          </div>

          {/* Texto Introdutório */}
          <div className="max-w-4xl mx-auto mb-16 text-left space-y-6">
            <div className="prose prose-lg prose-invert mx-auto">
              <p className="font-grotesque text-lg text-foreground/90 leading-relaxed text-justify max-w-3xl mx-auto">
                Para ele, o cinema não devia apenas entreter, devia fazer pensar, inquietar, despertar consciência. A postura o colocava em contraste com o gosto popular da época, voltado para as comédias leves e as pornochanchadas, que dominavam as bilheterias durante a ditadura militar. Enquanto muitos filmes buscavam escapar da realidade, Glauber queria encará-la de frente.
              </p>
              <p className="font-grotesque text-lg text-foreground/80 leading-relaxed text-justify max-w-3xl mx-auto">
                Apesar de ser reconhecido internacionalmente e premiado em grandes festivais, poucos baianos chegaram a conhecer de fato sua obra. Suas ideias, muitas vezes consideradas difíceis ou “intelectuais demais”, criaram uma distância entre o público e o cineasta.
              </p>
              <p className="font-grotesque text-lg text-foreground/80 leading-relaxed text-justify max-w-3xl mx-auto">
                Em 2020, sua filha, Paloma Rocha, tentou reduzir essa distância com o lançamento do acervo digital de Glauber, afirmando que o verdadeiro sentido do trabalho do pai era ser acessível a todos. Foi uma tentativa de democratizar um cinema que sempre quis ser do povo e para o povo, mesmo que a estrutura de distribuição e exibição no país ainda não favoreça isso.
              </p>
              <p className="font-grotesque text-lg text-foreground/80 leading-relaxed text-justify max-w-3xl mx-auto">
                A homenagem feita com a renomeação do antigo Cine Guarani, em Salvador, para Cine Glauber Rocha, reforça essa tentativa de manter viva sua presença.
              </p>
            </div>
          </div>

          {/* Mapa interativo */}
          <div className="relative w-full max-w-4xl mx-auto mb-12 rounded-lg overflow-hidden shadow-2xl bg-card">
            <img
              src={salvadorMap}
              alt="Mapa de Salvador"
              className="w-full h-auto block transition-transform duration-700 hover:scale-105"
            />

            {/* Overlay com textura */}
            <div className="absolute inset-0 film-grain opacity-20 pointer-events-none" />

            {/* Pontos interativos */}
            {locations.map((location) => (
              <button
                key={location.id}
                data-interactive="true"
                className="absolute group"
                style={{ left: location.x, top: location.y, transform: "translate(-50%, -50%)" }}
                onMouseEnter={() => !isLocked && setActivePoint(location.id)}
                onMouseLeave={() => !isLocked && setActivePoint(null)}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent immediate closing
                  setActivePoint(location.id);
                  setIsLocked(true);
                  const element = document.getElementById(`desc-${location.id}`);
                  element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
              >
                <div className="relative">
                  <MapPin
                    className={`w-8 h-8 transition-all duration-300 ${activePoint === location.id
                      ? "text-accent scale-125 animate-bounce"
                      : "text-primary hover:text-accent hover:scale-110"
                      }`}
                    fill="currentColor"
                  />

                  {/* Pulso */}
                  <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
                </div>

                {/* Nome do local */}
                <div className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 whitespace-nowrap
                  transition-all duration-300 ${activePoint === location.id ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
                  }`}
                >
                  <span className="font-grotesque text-sm bg-background/90 px-3 py-1 rounded border border-primary">
                    {location.name}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Descrições dos locais */}
          <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
            {locations.filter(loc => loc.id !== "cine-glauber").map((location) => (
              <div
                key={location.id}
                id={`desc-${location.id}`}
                data-interactive="true"
                className={`p-6 border-2 rounded-xl transition-all duration-500 ${activePoint === location.id
                  ? "border-accent bg-accent/10 scale-105"
                  : "border-primary/30 bg-card"
                  }`}
              >
                <h3 className="font-stencil text-2xl text-primary mb-0 tracking-wider">
                  {location.name}
                </h3>
              </div>
            ))}
          </div>

          {/* Seção especial: Cine Glauber Rocha */}
          <div className="relative mb-16 max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-accent/5 blur-xl" />
            <div
              id="desc-cine-glauber"
              data-interactive="true"
              className={`relative p-10 border-2 rounded-xl backdrop-blur-sm transition-all duration-500 ${activePoint === "cine-glauber"
                ? "border-accent bg-accent/10 shadow-2xl shadow-accent/20"
                : "border-accent/50 bg-card/80"
                }`}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-2 h-full bg-accent" />
                <div className="flex-1">
                  <h3 className="font-stencil text-3xl md:text-4xl text-accent mb-4 tracking-wider leading-tight">
                    CINE GLAUBER <br className="md:hidden" /> ROCHA
                  </h3>
                  <p className="font-grotesque text-lg text-accent/80 italic leading-snug">
                    Praça Castro Alves — <br className="md:hidden" /> espaço dedicado ao audiovisual e à memória do diretor
                  </p>
                </div>
              </div>

              {/* Imagem do interior do cinema */}
              <div className="relative mb-8 overflow-hidden rounded-lg shadow-2xl">
                <img
                  src={cineInterior}
                  alt="Interior do Cine Glauber Rocha com espectadores"
                  className="w-full h-auto animate-cinematic-zoom"
                />
                <div className="absolute inset-0 film-grain opacity-30 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />
              </div>

              <div className="space-y-6 font-grotesque text-foreground/90 leading-relaxed">
                <p className="text-lg text-justify">
                  Sua programação é marcada pela exibição de filmes brasileiros independentes, produções latino-americanas e clássicos restaurados. O espaço também acolhe mostras e festivais locais/regionais, além de promover sessões comentadas, encontros com diretores e críticos e atividades de cineclubes estudantis. Atrai principalmente estudantes, realizadores e cinéfilos interessados em uma programação alternativa.
                </p>

                <div className="grid md:grid-cols-2 gap-6 my-8">
                  <div className="p-6 bg-background/50 border-l-4 border-accent rounded-lg">
                    <h4 className="font-stencil text-lg text-accent mb-3">HISTÓRIA</h4>
                    <p className="text-justify text-lg">
                      O Cine Glauber Rocha, antes chamado Cine Teatro Guarani, foi inaugurado em 1917 na Praça Castro Alves, Salvador. Após ser renomeado em homenagem ao cineasta baiano Glauber Rocha em 1982, o cinema foi fechado em 1998 e reabriu em 2008, após um período de abandono e uma revitalização que incluiu a instalação de cinco salas de cinema.
                    </p>
                  </div>

                  <div className="p-6 bg-background/50 border-l-4 border-accent rounded-lg">
                    <h4 className="font-stencil text-lg text-accent mb-3">DADOS</h4>
                    <p className="mb-2">
                      <strong>Política de Acesso:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Clube Popular (Quintas): R$ 5,00</li>
                      <li>Clube Melhor Idade (Terças): R$ 5,00</li>
                      <li>Clube Jovem (Quartas): R$ 5,00</li>
                    </ul>
                    <p className="mt-4 text-xs text-muted-foreground">
                      *Dados de vendas de ingresso e público total em levantamento.
                    </p>
                  </div>
                </div>


              </div>

              {/* Elementos decorativos */}

            </div>
          </div>

          {/* Recorte de Jornal */}
          <div className="mt-16 flex justify-center">
            <div className="relative transform rotate-2 hover:rotate-0 transition-transform duration-500 max-w-2xl">
              <img
                src={newspaperClipping}
                alt="Recorte de jornal antigo sobre o Cinema Novo"
                className="w-full rounded shadow-2xl sepia opacity-90 hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Ato3Salvador;
