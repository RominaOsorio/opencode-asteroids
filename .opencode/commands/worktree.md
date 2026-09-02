---
description: Crea un git worktree con su rama propia, nombrado a partir de un argumento
---

# Worktree

Crea un git worktree en el proyecto actual (ubicado en `.worktrees/`), con una
rama nueva del mismo nombre.

## Instrucciones

1. Lee el argumento recibido a través de `$ARGUMENTS` (puede traer o no espacios).
   - Si está vacío, avisa que falta el argumento y no ejecutes nada.

2. Deriva un nombre válido para git a partir del argumento:
   - minúsculas, sin acentos, sin símbolos.
   - los espacios se convierten en guiones (`-`).
   - no agregues numeración ni prefijos.

3. Verifica antes de crear:
   - Si ya existe un directorio `.worktrees/<nombre>` o una rama local/nueva
     con ese nombre, detente y avisa. No lo sobrescribas.

4. Ejecuta UN solo comando desde la raíz del repo actual (no cambies de directorio):

   ```
   git worktree add -b <nombre> .worktrees/<nombre>
   ```

5. No hagas nada más:
   - no entres al worktree creado,
   - no crees ni modifiques archivos,
   - no ejecutes `git status`, `git add`, `git commit`, `git push` u otros comandos.
   - Solo reporta al usuario la ruta del worktree y la rama creados.

## Casos especiales

- Si el directorio actual no es un repositorio git (`git rev-parse --is-inside-work-tree` falla),
  avisa y no ejecutes nada.
- Si el argumento contiene caracteres que no se puedan convertir a un nombre
  de rama de git válido, devuelve solo letras/dígitos con guiones.
