"use client";

import { FC, useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ControlSlider } from "@/components/design-system/molecules/controls/control-slider";
import { Switch } from "@/components/design-system/atoms/buttons/switch";
import { matrixRainPanelOpenEvent } from "@/lib/command-palette/command-palette-events";
import {
    MATRIX_RAIN_DEFAULTS,
    MATRIX_RAIN_PRESETS,
    MatrixRainSettings,
    readMatrixSettings,
    writeMatrixSettings,
} from "@/lib/matrix-settings/matrix-settings";
import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";
import { MdClose } from "react-icons/md";
import { useGlassmorphism } from "@/components/design-system/hooks/use-glassmorphism";
import { Button } from "@/components/design-system/atoms/buttons/button";

const RAIN_DENSITY_MIN = 0.80;
const RAIN_DENSITY_MAX = 0.99;
const RAIN_STEP_RATE_MIN = 4;
const RAIN_STEP_RATE_MAX = 30;
const FONT_SIZE_STEPS = [12, 16, 20, 24, 28, 32, 36, 40] as const;
const BLOOM_INTENSITY_MIN = 0.5;
const BLOOM_INTENSITY_MAX = 3.0;
const BLOOM_THRESHOLD_MIN = 0.3;
const BLOOM_THRESHOLD_MAX = 1.2;
const BLOOM_EMISSION_MIN = 1.0;
const BLOOM_EMISSION_MAX = 2.5;
const CRT_SCANLINE_MIN = 0.0;
const CRT_SCANLINE_MAX = 0.8;
const CRT_ABERRATION_MIN = 0.0;
const CRT_ABERRATION_MAX = 3.0;

const fontSizeToSliderIndex = (fs: number): number => {
    const idx = FONT_SIZE_STEPS.indexOf(fs as (typeof FONT_SIZE_STEPS)[number]);
    return idx >= 0 ? idx : 2;
};

export const MatrixRainControlPanel: FC = () => {
    const { glassmorphismClass } = useGlassmorphism({ noScale: true, increaseContrast: true });
    const [open, setOpen] = useState(false);
    const [settings, setSettings] = useState<MatrixRainSettings>(MATRIX_RAIN_DEFAULTS);
    const [fontSizeDragIndex, setFontSizeDragIndex] = useState<number | null>(null);

    const close = useCallback(() => setOpen(false), []);

    useEffect(() => {
        const handleOpen = () => {
            setSettings(readMatrixSettings());
            setOpen(true);
        };
        window.addEventListener(matrixRainPanelOpenEvent, handleOpen);
        return () => window.removeEventListener(matrixRainPanelOpenEvent, handleOpen);
    }, []);

    useEffect(() => {
        if (!open) {
            return;
        }
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                close();
            }
        };
        window.addEventListener("keydown", handleEsc, true);
        return () => window.removeEventListener("keydown", handleEsc, true);
    }, [open, close]);

    const applySettings = useCallback((next: MatrixRainSettings) => {
        setSettings(next);
        writeMatrixSettings(next);
    }, []);

    const applyPreset = (presetName: string) => {
        const preset = MATRIX_RAIN_PRESETS[presetName];
        if (!preset) {
            return;
        }
        trackWith({
            category: tracking.category.command_palette,
            label: tracking.label.body,
            action: tracking.action.command_palette_matrix_rain_preset_selected,
        });
        setFontSizeDragIndex(null);
        applySettings(preset);
    };

    const fontSizeSliderIndex = fontSizeToSliderIndex(settings.rain.fontSize);
    const fontSizeThumbIndex = fontSizeDragIndex ?? fontSizeSliderIndex;
    const fontSizeDisplayValue = String(FONT_SIZE_STEPS[fontSizeThumbIndex] ?? settings.rain.fontSize);

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        key="matrix-rain-panel"
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className={
                            `${glassmorphismClass} overflow-x-hidden hide-scrollbar container-fixed fixed z-40 overflow-y-auto bottom-0 left-0 right-0 max-h-[60vh]`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4 pb-24 flex flex-col gap-2">
                            <div className="flex justify-between items-center mb-2">
                                <h4>{">"} Matrix Rain Settings</h4>
                                <button
                                    type="button"
                                    onClick={close}
                                    className="text-accent/50 hover:text-accent transition-colors duration-100 cursor-pointer"
                                    aria-label="Close panel"
                                >
                                    <MdClose size={18} />
                                </button>
                            </div>

                            <h5>Presets</h5>
                            <div className="flex flex-wrap gap-2">
                                {Object.keys(MATRIX_RAIN_PRESETS).map((name) => (
                                    <Button
                                        key={name}
                                        type="button"
                                        onClick={() => applyPreset(name)}
                                        className={[
                                            JSON.stringify(settings) === JSON.stringify(MATRIX_RAIN_PRESETS[name])
                                                ? "border-accent text-accent!"
                                                : "",
                                        ].join(" ")}
                                    >
                                        {name}
                                    </Button>
                                ))}
                            </div>

                            <h5>Rain</h5>
                            <ControlSlider
                                label="Respawn probability threshold"
                                value={settings.rain.density}
                                min={RAIN_DENSITY_MIN}
                                max={RAIN_DENSITY_MAX}
                                step={0.01}
                                onChange={(v) => applySettings({ ...settings, rain: { ...settings.rain, density: v } })}
                                displayValue={settings.rain.density.toFixed(2)}
                            />
                            <ControlSlider
                                label="Speed (Hz)"
                                value={settings.rain.stepRate}
                                min={RAIN_STEP_RATE_MIN}
                                max={RAIN_STEP_RATE_MAX}
                                step={1}
                                onChange={(v) => applySettings({ ...settings, rain: { ...settings.rain, stepRate: v } })}
                                displayValue={String(settings.rain.stepRate)}
                            />
                            <ControlSlider
                                label="Font size"
                                value={fontSizeThumbIndex}
                                min={0}
                                max={FONT_SIZE_STEPS.length - 1}
                                step={1}
                                onChange={(v) => {
                                    const newFontSize = FONT_SIZE_STEPS[Math.round(v)] ?? MATRIX_RAIN_DEFAULTS.rain.fontSize;

                                    if (newFontSize !== settings.rain.fontSize) {
                                        applySettings({ ...settings, rain: { ...settings.rain, fontSize: newFontSize } });
                                    }
                                }}
                                displayValue={fontSizeDisplayValue}
                            />

                            <div className="flex justify-between items-center mt-2">
                                <h5 className="mb-0">Bloom</h5>
                                <Switch
                                    checked={settings.bloom.enabled}
                                    onChange={(v) =>
                                        applySettings({ ...settings, bloom: { ...settings.bloom, enabled: v } })
                                    }
                                    label="Toggle bloom"
                                />
                            </div>
                            {settings.bloom.enabled && (
                                <>
                                    <ControlSlider
                                        label="intensity"
                                        value={settings.bloom.intensity}
                                        min={BLOOM_INTENSITY_MIN}
                                        max={BLOOM_INTENSITY_MAX}
                                        step={0.05}
                                        onChange={(v) =>
                                            applySettings({ ...settings, bloom: { ...settings.bloom, intensity: v } })
                                        }
                                        displayValue={settings.bloom.intensity.toFixed(2)}
                                    />
                                    <ControlSlider
                                        label="threshold"
                                        value={settings.bloom.threshold}
                                        min={BLOOM_THRESHOLD_MIN}
                                        max={BLOOM_THRESHOLD_MAX}
                                        step={0.05}
                                        onChange={(v) =>
                                            applySettings({ ...settings, bloom: { ...settings.bloom, threshold: v } })
                                        }
                                        displayValue={settings.bloom.threshold.toFixed(2)}
                                    />
                                    <ControlSlider
                                        label="emission"
                                        value={settings.bloom.emission}
                                        min={BLOOM_EMISSION_MIN}
                                        max={BLOOM_EMISSION_MAX}
                                        step={0.05}
                                        onChange={(v) =>
                                            applySettings({ ...settings, bloom: { ...settings.bloom, emission: v } })
                                        }
                                        displayValue={settings.bloom.emission.toFixed(2)}
                                    />
                                </>
                            )}

                            <div className="flex justify-between items-center mt-2">
                                <h5 className="mb-0">CRT</h5>
                                <Switch
                                    checked={settings.crt.enabled}
                                    onChange={(v) =>
                                        applySettings({ ...settings, crt: { ...settings.crt, enabled: v } })
                                    }
                                    label="Toggle CRT"
                                />
                            </div>
                            {settings.crt.enabled && (
                                <>
                                    <ControlSlider
                                        label="scanlines"
                                        value={settings.crt.scanlineStrength}
                                        min={CRT_SCANLINE_MIN}
                                        max={CRT_SCANLINE_MAX}
                                        step={0.05}
                                        onChange={(v) =>
                                            applySettings({ ...settings, crt: { ...settings.crt, scanlineStrength: v } })
                                        }
                                        displayValue={settings.crt.scanlineStrength.toFixed(2)}
                                    />
                                    <ControlSlider
                                        label="aberration"
                                        value={settings.crt.aberration}
                                        min={CRT_ABERRATION_MIN}
                                        max={CRT_ABERRATION_MAX}
                                        step={0.1}
                                        onChange={(v) =>
                                            applySettings({ ...settings, crt: { ...settings.crt, aberration: v } })
                                        }
                                        displayValue={settings.crt.aberration.toFixed(1)}
                                    />
                                </>
                            )}
                        </div>
                        <div
                            aria-hidden
                            className="pointer-events-none sticky bottom-0 left-0 right-0 -mt-24 h-24 bg-gradient-to-t from-general-background to-transparent"
                        />
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
