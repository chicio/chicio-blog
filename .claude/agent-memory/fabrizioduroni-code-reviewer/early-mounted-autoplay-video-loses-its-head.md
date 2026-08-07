---
name: early-mounted-autoplay-video-loses-its-head
description: Mounting an autoPlay video early (hidden) to keep the play() inside the user-activation window silently discards the first N seconds and leaks audio; measure currentTime at the reveal frame
metadata:
  type: feedback
---

The standard trick for unmuted autoplay — render the `<video autoPlay>` as soon as the overlay opens
but hide it (`opacity-0` / `-z-10`) behind an intro animation, so the play attempt lands inside the
browser's transient user activation — has a failure mode nobody writes a test for: **the clip is
playing the whole time it is hidden.** By the time it becomes visible the playhead has advanced by
however long the intro ran, and the audio has been audible over the intro.

Hiding with `opacity`/`z-index` (which is what you want, so the element is not remounted) does not
pause media. Only `display:none`/unmount would, and those defeat the purpose.

**Why:** measured on the easter-egg overlay — `currentTime` at the first visible frame was **2.58s**
(i-know-kung-fu) and **2.74s** (the-white-rabbit) against a ~2.8s boot animation, with
`muted:false, volume:1, paused:false` throughout the hidden phase. Every clip lost its opening beat
and played its audio over a fake terminal. Even the click-to-skip path revealed at 0.57s. The
reduced-motion path was clean (no hidden phase at all), which is exactly why it never showed up in
tests. Nothing catches this: unit tests assert the `<video>` renders with the right `src`, and e2e is
told never to wait for playback (a 60s clip per spec).

**How to apply:** any time a diff mounts media early to preserve autoplay permission, ask what
happens to the *playback position* at reveal. Measure it — poll `currentTime` + the wrapper's
visibility on a ~25ms interval in a real browser and report the value at the first visible sample;
do not infer it from a single post-reveal reading (a late sample looks like "it's playing", which is
how this got recorded as a success first time round). Expected fix: keep the early mount, then seek
`currentTime = 0` when the reveal fires, and mute during the hidden phase so nothing is audible
early — note that re-unmuting is itself subject to autoplay policy, so it needs a headed check, and
seeking alone (without muting) trades the lost head for an audio stutter.
