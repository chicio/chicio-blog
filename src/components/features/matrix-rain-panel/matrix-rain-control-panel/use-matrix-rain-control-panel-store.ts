"use client";

import { MouseEvent, useCallback, useEffect, useState } from "react";
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
import { ComponentStore } from "@/types/component-store";

export const FONT_SIZE_STEPS = [12, 16, 20, 24, 28, 32, 36, 40] as const;
export const RAIN_DENSITY_MIN = 0.8;
export const RAIN_DENSITY_MAX = 0.99;
export const RAIN_STEP_RATE_MIN = 4;
export const RAIN_STEP_RATE_MAX = 30;
export const BLOOM_INTENSITY_MIN = 0.5;
export const BLOOM_INTENSITY_MAX = 3.0;
export const BLOOM_THRESHOLD_MIN = 0.3;
export const BLOOM_THRESHOLD_MAX = 1.2;
export const BLOOM_EMISSION_MIN = 1.0;
export const BLOOM_EMISSION_MAX = 2.5;
export const CRT_SCANLINE_MIN = 0.0;
export const CRT_SCANLINE_MAX = 0.8;
export const CRT_ABERRATION_MIN = 0.0;
export const CRT_ABERRATION_MAX = 3.0;

const fontSizeToSliderIndex = (fs: number): number => {
    const idx = FONT_SIZE_STEPS.indexOf(fs as (typeof FONT_SIZE_STEPS)[number]);
    return idx >= 0 ? idx : 2;
};

interface MatrixRainControlPanelState {
    open: boolean;
    settings: MatrixRainSettings;
    presetNames: string[];
    fontSizeThumbIndex: number;
    fontSizeDisplayValue: string;
    isPresetActive: (name: string) => boolean;
}

interface MatrixRainControlPanelEffects {
    close: () => void;
    stopPropagation: (e: MouseEvent) => void;
    applyPreset: (presetName: string) => () => void;
    onRainDensityChange: (v: number) => void;
    onRainStepRateChange: (v: number) => void;
    onFontSizeChange: (v: number) => void;
    onBloomEnabledChange: (v: boolean) => void;
    onBloomIntensityChange: (v: number) => void;
    onBloomThresholdChange: (v: number) => void;
    onBloomEmissionChange: (v: number) => void;
    onCrtEnabledChange: (v: boolean) => void;
    onCrtScanlineChange: (v: number) => void;
    onCrtAberrationChange: (v: number) => void;
}

export const useMatrixRainControlPanelStore = (): ComponentStore<
    MatrixRainControlPanelState,
    MatrixRainControlPanelEffects
> => {
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

    const applyPreset = useCallback((presetName: string) => () => {
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
    }, [applySettings]);

    const onRainDensityChange = useCallback(
        (v: number) => applySettings({ ...settings, rain: { ...settings.rain, density: v } }),
        [applySettings, settings],
    );

    const onRainStepRateChange = useCallback(
        (v: number) => applySettings({ ...settings, rain: { ...settings.rain, stepRate: v } }),
        [applySettings, settings],
    );

    const onFontSizeChange = useCallback(
        (v: number) => {
            const newFontSize = FONT_SIZE_STEPS[Math.round(v)] ?? MATRIX_RAIN_DEFAULTS.rain.fontSize;
            setFontSizeDragIndex(Math.round(v));
            if (newFontSize !== settings.rain.fontSize) {
                applySettings({ ...settings, rain: { ...settings.rain, fontSize: newFontSize } });
            }
        },
        [applySettings, settings],
    );

    const onBloomEnabledChange = useCallback(
        (v: boolean) => applySettings({ ...settings, bloom: { ...settings.bloom, enabled: v } }),
        [applySettings, settings],
    );

    const onBloomIntensityChange = useCallback(
        (v: number) => applySettings({ ...settings, bloom: { ...settings.bloom, intensity: v } }),
        [applySettings, settings],
    );

    const onBloomThresholdChange = useCallback(
        (v: number) => applySettings({ ...settings, bloom: { ...settings.bloom, threshold: v } }),
        [applySettings, settings],
    );

    const onBloomEmissionChange = useCallback(
        (v: number) => applySettings({ ...settings, bloom: { ...settings.bloom, emission: v } }),
        [applySettings, settings],
    );

    const onCrtEnabledChange = useCallback(
        (v: boolean) => applySettings({ ...settings, crt: { ...settings.crt, enabled: v } }),
        [applySettings, settings],
    );

    const onCrtScanlineChange = useCallback(
        (v: number) => applySettings({ ...settings, crt: { ...settings.crt, scanlineStrength: v } }),
        [applySettings, settings],
    );

    const onCrtAberrationChange = useCallback(
        (v: number) => applySettings({ ...settings, crt: { ...settings.crt, aberration: v } }),
        [applySettings, settings],
    );

    const stopPropagation = useCallback((e: MouseEvent) => { e.stopPropagation(); }, []);

    const fontSizeSliderIndex = fontSizeToSliderIndex(settings.rain.fontSize);
    const fontSizeThumbIndex = fontSizeDragIndex ?? fontSizeSliderIndex;
    const fontSizeDisplayValue = String(FONT_SIZE_STEPS[fontSizeThumbIndex] ?? settings.rain.fontSize);

    return {
        state: {
            open,
            settings,
            presetNames: Object.keys(MATRIX_RAIN_PRESETS),
            fontSizeThumbIndex,
            fontSizeDisplayValue,
            isPresetActive: (name: string) =>
                JSON.stringify(settings) === JSON.stringify(MATRIX_RAIN_PRESETS[name]),
        },
        effects: {
            close,
            stopPropagation,
            applyPreset,
            onRainDensityChange,
            onRainStepRateChange,
            onFontSizeChange,
            onBloomEnabledChange,
            onBloomIntensityChange,
            onBloomThresholdChange,
            onBloomEmissionChange,
            onCrtEnabledChange,
            onCrtScanlineChange,
            onCrtAberrationChange,
        },
    };
};
