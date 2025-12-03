import { useEffect, useRef, useState } from "react";

import glauberPortrait from "@/assets/glauber-portrait.png";

const Ato2Ideia = () => {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      id="ato2"
      ref={sectionRef}
      className="relative min-h-screen bg-background py-20 overflow-hidden"
    >
      {/* Background com textura */}
      <div className="absolute inset-0 film-grain opacity-10" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header com imagem */}
          <div className="mb-20 text-center">


            <h2 className="font-stencil text-5xl md:text-7xl text-primary mb-6 tracking-wider">
              O QUE GLAUBER ENTENDIA POR "CULTURA"
            </h2>
          </div>

          {/* Glauber Portrait */}
          <div className="mb-20 flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary shadow-2xl grayscale hover:grayscale-0 transition-all duration-500">
              <img src={glauberPortrait} alt="Glauber Rocha" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Texto Jornalístico Corrido */}
          <div className="max-w-3xl mx-auto space-y-8 mb-20 text-left">
            <div className="prose prose-lg prose-invert mx-auto">
              <p className="font-grotesque text-lg text-foreground/90 leading-relaxed text-justify first-letter:text-5xl first-letter:font-stencil first-letter:text-primary first-letter:mr-3 first-letter:float-left">
                A visão de Glauber Rocha começou a se formar no fim dos anos 1950, quando ele participava do Clube de Cinema da Bahia, e em seguida, passou a escrever sobre cinema no Suplemento Dominical do Jornal do Brasil, no Rio de Janeiro.
              </p>

              <p className="font-grotesque text-lg text-foreground/80 leading-relaxed text-justify">
                Em 1959, Glauber criticou o filme <span className="italic text-primary">Orfeu Negro</span>, feito por um diretor francês, por mostrar a favela de forma bonita e poética, mas sem entender a realidade das pessoas que viviam ali. Para ele, o verdadeiro problema do Brasil era a fome e a miséria, e não uma versão romantizada da pobreza criada para agradar o público estrangeiro.
              </p>

              <p className="font-grotesque text-lg text-foreground/80 leading-relaxed text-justify">
                Dois anos depois, em 1961, Glauber lançou seu primeiro longa-metragem, <span className="italic text-primary">Barravento</span>. O filme foi uma resposta direta a esse tipo de olhar estrangeiro e marcou o início do movimento conhecido como Cinema Novo, que queria mostrar o Brasil de forma real, sem esconder seus conflitos sociais.
              </p>

              <p className="font-grotesque text-lg text-foreground/80 leading-relaxed text-justify">
                Vale ressaltar que ele nasceu em Vitória da Conquista, no sudoeste da Bahia, em 1939. A origem nordestina teve papel decisivo em sua visão de mundo e em sua forma de fazer cinema. Desde a infância, as viagens pelo interior o colocaram em contato com temas que mais tarde apareceriam em seus filmes, como a seca, o cangaço, a religiosidade popular e a desigualdade social.
              </p>

              <p className="font-grotesque text-lg text-foreground/80 leading-relaxed text-justify">
                Glauber pensou o Brasil a partir de dentro, com um olhar que nascia da própria experiência, não de uma perspectiva externa ou idealizada. É por isso que suas obras soam tão intensas e políticas: elas são fruto de uma vivência concreta, transformada em linguagem cinematográfica.
              </p>
            </div>
          </div>

          {/* Bloco Explicativo: O Olhar do Outro */}
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-accent/5 blur-xl" />
            <div className="relative p-10 border-2 rounded-xl backdrop-blur-sm border-accent/50 bg-card/80">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-2 h-full bg-accent" />
                <div className="flex-1">
                  <h3 className="font-stencil text-3xl md:text-4xl text-accent mb-4 tracking-wider leading-tight">
                    O OLHAR DO OUTRO
                  </h3>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <p className="font-grotesque text-lg text-foreground/90 leading-relaxed text-justify">
                    Para Glauber, o "olhar do outro" (ou olhar estrangeiro) era uma forma de colonização cultural. Quando cineastas europeus ou americanos filmavam o Brasil, muitas vezes buscavam o exótico, transformando nossa miséria em folclore.
                  </p>
                  <p className="font-grotesque text-lg text-foreground/90 leading-relaxed text-justify">
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


        </div>
      </div>

    </section>
  );
};

export default Ato2Ideia;
