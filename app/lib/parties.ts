export type Party = {
    id: string;
    name: string;
    description: string;
    logo: string; // path in public/
    candidateImage: string; // path in public/
};

export const PARTIES: Party[] = [
    {
        id: "p1",
        name: "Partido A",
        description:
            "Propuesta centrada en crecimiento económico y programas sociales sostenibles.",
        logo: "/capictive.png",
        candidateImage: "/capictive.png",
    },
    {
        id: "p2",
        name: "Partido B",
        description: "Prioriza transparencia, anticorrupción y fortalecimiento institucional.",
        logo: "/capictive.png",
        candidateImage: "/capictive.png",
    },
    {
        id: "p3",
        name: "Partido C",
        description: "Enfoque regional con proyectos de infraestructura y conectividad.",
        logo: "/capictive.png",
        candidateImage: "/capictive.png",
    },
    {
        id: "p4",
        name: "Partido D",
        description: "Agenda educativa y salud pública con innovación digital.",
        logo: "/capictive.png",
        candidateImage: "/capictive.png",
    },
    {
        id: "p5",
        name: "Partido E",
        description: "Sostenibilidad ambiental y desarrollo rural inclusivo.",
        logo: "/capictive.png",
        candidateImage: "/capictive.png",
    },
    {
        id: "p6",
        name: "Partido F",
        description: "Impulso a la seguridad ciudadana y justicia eficiente.",
        logo: "/capictive.png",
        candidateImage: "/capictive.png",
    },
    {
        id: "p7",
        name: "Partido G",
        description: "Innovación tecnológica y empleo digno para jóvenes.",
        logo: "/capictive.png",
        candidateImage: "/capictive.png",
    },
];
