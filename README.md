# CBT App

App web para hacer ejercicios de terapia cognitivo-conductual (CBT) desde la computadora.

## Stack

- **Frontend**: Vite + React 19 + TypeScript + Tailwind CSS v4 + React Router + React Query
- **Backend**: Node + TypeScript + Fastify + SQLite (better-sqlite3) + Zod

## Cómo correr

### Backend

```bash
cd server
npm install
npm run dev
```

El servidor escucha en `http://127.0.0.1:3001`.

### Frontend

```bash
npm install
npm run dev
```

La app abre en `http://localhost:5173`. El proxy de Vite redirige `/api` al backend.

## Estructura

```
cbt-app/
├── src/
│   ├── api/           # Cliente de API
│   ├── components/    # Componentes UI reutilizables
│   ├── data/          # Ejercicios como datos tipados
│   ├── hooks/         # Custom hooks
│   ├── pages/         # Pantallas
│   ├── types/         # Tipos TypeScript
│   ├── App.tsx        # Router
│   └── main.tsx       # Entry point
├── server/
│   ├── src/
│   │   ├── routes/    # Endpoints
│   │   ├── db.ts      # Conexión SQLite
│   │   ├── schema.ts  # Validación con zod
│   │   └── index.ts   # Entry point
│   └── data/          # Base de datos SQLite (gitignored)
└── README.md
```

## Motor de ejercicios

Los ejercicios se definen como datos tipados en `src/data/exercises.ts`. Un componente genérico (`ExerciseForm` + `FieldRenderer`) renderiza cualquier ejercicio sin código específico por ejercicio.

Para agregar un ejercicio nuevo, escribí un objeto tipado en `src/data/exercises.ts`. No hace falta tocar UI.

## Tipos de campo

- `text` — input de texto
- `rating` — slider numérico
- `rows` — tabla de filas repetibles
- `choice` — selección única
- `group` — bloques agrupados
- `readonly` — contenido de solo lectura
