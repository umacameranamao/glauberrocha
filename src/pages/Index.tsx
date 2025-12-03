import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Ato1Bahia from "@/components/Ato1Bahia";
import Ato2Ideia from "@/components/Ato2Ideia";
import Ato3Salvador from "@/components/Ato3Salvador";
import Ato4Revolucao from "@/components/Ato4Revolucao";
import GaleriaNegativo from "@/components/GaleriaNegativo";
import EpilogoManifesto from "@/components/EpilogoManifesto";

const Index = () => {
  return (
    <div className="relative">
      <Navigation />
      <main>
        <Hero />
        <Ato1Bahia />
        <Ato2Ideia />
        <Ato3Salvador />
        <Ato4Revolucao />
        <GaleriaNegativo />
        <EpilogoManifesto />
      </main>
    </div>
  );
};

export default Index;
