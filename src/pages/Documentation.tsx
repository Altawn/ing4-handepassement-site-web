import React, { useState } from 'react';
import HeaderClient from '../components/HeaderClient';
import FooterMain from '../components/FooterMain';
import Oeil from '../components/Oeil';
import { Search, ChevronDown, ChevronUp, FileText } from 'lucide-react';

interface DocSection {
    id: string;
    title: string;
    subtitle: string;
    content: string;
}

const Documentation: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    const docSections: DocSection[] = [
        {
            id: 'dyslexie',
            title: 'Dyslexie',
            subtitle: 'Comprendre et accompagner la dyslexie',
            content: "La dyslexie est un trouble spécifique de l'apprentissage de la lecture. Les aménagements possibles incluent : temps majoré pour les examens (tiers-temps), utilisation de logiciels de synthèse vocale, polices adaptées (comme OpenDyslexic), et supports de cours numérisés."
        },
        {
            id: 'tdah',
            title: 'TDAH (Trouble Déficit de l\'Attention avec Hyperactivité)',
            subtitle: 'Informations sur le TDAH et ses aménagements',
            content: "Le TDAH se caractérise par des difficultés d'attention, d'impulsivité et parfois d'hyperactivité. Aménagements : pauses régulières pendant les examens, salle d'examen isolée ou en petit groupe, autorisation de bouger, consignes scindées et claires."
        },
        {
            id: 'tsa',
            title: 'Troubles du Spectre Autistique (TSA)',
            subtitle: 'Accompagnement des étudiants autistes',
            content: "Les étudiants avec TSA peuvent avoir des besoins spécifiques en communication et interaction sociale. Aménagements : emploi du temps stable, tuteur pédagogique, consignes explicites, environnement calme, possibilité de s'isoler."
        },
        {
            id: 'phobie',
            title: 'Phobie Scolaire',
            subtitle: 'Soutien pour la phobie scolaire et l\'anxiété',
            content: "L'anxiété scolaire peut nécessiter une reprise progressive des cours, un accompagnement psychologique, des aménagements pour les oraux (passer seul avec l'enseignant), et un accès aux cours à distance si nécessaire."
        },
        {
            id: 'dyscalculie',
            title: 'Dyscalculie',
            subtitle: 'Soutien pour les troubles du calcul',
            content: "La dyscalculie affecte les compétences numériques. Aménagements : utilisation de la calculatrice, tables de multiplication et formulaires autorisés, temps supplémentaire, exercices aérés."
        },
        {
            id: 'moteur',
            title: 'Handicap Moteur',
            subtitle: 'Accessibilité et aménagements physiques',
            content: "L'accessibilité physique est primordiale. Aménagements : ascenseurs, rampes d'accès, mobilier adapté (tables réglables), assistance humaine pour la prise de notes ou les déplacements, temps de déplacement inter-cours aménagé."
        }
    ];

    const toggleSection = (id: string) => {
        if (expandedSection === id) {
            setExpandedSection(null);
        } else {
            setExpandedSection(id);
        }
    };

    const filteredSections = docSections.filter(section =>
        section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white font-sans flex flex-col">
            <HeaderClient />

            <main className="flex-grow container mx-auto px-4 lg:px-8 py-8 max-w-5xl">
                <div className="mb-8">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Documentation</h1>
                    <p className="text-gray-500 text-lg">Informations sur les différents types de handicaps et les aménagements disponibles</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-3xl p-6 lg:p-8 shadow-sm mb-12 relative overflow-hidden">
                    {/* Search Bar */}
                    <div className="flex justify-end mb-8">
                        <div className="relative w-full max-w-xs">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-brand focus:border-brand sm:text-sm transition duration-150 ease-in-out"
                                placeholder="Rechercher"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Info Header */}
                    <div className="flex items-center gap-2 text-brand mb-6">
                        <FileText className="h-5 w-5" />
                        <span className="font-medium">Cliquez sur chaque section pour en savoir plus</span>
                    </div>

                    {/* Accordion List */}
                    <div className="space-y-4">
                        {filteredSections.map((section) => (
                            <div key={section.id} className="border-b border-gray-100 last:border-0">
                                <button
                                    onClick={() => toggleSection(section.id)}
                                    className="w-full text-left py-4 flex items-center justify-between focus:outline-none group"
                                >
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-brand transition-colors">
                                            {section.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm mt-1">
                                            {section.subtitle}
                                        </p>
                                    </div>
                                    <div className="ml-4 flex-shrink-0 text-gray-400">
                                        {expandedSection === section.id ? (
                                            <ChevronUp className="h-5 w-5" />
                                        ) : (
                                            <ChevronDown className="h-5 w-5" />
                                        )}
                                    </div>
                                </button>
                                {expandedSection === section.id && (
                                    <div className="pb-6 pt-2 text-gray-600 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-200">
                                        {section.content}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Help Section */}
                <div className="bg-[#1e4066] rounded-2xl p-8 text-center text-white mb-12">
                    <h2 className="text-2xl font-bold mb-2">Besoin d'aide ?</h2>
                    <p className="text-blue-100 mb-4">
                        Notre équipe est là pour vous accompagner et répondre à toutes vos questions.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-8 text-yellow-400 font-medium">
                        <a href="mailto:associationhandepassement@gmail.com" className="hover:underline">
                            associationhandepassement@gmail.com
                        </a>
                        <span className="hidden sm:inline text-blue-400">|</span>
                        <a href="tel:+33781865744" className="hover:underline">
                            +33 7 81 86 57 44
                        </a>
                    </div>
                </div>
            </main>

            <FooterMain />
            <Oeil />
        </div>
    );
};

export default Documentation;
