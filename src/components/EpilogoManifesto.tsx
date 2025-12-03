import { useState } from "react";
import { Download } from "lucide-react";

const EpilogoManifesto = () => {
  const [selectedPhrases, setSelectedPhrases] = useState<string[]>([]);
  const [userName, setUserName] = useState("");

  const manifestoPhrases = [
    "O CINEMA É UMA ARMA",
    "A ESTÉTICA DA FOME",
    "UMA CÂMERA NA MÃO",
    "UMA IDEIA NA CABEÇA",
    "A VERDADE NÃO DUBLA",
    "DO SERTÃO AO MAR",
    "TUDO É NOSSO",
    "A REVOLUÇÃO PELA IMAGEM",
    "CONTRA O CINEMA DIGESTIVO",
    "PELA LIBERDADE DA FORMA",
    "O POVO FAMINTO GRITA",
    "A TERRA EM TRANSE",
  ];

  const togglePhrase = (phrase: string) => {
    setSelectedPhrases((prev) =>
      prev.includes(phrase)
        ? prev.filter((p) => p !== phrase)
        : [...prev, phrase]
    );
  };

  const downloadManifesto = () => {
    const manifestoText = `
╔════════════════════════════════════════╗
║   MANIFESTO GLAUBERIANO               ║
║   ${userName || "ANÔNIMO"}            ║
╚════════════════════════════════════════╝

${selectedPhrases.map((phrase) => `► ${phrase}`).join("\n\n")}

────────────────────────────────────────
"Uma câmera na mão e uma ideia na cabeça"
                              - Glauber Rocha
    `;

    const blob = new Blob([manifestoText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `manifesto-${userName || "anonimo"}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section
      id="epilogo"
      className="relative min-h-screen bg-background py-20 overflow-hidden"
    >
      {/* Background texture */}
      <div className="absolute inset-0 film-grain opacity-10" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="font-stencil text-5xl md:text-7xl text-primary mb-6 tracking-wider">
              MANIFESTO INTERATIVO
            </h2>
            <div className="w-32 h-1 bg-primary mx-auto" />
          </div>

          {/* Instruções */}
          <div className="text-center mb-12">
            <p className="font-grotesque text-lg text-foreground/80 max-w-2xl mx-auto leading-relaxed text-justify">
              Monte seu próprio manifesto glauberiano. Escolha as frases que ecoam sua visão
              revolucionária do cinema e da arte como arma de transformação.
            </p>
          </div>

          {/* Input de nome */}
          <div className="mb-12 max-w-md mx-auto">
            <label className="block font-stencil text-sm text-primary mb-3 tracking-wider">
              SEU NOME (OPCIONAL)
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Anônimo"
              className="w-full bg-background border-2 border-primary/30 px-4 py-3 
                font-grotesque text-foreground focus:border-primary focus:outline-none 
                transition-colors"
            />
          </div>

          {/* Grid de frases */}
          <div className="grid sm:grid-cols-2 gap-4 mb-16">
            {manifestoPhrases.map((phrase) => {
              const isSelected = selectedPhrases.includes(phrase);
              return (
                <button
                  key={phrase}
                  onClick={() => togglePhrase(phrase)}
                  className={`p-6 border-2 transition-all duration-300 text-left group
                    ${isSelected
                      ? "border-accent bg-accent/20 scale-105"
                      : "border-accent/30 hover:border-accent hover:bg-accent/5"
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 border-2 flex items-center justify-center flex-shrink-0 mt-1
                      ${isSelected ? "border-accent bg-accent" : "border-accent/30 group-hover:border-accent"}`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 bg-background" />
                      )}
                    </div>
                    <span className="font-stencil text-sm md:text-base text-accent leading-tight tracking-wide">
                      {phrase}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Preview do manifesto */}
          {selectedPhrases.length > 0 && (
            <div className="mb-12 relative group perspective-1000">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
              <div className="relative border-2 border-accent/50 p-10 bg-card/95 backdrop-blur-xl rounded-xl shadow-2xl transform transition-transform duration-500 hover:rotate-1">
                {/* Decorative corners */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-accent" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-accent" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent" />

                <h3 className="font-stencil text-3xl text-accent mb-8 text-center tracking-wider border-b border-accent/20 pb-4">
                  MANIFESTO GLAUBERIANO
                </h3>

                <div className="space-y-4 min-h-[200px] flex flex-col justify-center">
                  {selectedPhrases.map((phrase, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 animate-revolutionary-fade"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <span className="text-accent">►</span>
                      <p className="font-stencil text-xl text-accent tracking-wide">
                        {phrase}
                      </p>
                    </div>
                  ))}
                </div>

                {userName && (
                  <div className="mt-8 pt-4 border-t border-primary/20">
                    <p className="font-grotesque text-right text-accent text-lg italic">
                      — {userName}
                    </p>
                    <p className="font-grotesque text-right text-muted-foreground text-xs uppercase tracking-widest mt-1">
                      Revolucionário(a) do Cinema
                    </p>
                  </div>
                )}

                {/* Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none overflow-hidden">
                  <span className="font-stencil text-9xl text-primary -rotate-12 whitespace-nowrap">
                    CINEMA NOVO
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Botão de download */}
          {selectedPhrases.length > 0 && (
            <div className="text-center">
              <button
                onClick={downloadManifesto}
                className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground 
                  font-stencil text-lg tracking-wider hover:bg-primary/90 transition-all 
                  hover:scale-105 active:scale-95"
              >
                <Download className="w-5 h-5" />
                BAIXAR MANIFESTO
              </button>
            </div>
          )}

          {/* Citação final */}
          <div className="mt-20 text-center">
            <blockquote className="font-stencil text-3xl md:text-5xl text-primary tracking-wider leading-tight">
              O CINEMA É UMA ARMA
            </blockquote>
            <p className="font-grotesque text-sm text-muted-foreground mt-6">
              Glauber Rocha (1939-1981)
            </p>
          </div>

          {/* Ficha Técnica */}
          <div className="mt-24 border-t-2 border-primary/30 pt-16">
            <h3 className="font-stencil text-3xl md:text-4xl text-primary mb-12 text-center tracking-wider">
              FICHA TÉCNICA
            </h3>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Projeto */}
              <div className="space-y-4">
                <h4 className="font-stencil text-xl text-accent mb-6 tracking-wider">
                  PROJETO
                </h4>
                <div className="space-y-3 font-grotesque text-foreground/80">
                  <div>
                    <span className="text-primary font-semibold">Título:</span>
                    <p className="mt-1">A definir</p>
                  </div>
                  <div>
                    <span className="text-primary font-semibold">Formato:</span>
                    <p className="mt-1">Reportagem multimídia interativa</p>
                  </div>
                  <div>
                    <span className="text-primary font-semibold">Ano:</span>
                    <p className="mt-1">2025</p>
                  </div>
                  <div>
                    <span className="text-primary font-semibold">Instituição:</span>
                    <p className="mt-1">Faculdade de Comunicação Social - Jornalismo UFRB</p>
                  </div>
                </div>
              </div>

              {/* Equipe Jornalística */}
              <div className="space-y-4">
                <h4 className="font-stencil text-xl text-accent mb-6 tracking-wider">
                  EQUIPE JORNALÍSTICA
                </h4>
                <div className="space-y-3 font-grotesque text-foreground/80">
                  <div>
                    <span className="text-primary font-semibold">Editoria:</span>
                    <p className="mt-1">Cultura</p>
                  </div>
                  <div>
                    <span className="text-primary font-semibold">Redação:</span>
                    <p className="mt-1">Adrielle Alvim e Sinara Oliveira</p>
                  </div>
                  <div>
                    <span className="text-primary font-semibold">Fotógrafo:</span>
                    <p className="mt-1">Caique Fernandes</p>
                  </div>
                  <div>
                    <span className="text-primary font-semibold">Áudio:</span>
                    <p className="mt-1">Kailane Rodrigues</p>
                  </div>
                  <div>
                    <span className="text-primary font-semibold">Vídeo:</span>
                    <p className="mt-1">Raiane Santos</p>
                  </div>
                  <div>
                    <span className="text-primary font-semibold">Revisão:</span>
                    <p className="mt-1">Luiza Vitor</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Créditos adicionais */}
            <div className="mt-12 pt-8 border-t border-primary/20">
              <p className="font-grotesque text-sm text-muted-foreground text-center leading-relaxed">
                Este projeto nasceu como um trabalho da disciplina de Edição Jornalística do curso de Jornalismo da UFRB, celebrando o legado de Glauber Rocha e a força do cinema nacional como um todo.
              </p>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default EpilogoManifesto;
