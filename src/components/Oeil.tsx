import { useState } from 'react';
import { Eye, X, Type, AlignJustify, Palette, Sun } from 'lucide-react';

interface AccessibilitySettings {
    fontSize: number;
    letterSpacing: number;
    colorBlindMode: 'normal' | 'protan' | 'deutan' | 'tritan';
    contrast: 'normal' | 'high';
}

const Oeil = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [settings, setSettings] = useState<AccessibilitySettings>({
        fontSize: 16,
        letterSpacing: 0,
        colorBlindMode: 'normal',
        contrast: 'normal'
    });

    const applySettings = () => {
        const root = document.documentElement;

        // Apply font size
        root.style.setProperty('--base-font-size', `${settings.fontSize}px`);

        // Apply letter spacing
        root.style.setProperty('--letter-spacing', `${settings.letterSpacing}px`);

        // Apply color blind mode filters
        if (settings.colorBlindMode !== 'normal') {
            root.classList.add(`colorblind-${settings.colorBlindMode}`);
        } else {
            root.classList.remove('colorblind-protan', 'colorblind-deutan', 'colorblind-tritan');
        }

        // Apply contrast
        if (settings.contrast === 'high') {
            root.classList.add('high-contrast');
        } else {
            root.classList.remove('high-contrast');
        }
    };

    const resetSettings = () => {
        setSettings({
            fontSize: 16,
            letterSpacing: 0,
            colorBlindMode: 'normal',
            contrast: 'normal'
        });

        const root = document.documentElement;
        root.style.removeProperty('--base-font-size');
        root.style.removeProperty('--letter-spacing');
        root.classList.remove('colorblind-protan', 'colorblind-deutan', 'colorblind-tritan', 'high-contrast');
    };

    const handleFontSizeChange = (value: number) => {
        setSettings({ ...settings, fontSize: value });
    };

    const handleLetterSpacingChange = (value: number) => {
        setSettings({ ...settings, letterSpacing: value });
    };

    const handleColorBlindMode = (mode: 'normal' | 'protan' | 'deutan' | 'tritan') => {
        setSettings({ ...settings, colorBlindMode: mode });
    };

    const handleContrast = (contrast: 'normal' | 'high') => {
        setSettings({ ...settings, contrast: contrast });
    };

    // Apply settings whenever they change
    useState(() => {
        applySettings();
    });

    return (
        <>
            {/* Eye Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-8 right-8 w-14 h-14 bg-brand rounded-full flex items-center justify-center shadow-2xl hover:bg-brand-600 transition-colors z-50 border-2 border-white"
                aria-label="Paramètres d'accessibilité"
            >
                <Eye className="w-6 h-6 text-white" />
            </button>

            {/* Accessibility Panel */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/30 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Panel */}
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl shadow-2xl z-50 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-brand/10 rounded-full flex items-center justify-center">
                                        <Eye className="w-5 h-5 text-brand" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Paramètres d'accessibilité
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Font Size */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Type className="w-5 h-5 text-brand" />
                                        <h3 className="font-bold text-gray-900">Taille du texte</h3>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Ajustez la taille du texte pour une meilleure lisibilité
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => handleFontSizeChange(Math.max(12, settings.fontSize - 2))}
                                            className="px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 font-bold"
                                        >
                                            -
                                        </button>
                                        <div className="flex-1 text-center">
                                            <span className="text-2xl font-bold text-brand">{settings.fontSize}px</span>
                                            <p className="text-xs text-gray-500">augmentez ou diminuez</p>
                                        </div>
                                        <button
                                            onClick={() => handleFontSizeChange(Math.min(24, settings.fontSize + 2))}
                                            className="px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 font-bold"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Exemple de texte avec la taille sélectionnée
                                    </p>
                                </div>

                                <hr className="border-gray-200" />

                                {/* Letter Spacing */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <AlignJustify className="w-5 h-5 text-brand" />
                                        <h3 className="font-bold text-gray-900">Espacement des lettres</h3>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Augmentez l'espace entre les lettres
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => handleLetterSpacingChange(Math.max(0, settings.letterSpacing - 0.5))}
                                            className="px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 font-bold"
                                        >
                                            -
                                        </button>
                                        <div className="flex-1 text-center">
                                            <span className="text-2xl font-bold text-brand">{settings.letterSpacing.toFixed(1)}px</span>
                                            <p className="text-xs text-gray-500">augmentez ou diminuez</p>
                                        </div>
                                        <button
                                            onClick={() => handleLetterSpacingChange(Math.min(5, settings.letterSpacing + 0.5))}
                                            className="px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 font-bold"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Exemple de texte avec : Espacement additionnel
                                    </p>
                                </div>

                                <hr className="border-gray-200" />

                                {/* Color Blind Mode */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Palette className="w-5 h-5 text-brand" />
                                        <h3 className="font-bold text-gray-900">Mode daltonien</h3>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Ajustez les couleurs selon le type de daltonisme
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => handleColorBlindMode('normal')}
                                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${settings.colorBlindMode === 'normal'
                                                    ? 'bg-brand text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            Normal
                                        </button>
                                        <button
                                            onClick={() => handleColorBlindMode('protan')}
                                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${settings.colorBlindMode === 'protan'
                                                    ? 'bg-brand text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            Protanopie (rouge)
                                        </button>
                                        <button
                                            onClick={() => handleColorBlindMode('deutan')}
                                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${settings.colorBlindMode === 'deutan'
                                                    ? 'bg-brand text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            Deutéranopie (vert)
                                        </button>
                                        <button
                                            onClick={() => handleColorBlindMode('tritan')}
                                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${settings.colorBlindMode === 'tritan'
                                                    ? 'bg-brand text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            Tritanopie (bleu)
                                        </button>
                                    </div>
                                </div>

                                <hr className="border-gray-200" />

                                {/* Contrast */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Sun className="w-5 h-5 text-brand" />
                                        <h3 className="font-bold text-gray-900">Contraste</h3>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Augmentez le contraste pour une meilleure visibilité
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => handleContrast('normal')}
                                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${settings.contrast === 'normal'
                                                    ? 'bg-brand text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            Contraste normal
                                        </button>
                                        <button
                                            onClick={() => handleContrast('high')}
                                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${settings.contrast === 'high'
                                                    ? 'bg-brand text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            Contraste élevé
                                        </button>
                                    </div>
                                </div>

                                <hr className="border-gray-200" />

                                {/* Reset Button */}
                                <button
                                    onClick={resetSettings}
                                    className="w-full py-3 text-brand font-semibold hover:bg-brand/5 rounded-lg transition-colors"
                                >
                                    ↻ Réinitialiser tous les paramètres
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Oeil;
