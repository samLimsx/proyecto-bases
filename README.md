# 🍽️ Sistema de Gestión de Restaurante

Aplicación web full-stack desarrollada para la gestión integral de un restaurante. El sistema permite la administración del menú, control de almacén, gestión de personal, finanzas y cuenta con un mapa  del salón en tiempo real.

## Tecnologías Utilizadas
* **Frontend:** HTML5, CSS3, JavaScript, Vite
* **Backend:** PostgreSQL alojado en Supabase
* **Hosting:** Vercel

---

## Funcionalidades y capturas de pantalla

El sistema está dividido en módulos interactivos que se comunican de forma asíncrona con la base de datos relacional para mantener la información actualizada:

* **🪑 Salón Principal:** Plano visual del establecimiento con posicionamiento de las mesas. Muestra el estado de las 8 mesas (Libre u Ocupada) mediante filtros visuales que reaccionan en tiempo real a los registros de la base de datos, permitiendo abrir cuentas o visualizar pedidos con un clic.
  <details>
  <summary>🖼️  Captura del Salón</summary>
  <br>
  <img loading="lazy" src="https://github.com/user-attachments/assets/d7517efb-67f0-4e54-8b56-e085099ef7bd" alt="Mapa de Mesas Interactivo" width="800"/>
  </details>

* **🔐 Acceso y Seguridad:** Sistema de inicio de sesión validado con la base de datos para restringir el acceso según el rol del empleado.
  <details>
  <summary>🖼️ Captura de Inicio de Sesión</summary>
  <br>
  <img loading="lazy" src="https://github.com/user-attachments/assets/79e6baed-395d-487e-adc1-9ee656bb7223" alt="Login" width="800"/> 
  </details>

* **📋 Menú y Órdenes:** Catálogo de los platillos y bebidas del restaurante que permite tomar la orden directamente desde la mesa seleccionada, sumando totales al instante.
  <details>
  <summary>🖼️ Captura del Menú</summary>
  <br>
  <img loading="lazy" src="https://github.com/user-attachments/assets/772de401-0171-49cc-a700-652aa9705093" alt="Módulo de Menú" width="800"/>
  </details>

* **📦 Almacén:** Módulo para el control de inventario de los insumos y materias primas necesarios para la operación diaria.
  <details>
  <summary>🖼️ Captura del Almacén</summary>
  <br>
  <img loading="lazy" src="https://github.com/user-attachments/assets/6ab4974e-8ba2-4dec-aaf5-164564c89ed2" alt="Control de Almacén" width="800"/>
  </details>

* **👥 Personal:** Interfaz para la gestión y registro de los empleados, meseros y administradores del sistema.
  <details>
  <summary>🖼️ Captura de Personal</summary>
  <br>
  <img loading="lazy" src="https://github.com/user-attachments/assets/607e3ae6-9055-4cc4-9ecf-0015687459aa" alt="Gestión de Personal" width="800"/>
  </details>

* **📊 Finanzas:** Visualización de los ingresos y control de las cuentas cobradas en el establecimiento.
  <details>
  <summary>🖼️ Captura de Finanzas</summary>
  <br>
  <img loading="lazy" src="https://github.com/user-attachments/assets/7aa87642-240f-4806-bf7a-f015f8461d57" alt="Módulo de Finanzas" width="800"/>
  </details>


### 🔗 Enlaces del Proyecto
* **Código Fuente:** [Repositorio en GitHub](https://github.com/samLimsx/proyecto-bases.git)
* **Demo en Vivo:** [Página Web en Vercel](https://proyecto-bases-snowy.vercel.app/)
* **Usuario de prueba:**`admin@prueba.com`
* **Contraseña**`admin`

---
