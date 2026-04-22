import './style.css'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qkovcumfzicpepcyjkzq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrb3ZjdW1memljcGVwY3lqa3pxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NDE5MDAsImV4cCI6MjA5MjQxNzkwMH0.z7BzjaL5IXwLye04gqEtvC_DIm6MaYR1oL2OKADuRz4' // <-- ¡Tu llave aquí!

const supabase = createClient(supabaseUrl, supabaseKey)

// ==========================================
// 1. ESTRUCTURA HTML DE LA PÁGINA
// ==========================================
// ==========================================
// 1. ESTRUCTURA HTML DE LA PÁGINA
// ==========================================
document.querySelector('#app').innerHTML = `
  <div class="contenedor">
    <h1 style="text-align: center; margin-bottom: 30px;">🍽️ Fast Restaurant POS</h1>
    
    <section id="seccion-login" class="tarjeta" style="max-width: 400px; margin: 0 auto;">
      <h2 style="text-align: center; margin-top: 0;">Iniciar Sesión</h2>
      <form id="form-login" class="form-columna">
        <input type="email" name="email" placeholder="Correo" required>
        <input type="password" name="password" placeholder="Contraseña" required>
        <button type="submit" class="btn-exito" style="margin-top: 10px;">Entrar al Sistema</button>
      </form>
    </section>

    <div id="seccion-sistema" style="display: none;">
      
      <nav class="nav-bar">
        <button id="nav-pedidos" class="btn-primario" style="flex: 1;">Toma de Pedidos</button>
        <button id="nav-menu" class="btn-inactivo" style="flex: 1;">Gestión de Menú</button>
        <button id="btn-logout" class="btn-peligro">Cerrar Sesión</button>
      </nav>

      <div id="vista-pedidos">
        
        <section class="tarjeta">
          <h2 style="margin-top: 0; color: var(--texto-secundario);">1. Abrir Nueva Cuenta</h2>
          <form id="form-pedido" class="formulario" style="align-items: flex-end;">
            <div class="grupo-input">
              <label>Mesa</label>
              <select name="id_mesa"><option value="1">Mesa 1</option><option value="2">Mesa 2</option></select>
            </div>
            <div class="grupo-input">
              <label>Mesero</label>
              <select name="id_mesero"><option value="1">Roberto Carlos</option></select>
            </div>
            <button type="submit" class="btn-exito">Abrir Mesa</button>
          </form>
        </section>

        <section class="tarjeta">
          <h2 style="margin-top: 0; color: var(--texto-secundario);">2. Agregar Platillos a la Cuenta</h2>
          <form id="form-detalle" class="formulario" style="align-items: flex-end;">
            <div class="grupo-input" style="flex: 1;">
              <label>Mesa Activa (Folio)</label>
              <select id="select-folios" name="folio_pedido" required></select>
            </div>
            <div class="grupo-input" style="flex: 2;">
              <label>Platillo</label>
              <select id="select-platillos" name="id_platillo" required></select>
            </div>
            <div class="grupo-input" style="flex: 0.5;">
              <label>Cant.</label>
              <input type="number" name="cantidad" value="1" min="1" required>
            </div>
            <button type="submit" class="btn-alerta">+ Agregar</button>
          </form>
        </section>

      </div>

      <div id="vista-menu" style="display: none;">
        <section class="tarjeta">
          <h2 style="margin-top: 0;">Registrar Nuevo Platillo</h2>
          <form id="form-platillo" class="form-columna">
            <input type="text" name="nombre" placeholder="Nombre del platillo" required>
            <textarea name="descripcion" placeholder="Descripción de los ingredientes" required rows="2"></textarea>
            <div style="display: flex; gap: 12px;">
              <input type="number" step="0.01" name="precio" placeholder="Precio ($)" required style="flex: 1;">
              <select name="categoria" style="flex: 1;">
                <option value="Entradas">Entradas</option>
                <option value="Plato Fuerte">Plato Fuerte</option>
                <option value="Postres">Postres</option>
                <option value="Bebidas">Bebidas</option>
              </select>
            </div>
            <button type="submit" class="btn-primario" style="margin-top: 10px;">Guardar Platillo</button>
          </form>
        </section>
        
        <section class="tarjeta">
          <h2 style="margin-top: 0;">Menú Actual</h2>
          <div id="lista-menu" class="grid-menu"></div>
        </section>
      </div>

    </div>
  </div>
`;

// ==========================================
// 2. NAVEGACIÓN Y CARGA DE DATOS DINÁMICOS
// ==========================================
document.getElementById('nav-pedidos').addEventListener('click', () => {
  document.getElementById('vista-pedidos').style.display = 'block';
  document.getElementById('vista-menu').style.display = 'none';
  document.getElementById('nav-pedidos').style.background = '#646cff';
  document.getElementById('nav-menu').style.background = '#444';
  cargarDropdownsPedidos(); // Recarga las mesas activas
});

document.getElementById('nav-menu').addEventListener('click', () => {
  document.getElementById('vista-pedidos').style.display = 'none';
  document.getElementById('vista-menu').style.display = 'block';
  document.getElementById('nav-menu').style.background = '#646cff';
  document.getElementById('nav-pedidos').style.background = '#444';
});

// Esta función lee la BD para llenar las listas desplegables
async function cargarDropdownsPedidos() {
  // 1. Traer solo las mesas que están abiertas
  const { data: pedidos } = await supabase.from('PEDIDO').select('folio_pedido, id_mesa').eq('estado', 'Abierto');
  const selectFolios = document.getElementById('select-folios');
  if (pedidos) {
    selectFolios.innerHTML = pedidos.map(p => `<option value="${p.folio_pedido}">Folio: ${p.folio_pedido} (Mesa ${p.id_mesa})</option>`).join('');
  }

  // 2. Traer todos los platillos para el menú (guardando su precio en el HTML para usarlo después)
  const { data: platillos } = await supabase.from('PLATILLO').select('*');
  const selectPlatillos = document.getElementById('select-platillos');
  if (platillos) {
    selectPlatillos.innerHTML = platillos.map(p => `<option value="${p.id_platillo}" data-precio="${p.precio}">${p.nombre} - $${p.precio}</option>`).join('');
  }
}


// ==========================================
// 3. LÓGICA DE PEDIDOS Y DETALLES
// ==========================================
async function abrirPedido(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  
  const { error } = await supabase.from('PEDIDO').insert([{
    id_mesa: parseInt(formData.get('id_mesa')),
    id_empleado_mesero: parseInt(formData.get('id_mesero')),
    estado: 'Abierto',
    hora_apertura: new Date().toISOString()
  }]);

  if (error) alert("Error: " + error.message);
  else {
    alert("¡Mesa abierta con éxito!");
    cargarDropdownsPedidos(); // Actualizamos la lista para que aparezca la nueva mesa
  }
}

async function agregarPlatilloMesa(e) {
  e.preventDefault();
  const form = e.target;
  const selectPlatillo = form.id_platillo;
  
  const folio = parseInt(form.folio_pedido.value);
  const idPlatillo = parseInt(selectPlatillo.value);
  const cantidad = parseInt(form.cantidad.value);
  // Leemos el precio directamente de la opción seleccionada
  const precio = parseFloat(selectPlatillo.options[selectPlatillo.selectedIndex].dataset.precio);

  // Lógica inteligente: Buscar cuántas líneas tiene ya el pedido para sumarle 1
  const { data: lineas } = await supabase.from('DETALLE_PEDIDO').select('num_linea').eq('folio_pedido', folio).order('num_linea', { ascending: false }).limit(1);
  let numLineaToca = 1;
  if (lineas && lineas.length > 0) numLineaToca = lineas[0].num_linea + 1;

  // Insertar en la BD
  const { error } = await supabase.from('DETALLE_PEDIDO').insert([{
    folio_pedido: folio,
    num_linea: numLineaToca,
    id_platillo: idPlatillo,
    cantidad_servida: cantidad,
    precio_unitario: precio
  }]);

  if (error) alert("Error al agregar detalle: " + error.message);
  else {
    alert("¡Platillo enviado a cocina! 👨‍🍳");
    form.cantidad.value = 1; // Reseteamos la cantidad a 1 por comodidad
  }
}

document.querySelector('#form-pedido').addEventListener('submit', abrirPedido);
document.querySelector('#form-detalle').addEventListener('submit', agregarPlatilloMesa);


// ==========================================
// 4. LÓGICA DEL MENÚ Y AUTH (Igual que antes)
// ==========================================
async function iniciarSesion(e) {
  e.preventDefault();
  const { error } = await supabase.auth.signInWithPassword({ email: e.target.email.value, password: e.target.password.value });
  if (error) alert("Error: " + error.message); else mostrarSistema();
}

async function cerrarSesion() {
  await supabase.auth.signOut();
  document.getElementById('seccion-login').style.display = 'block';
  document.getElementById('seccion-sistema').style.display = 'none';
}

function mostrarSistema() {
  document.getElementById('seccion-login').style.display = 'none';
  document.getElementById('seccion-sistema').style.display = 'block';
  cargarDropdownsPedidos();
  cargarMenu();
}

async function registrarPlatillo(e) {
  e.preventDefault();
  const f = new FormData(e.target);
  const { error } = await supabase.from('PLATILLO').insert([{ id_restaurante: 1, nombre: f.get('nombre'), descripcion: f.get('descripcion'), precio: parseFloat(f.get('precio')), categoria: f.get('categoria') }]);
  if (!error) { alert("Platillo guardado"); e.target.reset(); cargarMenu(); cargarDropdownsPedidos(); }
}

async function cargarMenu() {
  const { data } = await supabase.from('PLATILLO').select('*');
  const lista = document.querySelector('#lista-menu');
  if (data) lista.innerHTML = data.map(p => `<div style="border: 1px solid #444; padding: 10px; margin-bottom: 10px; border-radius: 5px;"><strong style="color: #646cff;">${p.nombre}</strong> - $${p.precio}</div>`).join('');
}

document.querySelector('#form-login').addEventListener('submit', iniciarSesion);
document.querySelector('#form-platillo').addEventListener('submit', registrarPlatillo);
document.querySelector('#btn-logout').addEventListener('click', cerrarSesion);

supabase.auth.getSession().then(({ data: { session } }) => { if (session) mostrarSistema(); });