# 🚀 API de Node.js + Express (TypeScript)

Bienvenido/a al repositorio de la API backend de la práctica de DevOps. Esta API está construida con **Node.js, Express y TypeScript**, y expone una serie de endpoints (rutas) conectados a dos bases de datos: **PostgreSQL** (relacional) y **MongoDB** (NoSQL).

---

## 🐳 Guía Rápida: Ejecución con Docker (Recomendado)

Todo el proyecto está "dockerizado" para que no tengas que instalar las bases de datos ni configurar Node.js localmente. Solo necesitas tener [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y en ejecución.

### Pasos para levantar el entorno:

1. Clona el repositorio y asegúrate de tener una copia de `.env`:
   ```bash
   cp .env.example .env
   ```
2. Ejecuta el siguiente comando de npm para levantar la API, Postgres y Mongo en segundo plano:
   ```bash
   npm run docker:up
   ```
3. ¡Listo! La API estará disponible en `http://localhost:3000`.

### Comandos útiles de Docker:

- **Ver los logs de la API:** `npm run docker:logs`
- **Apagar y eliminar los contenedores:** `npm run docker:down`
- **Apagar contenedores y limpiar bases de datos (borrar volúmenes):** `docker compose down -v`

---

## 💻 Guía Alternativa: Ejecución Local (Sin Docker)

Si prefieres levantar el proyecto sin Docker, necesitarás cumplir con los siguientes requisitos:
- **Node.js 18+** instalado en tu máquina.
- **PostgreSQL** instalado y ejecutándose localmente.
- **MongoDB** instalado y ejecutándose localmente.

### Instalación y arranque:

1. Configura tus credenciales reales en el archivo `.env`.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

*Nota para producción:* Puedes compilar el código con `npm run build` y luego iniciarlo con `npm start`.

---

## 📡 Referencia de Endpoints

| Método | Ruta | Descripción |
| :---: | :--- | :--- |
| **GET** | `/health` | Estado de salud general de la API |
| **GET** | `/api/postgres/health` | Estado de salud de PostgreSQL |
| **GET** | `/api/postgres/users` | Lista todos los usuarios (Postgres) |
| **POST**| `/api/postgres/users` | Crea un nuevo usuario (Postgres) |
| **GET** | `/api/mongo/health` | Estado de salud de MongoDB |
| **GET** | `/api/mongo/users` | Lista todos los usuarios (Mongo) |
| **POST**| `/api/mongo/users` | Crea un nuevo usuario (Mongo) |

### 🛠️ Ejemplos de uso con `curl`

> **Nota:** Si usas **PowerShell** en Windows, asegúrate de correr los comandos `POST` en una sola línea para evitar problemas con los saltos de línea, o utiliza `Invoke-RestMethod` en su lugar.

#### Endpoints de Salud (GET)
```bash
curl http://localhost:3000/health
curl http://localhost:3000/api/postgres/health
curl http://localhost:3000/api/mongo/health
```

#### Creación de Usuarios (POST)

**Crear un usuario en Postgres:**
```bash
curl -X POST http://localhost:3000/api/postgres/users -H "Content-Type: application/json" -d "{\"name\":\"Belle\",\"email\":\"belle@example.com\"}"
```

**Crear un usuario en Mongo:**
```bash
curl -X POST http://localhost:3000/api/mongo/users -H "Content-Type: application/json" -d "{\"name\":\"Sigrid\",\"email\":\"sigrid@example.com\"}"
```

### 📄 Formato JSON esperado (Body)
Para las rutas `POST`, el sistema espera un cuerpo JSON como este:
```json
{
  "name": "Nombre",
  "email": "correo@example.com"
}
```
