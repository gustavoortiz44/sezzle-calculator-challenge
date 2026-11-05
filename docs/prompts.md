# AI Development Prompts

This document records actual development requests, their purpose, and their outcomes. Original prompt text is preserved in its original language.

## Prompt 01 — Initial repository structure

### Original prompt

```text
Actúa como un Senior Full-Stack Software Engineer.

Estamos preparando el repositorio del Sezzle Calculator Challenge.

Primero, lee completamente el archivo AGENTS.md ubicado en la raíz del proyecto y respeta todas sus instrucciones.

**Objetivo de esta tarea:**

Preparar únicamente la estructura inicial del repositorio para una aplicación full-stack con React + TypeScript y Go.

Archivos y directorios esperados:

- `frontend/`
- `backend/`
- `docs/prompts.md`
- `.gitignore`
- `README.md`

Requisitos:

1. No implementar todavía operaciones matemáticas.
2. No instalar dependencias.
3. No generar todavía una aplicación React ni un módulo Go.
4. Crear una estructura mínima y coherente para el proyecto.
5. Preparar un `.gitignore` adecuado para React, TypeScript, Go, VS Code y Windows.
6. Crear un README inicial que describa el objetivo, las tecnologías y el estado actual del proyecto, sin inventar instrucciones de ejecución.
7. Registrar este prompt en `docs/prompts.md`, identificándolo como Prompt 01.
8. No modificar `AGENTS.md`.
9. No ejecutar commits, push, merges ni crear Pull Requests.

**Importante:**

Antes de crear o modificar cualquier archivo, presenta:

- La estructura de directorios propuesta.
- Los archivos que crearás.
- Una breve justificación de las decisiones.

Espera mi aprobación explícita antes de implementar.
```

### Purpose

Prepare the minimum repository structure for a future React and TypeScript frontend and Go backend, without generating applications or installing dependencies.

### Significant follow-up instruction

```text
Apruebo la propuesta de estructura inicial.

Procede a crear los archivos y directorios exactamente como los describiste.

Condiciones:

1. No modifiques `AGENTS.md`.
2. No instales dependencias ni implementes funcionalidades.
3. Verifica que `.gitignore` permita versionar `go.mod`, `go.sum`, `package.json` y los archivos de bloqueo de dependencias.
4. Registra íntegramente el Prompt 01 en `docs/prompts.md`.
5. Verifica la estructura final y ejecuta `git status`.
6. No realices commits, push ni Pull Requests.

Al terminar, presenta un resumen de los archivos creados y las verificaciones realizadas.

Esperaré los resultados para revisar los cambios antes de autorizar nuestro primer commit.
```

### Implementation outcome

Created `frontend/.gitkeep`, `backend/.gitkeep`, `.gitignore`, `README.md`, and this prompt log after explicit approval. No application code, dependencies, or module configuration was introduced. Repository-owner review is pending.
