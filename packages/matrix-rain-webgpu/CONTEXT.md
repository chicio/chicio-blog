# Matrix Rain

The published "digital rain" background effect: falling columns of glyphs in the style of the film, simulated and drawn
on the GPU.

## Language

**Glyph Set**:
The fixed characters the rain draws from, those of the film: half-width katakana, the digits except 6 (absent from
the film's rain too), and a handful of symbols.
_Avoid_: charset, alphabet, font

**Showcase**:
The documentation and playground site for the rain, where every option can be tried live.

**Glyph**:
One character of the Glyph Set occupying one Cell.
_Avoid_: character, symbol, letter

**Cell**:
One Glyph-sized slot in the grid the rain is laid out on.

**Column**:
One vertical run of falling Glyphs, with its own speed, Depth and Tail length.
_Avoid_: stream, drop, strand, particle

**Head**:
The leading Glyph of a Column, always the brightest and the only one that glows past full brightness.

**Tail**:
The Glyphs behind the Head, fading out with distance from it.
_Avoid_: trail

**Step**:
One tick of the simulation, in which every Column advances and may Respawn.
_Avoid_: frame, which is a render, not a Step

**Respawn**:
A Column that has fallen past the bottom restarting from the top.

**Density**:
The per-Step chance that a Column past the bottom keeps waiting instead of Respawning; despite the name, the higher it
is, the sparser the rain.

**Depth**:
How far away a Column reads, conveyed by slower speed and dimmer Glyphs.
_Avoid_: layer, z-index
