# Invoice RPA Manager (V 1.0)

Aplicación full-stack para la carga, previsualización y monitoreo de facturas PDF. Al subir un comprobante, el sistema registra la factura en base de datos con estado **PENDIENTE** y expone una API para que un bot de **Automation Anywhere** consulte el archivo, lo procese y actualice el estado final (`PROCESADO`, `PROCESANDO`, `ERROR`, etc.).

---

## 1. Estructura del proyecto

```text
invoice-rpa-manager/
├── api/                          # Backend Node.js + Express + Sequelize + PostgreSQL
│   ├── index.js                  # Punto de entrada del servidor
│   ├── package.json
│   ├── .env.template
│   └── src/
│       ├── app.js                # Configuración de Express, CORS y middlewares
│       ├── db.js                 # Conexión Sequelize e inyección de modelos
│       ├── config/
│       │   └── multer.js         # Configuración de carga de archivos
│       ├── controllers/
│       │   └── invoiceController.js
|       ├── scripts/
│       │   └── bot-simulator.js  ## Simulador para pruebas sin tener que implementar Automation anywhere
│       ├── models/
│       │   └── Invoice.js
│       └── routes/
│           └── Invoice.js
└── client/                       # Frontend React + Vite + Tailwind CSS
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── components/
        │   ├── DocPreview/
        │   ├── FileUploader/
        │   ├── Header/
        │   ├── InvoiceTable/
        │   └── Sidebar/
        └── views/
            └── DashboardInvoices/
```

## 2. Tecnologías

### Backend

- Node.js 18+
- Express 4
- Sequelize 6 (PostgreSQL)
- Multer (carga de archivos)
- CORS
- dotenv

### Frontend

- React 19
- Vite 8
- Tailwind CSS 4
- Lucide React (iconografía)

```text
[Frontend] --> [API Node.js] --> [PostgreSQL]
                  ↑  |
        (Resp AA) |  |(Files)
                  |  v
             [Automation Anywhere]
```

---

## 3. Flujo de funcionamiento

1. El usuario arrastra o selecciona un archivo PDF desde el componente `FileUploader`.
2. El componente `DocPreview` genera una URL local para previsualizar el PDF.
3. El usuario presiona **“Enviar a Automation Anywhere”**.
4. El frontend realiza un `POST` `multipart/form-data` a `/api/invoice/upload` con el campo `invoice`.
5. El backend:
   - Genera un `invoice_id` UUID v4, también usado como nombre de archivo en disco.
   - Guarda el archivo PDF en el directorio configurado (`UPLOAD_DIR`).
   - Crea un registro en la base de datos con:
     - `invoice_id`
     - `invoice_file_name` (nombre original del archivo)
     - `invoice_status` = `PENDIENTE`
     - `invoice_upload_date` = `NOW()`
   - Responde con `{ id, fileName }`.
6. El bot de **Automation Anywhere** consulta el registro `PENDIENTE` y obtiene el archivo PDF almacenado en `UPLOAD_DIR` usando el `invoice_id` como nombre físico.
7. El bot ejecuta el proceso/documento entrenado en **Automation Anywhere** y extrae los campos estructurados del comprobante (número, fecha, importe, CUIT, etc.).
8. El bot genera un archivo **Excel (.xlsx)** en la máquina del usuario con los datos extraídos, organizados en columnas y hojas según el esquema configurado en el modelo entrenado.
9. Una vez finalizada la extracción y generación del Excel, el bot envía una petición `PUT` a `/api/invoice/status/:id` con:
   - `status` (`REQUIERE VALDIACIÓN`, `PROCESADO`, `ERROR`)
   - `error_log` (opcional, requerido solo si el estado es `ERROR`)
10. El frontend monitorea el estado consultando `GET /api/invoice/`.

---

## 4. Endpoints de la API

| Método | Ruta                      | Descripción                                  | Body / Params                              |
|--------|---------------------------|----------------------------------------------|--------------------------------------------|
| POST   | `/api/invoice/upload`     | Sube un archivo PDF y crea el registro       | `multipart/form-data`, campo `invoice`     |
| PUT    | `/api/invoice/status/:id` | Actualiza el estado del procesamiento        | JSON `{ status, error_log? }`              |
| GET    | `/api/invoice/`           | Lista todas las facturas ordenadas por fecha | —                                          |

---

## 5. Modelo de datos

**Tabla: `Invoices`**

| Campo                 | Tipo    | Descripción                         |
|-----------------------|---------|-------------------------------------|
| `invoice_id`          | UUID    | Clave primaria                      |
| `invoice_file_name`   | STRING  | Nombre original del archivo         |
| `invoice_status`      | STRING  | Estado por defecto: `PENDIENTE`     |
| `invoice_upload_date` | DATE    | Fecha y hora de carga               |
| `invoice_error_log`   | TEXT    | Mensaje de error (opcional)         |

### Estados esperados en el frontend

- `PENDIENTE`
- `PROCESANDO`
- `PROCESADO`
- `REQUIERE VALIDACIÓN`
- `ERROR`

---

## 6. Configuración e instalación

### Requisitos previos

- Node.js 18 o superior
- PostgreSQL 14 o superior
- Cuenta o entorno de Automation Anywhere (para la integración RPA)

### Variables de entorno (API)

Crear un archivo `.env` dentro de `api/` a partir de `.env.template`:

```env
PORT=tu_puerto_de_servidor
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_HOST=localhost
DB_NAME=nombre_de_tu_db
DB_PORT=5432
UPLOAD_DIR=ruta_donde_se_subira_el_archivo_para_activar_el_bot (Debe coincidir con la de Automation Anywhere)
```

### Instalación y ejecución

```bash
# 1. Clonar el repositorio
git clone https://github.com/maksudxx/invoice-rpa-manager.git
cd invoice-rpa-manager

# 2. Instalar y levantar el backend
cd api
npm install
# Crear .env con tus credenciales
npm run dev  # modo desarrollo con nodemon

# 3. Instalar y levantar el frontend
cd ../client
npm install
npm run dev # inicia en http://localhost:5173
```

El frontend está configurado para consumir la API en:

```javascript
const API_URL = "http://localhost:3001/api/invoice";
```

> **Importante:** el CORS del backend está restringido al origen `http://localhost:5173`. Si se cambia el puerto del cliente, actualizar `api/src/app.js`.

---

## 7. Demo rápida

### 🚀 ¿Quieres probarlo ahora mismo?

No necesitas tener configurado Automation Anywhere para ver cómo funciona el sistema. He incluido un script de simulación que emula el comportamiento de un bot real (no procesa facturas porque se necesita del bot, solo emula el estado):

1- Levanta el backend (cd api && npm run dev) y el frontend (cd client && npm run dev).

2- Abre una nueva terminal en la raíz del proyecto.

3- Ejecuta el simulador:

```bash
node src/scripts/bot-simulator.js
```
4- Sube cualquier PDF desde la web: verás cómo el sistema registra el archivo como PENDIENTE y el simulador lo marca automáticamente como PROCESADO en segundos.

---

## 8. Integración con Automation Anywhere

El procesamiento documental es ejecutado por un **bot de Automation Anywhere** desplegado en un entorno control room. A continuación se describe el ciclo de vida técnico completo.

### 8.1. Disparador del proceso

El flujo se inicia cuando el usuario presiona **“Enviar a Automation Anywhere”** en el frontend. Esa acción ejecuta:

```http
POST /api/invoice/upload
Content-Type: multipart/form-data
```

El backend almacena el PDF en disco, genera un UUID vinculante (`invoice_id`) y persiste el registro con estado `PENDIENTE`.

### 8.2. Obtención del trabajo pendiente

El bot puede conocer qué documentos debe procesar de dos formas:

- **Pull model:** consulta periódicamente `GET /api/invoice/` y filtra por `invoice_status = 'PENDIENTE'`.
- **Direct DB access:** lee directamente la tabla `Invoices` por el mismo estado, si el runner tiene acceso a PostgreSQL.

### 8.3. Lectura del documento

Para cada registro seleccionado, el bot localiza el archivo físico usando `invoice_id` como nombre de archivo:

```text
{UPLOAD_DIR}/{invoice_id}
```

Este contrato garantiza la trazabilidad entre el registro relacional y el objeto binario en disco, independientemente del nombre original del comprobante.

### 8.4. Extracción de datos mediante el modelo entrenado

El bot ejecuta un proceso de Automation Anywhere previamente entrenado, por ejemplo:

- **Document Automation** (models entrenados para reconocimiento de layouts de facturas)
- **Automation Anywhere IQ Bot** con grupos de aprendizaje para comprobantes locales


El modelo interpreta el contenido del PDF y extrae los campos estructurados —número de factura, fecha de emisión, CUIT emisor/receptor, importes, ítems, etc.— normalizando tipos de dato y aplicando reglas de validación definidas durante el entrenamiento.

### 8.5. Generación del archivo Excel

Una vez extraídos los datos, el bot genera un archivo **Excel (.xlsx)** en la máquina del usuario o del runner. El mapeo respeta el esquema tabular definido en el modelo entrenado, permitiendo columnas como:

| Columna                  | Tipo   | Origen                                      |
|--------------------------|--------|---------------------------------------------|
| `invoice_number`         | string | Número de factura                           |
| `invoice_date`           | date   | Fecha parseada del comprobante              |
| `receiver_address`       | string | Dirección del receptor de la factura        |
| `total_amount`           | number | Total de la factura                         |
| `bank_account_number`    | number | numero de cuenta bancaria                   |
| `bank_name`              | string | nombre del banco                            |
| `vendor_address`         | string | Dirección del vendedor                      |
| `email`                  | string | Email del receptor                          |
| `description`            | string | Descripción del producto comprado           |
| `quantity`               | number | Cantidad de prodcuto                        |
| `unit_price`             | number | Precio unitario                             |
| `total_price`            | number | Precio total                                |        

> El archivo Excel se almacena localmente en la estación de trabajo del runner. La aplicación web no recibe ni persiste el contenido del Excel por diseño, salvo que se extienda la integración para retornar una URL o base64 del archivo.

### 8.6. Actualización del estado del procesamiento

Al finalizar la extracción y la generación del Excel, el bot notifica el resultado al backend:

```http
PUT /api/invoice/status/:id
Content-Type: application/json
```

**Caso de éxito:**

```json
{
  "status": "PROCESADO"
}
```

**Caso de validación manual requerida (extracción incompleta o confianza baja):**

```json
{
  "status": "REQUIERE VALIDACIÓN"
}
```

**Caso de error en la extracción o generación del Excel:**

```json
{
  "status": "ERROR",
  "error_log": "A file with same name '469cf287-cb5d-4c6e-bb54-0671cd1a2681_boleta_prueba_1.xlsx' already exists. To fix it, either rename the file or tick the 'Replace existing file' checkbox in the action properties."
}
```

El backend actualiza `invoice_status` y, en caso de corresponder, `invoice_error_log`. El frontend detecta el cambio mediante el intervalo de polling configurado sobre `GET /api/invoice/`.

### 8.7. Estado final esperado

Al concluir el ciclo, el usuario visualiza en el dashboard el estado actualizado (`PROCESANDO`, `PROCESADO`, `ERROR`, `REQUIERE VALIDACIÓN`, etc.) junto con el log de error si el bot reportó alguna falla, sin necesidad de recargar manualmente la página.

### 8.8. Requisitos y configuración del entorno de RPA

Para el funcionamiento del procesamiento automatizado, el desarrollador debe asegurar la siguiente infraestructura:

- **Acceso a Control Room**
  Conectividad habilitada con la **Control Room de Automation Anywhere** para gestión, despliegue y monitoreo del bot.

- **Despliegue del Bot**
  El bot debe estar configurado en un **Bot Runner** local o remoto, con permisos de lectura y escritura sobre el directorio configurado como `UPLOAD_DIR` en el backend.

- **Modelos de Documentos**
  Entrenamiento previo en **Document Automation** (Learning Instance) con un set representativo de comprobantes, con el fin de garantizar precisión en la extracción de campos.

- **Desarrollo del Bot**
  En caso de no contar con una automatización preexistente, el desarrollador deberá crear un flujo que integre:
  - la ingesta del archivo PDF,
  - la ejecución del modelo OCR o de extracción entrenado,
  - la validación de reglas de negocio,
  - el callback al backend mediante `PUT /api/invoice/status/:id`.

### 8.9. Flujo de activación (Trigger-Based)

El bot opera bajo un modelo de **Event Trigger**, ejecutándose automáticamente según el siguiente paso a paso:

1. **Monitoreo de Directorio**
   El Bot Runner mantiene un trigger activo vigilando el directorio `UPLOAD_DIR` definido en el backend.

2. **Detección de Evento**
   Al momento en que un archivo es creado en dicho directorio (tras el `POST /api/invoice/upload`), el sistema dispara la ejecución del bot de manera asíncrona.

3. **Procesamiento**
   El bot realiza la ingesta del PDF, ejecuta el OCR y extrae los datos mediante el modelo entrenado.

4. **Callback de Estado**
   Tras finalizar el procesamiento, el bot invoca el endpoint `PUT /api/invoice/status/:id` para actualizar el estado del proceso en la base de datos.

> **Nota sobre el control de versiones:**
> El bot de Automation Anywhere reside en la plataforma **Control Room** y no forma parte del código fuente de este repositorio. Cualquier modificación en la lógica del bot —cambios en el trigger, modelos o scripts internos— debe realizarse directamente en el entorno de desarrollo de Automation Anywhere. Este repositorio gestiona únicamente la capa de API y la interfaz web que permite el monitoreo y la interacción con dichos procesos.

---

## 9. Componentes principales del frontend

| Componente            | Responsabilidad                                                                 |
|-----------------------|---------------------------------------------------------------------------------|
| `Sidebar`             | Navegación lateral estática (Dashboard, Facturas, Modelos RPA, Configuración).  |
| `Header`              | Título, búsqueda por nombre de archivo y filtro por estado.                     |
| `InvoiceTable`        | Tabla responsive con listado, íconos de estado, log de error y fecha de carga.  |
| `FileUploader`        | Zona drag & drop y input de archivos, restringido a PDF.                        |
| `DocPreview`          | Previsualización del PDF cargado y botón de envío a Automation Anywhere.        |
| `DashboardInvoices`   | Orquesta estado global, filtros y comunicación con la API.                      |

---

## 10. Observaciones y notas de funcionamiento

- El backend genera el UUID del registro antes de guardar el archivo, garantizando que el nombre en disco coincida con `invoice_id`.
- El límite de tamaño de archivo está configurado en Multer (revisar `api/src/config/multer.js`).
- El filtro de archivos acepta `PDF` desde el backend, pero el frontend actualmente solo permite `PDF`.
- El frontend realiza polling automático cada 5 segundos sobre `GET /api/invoice/` para reflejar los cambios de estado reportados por el bot.
- El endpoint de actualización de estado es unificado: sirve tanto para estados exitosos como para errores.
- El bot de Automation Anywhere es el responsable de aplicar el modelo entrenado y de generar el Excel en la máquina local; esta aplicación solo expone el documento y registra el estado.

---

## 11. Scripts útiles

| Comando           | Ubicación   | Descripción                          |
|-------------------|-------------|--------------------------------------|
| `npm start`       | `api/`      | Levanta el servidor en producción    |
| `npm run dev`     | `api/`      | Levanta el servidor con nodemon      |
| `node src/scripts/bot-simulator.js` | `api`/ | Levanta el simulador    |
| `npm run dev`     | `client/`   | Levanta el cliente Vite              |
| `npm run build`   | `client/`   | Genera el build de producción        |
| `npm run preview` | `client/`   | Previsualiza el build de producción  |

---

## 12. Autor

- **Facundo Maksud**
- Linkedin: [https://www.linkedin.com/in/facundo-maksud/](https://www.linkedin.com/in/facundo-maksud/)
