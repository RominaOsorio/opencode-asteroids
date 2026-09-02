# Asteroids

Clon del clásico arcade **Asteroids** implementado en canvas HTML5 puro, sin dependencias ni bundler.

## Descripción

Nave espacial en un campo de asteroides con envolvimiento de bordes (el espacio es toroidal). Destruye asteroides para sumar puntos: los grandes se parten en medianos, los medianos en pequeños. Incluye power-ups especiales y tipos de asteroides únicos como la estrella fugaz.

## Tecnologías

- **HTML5 Canvas** — renderizado 2D
- **JavaScript (ES6+)** — lógica del juego en un solo archivo `game.js`
- Sin frameworks, sin bundler, sin dependencias

## Cómo correr

Abre `index.html` directamente en el navegador (doble clic), o usa un servidor local:

```bash
npx serve .
```

Luego visita `http://localhost:3000`.

## Controles

| Tecla     | Acción     |
| --------- | ---------- |
| `←` `→`   | Rotar nave |
| `↑`       | Propulsar  |
| `Espacio` | Disparar   |

## Puntuación

| Asteroide | Puntos |
| --------- | ------ |
| Grande    | 20     |
| Mediano   | 50     |
| Pequeño   | 100    |

## Características

- 3 vidas con invencibilidad temporal al reaparecer (parpadeo)
- Asteroides se parten en fragmentos más pequeños al ser destruidos
- Partículas de explosión al destruir asteroides
- Power-ups (15% de probabilidad al destruir asteroides, repartidos uniformemente; el indicio dura 5 segundos al recogerlos):
  - Velocidad "V" (cian): la nave se mueve al doble de rápido
  - Triple shot "T" (naranja): dispara 3 balas en abanico
  - Escudo "S" (azul): envuelve la nave y destruye cualquier asteroide que la toque sin sufrir daño
- Estrella fugaz: asteroide especial amarillo que cruza la pantalla mucho más rápido que el resto, una por nivel; vale 50 puntos y desaparece sola al poco tiempo
- Skins (teclas `1`-`6`): cambia la apariencia de la nave. La skin **TITÁN** (tecla `6`) es el doble de grande y otorga el doble de puntos
