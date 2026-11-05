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

## Prompt 02 — Backend REST API

### Original prompt

````text
Actúa como un Senior Go Backend Engineer especializado en APIs REST mantenibles y testeables.

Estamos desarrollando el backend del Sezzle Calculator Challenge.

Lee completamente y respeta las instrucciones de AGENTS.md antes de comenzar.

Contexto:

- Repositorio: sezzle-calculator-challenge.
- Rama actual esperada: feat/backend-calculator.
- Backend: Go utilizando exclusivamente la biblioteca estándar.
- Frontend: React + TypeScript, que implementaremos posteriormente.
- Tiempo limitado: debemos priorizar simplicidad, calidad y mantenibilidad.

Objetivo de esta etapa:

Diseñar el contrato de una API REST para una calculadora que permita suma, resta, multiplicación y división.

Propuesta inicial:

POST /api/v1/calculate

Request:
```json
{
  "operation": "add",
  "a": 10,
  "b": 5
}
```

Successful response:
```json
{
  "result": 15
}
```

Requisitos de diseño:

1. Definir las operaciones admitidas: add, subtract, multiply y divide.
2. Proponer la estructura mínima de carpetas y archivos del backend.
3. Separar los handlers HTTP de la lógica de cálculo.
4. Definir validaciones para entradas faltantes, valores no numéricos y operaciones desconocidas.
5. Definir el comportamiento ante división entre cero.
6. Proponer respuestas JSON consistentes para errores.
7. Definir los códigos HTTP apropiados.
8. Considerar cómo manejar números decimales y resultados no finitos.
9. Considerar la integración futura con React mediante CORS, sin agregar dependencias innecesarias.
10. Proponer una estrategia de pruebas unitarias y pruebas HTTP utilizando el paquete testing de Go.

Restricciones:

- No escribir ni modificar código todavía.
- No instalar dependencias.
- No modificar el frontend.
- No implementar operaciones opcionales.
- No crear commits, push ni Pull Requests.
- No avanzar a otra etapa sin autorización.

Antes de implementar, presenta:

- El contrato REST propuesto.
- Ejemplos de respuestas exitosas y errores.
- La estructura mínima del backend.
- Las decisiones técnicas y sus justificaciones.
- Los casos de prueba recomendados.

Espera mi aprobación explícita antes de crear o modificar archivos.
````

### Purpose

Define the REST contract, minimal backend architecture, validation, arithmetic behavior, CORS, and test strategy before implementation.

### Implementation authorization

```text
Apruebo el contrato REST y la arquitectura propuesta para el backend del Sezzle Calculator Challenge.

Puedes comenzar la implementación en la rama `feat/backend-calculator`, respetando completamente `AGENTS.md`.

Consideraciones adicionales:

1. Implementa exclusivamente las cuatro operaciones obligatorias: add, subtract, multiply y divide.
2. Mantén la separación entre lógica matemática y handlers HTTP.
3. Prioriza código idiomático, legible y mantenible sobre abstracciones innecesarias.
4. Implementa las validaciones y los errores definidos en el contrato aprobado.
5. Configura CORS para permitir únicamente el origen autorizado, incluyendo el manejo correcto de solicitudes preflight y respuestas de error.
6. Utiliza exclusivamente la biblioteca estándar de Go.
7. Implementa las pruebas unitarias y HTTP propuestas.
8. Actualiza README.md con instrucciones reales de ejecución, ejemplos de API y decisiones técnicas.
9. Registra íntegramente el Prompt 02 y esta autorización en docs/prompts.md, sin alterar los registros anteriores.
10. No modifiques el frontend ni implementes operaciones opcionales.

Al finalizar, ejecuta desde `backend/`:

- `go test ./...`
- `go test -cover ./...`
- `go vet ./...`
- `go build ./...`

Reporta los resultados reales, incluyendo cobertura, errores encontrados y correcciones realizadas.

No realices commits, push, merges ni Pull Requests.

No avances al frontend.

Al terminar, presenta un resumen de los archivos modificados y espera mi revisión antes de continuar.
```

### Implementation outcome

Implemented the four required operations, independent arithmetic logic, JSON validation and consistent HTTP errors, exact-origin CORS, server timeouts, and standard-library unit and HTTP tests. Updated the README with execution instructions, API behavior, and validation results. No frontend changes or external dependencies were introduced. Owner review remains pending.
