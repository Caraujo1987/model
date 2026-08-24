# Visor RA 3D

Proyecto web estatico para visualizar un modelo 3D (`result.glb`) con soporte de realidad aumentada usando [`<model-viewer>`](https://modelviewer.dev/).

## Archivos principales

- `index.html`: estructura del visor 3D/RA.
- `styles.css`: estilos del visor, barra de progreso y boton RA.
- `script.js`: control de progreso de carga y selector de plano RA.
- `result.glb`: modelo 3D.
- `poster.webp`: imagen previa del modelo.
- `server-vr/`: segunda escena WebXR VR con el modelo `SERVER_BLENDER.glb`.
- `server-ar/`: visor RA para poner `SERVER_BLENDER.glb` en el espacio real.

## Visualizar localmente

Sirve la carpeta por HTTP y abre la URL en el navegador:

```bash
python -m http.server 8000
```

Luego entra en:

```text
http://localhost:8000
```

La escena VR nueva queda en:

```text
http://localhost:8000/server-vr/
```

La version RA del mismo modelo queda en:

```text
http://localhost:8000/server-ar/
```

## Publicar con GitHub Pages

1. Sube este proyecto a un repositorio de GitHub.
2. En GitHub, entra a `Settings > Pages`.
3. En `Build and deployment`, selecciona `Deploy from a branch`.
4. Elige la rama `main` y la carpeta `/root`.
5. Guarda los cambios y espera a que GitHub genere la URL publica.

## Nota RA

La realidad aumentada funciona mejor desde un telefono compatible. En escritorio se puede visualizar el modelo 3D, pero el boton RA depende del navegador y del dispositivo.

El visor usa reconocimiento de plano nativo con `ar-placement`. Antes de entrar en RA puedes elegir `Piso` o `Pared`; el telefono detecta el plano compatible y posiciona el modelo sobre esa superficie. `ar-scale="auto"` permite ajustar el tamano desde la experiencia RA cuando el dispositivo lo soporte.
