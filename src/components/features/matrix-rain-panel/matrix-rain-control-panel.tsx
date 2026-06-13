"use client";

import { FC, useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TerminalLine } from "@/components/design-system/atoms/typography/terminal-blocks";
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

// TUNE TO TASTE: Clamp ranges — chosen to stay "fun but never broken".
// Author should review and adjust these for the desired aesthetic.
const RAIN_DENSITY_MIN = 0.80;
const RAIN_DENSITY_MAX = 0.99;
const RAIN_STEP_RATE_MIN = 4;
const RAIN_STEP_RATE_MAX = 30;
const FONT_SIZE_STEPS = [12, 16, 20, 28, 40] as const;
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

interface SliderProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (v: number) => void;
    onCommit?: (v: number) => void;
    commitOnly?: boolean;
    displayValue?: string;
}

const ControlSlider: FC<SliderProps> = ({ label, value, min, max, step, onChange, onCommit, commitOnly, displayValue }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = parseFloat(e.target.value);
        if (!commitOnly) {
            onChange(v);
        }
    };

    const handleCommitMouse = (e: React.MouseEvent<HTMLInputElement>) => {
        const v = parseFloat((e.target as HTMLInputElement).value);
        if (commitOnly) {
            onChange(v);
        }
        onCommit?.(v);
    };

    const handleCommitTouch = (e: React.TouchEvent<HTMLInputElement>) => {
        const v = parseFloat((e.target as HTMLInputElement).value);
        if (commitOnly) {
            onChange(v);
        }
        onCommit?.(v);
    };

    return (
        <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
                <span className="font-mono text-xs text-accent/70">{label}</span>
                <span className="font-mono text-xs text-accent">{displayValue ?? value}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={handleChange}
                onMouseUp={handleCommitMouse}
                onTouchEnd={handleCommitTouch}
                className="w-full accent-accent cursor-pointer h-1"
            />
        </div>
    );
};

interface ToggleProps {
    label: string;
    value: boolean;
    onChange: (v: boolean) => void;
}

const ControlToggle: FC<ToggleProps> = ({ label, value, onChange }) => (
    <div className="flex justify-between items-center">
        <span className="font-mono text-xs text-accent/70">{label}</span>
        <button
            type="button"
            onClick={() => onChange(!value)}
            className={`font-mono text-xs px-2 py-0.5 border transition-colors duration-100 cursor-pointer ${
                value
                    ? "border-accent text-accent bg-accent/10"
                    : "border-accent/30 text-accent/40 bg-transparent"
            }`}
        >
            {value ? "ON" : "OFF"}
        </button>
    </div>
);

interface SectionHeadingProps {
    children: React.ReactNode;
}

const SectionHeading: FC<SectionHeadingProps> = ({ children }) => (
    <div className="text-accent/50 font-mono text-xs tracking-wider uppercase mb-2 mt-3 first:mt-0">
        {children}
    </div>
);

const fontSizeToSliderIndex = (fs: number): number => {
    const idx = FONT_SIZE_STEPS.indexOf(fs as (typeof FONT_SIZE_STEPS)[number]);
    return idx >= 0 ? idx : 2;
};

export const MatrixRainControlPanel: FC = () => {
    const [open, setOpen] = useState(false);
    const [settings, setSettings] = useState<MatrixRainSettings>(MATRIX_RAIN_DEFAULTS);

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
        applySettings(preset);
    };

    const fontSizeSliderIndex = fontSizeToSliderIndex(settings.rain.fontSize);

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        key="matrix-rain-panel"
                        initial={{ x: "100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "100%", opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className={[
                            "fixed z-40 overflow-y-auto",
                            "bottom-0 left-0 right-0 max-h-[60vh]",
                            "md:top-0 md:right-0 md:left-auto md:bottom-auto md:h-full md:max-h-full md:w-80",
                            "bg-background/95 border-accent/20 backdrop-blur-sm",
                            "border-t md:border-t-0 md:border-l",
                        ].join(" ")}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4 flex flex-col gap-2">
                            <div className="flex justify-between items-center mb-2">
                                <TerminalLine>{">"} Matrix Rain Settings</TerminalLine>
                                <button
                                    type="button"
                                    onClick={close}
                                    className="text-accent/50 hover:text-accent transition-colors duration-100 cursor-pointer"
                                    aria-label="Close panel"
                                >
                                    <MdClose size={18} />
                                </button>
                            </div>

                            <SectionHeading>Presets</SectionHeading>
                            <div className="flex flex-wrap gap-2">
                                {Object.keys(MATRIX_RAIN_PRESETS).map((name) => (
                                    <button
                                        key={name}
                                        type="button"
                                        onClick={() => applyPreset(name)}
                                        className={[
                                            "font-mono text-xs px-2 py-1 border transition-colors duration-100 cursor-pointer",
                                            JSON.stringify(settings) === JSON.stringify(MATRIX_RAIN_PRESETS[name])
                                                ? "border-accent text-accent bg-accent/10"
                                                : "border-accent/30 text-accent/60 hover:border-accent/60 hover:text-accent",
                                        ].join(" ")}
                                    >
                                        {name}
                                    </button>
                                ))}
                            </div>

                            <SectionHeading>Rain</SectionHeading>
                            <ControlSlider
                                label="density"
                                value={settings.rain.density}
                                min={RAIN_DENSITY_MIN}
                                max={RAIN_DENSITY_MAX}
                                step={0.01}
                                onChange={(v) => applySettings({ ...settings, rain: { ...settings.rain, density: v } })}
                                displayValue={settings.rain.density.toFixed(2)}
                            />
                            <ControlSlider
                                label="speed (Hz)"
                                value={settings.rain.stepRate}
                                min={RAIN_STEP_RATE_MIN}
                                max={RAIN_STEP_RATE_MAX}
                                step={1}
                                onChange={(v) => applySettings({ ...settings, rain: { ...settings.rain, stepRate: v } })}
                                displayValue={String(settings.rain.stepRate)}
                            />
                            <ControlSlider
                                label="font size (commit on release)"
                                value={fontSizeSliderIndex}
                                min={0}
                                max={FONT_SIZE_STEPS.length - 1}
                                step={1}
                                commitOnly={true}
                                onChange={() => {}}
                                onCommit={(v) => {
                                    const fs = FONT_SIZE_STEPS[v] ?? MATRIX_RAIN_DEFAULTS.rain.fontSize;
                                    applySettings({ ...settings, rain: { ...settings.rain, fontSize: fs } });
                                }}
                                displayValue={String(settings.rain.fontSize)}
                            />

                            <SectionHeading>Bloom</SectionHeading>
                            <ControlToggle
                                label="enabled"
                                value={settings.bloom.enabled}
                                onChange={(v) => applySettings({ ...settings, bloom: { ...settings.bloom, enabled: v } })}
                            />
                            {settings.bloom.enabled && (
                                <>
                                    <ControlSlider
                                        label="intensity"
                                        value={settings.bloom.intensity}
                                        min={BLOOM_INTENSITY_MIN}
                                        max={BLOOM_INTENSITY_MAX}
                                        step={0.05}
                                        onChange={(v) => applySettings({ ...settings, bloom: { ...settings.bloom, intensity: v } })}
                                        displayValue={settings.bloom.intensity.toFixed(2)}
                                    />
                                    <ControlSlider
                                        label="threshold"
                                        value={settings.bloom.threshold}
                                        min={BLOOM_THRESHOLD_MIN}
                                        max={BLOOM_THRESHOLD_MAX}
                                        step={0.05}
                                        onChange={(v) => applySettings({ ...settings, bloom: { ...settings.bloom, threshold: v } })}
                                        displayValue={settings.bloom.threshold.toFixed(2)}
                                    />
                                    <ControlSlider
                                        label="emission"
                                        value={settings.bloom.emission}
                                        min={BLOOM_EMISSION_MIN}
                                        max={BLOOM_EMISSION_MAX}
                                        step={0.05}
                                        onChange={(v) => applySettings({ ...settings, bloom: { ...settings.bloom, emission: v } })}
                                        displayValue={settings.bloom.emission.toFixed(2)}
                                    />
                                </>
                            )}

                            <SectionHeading>CRT</SectionHeading>
                            <ControlToggle
                                label="enabled"
                                value={settings.crt.enabled}
                                onChange={(v) => applySettings({ ...settings, crt: { ...settings.crt, enabled: v } })}
                            />
                            {settings.crt.enabled && (
                                <>
                                    <ControlSlider
                                        label="scanlines"
                                        value={settings.crt.scanlineStrength}
                                        min={CRT_SCANLINE_MIN}
                                        max={CRT_SCANLINE_MAX}
                                        step={0.05}
                                        onChange={(v) => applySettings({ ...settings, crt: { ...settings.crt, scanlineStrength: v } })}
                                        displayValue={settings.crt.scanlineStrength.toFixed(2)}
                                    />
                                    <ControlSlider
                                        label="aberration"
                                        value={settings.crt.aberration}
                                        min={CRT_ABERRATION_MIN}
                                        max={CRT_ABERRATION_MAX}
                                        step={0.1}
                                        onChange={(v) => applySettings({ ...settings, crt: { ...settings.crt, aberration: v } })}
                                        displayValue={settings.crt.aberration.toFixed(1)}
                                    />
                                </>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
