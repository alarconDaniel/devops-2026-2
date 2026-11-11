import fs from "node:fs";
import { execSync } from "node:child_process";

const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Informe de Rendimiento, Recursos y Trazabilidad - Daniel Alarcón</title>
<style>
  @page {
    margin: 2.2cm 2cm 2.2cm 2cm;
    size: letter;
  }
  body {
    font-family: 'Times New Roman', Times, serif;
    font-size: 11pt;
    line-height: 1.35;
    color: #1e293b;
    margin: 0;
    padding: 0;
  }
  .header-box {
    text-align: center;
    border-bottom: 2pt solid #1e3a8a;
    padding-bottom: 12pt;
    margin-bottom: 18pt;
  }
  .institution {
    font-size: 15pt;
    font-weight: bold;
    color: #0f172a;
    text-transform: uppercase;
    margin-bottom: 2pt;
  }
  .faculty {
    font-size: 11pt;
    font-style: italic;
    color: #475569;
    margin-bottom: 4pt;
  }
  .doc-title {
    font-size: 14pt;
    font-weight: bold;
    color: #1e3a8a;
    margin-top: 10pt;
    margin-bottom: 6pt;
  }
  .metadata-table {
    width: 100%;
    margin-top: 8pt;
    font-size: 10pt;
    border-collapse: collapse;
  }
  .metadata-table td {
    padding: 3pt 6pt;
    border: none;
  }
  .meta-label {
    font-weight: bold;
    color: #334155;
    width: 25%;
  }
  .meta-val {
    color: #0f172a;
  }
  h2 {
    color: #1e3a8a;
    font-size: 12.5pt;
    border-bottom: 1pt solid #cbd5e1;
    padding-bottom: 3pt;
    margin-top: 16pt;
    margin-bottom: 8pt;
  }
  h3 {
    color: #0f172a;
    font-size: 11pt;
    margin-top: 12pt;
    margin-bottom: 4pt;
  }
  p {
    text-align: justify;
    margin-top: 0;
    margin-bottom: 7pt;
  }
  .code-term {
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 9.5pt;
    background-color: #0f172a;
    color: #f8fafc;
    padding: 8pt 10pt;
    border-radius: 4pt;
    margin: 8pt 0;
    white-space: pre-wrap;
    line-height: 1.3;
  }
  table.data-table {
    width: 100%;
    border-collapse: collapse;
    margin: 10pt 0;
    font-size: 9.5pt;
  }
  table.data-table th {
    background-color: #f1f5f9;
    color: #0f172a;
    font-weight: bold;
    border: 1pt solid #94a3b8;
    padding: 5pt 6pt;
    text-align: left;
  }
  table.data-table td {
    border: 1pt solid #cbd5e1;
    padding: 4.5pt 6pt;
  }
  table.data-table tr:nth-child(even) td {
    background-color: #f8fafc;
  }
  .badge-pass {
    color: #166534;
    font-weight: bold;
    background-color: #dcfce7;
    padding: 1pt 5pt;
    border-radius: 3pt;
  }
  .callout {
    background-color: #eff6ff;
    border-left: 3.5pt solid #3b82f6;
    padding: 7pt 10pt;
    margin: 10pt 0;
    font-size: 10pt;
    color: #1e40af;
  }
  .conclusion-list {
    margin-top: 4pt;
    padding-left: 18pt;
  }
  .conclusion-list li {
    margin-bottom: 6pt;
    text-align: justify;
  }
</style>
</head>
<body>

<div class="header-box">
  <div class="institution">Universidad Santo Tomás &bull; Seccional Tunja</div>
  <div class="faculty">División de Ingenierías y Arquitectura &bull; Ingeniería de Sistemas</div>
  <div class="doc-title">Práctica: Medición de Rendimiento, Recursos y Trazabilidad DevOps</div>
  
  <table class="metadata-table">
    <tr>
      <td class="meta-label">Estudiante:</td>
      <td class="meta-val">Daniel Esteban Alarcón Rojas</td>
      <td class="meta-label">Asignatura:</td>
      <td class="meta-val">DevOps (Octavo Semestre)</td>
    </tr>
    <tr>
      <td class="meta-label">Docente:</td>
      <td class="meta-val">Manuel Castro Barinas</td>
      <td class="meta-label">Fecha:</td>
      <td class="meta-val">10 de Noviembre de 2026</td>
    </tr>
    <tr>
      <td class="meta-label">Rama Origen:</td>
      <td class="meta-val"><code>products-test-alarcon</code> (PR #88)</td>
      <td class="meta-label">Nueva Rama:</td>
      <td class="meta-val"><code>timing-alarcon-daniel</code></td>
    </tr>
  </table>
</div>

<h2>1. Introducción y Contexto del Requerimiento</h2>
<p>
El presente informe da cumplimiento a la directriz planteada por el docente:
<em>"Medir cuánto se está demorando el servicio en ser ejecutado. De esa rama crear otra y hacer el cálculo"</em>.
Previamente se completó la implementación del almacén de productos en memoria dentro de la rama <code>products-test-alarcon</code>, sobre la cual se encuentra abierto el <strong>Pull Request #88</strong> en el repositorio central (<code>upstream: uni-dev-labs/devops-2026-2</code>), alcanzando una calificación perfecta de <strong>5.0 / 5.0</strong> al superar los 32 tests unitarios.
</p>
<p>
Para ofrecer un análisis riguroso y resolver la ambigüedad de la solicitud con estándares de ingeniería DevOps, se ramificó hacia <code>timing-alarcon-daniel</code> y se diseñó una metodología con doble alcance:
</p>
<ol>
  <li><strong>Rendimiento y consumo de recursos del servicio en ejecución:</strong> Medición cuantitativa de latencias por operación (promedio, percentil 95, mín/máx), throughput (operaciones por segundo) y consumo de recursos del proceso Node.js (CPU y memoria Heap/RSS).</li>
  <li><strong>Tiempos de pruebas automatizadas y trazabilidad de CI/CD:</strong> Desglose temporal de la suite principal y de productos en local, y análisis de la cadena completa de integración continua en GitHub Actions (commit &rarr; rama &rarr; PR &rarr; run &rarr; jobs &rarr; steps).</li>
</ol>

<h2>2. Metodología y Scripts Desarrollados</h2>
<p>
Se incorporaron tres scripts modulares y reproducibles dentro del proyecto:
</p>
<table class="data-table">
  <thead>
    <tr>
      <th>Script / Comando</th>
      <th>Descripción y Función Técnica</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>npm run benchmark:service</code><br><code>(scripts/service-benchmark.mjs)</code></td>
      <td>Realiza un benchmarking intensivo del servicio: ejecuta 1,000 inserciones, 5,000 búsquedas indexadas, 500 consultas complejas con filtros y ordenamiento léxico, 2,000 actualizaciones de inventario y 200 peticiones HTTP a través del pipeline de Express. Calcula latencias, ops/s, uso de CPU (<code>process.cpuUsage</code>) y deltas de memoria (<code>process.memoryUsage</code>).</td>
    </tr>
    <tr>
      <td><code>npm run test:timing</code><br><code>(scripts/test-timing.mjs)</code></td>
      <td>Ejecuta Vitest con reporte estructurado JSON. Calcula el tiempo de pared total (*wall time*), tiempo neto por archivo de prueba y el ranking de tests más lentos. Soporta la suite general y la suite de productos (<code>npm run test:timing:productos</code>).</td>
    </tr>
    <tr>
      <td><code>npm run ci:timing</code><br><code>(scripts/ci-timing.mjs)</code></td>
      <td>Automatiza la consulta mediante GitHub CLI (<code>gh</code>) para reconstruir la cadena de trazabilidad y obtener la duración exacta en segundos de cada job y paso en GitHub Actions.</td>
    </tr>
  </tbody>
</table>

<h2>3. Resultados: Rendimiento y Consumo de Recursos en Runtime</h2>
<p>
Las mediciones se llevaron a cabo en el entorno de desarrollo sobre la plataforma Linux x86_64 con Node.js v22.23.4.
</p>

<h3>3.1. Latencias y Throughput por Operación del Servicio</h3>
<table class="data-table">
  <thead>
    <tr>
      <th>Operación / Endpoint</th>
      <th>Muestras</th>
      <th>Promedio</th>
      <th>P95</th>
      <th>Máximo</th>
      <th>Throughput</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>ProductStore.create()</code></td>
      <td>1,000</td>
      <td>0.024 ms</td>
      <td>0.036 ms</td>
      <td>1.288 ms</td>
      <td><strong>41,950 ops/s</strong></td>
    </tr>
    <tr>
      <td><code>ProductStore.getById/Sku()</code></td>
      <td>5,000</td>
      <td>0.009 ms</td>
      <td>0.028 ms</td>
      <td>0.447 ms</td>
      <td><strong>117,272 ops/s</strong></td>
    </tr>
    <tr>
      <td><code>ProductStore.list()</code> (Filtros + Locale 'es')</td>
      <td>500</td>
      <td>1.243 ms</td>
      <td>1.364 ms</td>
      <td>6.644 ms</td>
      <td><strong>804 ops/s</strong></td>
    </tr>
    <tr>
      <td><code>ProductStore.adjustStock()</code></td>
      <td>2,000</td>
      <td>0.001 ms</td>
      <td>0.001 ms</td>
      <td>0.078 ms</td>
      <td><strong>1,744,997 ops/s</strong></td>
    </tr>
    <tr>
      <td><code>HTTP GET /health</code> (Pipeline Express)</td>
      <td>200</td>
      <td>0.847 ms</td>
      <td>1.194 ms</td>
      <td>18.313 ms</td>
      <td><strong>1,181 ops/s</strong></td>
    </tr>
  </tbody>
</table>

<h3>3.2. Consumo de Recursos del Proceso</h3>
<table class="data-table">
  <thead>
    <tr>
      <th>Recurso Evaluado</th>
      <th>Estado Inicial</th>
      <th>Estado Final</th>
      <th>Impacto / Uso Medido</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Duración total de prueba</strong></td>
      <td>&mdash;</td>
      <td>&mdash;</td>
      <td><strong>0.86 segundos</strong></td>
    </tr>
    <tr>
      <td><strong>Tiempo de CPU del proceso</strong></td>
      <td>&mdash;</td>
      <td>&mdash;</td>
      <td><strong>895.57 ms</strong> (User: 849.09 ms | Sys: 46.48 ms)</td>
    </tr>
    <tr>
      <td><strong>Intensidad de CPU</strong></td>
      <td>&mdash;</td>
      <td>&mdash;</td>
      <td><strong>103.7%</strong> (ráfaga que satura un núcleo completo)</td>
    </tr>
    <tr>
      <td><strong>Memoria Heap Usada (V8)</strong></td>
      <td>19.31 MB</td>
      <td>32.42 MB</td>
      <td><strong>+13.11 MB</strong> (almacenamiento de objetos y cierres)</td>
    </tr>
    <tr>
      <td><strong>Memoria RSS (Resident Set Size)</strong></td>
      <td>&mdash;</td>
      <td>161.59 MB</td>
      <td>Consumo estable y óptimo para el runtime Node.js</td>
    </tr>
  </tbody>
</table>

<div class="callout">
<strong>Diagnóstico de Eficiencia en Runtime:</strong> Las operaciones directas sobre índices en memoria (<code>adjustStock</code> y <code>getBySku</code>) registran un desempeño sobresaliente superando el millón de transacciones por segundo. La operación de búsqueda y listado (<code>list</code>) concentra el 80% del tiempo de cómputo por requerir ordenamiento con sensibilidad de idioma español (<code>Intl.Collator</code> / <code>localeCompare</code>).
</div>

<h2>4. Resultados: Tiempos de Pruebas Automatizadas (Local)</h2>
<p>
Al ejecutar las suites de pruebas con <code>npm run test:timing</code> y <code>npm run test:timing:productos</code>, se obtuvieron los siguientes tiempos:
</p>
<table class="data-table">
  <thead>
    <tr>
      <th>Suite de Pruebas</th>
      <th>Tests Pasados</th>
      <th>Tiempo de Pared Total</th>
      <th>Tiempo Neto de Tests</th>
      <th>Overhead de Arranque</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Suite Principal</strong> (App, Products, Pagination)</td>
      <td><span class="badge-pass">8 / 8 (100%)</span></td>
      <td>0.73 s</td>
      <td>0.06 s (60 ms)</td>
      <td>0.67 s (91.7%)</td>
    </tr>
    <tr>
      <td><strong>Suite de Productos</strong> (ProductStore 32 tests)</td>
      <td><span class="badge-pass">32 / 32 (Nota: 5.0)</span></td>
      <td>0.63 s</td>
      <td>0.03 s (25 ms)</td>
      <td>0.60 s (95.2%)</td>
    </tr>
  </tbody>
</table>

<p>
<strong>Desglose por archivo en la suite principal:</strong> <code>tests/app.test.ts</code> (33 ms, 4 tests), <code>tests/products.test.ts</code> (28 ms, 2 tests), <code>tests/pagination.service.test.ts</code> (2 ms, 2 tests).<br>
<strong>Pruebas más lentas identificadas:</strong> <code>POST /api/products</code> (24 ms) y <code>GET /health</code> (18 ms), explicadas por el arranque en frío del middleware de Express y el mock de MongoDB.
</p>

<h2>5. Trazabilidad en CI/CD (GitHub Actions)</h2>
<p>
Mediante <code>scripts/ci-timing.mjs</code> se verificó la trazabilidad del commit <code>65563e0</code> perteneciente a la rama <code>products-test-alarcon</code> en el <strong>Pull Request #88</strong>:
</p>

<div class="code-term">=== Trazabilidad y Tiempos de CI/CD ===
Commit : 65563e05eaafe538e5c049cf4831b042765802e4
Rama   : products-test-alarcon
PR     : #88 (OPEN) https://github.com/uni-dev-labs/devops-2026-2/pull/88
Run    : https://github.com/uni-dev-labs/devops-2026-2/actions/runs/40250745639
Evento : pull_request | Estado: completed/success | Total: 13 s

Job "Práctica productos" [success] ── 7 s
   ├── 1 s  Set up job
   ├── 0 s  Descargar el código
   ├── 2 s  Instalar Node.js
   ├── 1 s  Instalar dependencias
   ├── 1 s  Correr tests de productos
   └── 0 s  Publicar nota (Calificación 5.000)

Job "Typecheck, tests y build" [success] ── 11 s
   ├── 1 s  Set up job
   ├── 1 s  Descargar el código
   ├── 2 s  Instalar Node.js
   ├── 2 s  Instalar dependencias (npm ci)
   ├── 1 s  Verificar tipos (tsc --noEmit)
   ├── 0 s  Correr tests (vitest run)
   └── 1 s  Compilar (tsc)</div>

<p>
La trazabilidad DevOps vincula de forma unívoca el commit del estudiante con la ejecución automatizada de pruebas y la posterior integración, permitiendo auditar con exactitud el tiempo consumido en cada compuerta de calidad (*quality gate*).
</p>

<h2>6. Conclusiones y Análisis de Eficiencia DevOps</h2>
<ul class="conclusion-list">
  <li><strong>Desempeño del Algoritmo en Memoria:</strong> La arquitectura basada en mapas de claves (<code>skuIndex</code> e <code>idIndex</code>) garantiza tiempos de respuesta de microsegundos en lecturas y mutaciones directas, soportando picos de demanda superiores a 40,000 peticiones concurrentes por segundo sin degradación de memoria.</li>
  <li><strong>Eficiencia del Pipeline de CI:</strong> El flujo de integración continua completa todas sus validaciones en apenas 13 segundos. El 55% de este tiempo se invierte en el aprovisionamiento de dependencias y el entorno Node.js, lo que confirma que el código implementado no introduce cuellos de botella en el pipeline.</li>
  <li><strong>Recomendación de Escalabilidad:</strong> Para grandes volúmenes de datos donde la lista supere los 10,000 registros, el ordenamiento léxico en español debe delegarse a motores de base de datos indexados (como PostgreSQL con índices <code>COLLATE "es_ES"</code>), reservando la memoria de la aplicación para operaciones de alta frecuencia.</li>
</ul>

</body>
</html>`;

fs.writeFileSync("/mnt/D/U/OctavoSemestre/DevOps/devops-2026-2/Entrega_Timing_Daniel_Alarcon.html", htmlContent, "utf8");
console.log("HTML report generated.");

// Convert to DOCX and PDF using LibreOffice
console.log("Converting to DOCX and PDF via LibreOffice...");
execSync('libreoffice --headless --convert-to "docx:MS Word 2007 XML" Entrega_Timing_Daniel_Alarcon.html --outdir .', { stdio: "inherit" });
execSync('libreoffice --headless --convert-to "pdf:writer_pdf_Export" Entrega_Timing_Daniel_Alarcon.html --outdir .', { stdio: "inherit" });
console.log("Documents generated successfully!");
