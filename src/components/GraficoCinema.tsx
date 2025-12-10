import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const GraficoCinema = () => {
    const [activeTab, setActiveTab] = useState<"lancamentos" | "sessoes" | "publico" | "renda">("lancamentos");

    // Data structure
    const data = {
        lancamentos: [
            { year: '2018', nac: 39, est: 61 },
            { year: '2019', nac: 37.5, est: 62.5 },
            { year: '2020', nac: 34, est: 66 },
            { year: '2021', nac: 41.5, est: 58.5 },
            { year: '2022', nac: 45, est: 55 },
            { year: '2023', nac: 39, est: 61 },
        ],
        sessoes: [
            { year: '2018', nac: 16, est: 84 },
            { year: '2019', nac: 15, est: 85 },
            { year: '2020', nac: 13.5, est: 86.5 },
            { year: '2021', nac: 3.5, est: 96.5 },
            { year: '2022', nac: 8.5, est: 91.5 },
            { year: '2023', nac: 7.5, est: 92.5 },
            { year: '2024', nac: 15.5, est: 84.5 },
        ],
        publico: [
            { year: '2018', nac: 14.5, est: 85.5 },
            { year: '2019', nac: 13.5, est: 86.5 },
            { year: '2020', nac: 23, est: 77 },
            { year: '2021', nac: 1.5, est: 98.5 },
            { year: '2022', nac: 4, est: 96 },
            { year: '2023', nac: 3, est: 97 },
            { year: '2024', nac: 10, est: 90 },
        ],
        renda: [
            { year: '2018', nac: 11.5, est: 88.5 },
            { year: '2019', nac: 11.5, est: 88.5 },
            { year: '2020', nac: 22.5, est: 77.5 },
            { year: '2021', nac: 1.5, est: 98.5 },
            { year: '2022', nac: 4, est: 96 },
            { year: '2023', nac: 3, est: 97 },
            { year: '2024', nac: 10, est: 90 },
        ]
    };

    const titles = {
        lancamentos: "LANÇAMENTOS",
        sessoes: "SESSÕES",
        publico: "PÚBLICO",
        renda: "RENDA"
    };

    const descriptions = {
        lancamentos: "Porcentagem de títulos brasileiros vs. internacionais lançados.",
        sessoes: "Ocupação das salas de cinema por filmes nacionais.",
        publico: "Total de espectadores que escolheram filmes nacionais.",
        renda: "Arrecadação de bilheteria das produções brasileiras. Fonte: Ancine."
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-black border-2 border-primary p-4 shadow-[4px_4px_0px_0px_rgba(138,28,28,1)]">
                    <p className="font-stencil text-accent text-lg mb-2 border-b border-primary/30 pb-1">{label}</p>
                    <div className="space-y-1 font-grotesque">
                        <p className="text-accent">
                            <span className="text-white uppercase text-xs tracking-wider mr-2">Nacional:</span>
                            {payload[0].value}%
                        </p>
                        <p className="text-primary">
                            <span className="text-white uppercase text-xs tracking-wider mr-2">Internacional:</span>
                            {payload[1].value}%
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full max-w-5xl mx-auto my-16">
            <div className="relative">
                <div className="absolute inset-0 bg-accent/5 blur-xl" />
                <div className="relative bg-card/80 border-2 border-accent/50 p-6 md:p-10 rounded-xl backdrop-blur-sm shadow-none overflow-hidden">
                    {/* Texture Overlay */}
                    <div className="absolute inset-0 film-grain opacity-20 pointer-events-none" />


                    {/* Header */}
                    <div className="relative z-10 mb-10 text-center">
                        <h3 className="font-stencil text-2xl text-accent mb-4 tracking-wider uppercase">
                            O ABISMO DO MERCADO
                        </h3>
                        <p className="font-grotesque text-white/70 text-lg max-w-2xl mx-auto">
                            A luta desigual do cinema brasileiro nas salas de exibição (2018-2024)
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="relative z-10 flex flex-wrap justify-center gap-4 mb-10">
                        {(Object.keys(data) as Array<keyof typeof data>).map((key) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={`px-6 py-2 font-stencil text-sm md:text-base tracking-widest transition-all duration-300 border-2 
                ${activeTab === key
                                        ? "bg-primary text-white border-primary shadow-[4px_4px_0px_0px_rgba(212,175,55,1)] translate-y-[-2px]"
                                        : "bg-transparent text-primary border-primary/50 hover:border-primary hover:bg-primary/10"
                                    }`}
                            >
                                {titles[key]}
                            </button>
                        ))}
                    </div>

                    {/* Chart Container */}
                    <div className="relative z-10 h-[400px] w-full bg-white/5 border border-white/10 rounded p-4 mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data[activeTab]}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis
                                    dataKey="year"
                                    stroke="#d4af37"
                                    tick={{ fontFamily: 'stencil', fontSize: 14 }}
                                    tickLine={false}
                                    axisLine={{ stroke: '#8a1c1c', strokeWidth: 2 }}
                                />
                                <YAxis
                                    stroke="#888"
                                    tick={{ fontFamily: 'grotesque', fontSize: 12, fill: '#888' }}
                                    tickFormatter={(value) => `${value}%`}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
                                <Bar dataKey="nac" name="Nacional" stackId="a" fill="#d4af37" radius={[0, 0, 0, 0]} barSize={40}>
                                    {data[activeTab].map((entry, index) => (
                                        <Cell key={`cell-nac-${index}`} stroke="black" strokeWidth={1} />
                                    ))}
                                </Bar>
                                <Bar dataKey="est" name="Internacional" stackId="a" fill="#8a1c1c" radius={[2, 2, 0, 0]} barSize={40}>
                                    {data[activeTab].map((entry, index) => (
                                        <Cell key={`cell-est-${index}`} stroke="black" strokeWidth={1} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Legend & Description */}
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 bg-black/50 p-6 border border-white/10 rounded">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-accent border border-black" />
                                <span className="font-grotesque text-white text-sm uppercase tracking-wider">Nacional</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-primary border border-black" />
                                <span className="font-grotesque text-white text-sm uppercase tracking-wider">Internacional</span>
                            </div>
                        </div>

                        <p className="font-grotesque text-white/60 text-sm text-right italic">
                            {descriptions[activeTab]}
                        </p>
                    </div>

                    {/* Decorative Corner */}
                    <div className="absolute bottom-2 right-2 text-white/10 font-stencil text-6xl pointer-events-none select-none">
                        %
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GraficoCinema;
