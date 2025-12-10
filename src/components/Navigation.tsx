import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  const sections = [
    { id: "hero", label: "Início" },
    { id: "ato1", label: "A cena pop" },
    { id: "ato2", label: "Visão crítica" },
    { id: "ato3", label: "Luta pela distribuição" },
    { id: "ato4", label: "O contraste de cinemas" },
    { id: "epilogo", label: "Manifesto Interativo" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-primary/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h2 className="font-stencil text-lg text-primary tracking-wider">GLAUBER ROCHA</h2>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="xl:hidden text-foreground hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <ul className="hidden xl:flex gap-6">
              {sections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className={`font-grotesque text-sm hover:text-red-600 transition-colors relative ${activeSection === section.id ? "text-red-600" : "text-accent"
                      }`}
                  >
                    {section.label}
                    {activeSection === section.id && (
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-600" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="fixed inset-0 z-40 xl:hidden bg-background/95 backdrop-blur-md">
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`font-grotesque text-2xl hover:text-red-600 transition-colors ${activeSection === section.id ? "text-red-600" : "text-accent"
                  }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
