## Worktrees manualmente

1. Crear directorio `.worktrees/`
2. Ejecutar:
```
git worktree add .worktrees/<nombre-del-worktree>
```

## Ahora necesitamos 3 features:

- implementemos un **triple shot**: Por 5 segundos, el personaje dispara 3 veces en línea recta.
- implementemos un **sistema de skins**: Poder cambiar la apariencia de la nave.
- implementemos un **escudo**: Un escudo que protege a la nave de los proyectiles enemigos.

## Eliminar Worktrees manualmente

1. Ejecutar:
```
git worktree remove .worktrees/<nombre-del-worktree>
git branch -d <nombre-del-worktree>
```

## Recomendaciones

1. Agregarlo en el archivo .gitignore