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

## Prompt 03 — React calculator frontend

### Original prompt

```text
Actúa como un Senior Frontend Engineer especializado en React, TypeScript y arquitectura de aplicaciones web.

Estamos desarrollando el Sezzle Calculator Challenge.

Antes de comenzar:

1. Lee completamente `AGENTS.md` y respeta todas sus instrucciones.
2. Verifica que estamos en la rama `feat/frontend-calculator`.
3. Confirma que el árbol de trabajo está limpio.
4. Revisa el backend existente, especialmente el contrato REST `POST /api/v1/calculate`.
5. Revisa `README.md` y `docs/prompts.md`.

**Objetivo — Prompt 03**

Implementar el frontend de nuestra calculadora utilizando React, TypeScript y Vite, consumiendo la API REST desarrollada en Go.

**Requisitos funcionales**

- Interfaz moderna, profesional, responsiva y accesible.
- Permitir suma, resta, multiplicación y división.
- Capturar dos operandos numéricos.
- Consumir el backend mediante `POST /api/v1/calculate`.
- Mostrar los resultados de forma clara.
- Validar entradas antes de enviar solicitudes.
- Manejar errores del backend, incluyendo división entre cero.
- Mostrar estados de carga y errores de conexión.
- Evitar solicitudes duplicadas mientras exista una operación pendiente.

**Requisitos técnicos**

- React con TypeScript y Vite.
- Separación clara entre componentes, lógica y cliente HTTP.
- Configuración de la URL del backend mediante variables de entorno.
- No duplicar innecesariamente las reglas de negocio del backend.
- Evitar dependencias innecesarias.
- Mantener código legible, mantenible y fácilmente comprobable.

**Pruebas obligatorias**

Utilizar Vitest y React Testing Library para verificar:

- Renderizado de componentes.
- Validación de entradas.
- Selección de operaciones.
- Integración simulada con la API.
- Visualización de resultados.
- Manejo de errores.
- Estados de carga.

Ejecutar las pruebas, validación de TypeScript y compilación de producción. Reportar resultados reales y cobertura medida.

**Documentación**

- Actualizar `README.md` con instrucciones verificadas de instalación y ejecución.
- Registrar íntegramente este Prompt 03 en `docs/prompts.md`.
- Documentar decisiones técnicas relevantes.

**Reglas de Git**

- Trabajar exclusivamente en `feat/frontend-calculator`.
- No modificar `AGENTS.md`.
- No modificar el backend salvo autorización explícita.
- No realizar commits, push, merges ni crear Pull Requests sin autorización.
- Ningún PR podrá considerarse listo para merge sin ejecutar satisfactoriamente las pruebas.
- El merge final será aprobado y realizado manualmente por el propietario del repositorio.

**IMPORTANTE**

Antes de instalar dependencias, crear o modificar archivos:

1. Presenta la arquitectura propuesta del frontend.
2. Explica los componentes y archivos que crearás.
3. Describe cómo consumirás la API existente.
4. Presenta tu estrategia de pruebas.
5. Identifica riesgos o decisiones técnicas relevantes.

Espera mi aprobación explícita antes de implementar.
```

### Purpose

Build an accessible React and TypeScript calculator consuming the existing Go API, with client-side input validation, asynchronous request handling, and automated frontend tests.

### Implementation authorization

```text
Apruebo la arquitectura propuesta para el frontend y autorizo la instalación de las dependencias indicadas.

Procede con la implementación del Prompt 03 respetando completamente `AGENTS.md` y las decisiones técnicas presentadas.

Condiciones adicionales:

1. Mantén una arquitectura sencilla, profesional y mantenible.
2. Verifica la compatibilidad de Node.js con las versiones seleccionadas de Vite y Vitest.
3. Implementa correctamente el manejo de respuestas asíncronas y la prevención de solicitudes duplicadas.
4. Asegúrate de interpretar los códigos HTTP y los errores estructurados de nuestra API Go.
5. Ejecuta todas las pruebas automatizadas, la comprobación de TypeScript, la cobertura y el build de producción.
6. Documenta los resultados reales de las pruebas y cualquier limitación encontrada.
7. Actualiza `README.md` y registra íntegramente el Prompt 03 junto con esta autorización en `docs/prompts.md`.
8. No modifiques `AGENTS.md` ni el backend.
9. Trabaja exclusivamente en `feat/frontend-calculator`.
10. No realices commits, push, merges ni crees Pull Requests.

Al finalizar, presenta los archivos creados, las decisiones implementadas, los resultados de las pruebas y cualquier observación relevante.

Esperaré tu reporte para revisar el código y probar manualmente la aplicación antes de autorizar el commit y el Pull Request.
```

### Implementation outcome

Implemented the calculator form, result presentation, strict operand validation, typed fetch client, structured API error handling, loading states, immediate duplicate-request protection, and request cancellation on unmount. Added Vitest and React Testing Library tests. Only React and React DOM are runtime dependencies. The README records reproducible commands, measured validation results, and verification limitations. Backend and AGENTS.md remain unchanged; owner review is pending.

## Prompt 03 follow-up — Clear stale API errors on a new attempt

### Original request

```text
Actúa como un Senior Frontend Engineer.

Estamos trabajando en el Sezzle Calculator Challenge, específicamente en la rama `feat/frontend-calculator`.

Antes de realizar cambios, lee completamente `AGENTS.md` y respeta sus instrucciones.

Durante las pruebas manuales detectamos un problema de experiencia de usuario:

1. Al intentar dividir entre cero, se muestra correctamente el error del backend.
2. Posteriormente, al dejar vacío uno de los operandos e intentar calcular nuevamente, aparece el error de validación del campo.
3. Sin embargo, el mensaje anterior de división entre cero permanece visible.

**Objetivo:**

Corregir el manejo de errores para evitar mostrar mensajes obsoletos cuando se inicia un nuevo intento de cálculo.

**Requisitos:**

- Mantener la arquitectura actual.
- No modificar el backend.
- No instalar dependencias adicionales.
- Conservar los mensajes y el contrato REST existentes.
- Asegurar que los errores anteriores se limpien apropiadamente.
- Agregar o actualizar pruebas automatizadas que reproduzcan el problema y validen la solución.
- Ejecutar pruebas, TypeScript y build.
- Registrar este requerimiento y sus resultados en `docs/prompts.md`.
- No realizar commits, push, merges ni Pull Requests.

Antes de modificar archivos, explica brevemente la causa identificada y los cambios propuestos. Espera mi aprobación explícita.
```

### Purpose and diagnosis

Clear a previous API error when the user submits another attempt that fails client validation. Previously, API errors were cleared only inside the valid-input calculation handler, which the form never called for invalid operands.

### Implementation authorization

```text
Apruebo los cambios propuestos.

Procede con la implementación del callback `onAttempt` para limpiar los errores anteriores al iniciar un nuevo intento de cálculo.

Condiciones:

1. Mantener la arquitectura actual y la protección contra solicitudes duplicadas.
2. No modificar el backend ni instalar dependencias adicionales.
3. Agregar las pruebas automatizadas que reproduzcan el problema detectado.
4. Ejecutar pruebas, cobertura, TypeScript y build.
5. Actualizar `docs/prompts.md` con el requerimiento y los resultados reales.
6. No modificar `AGENTS.md`.
7. No realizar commits, push, merges ni Pull Requests.

Al finalizar, presenta los archivos modificados, los resultados de las verificaciones y cualquier problema pendiente.

Esperaré los resultados para revisar y autorizar el commit.
```

### Implementation outcome

Added an onAttempt callback to CalculatorForm, invoked after the pending-request guard and before validating operands. App clears its API error through that callback. Existing messages, API behavior, result handling, and duplicate-request protection are preserved. No backend, dependency, or AGENTS.md changes were made.

Added two regression cases: division by zero followed by an empty first or second operand. Both tests failed before the fix because the obsolete API alert remained. After the fix, each verifies that only the field validation alert remains and that no additional request is sent.

Validation from frontend/: npm.cmd test and npm.cmd run test:coverage passed all 56 tests across 3 files; npm.cmd run typecheck and npm.cmd run build passed. V8 coverage: statements 98.7% (76/77), branches 95.38% (62/65), functions 100% (17/17), lines 100% (60/60). Coverage reports were regenerated locally. Existing duplicate-submission and retry tests remain passing. No additional defects were found; browser verification of this fix and owner review remain pending. No commits, pushes, merges, or Pull Requests were performed.

## Prompt 04 — Final Technical Audit

### Original prompt

````text
# Prompt 04 — Final Technical Audit | Sezzle Calculator Challenge

Actúa como un Senior Full Stack Engineer y Technical Reviewer encargado de realizar una auditoría final del proyecto Sezzle Calculator Challenge antes de su entrega.

## 1. Instrucciones obligatorias

Antes de comenzar:

- Lee completamente `AGENTS.md`, `README.md` y `docs/prompts.md`.
- Revisa la estructura completa del repositorio.
- Confirma que estamos trabajando sobre la rama `main`.
- Verifica que `main` esté sincronizada con `origin/main`.
- Confirma que el árbol de trabajo esté limpio.

**IMPORTANTE: Esta auditoría es estrictamente de solo lectura.**

No tienes autorización para:

- Modificar, crear o eliminar archivos del proyecto.
- Instalar, actualizar o eliminar dependencias.
- Crear ramas, commits, tags o Pull Requests.
- Ejecutar push, merge, reset o comandos que alteren el repositorio.
- Corregir problemas automáticamente.
- Modificar `AGENTS.md` ni `docs/prompts.md`.

Puedes ejecutar comandos de inspección, pruebas, análisis estático y compilación, siempre que no modifiquen archivos versionados. Evita generar artefactos persistentes; utiliza rutas temporales cuando sea necesario. Solicita autorización si una verificación requiere cambios o permisos adicionales.

## 2. Revisión de requisitos

Identifica los requisitos originales del challenge utilizando la documentación disponible en el repositorio.

Verifica que cada requisito esté implementado correctamente.

No inventes requisitos ni supongas que algo está aprobado sin evidencia.

Clasifica cada requisito como:

- PASS: cumple con evidencia verificable.
- FAIL: incumplimiento confirmado.
- WARNING: riesgo o cumplimiento parcial.
- NOT VERIFIED: no fue posible comprobarlo.

## 3. Auditoría del backend Go

Revisa:

- Arquitectura y separación de responsabilidades.
- Implementación de suma, resta, multiplicación y división.
- Validación estricta de solicitudes JSON.
- Manejo de división entre cero.
- Manejo de números inválidos y resultados no finitos.
- Códigos HTTP y estructura de errores.
- Configuración CORS.
- Seguridad básica del servidor.
- Pruebas unitarias y HTTP.
- Cobertura real y calidad de las pruebas.

Ejecuta, si el entorno lo permite:

- `go test ./...`
- `go test -cover ./...`
- `go vet ./...`
- `go build ./...`

## 4. Auditoría del frontend React

Revisa:

- Arquitectura React + TypeScript.
- Integración con la API Go.
- Implementación de las cuatro operaciones.
- Validación de operandos.
- Manejo de errores de API y red.
- Estados de carga.
- Prevención de solicitudes duplicadas.
- Accesibilidad básica.
- Diseño responsive.
- Manejo correcto de errores anteriores cuando falla una nueva validación.
- Seguridad de configuración y dependencias.
- Pruebas automatizadas y cobertura.

Ejecuta las verificaciones disponibles mediante los scripts existentes:

- Pruebas automatizadas.
- Cobertura.
- TypeScript.
- Build de producción.
- Auditoría de dependencias, si está permitida.

No instales ni actualices dependencias.

## 5. Revisión de integración

Verifica que el contrato HTTP utilizado por React coincida exactamente con el backend Go.

Revisa:

- Endpoint y método HTTP.
- Estructura del JSON enviado.
- Estructura de respuestas exitosas.
- Estructura de errores.
- Variables de entorno.
- Origen permitido por CORS.
- Configuración de puertos.

Distingue claramente entre verificaciones estáticas y pruebas de integración ejecutadas realmente.

No afirmes que una prueba navegador–backend pasó si no fue ejecutada durante esta auditoría.

## 6. Documentación y repositorio

Revisa:

- Calidad y precisión del README.
- Instrucciones de instalación y ejecución.
- Comandos de pruebas.
- Variables de entorno documentadas.
- Historial de prompts de IA en `docs/prompts.md`.
- Consistencia entre documentación y código.
- Archivos excluidos mediante `.gitignore`.
- Ausencia de credenciales o secretos versionados.
- Estado de Git y commits relevantes.

## 7. Reporte final obligatorio

Entrega un reporte estructurado con:

### A. Executive Summary
Evaluación general del proyecto y su preparación para entrega.

### B. Requirements Compliance Matrix
Tabla de requisitos, estado, evidencia y observaciones.

### C. Backend Audit
Hallazgos técnicos y resultados reales de verificaciones.

### D. Frontend Audit
Hallazgos técnicos y resultados reales de verificaciones.

### E. Integration Audit
Compatibilidad del contrato y verificaciones realizadas.

### F. Documentation & Repository Audit
Estado de documentación, Git y seguridad básica.

### G. Findings
Clasifica los hallazgos como:

- CRITICAL
- HIGH
- MEDIUM
- LOW
- INFORMATIONAL

Incluye archivo, ubicación, evidencia, impacto y recomendación.

### H. Final Recommendation
Emite una de estas conclusiones:

- READY FOR SUBMISSION
- READY WITH MINOR OBSERVATIONS
- NOT READY FOR SUBMISSION

Justifica la conclusión.

## 8. Restricción final

No implementes ninguna corrección.

Si detectas problemas, explica cómo resolverlos y espera mi autorización explícita.

Al finalizar, confirma que la rama `main` y los archivos versionados permanecen sin modificaciones.
````
### Purpose and outcome

Perform a read-only final audit. The audit ran on clean main at 71e61cb, verified against origin/main and the remote GitHub branch. Go tests, vet, and build passed; backend statement coverage was 93.1% overall (calculator 100%, httpapi 98.8%, main 0%). Frontend tests passed 56 cases, TypeScript and build passed, and coverage measured 98.7% statements, 95.38% branches, 100% functions and lines. npm audit reported 0 vulnerabilities.

Recommendation: READY WITH MINOR OBSERVATIONS. Findings: stale README metrics, an overly broad Node engine range, no client request timeout, and an informational ignored JSON-write error in Go. No corrections were made during that audit. Live HTTP verification was skipped because port 8080 was occupied; browser-to-backend integration, visual, and screen-reader behavior were not verified. This prompt is recorded retrospectively under the explicit Prompt 05 authorization; the original audit prohibited documentation edits.

## Prompt 05 — Final Audit Fixes

### Original prompt
````text
# Prompt 05 — Final Audit Fixes | Sezzle Calculator Challenge

Actúa como un Senior Full Stack Engineer especializado en React, TypeScript, Go, testing y buenas prácticas de Git.

El objetivo es resolver las observaciones menores identificadas durante la auditoría final del Sezzle Calculator Challenge, sin alterar las funcionalidades existentes ni introducir complejidad innecesaria.

## 1. Instrucciones obligatorias

Antes de realizar cualquier modificación:

1. Lee completamente `AGENTS.md`, `README.md` y `docs/prompts.md`.
2. Revisa la implementación actual del backend y frontend.
3. Confirma la rama actual y el estado del repositorio.
4. Verifica que `main` esté sincronizada con `origin/main`.
5. Confirma que el árbol de trabajo esté limpio.
6. Revisa las versiones de Node, Vite, Vitest y las dependencias existentes.

No modifiques archivos, instales dependencias ni ejecutes operaciones de escritura hasta recibir mi autorización explícita.

Respeta todas las instrucciones de `AGENTS.md`.

## 2. Estrategia de Git

La rama autorizada para este requerimiento será:

`fix/final-audit-observations`

Debe partir de la última versión de `origin/main`.

Antes de crearla, presenta tu plan y espera mi autorización.

No realices modificaciones directamente sobre `main`.

No ejecutes commits, push, merges ni Pull Requests sin autorización posterior.

El merge final será realizado manualmente por mí.

## 3. Corrección del README

La auditoría detectó métricas desactualizadas en `README.md`.

Revisa los resultados actuales de las pruebas y actualiza:

- Número de pruebas automatizadas.
- Cobertura de sentencias.
- Cobertura de ramas.
- Cobertura de funciones.
- Cobertura de líneas.
- Cualquier otra cifra que ya no coincida con las mediciones reales.

No utilices métricas históricas como si fueran resultados actuales.

Conserva la documentación existente y evita reescrituras innecesarias.

## 4. Compatibilidad de Node.js

La auditoría identificó que `frontend/package.json` declara un rango `engines.node` más amplio que el soportado por algunas herramientas de desarrollo.

Investiga las restricciones reales de:

- Vite.
- Vitest.
- Plugin React de Vite.
- Otras dependencias que establezcan restricciones de Node.

Propón un rango de versiones compatible con todas ellas.

No actualices dependencias únicamente para resolver la declaración de compatibilidad.

Si es necesario modificar `package-lock.json`, explica por qué antes de hacerlo.

El entorno local utilizado previamente fue Node.js 24.22.1.

## 5. Timeout de solicitudes HTTP

La auditoría identificó que el cliente HTTP del frontend no establece un tiempo máximo para las solicitudes.

Propón implementar un timeout razonable en:

`frontend/src/api/calculator.ts`

Requisitos:

- Utilizar preferentemente APIs nativas del navegador.
- Evitar dependencias adicionales.
- Cancelar solicitudes que excedan el tiempo establecido.
- Mostrar un mensaje comprensible al usuario.
- Recuperar correctamente el estado de la interfaz.
- Mantener la prevención de solicitudes duplicadas.
- Conservar la cancelación existente al desmontar componentes.
- Distinguir, cuando corresponda, entre timeout y cancelación intencional.
- Evitar actualizaciones de estado después de desmontar.
- No modificar el contrato REST del backend.

Agrega pruebas automatizadas para el timeout y la recuperación posterior.

El tiempo exacto debe justificarse en la propuesta técnica antes de implementarlo.

## 6. Registro de documentación de IA

Una vez autorizada la implementación, actualiza:

`docs/prompts.md`

Registra:

- Prompt 04 — Final Technical Audit.
- Resumen de sus resultados.
- Prompt 05 — Final Audit Fixes.
- Mi autorización explícita.
- Cambios realizados.
- Pruebas ejecutadas y resultados.

Conserva íntegramente los registros anteriores.

## 7. Alcance restringido

No debes:

- Modificar el backend Go.
- Cambiar el diseño visual.
- Modificar las cuatro operaciones matemáticas.
- Alterar el contrato HTTP.
- Agregar funcionalidades fuera del alcance.
- Instalar nuevas dependencias sin autorización.
- Modificar `AGENTS.md`.
- Realizar refactorizaciones no relacionadas.

La observación informativa sobre el registro de errores de escritura del backend queda fuera del alcance.

## 8. Validaciones posteriores

Después de recibir autorización e implementar los cambios, ejecuta:

- Pruebas automatizadas del frontend.
- Cobertura de pruebas.
- Verificación TypeScript.
- Build de producción.
- Auditoría npm.
- Revisión de Git y archivos modificados.

Si alguna comprobación no puede ejecutarse, explica el motivo.

No declares pruebas exitosas sin haberlas ejecutado.

## 9. Primera respuesta obligatoria

Antes de implementar, entrégame:

### A. Estado del repositorio
Rama, sincronización y estado de Git.

### B. Diagnóstico
Confirma cada observación de la auditoría y su causa.

### C. Propuesta técnica
Explica las modificaciones específicas, incluyendo el timeout y el rango de Node.

### D. Archivos previstos
Enumera los archivos que necesitarían modificaciones.

### E. Riesgos
Identifica posibles regresiones y cómo prevenirlas.

### F. Plan de pruebas
Explica cómo verificarás cada corrección.

### G. Solicitud de autorización
Pregunta explícitamente si apruebo la creación de la rama y la implementación.

**DETENTE después de presentar este plan. No crees la rama ni modifiques archivos hasta recibir mi aprobación.**

## 10. Entrega posterior

Una vez implementado y validado el trabajo, presenta un reporte con los resultados y espera mi revisión manual.

No realices commits, push, merges ni Pull Requests sin una autorización adicional.
````

### Implementation authorization

````text
Apruebo explícitamente la propuesta del Prompt 05 — Final Audit Fixes.

Autorizo:

1. Crear la rama `fix/final-audit-observations` desde la última versión de `origin/main`.
2. Actualizar las métricas del README con resultados reales.
3. Ajustar `engines.node` en `package.json` y los metadatos correspondientes en `package-lock.json`, sin actualizar dependencias.
4. Implementar el timeout HTTP de 15 segundos, conservando la cancelación existente y evitando solicitudes duplicadas.
5. Agregar las pruebas automatizadas propuestas.
6. Actualizar `docs/prompts.md` con los registros de los Prompts 04 y 05, mi autorización y los resultados.

Consideraciones adicionales:

- Verifica la compatibilidad exacta del rango de Node con las herramientas instaladas.
- Asegura que el timeout no se confunda con una cancelación intencional.
- Confirma que los temporizadores y listeners se liberen correctamente.
- No modifiques el backend, el diseño visual, el contrato REST ni `AGENTS.md`.
- No instales ni actualices dependencias.

Al terminar, ejecuta las pruebas, cobertura, TypeScript, build y auditoría npm.

Presenta los resultados reales, los archivos modificados y cualquier observación pendiente.

**No realices commit, push, merge ni Pull Request. Espera mi revisión y autorización posterior.**
````
### Purpose and implementation outcome

Resolve only the approved audit observations. Created fix/final-audit-observations from origin/main at 71e61cb after checking the live remote SHA. Updated the Node engine range and only the corresponding root lockfile metadata to ^22.12.0 || ^24.0.0 || >=26.0.0, matching Vitest and compatible with all Node constraints recorded in the existing lockfile. No dependency versions or resolutions changed, and no dependencies were installed or updated.

Added a 15-second timeout covering fetch and response-body reading. An internal AbortController forwards external cancellation, preserves the first cancellation reason, and aborts timed-out requests with a dedicated user-facing message. The caller's signal remains unmodified on timeout so App can release its pending state and permit retry. Timers and external listeners are removed in finally. Existing unmount cancellation, duplicate prevention, API messages, and the REST contract are preserved. Backend, visual design, and AGENTS.md remain unchanged.

Added nine test cases covering timeout timing, stalled response bodies, intentional and pre-existing cancellation, timer/listener cleanup after completion and errors, and UI recovery with successful retry. README metrics and timeout/Node documentation were updated without rewriting unrelated sections.

### Validation results

Executed from frontend/: npm.cmd test passed 65 tests across 3 files; npm.cmd run test:coverage passed all 65 tests; npm.cmd run typecheck and npm.cmd run build passed. V8 coverage: statements 100% (93/93), branches 97.1% (67/69), functions 100% (20/20), lines 100% (73/73). npm.cmd audit --json reported 0 vulnerabilities. No failures occurred during these implementation checks. Tests used simulated network responses and fake timers; real-browser timeout behavior and browser-to-Go integration still require manual review. No commits, pushes, merges, or Pull Requests were performed; owner review is pending.
