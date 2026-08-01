---
name: tailwind-v4-emits-unprefixed-twin-of-arbitrary-variant
description: Tailwind v4 emits BOTH an unprefixed base rule and the variant rule for a breakpoint-prefixed arbitrary value, so a stray .left-[calc(...)] in the built CSS is engine behavior, not a stray class — verify in .next before raising it
metadata:
  type: feedback
---

Do not raise a "dead/unprefixed utility class" finding for a breakpoint-prefixed **arbitrary** value
without checking the built CSS first. Tailwind v4 emits both rules.

**Why:** `xl:left-[calc(50%+504px)]` in the JSX produces, in the same stylesheet, an unprefixed
`.left-\[calc\(50\%\+504px\)\]{left:calc(50% + 504px)}` in the base utility layer **and**
`.xl\:left-\[calc\(50\%\+504px\)\]` inside `@media (min-width:1600px)`. The unprefixed twin matches no
element and is ~40 bytes; it is the v4 engine registering the arbitrary value as a utility before
applying the variant. I raised it as dead CSS, the implementer rebutted, and the rebuttal was correct.

**How to apply:** grep the built CSS, not the source. The class name is CSS-escaped, so a literal search
for `left-[calc(50%+504px)]` finds nothing — search for the distinctive number instead:

```
python3 - <<'PY'
import glob
for p in glob.glob('.next/**/*.css', recursive=True):
    s = open(p, errors='replace').read()
    if '504px' in s: print(p)
PY
```

Same trip-up applies to any `sm:`/`md:`/`xl:` + `[...]` pair. Note `xl` is **1600px** in this codebase's
overridden scale, not Tailwind's default 1280px, and there is no `2xl`.
