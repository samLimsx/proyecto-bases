import './style.css'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qkovcumfzicpepcyjkzq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrb3ZjdW1memljcGVwY3lqa3pxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NDE5MDAsImV4cCI6MjA5MjQxNzkwMH0.z7BzjaL5IXwLye04gqEtvC_DIm6MaYR1oL2OKADuRz4' // <-- ¡Tu llave aquí!
const supabase = createClient(supabaseUrl, supabaseKey)

document.querySelector('#app').innerHTML = `
  <style>
    /* Ajuste para que las mesas sean recuadros en lugar de círculos */
    .mesa-visual { aspect-ratio: auto !important; padding: 25px 15px !important; border-radius: 16px !important; }
    .mesa-numero { font-size: 1.5em !important; margin: 10px 0 5px 0 !important; }
  </style>

  <div class="contenedor">
    <div class="header-titulo">
      <svg class="icono-restaurante" viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M3 20h18" stroke-width="2"/><path d="M5.164 12.184C6.262 8.163 9.8 5 14 5c4.717 0 8.307 3.962 7.747 8.618a8.98 8.98 0 0 1-1.313 4.382H3.566a8.977 8.977 0 0 1-1.313-4.382 8.435 8.435 0 0 1 .15-.812Z"/><path d="M14 5V3a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v2M10 10.5h1"/></svg>
      <h1>Fast Restaurant POS</h1>
    </div>
    
    <section id="seccion-login" class="tarjeta" style="max-width: 400px; margin: 0 auto;">
      <h2 style="text-align: center; margin-top: 0; color: var(--neon-turquesa);">Acceso al Sistema</h2>
      <form id="form-login" class="form-columna">
        <input type="email" name="email" placeholder="Correo electrónico" required>
        <input type="password" name="password" placeholder="Contraseña" required>
        <button type="submit" class="btn-primario" style="margin-top: 10px;">Iniciar Sesión</button>
      </form>
    </section>

    <div id="seccion-sistema" style="display: none;">
      <nav class="nav-bar" style="flex-wrap: wrap;">
        <button id="nav-pedidos" class="btn-primario" style="flex: 1; min-width: 100px;">Salón 🪑</button>
        <button id="nav-cocina" class="btn-inactivo" style="flex: 1; min-width: 100px;">Cocina 👨‍🍳</button>
        <button id="nav-menu" class="btn-inactivo" style="flex: 1; min-width: 100px;">Menú 📋</button>
        <button id="nav-inventario" class="btn-inactivo" style="flex: 1; min-width: 100px;">Almacén 📦</button>
        <button id="nav-personal" class="btn-inactivo" style="flex: 1; min-width: 100px;">Personal 👥</button>
        <button id="nav-reportes" class="btn-inactivo" style="flex: 1; min-width: 100px;">Finanzas 📊</button>
        <button id="btn-logout" class="btn-peligro" style="min-width: 100px;">Salir</button>
      </nav>

      <div id="vista-pedidos">
        
        <div id="contenedor-mapa">
          <section class="tarjeta">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; margin-bottom: 20px;">
              <div>
                <h2 style="margin: 0; color: var(--neon-turquesa);">📍 Salón Principal</h2>
                <p style="font-size: 0.85em; color: var(--texto-sec); margin: 5px 0 0 0;">Selecciona un recuadro para abrir la mesa o cobrarla.</p>
              </div>
              <div style="display: flex; align-items: center; gap: 10px; background: rgba(15, 240, 252, 0.1); padding: 10px 15px; border-radius: 8px; border: 1px solid var(--neon-turquesa);">
                <span style="font-size: 1.5em;">🤵</span>
                <div>
                  <label style="display: block; color: var(--neon-turquesa); font-size: 0.7em;">MESERO EN TURNO:</label>
                  <select id="select-mesero-turno" style="background: transparent; border: none; color: white; font-weight: bold; padding: 0; cursor: pointer; outline: none;"></select>
                </div>
              </div>
            </div>
            <div id="mapa-mesas" style="position: relative; width: 100%; height: 500px; background: rgba(15, 240, 252, 0.05); border: 2px dashed var(--neon-turquesa); border-radius: 10px; margin-top: 20px;"></div>
          </section>
        </div>

        <div id="contenedor-operacion" style="display: none;">
          <div style="margin-bottom: 20px; display: flex; align-items: center; gap: 20px;">
            <button class="btn-inactivo" onclick="volverAlMapa()" style="font-size: 1.1em; padding: 10px 20px; border-color: var(--neon-turquesa); color: var(--neon-turquesa);">🔙 Volver al Mapa</button>
            <h2 id="titulo-mesa-activa" style="margin: 0; color: white; font-size: 2em; text-shadow: 0 0 10px rgba(15, 240, 252, 0.5);">Mesa X</h2>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
            <section class="tarjeta" id="zona-agregar-platillo" style="border-color: var(--neon-naranja);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h2 style="margin: 0; color: var(--neon-naranja);">Agregar Consumo</h2>
                <select id="select-folios" style="display: none;"></select> </div>
              <p style="font-size: 0.85em; color: var(--texto-sec); margin-top: 0;">Toca un platillo para enviarlo directamente a la cuenta.</p>
              <div id="grid-platillos-pos" style="display: flex; flex-direction: column; gap: 10px;"></div>
            </section>

            <section class="tarjeta" id="zona-ticket" style="border-color: var(--neon-cyan);">
              <h2 style="margin-top: 0; color: var(--neon-cyan);">Caja y Ticket</h2>
              <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                <select id="select-ticket-folio" style="display: none;"></select>
                <button id="btn-ver-ticket" class="btn-primario" style="width: 100%;">Refrescar Ticket</button>
                <button id="btn-imprimir" class="btn-primario" style="display: none;">📄 Imprimir</button>
              </div>
              <div id="ticket-contenido" style="background: white; color: black; padding: 20px; border-radius: 8px; display: none; margin-bottom: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"></div>
              <div id="zona-cobro" style="display: none; background: rgba(1, 6, 18, 0.5); padding: 15px; border-radius: 8px; border: 1px solid var(--neon-cyan);">
                <label style="display: block; font-size: 0.85em; color: var(--neon-cyan); margin-bottom: 8px;">Liquidación de Cuenta</label>
                <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
                  <select id="select-pago" style="flex: 1;"><option value="Efectivo">💵 Efectivo</option><option value="Tarjeta">💳 Tarjeta</option></select>
                  <button id="btn-cobrar" class="btn-exito" style="flex: 1; min-width: 150px; font-size: 1.1em;">💰 Cobrar y Cerrar</button>
                </div>
              </div>
            </section>
          </div>
        </div>

      </div>

      <div id="vista-cocina" style="display: none;"><section class="tarjeta"><h2 style="color: var(--neon-naranja);">Comandas Entrantes</h2><div id="lista-cocina" class="grid-menu"></div></section></div>
      
      <div id="vista-menu" style="display: none;">
        <section class="tarjeta" style="border-color: var(--neon-cyan);">
          <h2 style="margin-top: 0; color: var(--neon-cyan);">🏷️ Gestionar Secciones del Menú</h2>
          <form id="form-categoria" class="formulario" style="align-items: flex-end;">
            <div class="grupo-input" style="flex: 2;"><input type="text" name="nombre_cat" placeholder="Nueva sección..." required></div>
            <button type="submit" class="btn-exito">➕ Agregar</button>
          </form>
          <div id="lista-categorias" style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 15px;"></div>
        </section>
        <section class="tarjeta">
          <h2 style="margin-top: 0; color: var(--neon-turquesa);">✨ Agregar Nuevo Platillo</h2>
          <form id="form-platillo" class="form-columna">
            <div style="display: flex; gap: 12px; flex-wrap: wrap;"><div class="grupo-input" style="flex: 2;"><input type="text" name="nombre" placeholder="Nombre (Ej. Tacos al Pastor)" required></div><div class="grupo-input" style="flex: 1;"><select name="categoria" id="select-categoria-form" required></select></div></div>
            <textarea name="descripcion" placeholder="Descripción breve..." required rows="2"></textarea><div class="grupo-input" style="width: 50%;"><input type="number" step="0.01" name="precio" placeholder="Precio ($)" required></div>
            <button type="submit" class="btn-primario" style="margin-top: 5px;">Guardar Platillo</button>
          </form>
        </section>
        <section class="tarjeta" style="border-color: var(--neon-naranja);"><h2 style="margin-top: 0; color: var(--neon-naranja);">Ficha Técnica (Vincular Ingredientes)</h2><form id="form-receta" class="formulario" style="align-items: flex-end;"><div class="grupo-input" style="flex: 2;"><label>Platillo</label><select id="select-receta-platillo" name="id_platillo" required></select></div><div class="grupo-input" style="flex: 2;"><label>Insumo</label><select id="select-receta-ingrediente" name="id_componente" required></select></div><div class="grupo-input" style="flex: 1;"><label>Cant.</label><input type="number" step="0.01" name="cantidad" required></div><button type="submit" class="btn-alerta">Vincular</button></form></section>
        <section class="tarjeta"><h2 style="margin-top: 0;">Menú Actual (Agrupado)</h2><div id="lista-menu" style="display: flex; flex-direction: column; gap: 15px;"></div></section>
      </div>

      <div id="vista-inventario" style="display: none;">
        <section class="tarjeta">
          <h2 style="margin-top: 0; color: var(--neon-turquesa);">Ingresar Insumo</h2>
          <form id="form-inventario" class="form-columna"><input type="text" name="nombre" placeholder="Nombre" required><div style="display: flex; gap: 12px; flex-wrap: wrap;"><div class="grupo-input" style="flex: 1;"><label>Costo ($)</label><input type="number" step="0.01" name="costo" required></div><div class="grupo-input" style="flex: 1;"><label>Stock</label><input type="number" step="0.01" name="stock" required></div><div class="grupo-input" style="flex: 1;"><label>Unidad</label><select name="unidad_medida"><option value="pz">pz</option><option value="g">g</option><option value="kg">kg</option><option value="ml">ml</option><option value="l">l</option></select></div></div><button type="submit" class="btn-exito" style="margin-top: 10px;">Guardar</button></form>
        </section>
        <section class="tarjeta"><h2>Almacén Actual</h2><div id="lista-inventario" class="grid-menu"></div></section>
      </div>

      <div id="vista-personal" style="display: none;">
        <section class="tarjeta">
          <h2 style="margin-top: 0; color: var(--neon-turquesa);">Control de Cuentas y Empleados</h2>
          <form id="form-empleado" class="form-columna">
            <div style="display: flex; gap: 12px; flex-wrap: wrap;"><div class="grupo-input" style="flex: 2;"><label>Nombre Completo</label><input type="text" name="nombre" id="input-nombre" placeholder="Ej. Ana Pérez" required></div><div class="grupo-input" style="flex: 2;"><label>Correo Electrónico (Login)</label><input type="email" name="email" id="input-email" placeholder="mesero@restaurante.com" required></div></div>
            <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;"><div class="grupo-input" style="flex: 2;"><label>Contraseña</label><input type="text" name="password" id="input-password" placeholder="******" required></div><div style="flex: 1; display: flex; align-items: center; gap: 10px; margin-top: 20px; background: rgba(255, 56, 96, 0.1); padding: 10px; border-radius: 8px; border: 1px solid var(--neon-rojo);"><input type="checkbox" name="es_admin" id="input-admin" style="width: 20px; height: 20px; cursor: pointer;"><label for="input-admin" style="color: var(--neon-rojo); cursor: pointer; margin: 0;">Es Administrador</label></div></div>
            <button type="submit" id="btn-guardar-empleado" class="btn-exito" style="margin-top: 15px;">➕ Guardar Empleado</button>
          </form>
        </section>
        <section class="tarjeta"><h2>Plantilla de Empleados</h2><div id="lista-empleados" class="grid-menu"></div></section>
      </div>

      <div id="vista-reportes" style="display: none;">
        <section class="tarjeta">
          <h2 style="color: var(--neon-turquesa);">Corte de Caja</h2>
          <button id="btn-generar-reporte" class="btn-primario" style="margin-bottom: 20px; width: 100%;">Procesar Datos</button>
          <div id="contenido-reporte" style="display: none; background: rgba(1, 6, 18, 0.8); padding: 20px; border-radius: 8px; border: 1px solid var(--neon-turquesa);">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; text-align: center;"><div style="padding: 15px; border-radius: 8px; border: 1px solid var(--neon-cyan); box-shadow: 0 0 10px rgba(16, 185, 129, 0.2);"><h3 style="margin:0;color:var(--neon-cyan);">Ingreso Total</h3><p id="rep-total" style="font-size: 2em; margin: 10px 0 0 0; color: white; font-weight: bold;">$0.00</p></div><div style="padding: 15px; border-radius: 8px; border: 1px solid var(--neon-turquesa); box-shadow: 0 0 10px rgba(15, 240, 252, 0.2);"><h3 style="margin:0;color:var(--neon-turquesa);">Mesas Cobradas</h3><p id="rep-mesas" style="font-size: 2em; margin: 10px 0 0 0; color: white; font-weight: bold;">0</p></div></div>
          </div>
        </section>
      </div>
      
    </div>
  </div>
`;

let esAdmin = false;

function cambiarVista(vistaDestino, btnActivo) {
  const vistas = ['vista-pedidos', 'vista-cocina', 'vista-menu', 'vista-inventario', 'vista-personal', 'vista-reportes'];
  const botones = ['nav-pedidos', 'nav-cocina', 'nav-menu', 'nav-inventario', 'nav-personal', 'nav-reportes'];
  vistas.forEach(v => document.getElementById(v).style.display = (v === vistaDestino) ? 'block' : 'none');
  botones.forEach(b => document.getElementById(b).className = (b === btnActivo) ? 'btn-primario' : 'btn-inactivo');
  
  if(vistaDestino === 'vista-pedidos') {
    window.volverAlMapa();
  }
}

document.getElementById('nav-pedidos').addEventListener('click', () => cambiarVista('vista-pedidos', 'nav-pedidos'));
document.getElementById('nav-cocina').addEventListener('click', () => cambiarVista('vista-cocina', 'nav-cocina'));
document.getElementById('nav-menu').addEventListener('click', () => cambiarVista('vista-menu', 'nav-menu'));
document.getElementById('nav-inventario').addEventListener('click', () => cambiarVista('vista-inventario', 'nav-inventario'));
document.getElementById('nav-personal').addEventListener('click', () => cambiarVista('vista-personal', 'nav-personal'));
document.getElementById('nav-reportes').addEventListener('click', () => cambiarVista('vista-reportes', 'nav-reportes'));

async function cargarCategorias() {
  const { data } = await supabase.from('CATEGORIA').select('*').order('nombre');
  if (data) {
    document.getElementById('select-categoria-form').innerHTML = '<option value="" disabled selected>Selecciona la sección...</option>' + data.map(c => `<option value="${c.nombre}">${c.nombre}</option>`).join('');
    document.getElementById('lista-categorias').innerHTML = data.map(c => `<span style="display: flex; align-items: center; gap: 8px; background: rgba(16, 185, 129, 0.1); padding: 5px 12px; border: 1px solid var(--neon-cyan); border-radius: 20px; color: white; font-weight: bold; font-size: 0.85em;">${c.nombre}<button type="button" onclick="eliminarCategoria(${c.id_categoria})" style="background: transparent; color: var(--neon-rojo); border: none; padding: 0; margin-left: 5px; cursor: pointer; font-size: 1.2em;">✖</button></span>`).join('');
  }
}
document.getElementById('form-categoria').addEventListener('submit', async (e) => { e.preventDefault(); const nombreCat = e.target.nombre_cat.value; const { error } = await supabase.from('CATEGORIA').insert([{ nombre: nombreCat }]); if (error) alert("❌ Error: " + error.message); else { e.target.reset(); cargarCategorias(); } });
window.eliminarCategoria = async function(id) { if(confirm("¿Estás seguro de borrar esta sección?")) { await supabase.from('CATEGORIA').delete().eq('id_categoria', id); cargarCategorias(); } }

window.volverAlMapa = function() {
  document.getElementById('contenedor-operacion').style.display = 'none';
  document.getElementById('contenedor-mapa').style.display = 'block';
  cargarDropdownsPedidos();
};

async function cargarDropdownsPedidos() {
  const { data: pedidos } = await supabase.from('PEDIDO').select('folio_pedido, id_mesa').eq('estado', 'Abierto');
  dibujarMapaMesas(pedidos);
  
  const opciones = pedidos && pedidos.length > 0 ? pedidos.map(p => `<option value="${p.folio_pedido}">MESA ${p.id_mesa} (Folio #${p.folio_pedido})</option>`).join('') : '<option value="">Ninguna mesa activa</option>';
  document.getElementById('select-folios').innerHTML = opciones; document.getElementById('select-ticket-folio').innerHTML = opciones;
  
  const { data: platillos } = await supabase.from('PLATILLO').select('*');
  if (platillos) {
    document.getElementById('select-receta-platillo').innerHTML = platillos.map(p => `<option value="${p.id_platillo}">${p.nombre}</option>`).join(''); 
    const categoriasActuales = [...new Set(platillos.map(p => p.categoria))];
    let htmlMenu = '';
    categoriasActuales.forEach(cat => {
      htmlMenu += `<div style="background: rgba(0,0,0,0.2); padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);"><h3 style="margin: 0 0 10px 0; color: var(--neon-turquesa); border-bottom: 1px solid var(--borde); padding-bottom: 5px; font-size: 1.1em; text-transform: uppercase;">🏷️ ${cat || 'Otros'}</h3><div class="grid-pos">`;
      const platillosFiltrados = platillos.filter(p => p.categoria === cat);
      platillosFiltrados.forEach(p => {
        let icono = '🍽️'; if(p.categoria === 'Bebidas') icono = '🍹'; if(p.categoria === 'Postres') icono = '🍰'; if(p.categoria === 'Entradas') icono = '🥗'; if(p.categoria === 'Plato Fuerte') icono = '🌮';
        htmlMenu += `<button class="btn-pos" onclick="agregarPlatilloDirecto(${p.id_platillo}, ${p.precio})"><span class="icono">${icono}</span><span class="nombre">${p.nombre}</span><span class="precio">$${p.precio}</span></button>`;
      });
      htmlMenu += `</div></div>`;
    });
    document.getElementById('grid-platillos-pos').innerHTML = htmlMenu;
  }
}

function dibujarMapaMesas(pedidos) {
  const posiciones = [
   { id: 1, top: '20%', left: '15%' },
    { id: 2, top: '20%', left: '50%' }, 
    { id: 3, top: '20%', left: '85%' }, 
    
    { id: 4, top: '50%', left: '33%' }, 
    { id: 5, top: '50%', left: '67%' }, 
    
    { id: 6, top: '80%', left: '15%' }, 
    { id: 7, top: '80%', left: '50%' }, 
    { id: 8, top: '80%', left: '85%' }  
  ];
  let html = '';
posiciones.forEach(pos => {
    const mesaOcupada = pedidos ? pedidos.find(p => p.id_mesa === pos.id) : null;
    
    if (mesaOcupada) { 
      // MESA OCUPADA
      html += `
        <div class="mesa-visual mesa-ocupada" onclick="seleccionarMesaOcupada(${pos.id}, ${mesaOcupada.folio_pedido})" style="position: absolute; top: ${pos.top}; left: ${pos.left}; cursor: pointer; text-align: center; width: 90px; transform: translate(-50%, -50%);">
          <img src="/mesa.png" alt="Mesa" style="width: 100%; filter: drop-shadow(0px 0px 8px rgba(255, 56, 96, 0.9));">
          <div style="font-weight: bold; color: white; background: rgba(0,0,0,0.6); border-radius: 4px;">Mesa ${pos.id}</div>
        </div>`; 
    } else { 
      // MESA LIBRE
      html += `
        <div class="mesa-visual mesa-libre" onclick="abrirMesaRapida(${pos.id})" style="position: absolute; top: ${pos.top}; left: ${pos.left}; cursor: pointer; text-align: center; width: 90px; transform: translate(-50%, -50%);">
          <img src="/mesa.png" alt="Mesa" style="width: 100%; opacity: 0.6; filter: drop-shadow(0px 0px 8px rgba(16, 185, 129, 0.9));">
          <div style="font-weight: bold; color: white; background: rgba(0,0,0,0.6); border-radius: 4px;">Mesa ${pos.id}</div>
        </div>`; 
    }
  });
  document.getElementById('mapa-mesas').innerHTML = html;
}

window.abrirMesaRapida = async function(numMesa) {
  const meseroActivo = document.getElementById('select-mesero-turno').value;
  if(!meseroActivo) { alert("⚠️ Selecciona a un mesero en turno en la parte superior."); return; }
  if (confirm(`¿Abrir cuenta en la Mesa ${numMesa}?`)) {
    const { error } = await supabase.from('PEDIDO').insert([{ id_mesa: numMesa, id_empleado_mesero: parseInt(meseroActivo), estado: 'Abierto', hora_apertura: new Date().toISOString() }]);
    if (error) alert("❌ Error: " + error.message); else cargarDropdownsPedidos();
  }
};

window.seleccionarMesaOcupada = function(numMesa, folio) {
  document.getElementById('contenedor-mapa').style.display = 'none';
  document.getElementById('contenedor-operacion').style.display = 'block';
  
  document.getElementById('titulo-mesa-activa').innerText = `Mesa ${numMesa} (Folio #${folio})`;
  
  document.getElementById('select-folios').value = folio; 
  document.getElementById('select-ticket-folio').value = folio;
  document.getElementById('btn-ver-ticket').click(); 
};

window.agregarPlatilloDirecto = async function(idPlatillo, precio) {
  const folio = document.getElementById('select-folios').value;
  if(!folio) return;
  const { data: lineas } = await supabase.from('DETALLE_PEDIDO').select('num_linea').eq('folio_pedido', folio).order('num_linea', { ascending: false }).limit(1);
  await supabase.from('DETALLE_PEDIDO').insert([{ folio_pedido: folio, num_linea: (lineas && lineas.length > 0) ? lineas[0].num_linea + 1 : 1, id_platillo: idPlatillo, cantidad_servida: 1, precio_unitario: precio }]);
  document.getElementById('select-ticket-folio').value = folio; 
  document.getElementById('btn-ver-ticket').click(); 
};

document.getElementById('btn-ver-ticket').addEventListener('click', async () => {
  const folio = document.getElementById('select-ticket-folio').value;
  if(!folio) return;
  
  const { data: pedidoData } = await supabase.from('PEDIDO').select('descuento').eq('folio_pedido', folio).single();
  const descuentoAplicado = pedidoData ? parseFloat(pedidoData.descuento || 0) : 0;

  const { data } = await supabase.from('DETALLE_PEDIDO').select('num_linea, id_platillo, cantidad_servida, precio_unitario, PLATILLO ( nombre )').eq('folio_pedido', folio);
  const cont = document.getElementById('ticket-contenido');
  
  if (!data || data.length === 0) { 
    cont.style.display = 'block'; cont.innerHTML = `<p style="text-align:center; color: black; font-weight:bold;">Mesa sin consumos cargados.</p>`; 
    document.getElementById('zona-cobro').style.display = 'none'; document.getElementById('btn-imprimir').style.display = 'none'; return; 
  }
  
  let subtotal = 0;
  let html = `<div style="text-align: center; border-bottom: 2px dashed #000; padding-bottom: 10px; margin-bottom: 10px;"><h3 style="margin: 0; color: #000; font-size: 1.2em;">RESTAURANTE ESCOM</h3><p style="margin: 5px 0 0 0; color: #000;">Folio #${folio}</p></div><table style="width: 100%; color: #000; font-family: monospace; font-size: 0.95em; border-collapse: collapse;">`;
  
  data.forEach(i => { 
    const rowTotal = i.cantidad_servida * i.precio_unitario; 
    subtotal += rowTotal; 
    const btnTransferir = `<button onclick="transferirPlatilloTicket(${folio}, ${i.num_linea}, ${i.id_platillo}, ${i.cantidad_servida}, ${i.precio_unitario})" style="background: var(--neon-turquesa); color: black; border: none; border-radius: 4px; padding: 2px 6px; cursor: pointer; font-size: 0.9em; margin-left: 8px; font-weight: bold;" title="Traspasar a otra mesa">↔️</button>`;
    const btnEliminar = esAdmin ? `<button onclick="eliminarPlatilloTicket(${folio}, ${i.num_linea})" style="background: red; color: white; border: none; border-radius: 4px; padding: 2px 6px; cursor: pointer; font-size: 0.9em; margin-left: 8px; font-weight: bold;" title="Eliminar de la cuenta">X</button>` : '';
    html += `<tr><td style="padding: 6px 0; text-align: left; border-bottom: 1px solid #eee;">${i.cantidad_servida}x ${i.PLATILLO.nombre} ${btnTransferir} ${btnEliminar}</td><td style="padding: 6px 0; text-align: right; border-bottom: 1px solid #eee;">$${rowTotal.toFixed(2)}</td></tr>`; 
  });

  const totalFinal = Math.max(0, subtotal - descuentoAplicado);

  html += `</table><div style="margin-top: 10px; padding-top: 10px;"><table style="width: 100%; color: #000; font-size: 1em;">`;
  html += `<tr><td style="text-align: left;">Subtotal:</td><td style="text-align: right;">$${subtotal.toFixed(2)}</td></tr>`;
  if (descuentoAplicado > 0) { html += `<tr><td style="text-align: left; color: red;">Descuento:</td><td style="text-align: right; color: red;">-$${descuentoAplicado.toFixed(2)}</td></tr>`; }
  html += `<tr><td style="text-align: left; font-weight: bold; font-size: 1.3em; border-top: 2px dashed #000; padding-top: 5px; margin-top: 5px;">TOTAL:</td><td style="text-align: right; font-weight: bold; font-size: 1.3em; border-top: 2px dashed #000; padding-top: 5px; margin-top: 5px;" id="ticket-total" data-valor="${totalFinal}">$${totalFinal.toFixed(2)}</td></tr></table></div>`;
  
  if (esAdmin) {
    html += `
      <div style="margin-top: 20px; border-top: 1px solid #ccc; padding-top: 15px; display: flex; gap: 8px; align-items: center; justify-content: space-between;">
        <input type="number" id="input-desc-${folio}" placeholder="Desc. $" style="width: 90px; padding: 8px; font-size: 1em; border: 1px solid #000; border-radius: 4px; color: #000; background: white;" min="0">
        <button onclick="aplicarDescuento(${folio})" style="background: var(--neon-naranja); color: black; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-weight: bold; width: 100%;">Aplicar Descuento</button>
      </div>`;
  }

  cont.innerHTML = html; cont.style.display = 'block'; document.getElementById('zona-cobro').style.display = 'block'; document.getElementById('btn-imprimir').style.display = 'block';
});

window.transferirPlatilloTicket = async function(folioOrigen, numLinea, idPlatillo, cantidad, precio) {
  const mesaDestinoStr = prompt("Ingresa el NÚMERO DE MESA (1-8) al que deseas traspasar este platillo:");
  if(!mesaDestinoStr) return;
  const mesaDestino = parseInt(mesaDestinoStr);
  if(isNaN(mesaDestino) || mesaDestino < 1 || mesaDestino > 8) { alert("❌ Número de mesa inválido."); return; }
  const { data: pedidoDestino, error: errDest } = await supabase.from('PEDIDO').select('folio_pedido').eq('id_mesa', mesaDestino).eq('estado', 'Abierto').single();
  if (errDest || !pedidoDestino) { alert(`❌ La Mesa ${mesaDestino} no está abierta. Ábrela primero desde el mapa.`); return; }
  const folioDestino = pedidoDestino.folio_pedido;
  if(folioDestino == folioOrigen) { alert("❌ El platillo ya está en esta mesa."); return; }
  const { data: lineas } = await supabase.from('DETALLE_PEDIDO').select('num_linea').eq('folio_pedido', folioDestino).order('num_linea', { ascending: false }).limit(1);
  const nuevaLinea = (lineas && lineas.length > 0) ? lineas[0].num_linea + 1 : 1;
  const { error: errInsert } = await supabase.from('DETALLE_PEDIDO').insert([{ folio_pedido: folioDestino, num_linea: nuevaLinea, id_platillo: idPlatillo, cantidad_servida: cantidad, precio_unitario: precio }]);
  if (errInsert) { alert("Error al transferir: " + errInsert.message); return; }
  await supabase.from('DETALLE_PEDIDO').delete().match({ folio_pedido: folioOrigen, num_linea: numLinea });
  alert(`✅ Platillo traspasado a la Mesa ${mesaDestino} exitosamente.`);
  document.getElementById('btn-ver-ticket').click(); 
};

window.eliminarPlatilloTicket = async function(folio, linea) {
  if(!confirm("⚠️ ¿Estás seguro de quitar este platillo de la cuenta? (El inventario no se verá afectado)")) return;
  const { error } = await supabase.from('DETALLE_PEDIDO').delete().match({ folio_pedido: folio, num_linea: linea });
  if (error) alert("Error: " + error.message); else document.getElementById('btn-ver-ticket').click();
};

window.aplicarDescuento = async function(folio) {
  const montoInput = document.getElementById(`input-desc-${folio}`).value;
  const descuentoNum = parseFloat(montoInput);
  if(isNaN(descuentoNum) || descuentoNum < 0) { alert("❌ Ingresa una cantidad válida."); return; }
  const { error } = await supabase.from('PEDIDO').update({ descuento: descuentoNum }).eq('folio_pedido', folio);
  if (error) alert("Error: " + error.message); else { alert("✅ Descuento registrado en el sistema."); document.getElementById('btn-ver-ticket').click(); }
};

document.getElementById('btn-imprimir').addEventListener('click', () => {
  const elementoTicket = document.getElementById('ticket-contenido');
  const folio = document.getElementById('select-ticket-folio').value;
  const estiloOriginal = elementoTicket.style.cssText;
  elementoTicket.style.cssText += 'width: 260px; margin: 0 auto; background: white; padding: 15px; border: none;';
  const opcionesPDF = { margin: 5, filename: `Ticket_Folio_${folio}.pdf`, image: { type: 'jpeg', quality: 1 }, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'mm', format: [80, 200], orientation: 'portrait' } };
  const btn = document.getElementById('btn-imprimir'); const textoOriginal = btn.innerText; btn.innerText = "⏳ Generando..."; btn.disabled = true;
  html2pdf().set(opcionesPDF).from(elementoTicket).save().then(() => { btn.innerText = textoOriginal; btn.disabled = false; elementoTicket.style.cssText = estiloOriginal; });
});

document.getElementById('btn-cobrar').addEventListener('click', async () => {
  const folio = document.getElementById('select-ticket-folio').value;
  const spanTotal = document.getElementById('ticket-total');
  if (!spanTotal || parseFloat(spanTotal.dataset.valor) < 0) { alert("❌ Error: Total inválido."); return; }
  if (!confirm(`¿Cerrar y cobrar Mesa (Folio #${folio})?`)) return;
  
  const { data: detalles } = await supabase.from('DETALLE_PEDIDO').select('id_platillo, cantidad_servida').eq('folio_pedido', folio);
  if (detalles) {
    for (const det of detalles) {
      const { data: receta } = await supabase.from('COMPONENTE_RECETA').select('id_componente, cantidad_requerida').eq('id_platillo', det.id_platillo);
      if (receta) {
        for (const ing of receta) {
          const aDescontar = ing.cantidad_requerida * det.cantidad_servida;
          const { data: comp } = await supabase.from('COMPONENTE').select('stock_actual').eq('id_componente', ing.id_componente).single();
          if (comp) await supabase.from('COMPONENTE').update({ stock_actual: comp.stock_actual - aDescontar }).eq('id_componente', ing.id_componente);
        }
      }
    }
  }
  await supabase.from('PEDIDO').update({ estado: 'Cerrado', hora_cobro: new Date().toISOString(), metodo_pago: document.getElementById('select-pago').value }).eq('folio_pedido', folio);
  alert("¡Cuenta pagada y almacén actualizado! ✅");
  
  document.getElementById('ticket-contenido').style.display = 'none'; 
  document.getElementById('zona-cobro').style.display = 'none'; 
  document.getElementById('btn-imprimir').style.display = 'none';
  
  window.volverAlMapa();
});

window.empleadoEditandoId = null;

async function cargarEmpleados() {
  const { data } = await supabase.from('EMPLEADO').select('*').order('id_empleado', { ascending: true });
  if (data) {
    document.getElementById('select-mesero-turno').innerHTML = data.map(e => `<option value="${e.id_empleado}">${e.nombre}</option>`).join('');
    document.getElementById('lista-empleados').innerHTML = data.map(e => `<div class="item-menu" style="border-left: 4px solid var(--neon-turquesa); display: flex; flex-direction: column; gap: 10px;"><div style="display: flex; justify-content: space-between; align-items: center;"><strong style="color: white; font-size: 1.1em;">🤵 ${e.nombre} <span style="font-size: 0.7em; color: var(--neon-naranja);">(${e.rol || 'Mesero'})</span></strong><div style="display: flex; gap: 5px;"><button onclick="prepararEdicion(${e.id_empleado}, '${e.nombre}', '${e.email || ''}', '${e.password || ''}', '${e.rol}')" class="btn-alerta" style="padding: 5px 10px; font-size: 0.8em;">✏️ Editar</button><button onclick="eliminarEmpleado(${e.id_empleado})" class="btn-peligro" style="padding: 5px 10px; font-size: 0.8em;">🗑️</button></div></div><div style="font-size: 0.85em; color: var(--texto-sec); background: rgba(0,0,0,0.3); padding: 5px; border-radius: 4px;">📧 ${e.email || 'Sin correo'} | 🔑 ${e.password || 'Sin clave'}</div></div>`).join('');
  }
}

window.prepararEdicion = function(id, nombre, email, password, rol) {
  window.empleadoEditandoId = id; document.getElementById('input-nombre').value = nombre; document.getElementById('input-email').value = email; document.getElementById('input-password').value = password; document.getElementById('input-admin').checked = (rol === 'Admin');
  const btn = document.getElementById('btn-guardar-empleado'); btn.innerText = "💾 Actualizar Empleado"; btn.classList.replace('btn-exito', 'btn-alerta'); btn.scrollIntoView({ behavior: 'smooth' });
}

document.getElementById('form-empleado').addEventListener('submit', async (e) => {
  e.preventDefault(); const f = new FormData(e.target);
  const dataForm = { nombre: f.get('nombre'), email: f.get('email'), password: f.get('password'), rol: f.get('es_admin') === 'on' ? 'Admin' : 'Mesero' };
  const btn = document.getElementById('btn-guardar-empleado'); btn.innerText = "⏳ Guardando..."; btn.disabled = true;
  if (window.empleadoEditandoId) { const { error } = await supabase.from('EMPLEADO').update(dataForm).eq('id_empleado', window.empleadoEditandoId); if(error) alert("Error: " + error.message); else alert("✅ Empleado actualizado"); window.empleadoEditandoId = null; btn.classList.replace('btn-alerta', 'btn-exito'); } 
  else { const { error } = await supabase.from('EMPLEADO').insert([dataForm]); if(error) alert("Error: " + error.message); else alert("✅ Empleado registrado"); }
  e.target.reset(); btn.innerText = "➕ Guardar Empleado"; btn.disabled = false; cargarEmpleados();
});

window.eliminarEmpleado = async function(id) { if(confirm("¿Estás seguro de eliminar a este empleado?")) { const { error } = await supabase.from('EMPLEADO').delete().eq('id_empleado', id); if(error) alert("Error: " + error.message); else cargarEmpleados(); } }

async function cargarInventario() {
  const { data } = await supabase.from('COMPONENTE').select('*').order('id_componente', { ascending: false });
  if (data) {
    document.getElementById('lista-inventario').innerHTML = data.map(ing => { const alertaStock = ing.stock_actual <= 50 ? `<span style="color: var(--neon-rojo); font-weight: bold; font-size: 0.85em; float: right;">⚠️ BAJO</span>` : ''; return `<div class="item-menu" style="border-left: 4px solid ${ing.stock_actual <= 50 ? 'var(--neon-rojo)' : 'var(--neon-cyan)'};"><strong style="color: white; font-size: 1.1em;">${ing.nombre}</strong> ${alertaStock}<p style="margin: 5px 0; color: var(--texto-sec); font-size: 0.9em;">Stock: <span style="color: ${ing.stock_actual <= 50 ? 'var(--neon-rojo)' : 'var(--neon-cyan)'}; font-weight: bold;">${ing.stock_actual} ${ing.unidad_medida}</span></p></div>`; }).join('');
    document.getElementById('select-receta-ingrediente').innerHTML = data.map(ing => `<option value="${ing.id_componente}">${ing.nombre} (${ing.unidad_medida})</option>`).join('');
  }
}
document.querySelector('#form-inventario').addEventListener('submit', async (e) => { e.preventDefault(); const f = new FormData(e.target); await supabase.from('COMPONENTE').insert([{ nombre: f.get('nombre'), costo: parseFloat(f.get('costo')), stock_actual: parseFloat(f.get('stock')), unidad_medida: f.get('unidad_medida') }]); alert("Agregado"); e.target.reset(); cargarInventario(); });

async function cargarMenu() { 
  const { data } = await supabase.from('PLATILLO').select('*'); 
  if (data) { 
    const categoriasActuales = [...new Set(data.map(p => p.categoria))]; let htmlLista = '';
    categoriasActuales.forEach(cat => {
      htmlLista += `<div style="background: rgba(0,0,0,0.1); border-radius: 8px; padding: 10px;"><h3 style="margin: 0 0 10px 0; color: var(--neon-naranja); border-bottom: 1px dashed var(--borde); padding-bottom: 5px;">${cat || 'Otros'}</h3><div class="grid-menu">`;
      const platillosCat = data.filter(p => p.categoria === cat);
      platillosCat.forEach(p => { let i='🍽️'; if(p.categoria==='Bebidas') i='🍹'; if(p.categoria==='Postres') i='🍰'; if(p.categoria==='Entradas') i='🥗'; if(p.categoria==='Plato Fuerte') i='🌮'; htmlLista += `<div class="item-menu" style="border-left: 4px solid var(--neon-turquesa);"><div><div style="display: flex; justify-content: space-between;"><strong style="color: white; font-size: 1.2em;">${i} ${p.nombre}</strong><span style="color: var(--neon-cyan); font-weight: 900;">$${p.precio}</span></div><p style="margin: 8px 0; color: var(--texto-sec); font-size: 0.85em; font-style: italic;">"${p.descripcion}"</p></div></div>`; });
      htmlLista += `</div></div>`;
    });
    document.getElementById('lista-menu').innerHTML = htmlLista; 
  } 
}
document.querySelector('#form-platillo').addEventListener('submit', async (e) => { e.preventDefault(); const f = new FormData(e.target); const p = parseFloat(f.get('precio')); if(p<=0){ alert("Error"); return; } await supabase.from('PLATILLO').insert([{ nombre: f.get('nombre'), descripcion: f.get('descripcion'), precio: p, categoria: f.get('categoria') }]); alert("Platillo Guardado"); e.target.reset(); cargarMenu(); cargarDropdownsPedidos(); });
document.querySelector('#form-receta').addEventListener('submit', async (e) => { e.preventDefault(); const f = new FormData(e.target); const p = parseInt(f.get('id_platillo')); const { data: pso } = await supabase.from('COMPONENTE_RECETA').select('num_paso').eq('id_platillo', p).order('num_paso', { ascending: false }).limit(1); await supabase.from('COMPONENTE_RECETA').insert([{ id_platillo: p, num_paso: (pso && pso.length>0)?pso[0].num_paso+1:1, id_componente: parseInt(f.get('id_componente')), cantidad_requerida: parseFloat(f.get('cantidad')) }]); alert("Vinculado"); e.target.reset();});

function activarWebSocketsCocina() { supabase.channel('canal-cocina').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'DETALLE_PEDIDO' }, async (payload) => { const nuevo = payload.new; const { data } = await supabase.from('PLATILLO').select('nombre').eq('id_platillo', nuevo.id_platillo).single(); document.getElementById('lista-cocina').innerHTML += `<div class="item-menu" style="border-left: 4px solid var(--neon-naranja); background: rgba(1,6,18,0.8);"><small style="color: var(--texto-sec);">Folio #${nuevo.folio_pedido}</small><br><strong style="font-size: 1.3em; color: white;">${nuevo.cantidad_servida}x ${data ? data.nombre : 'Platillo'}</strong><button class="btn-exito" style="width: 100%; margin-top: 15px; padding: 8px;" onclick="this.parentElement.remove()">Listo ✔️</button></div>`; }).subscribe(); }

document.getElementById('btn-generar-reporte').addEventListener('click', async () => { const { data: p } = await supabase.from('PEDIDO').select('folio_pedido').eq('estado', 'Cerrado'); if(!p || p.length===0){ alert("Sin datos"); return; } const f = p.map(x=>x.folio_pedido); const { data: d } = await supabase.from('DETALLE_PEDIDO').select('cantidad_servida, precio_unitario').in('folio_pedido', f); let t=0; d.forEach(x=>t+=x.cantidad_servida*x.precio_unitario); document.getElementById('rep-total').innerText = `$${t.toFixed(2)}`; document.getElementById('rep-mesas').innerText = p.length; document.getElementById('contenido-reporte').style.display='block'; });

document.querySelector('#form-login').addEventListener('submit', async (e) => {
  e.preventDefault(); const emailInput = e.target.email.value; const passInput = e.target.password.value;
  if (emailInput === 'admin@prueba.com' && passInput === 'admin') {
    const usuarioChocolate = { nombre: 'Admin Prueba', rol: 'Admin', email: 'admin' };
    localStorage.setItem('pos_user', JSON.stringify(usuarioChocolate));
    esAdmin = true;
    arrancarApp();
    return;
  }
  const { data, error } = await supabase.from('EMPLEADO').select('*').eq('email', emailInput).eq('password', passInput);
  if (error || !data || data.length === 0) { alert("❌ Credenciales incorrectas o usuario inexistente"); return; }
  const usuarioActivo = data[0]; localStorage.setItem('pos_user', JSON.stringify(usuarioActivo)); esAdmin = (usuarioActivo.rol === 'Admin'); arrancarApp();
});
document.getElementById('btn-logout').addEventListener('click', () => { localStorage.removeItem('pos_user'); document.getElementById('seccion-login').style.display = 'block'; document.getElementById('seccion-sistema').style.display = 'none'; });

function arrancarApp() {
  document.getElementById('seccion-login').style.display = 'none'; document.getElementById('seccion-sistema').style.display = 'block';
  if (esAdmin) { document.getElementById('nav-menu').style.display = 'block'; document.getElementById('nav-inventario').style.display = 'block'; document.getElementById('nav-personal').style.display = 'block'; document.getElementById('nav-reportes').style.display = 'block'; } 
  else { document.getElementById('nav-menu').style.display = 'none'; document.getElementById('nav-inventario').style.display = 'none'; document.getElementById('nav-personal').style.display = 'none'; document.getElementById('nav-reportes').style.display = 'none'; }
  cargarEmpleados(); cargarCategorias(); cargarDropdownsPedidos(); cargarMenu(); cargarInventario(); activarWebSocketsCocina();
}

const sesionGuardada = localStorage.getItem('pos_user');
if (sesionGuardada) { const usuarioActivo = JSON.parse(sesionGuardada); esAdmin = (usuarioActivo.rol === 'Admin'); arrancarApp(); }
