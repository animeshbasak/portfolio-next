# Lab prototypes (HyperFrames)

Looping 10-second prototypes for the Lab cards on the homepage. Each tells a three-beat story: a big headline says what is happening, the product moment plays beside it with a camera push-in, and a progress bar marks the beats. They are, rendered with
[HyperFrames](https://hyperframes.heygen.com) in the dossier theme, light and dark.

```bash
cd prototypes
python3 build.py                      # writes one HyperFrames project per card into p2/
npx hyperframes@0.9.9 lint p2/paarth  # check a project
npx hyperframes@0.9.9 render p2/paarth --variables '{"theme":"dark"}' -o out/paarth-dark.mp4
```

For the site, each render is re-encoded without audio and with a poster frame:

```bash
ffmpeg -i out/NAME-THEME.mp4 -an -c:v libx264 -preset veryfast -crf 26 -pix_fmt yuv420p -movflags +faststart ../public/lab/NAME-THEME.mp4
ffmpeg -ss KEY_MOMENT -i out/NAME-THEME.mp4 -frames:v 1 -c:v libwebp -quality 78 ../public/lab/NAME-THEME.webp
```

Content rules: only facts already on the site; insaneFit stays abstract (no app screens).
Fonts: Bebas Neue and IBM Plex Mono (SIL Open Font License). GSAP under its standard licence.
