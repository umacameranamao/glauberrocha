import { useRef, useState } from "react";
import { Camera } from "lucide-react";
import cineMadrigal from "@/assets/cine-madrigal.jpg";
import cineGlauberExterior from "@/assets/cine-glauber-exterior.jpg";
import GraficoCinema from "./GraficoCinema";

const Ato4Revolucao = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [sliderValue, setSliderValue] = useState(50);

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

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <h2 className="font-stencil text-5xl md:text-7xl text-primary mb-6 tracking-wider">
              O "DUELO" DOS CINEMAS DE RUA
            </h2>
          </div>

          {/* Texto Jornalístico */}
          <div className="prose prose-lg prose-invert mx-auto space-y-8">
            <p className="font-grotesque text-lg text-foreground/90 leading-relaxed text-justify max-w-3xl mx-auto">
              Em Vitória da Conquista, sua terra natal, as ruínas do Cine Madrigal, fechado desde 2007 e alvo de promessas não cumpridas de restauração, simbolizam o abandono dos espaços culturais no interior. O prédio, que um dia reuniu a população em torno da tela grande, hoje resiste apenas na memória da cidade. A imagem difere do Cine Glauber Rocha, em Salvador, um dos últimos cinemas de rua em funcionamento na capital baiana, que se tornou símbolo de resistência.
            </p>

            <p className="font-grotesque text-lg text-foreground/80 leading-relaxed text-justify max-w-3xl mx-auto">
              O contraste entre o Madrigal e o Glauber Rocha reflete o próprio paradoxo que o cineasta viveu: um artista que falava sobre o povo, mas que o povo nem sempre conseguia ver. É possível que a falta de acesso ao cinema no interior seja a causa de muitos conterrâneos ainda desconhecerem sua obra.
            </p>

            {/* Comparativo Visual: Slider */}
            <div className="my-16 not-prose">
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
                Arraste para comparar as realidades dos cinemas
              </p>
            </div>

            <p className="font-grotesque text-lg text-foreground/80 leading-relaxed text-justify max-w-3xl mx-auto">
              Por isso, a reportagem também propõe refletir sobre como os filmes nacionais chegam ao público. Como essas produções são divulgadas? Quem é esse público e onde ele está? A concentração de salas de cinema nas grandes cidades e a dependência de patrocínios e editais ainda limitam o acesso. É preciso observar como esses espaços são viabilizados e quais produções ganham visibilidade suficiente para despertar o interesse da população, especialmente entre aqueles que normalmente não têm acesso a esses espaços culturais.
            </p>

            {/* Gráfico de Dados */}
            <GraficoCinema />

            <p className="font-grotesque text-lg text-foreground/80 leading-relaxed text-justify max-w-3xl mx-auto">
              Pensar no legado de Glauber é, portanto, também pensar em como o cinema nacional pode ser mais acessível, formador de pensamento crítico e instrumento de educação.
            </p>

            {/* Fechamento Destacado */}
            <div className="mt-16 p-8 border-l-4 border-primary bg-primary/5 rounded-r-xl">
              <p className="font-grotesque text-xl text-foreground italic leading-relaxed">
                "Entender que sua revolução era, acima de tudo, uma batalha por acesso e representação. Uma batalha que, a julgar pelas ruínas do Cine Madrigal e estrutura de distribuição e exibição no país, ainda está longe de terminar."
              </p>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Ato4Revolucao;
