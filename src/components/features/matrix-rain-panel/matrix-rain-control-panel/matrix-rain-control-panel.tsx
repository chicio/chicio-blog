"use client";

import { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ControlSlider } from "@/components/design-system/molecules/controls/control-slider";
import { Switch } from "@/components/design-system/atoms/buttons/switch";
import { MdClose } from "react-icons/md";
import { useGlassmorphism } from "@/components/design-system/hooks/use-glassmorphism";
import { Button } from "@/components/design-system/atoms/buttons/button";
import {
    useMatrixRainControlPanelStore,
    FONT_SIZE_STEPS,
    RAIN_DENSITY_MIN,
    RAIN_DENSITY_MAX,
    RAIN_STEP_RATE_MIN,
    RAIN_STEP_RATE_MAX,
    BLOOM_INTENSITY_MIN,
    BLOOM_INTENSITY_MAX,
    BLOOM_THRESHOLD_MIN,
    BLOOM_THRESHOLD_MAX,
    BLOOM_EMISSION_MIN,
    BLOOM_EMISSION_MAX,
    CRT_SCANLINE_MIN,
    CRT_SCANLINE_MAX,
    CRT_ABERRATION_MIN,
    CRT_ABERRATION_MAX,
} from "./use-matrix-rain-control-panel-store";

export const MatrixRainControlPanel: FC = () => {
    const { glassmorphismClass } = useGlassmorphism({ noScale: true, increaseContrast: true });
    const { state, effects } = useMatrixRainControlPanelStore();

    return (
        <AnimatePresence>
            {state.open && (
                <motion.div
                    key="matrix-rain-panel"
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "100%", opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className={`${glassmorphismClass} overflow-x-hidden hide-scrollbar container-fixed fixed z-40 overflow-y-auto bottom-0 left-0 right-0 max-h-[60vh]`}
                    onClick={effects.stopPropagation}
                >
                    <div className="p-4 pb-24 flex flex-col gap-2">
                        <div className="flex justify-between items-center mb-2">
                            <h4>{">"} Matrix Rain Settings</h4>
                            <button
                                type="button"
                                onClick={effects.close}
                                className="text-accent/50 hover:text-accent transition-colors duration-100 cursor-pointer"
                                aria-label="Close panel"
                            >
                                <MdClose size={18} />
                            </button>
                        </div>

                        <h5>Presets</h5>
                        <div className="flex flex-wrap gap-2">
                            {state.presetNames.map((name) => (
                                <Button
                                    key={name}
                                    type="button"
                                    onClick={effects.applyPreset(name)}
                                    className={state.isPresetActive(name) ? "border-accent text-accent!" : ""}
                                >
                                    {name}
                                </Button>
                            ))}
                        </div>

                        <h5>Rain</h5>
                        <ControlSlider
                            label="Respawn probability threshold"
                            value={state.settings.rain.density}
                            min={RAIN_DENSITY_MIN}
                            max={RAIN_DENSITY_MAX}
                            step={0.01}
                            onChange={effects.onRainDensityChange}
                            displayValue={state.settings.rain.density.toFixed(2)}
                        />
                        <ControlSlider
                            label="Speed (Hz)"
                            value={state.settings.rain.stepRate}
                            min={RAIN_STEP_RATE_MIN}
                            max={RAIN_STEP_RATE_MAX}
                            step={1}
                            onChange={effects.onRainStepRateChange}
                            displayValue={String(state.settings.rain.stepRate)}
                        />
                        <ControlSlider
                            label="Font size"
                            value={state.fontSizeThumbIndex}
                            min={0}
                            max={FONT_SIZE_STEPS.length - 1}
                            step={1}
                            onChange={effects.onFontSizeChange}
                            displayValue={state.fontSizeDisplayValue}
                        />

                        <div className="flex justify-between items-center mt-2">
                            <h5 className="mb-0">Bloom</h5>
                            <Switch
                                checked={state.settings.bloom.enabled}
                                onChange={effects.onBloomEnabledChange}
                                label="Toggle bloom"
                            />
                        </div>
                        {state.settings.bloom.enabled && (
                            <>
                                <ControlSlider
                                    label="intensity"
                                    value={state.settings.bloom.intensity}
                                    min={BLOOM_INTENSITY_MIN}
                                    max={BLOOM_INTENSITY_MAX}
                                    step={0.05}
                                    onChange={effects.onBloomIntensityChange}
                                    displayValue={state.settings.bloom.intensity.toFixed(2)}
                                />
                                <ControlSlider
                                    label="threshold"
                                    value={state.settings.bloom.threshold}
                                    min={BLOOM_THRESHOLD_MIN}
                                    max={BLOOM_THRESHOLD_MAX}
                                    step={0.05}
                                    onChange={effects.onBloomThresholdChange}
                                    displayValue={state.settings.bloom.threshold.toFixed(2)}
                                />
                                <ControlSlider
                                    label="emission"
                                    value={state.settings.bloom.emission}
                                    min={BLOOM_EMISSION_MIN}
                                    max={BLOOM_EMISSION_MAX}
                                    step={0.05}
                                    onChange={effects.onBloomEmissionChange}
                                    displayValue={state.settings.bloom.emission.toFixed(2)}
                                />
                            </>
                        )}

                        <div className="flex justify-between items-center mt-2">
                            <h5 className="mb-0">CRT</h5>
                            <Switch
                                checked={state.settings.crt.enabled}
                                onChange={effects.onCrtEnabledChange}
                                label="Toggle CRT"
                            />
                        </div>
                        {state.settings.crt.enabled && (
                            <>
                                <ControlSlider
                                    label="scanlines"
                                    value={state.settings.crt.scanlineStrength}
                                    min={CRT_SCANLINE_MIN}
                                    max={CRT_SCANLINE_MAX}
                                    step={0.05}
                                    onChange={effects.onCrtScanlineChange}
                                    displayValue={state.settings.crt.scanlineStrength.toFixed(2)}
                                />
                                <ControlSlider
                                    label="aberration"
                                    value={state.settings.crt.aberration}
                                    min={CRT_ABERRATION_MIN}
                                    max={CRT_ABERRATION_MAX}
                                    step={0.1}
                                    onChange={effects.onCrtAberrationChange}
                                    displayValue={state.settings.crt.aberration.toFixed(1)}
                                />
                            </>
                        )}
                    </div>
                    <div
                        aria-hidden
                        className="pointer-events-none sticky bottom-0 left-0 right-0 -mt-24 h-24 bg-gradient-to-t from-general-background to-transparent"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};
