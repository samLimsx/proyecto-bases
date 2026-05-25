import './style.css'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qkovcumfzicpepcyjkzq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrb3ZjdW1memljcGVwY3lqa3pxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NDE5MDAsImV4cCI6MjA5MjQxNzkwMH0.z7BzjaL5IXwLye04gqEtvC_DIm6MaYR1oL2OKADuRz4' // <-- ¡Tu llave aquí!

const supabase = createClient(supabaseUrl, supabaseKey)

document.querySelector('#app').innerHTML = `
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
        <button id="nav-menu" class="btn-inactivo" style="flex: 1; min-width: 100px;">Recetas 📋</button>
        <button id="nav-inventario" class="btn-inactivo" style="flex: 1; min-width: 100px;">Almacén 📦</button>
        <button id="nav-personal" class="btn-inactivo" style="flex: 1; min-width: 100px;">Personal 👥</button>
        <button id="nav-reportes" class="btn-inactivo" style="flex: 1; min-width: 100px;">Finanzas 📊</button>
        <button id="btn-logout" class="btn-peligro" style="min-width: 100px;">Salir</button>
      </nav>

      <div id="vista-pedidos">
        <section class="tarjeta">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; margin-bottom: 15px;">
            <div>
              <h2 style="margin: 0; color: var(--neon-turquesa);">📍 Mapa Interactivo del Salón</h2>
              <p style="font-size: 0.85em; color: var(--texto-sec); margin: 5px 0 0 0;">Haz clic en una mesa para abrirla o gestionarla.</p>
            </div>
            <div style="display: flex; align-items: center; gap: 10px; background: rgba(15, 240, 252, 0.1); padding: 10px 15px; border-radius: 8px; border: 1px solid var(--neon-turquesa);">
              <span style="font-size: 1.5em;">🤵</span>
              <div>
                <label style="display: block; color: var(--neon-turquesa); font-size: 0.7em;">MESERO EN TURNO:</label>
                <select id="select-mesero-turno" style="background: transparent; border: none; color: white; font-weight: bold; padding: 0; cursor: pointer; outline: none;"></select>
              </div>
            </div>
          </div>
          <div id="mapa-mesas" class="grid-mesas"></div>
        </section>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
          <section class="tarjeta" id="zona-agregar-platillo">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <h2 style="margin: 0; color: var(--neon-naranja);">Agregar Consumo</h2>
              <select id="select-folios" style="background: rgba(255, 184, 108, 0.1); border: 1px solid var(--neon-naranja); color: var(--neon-naranja); padding: 5px 10px;"></select>
            </div>
            <p style="font-size: 0.85em; color: var(--texto-sec);">Toca un platillo para enviarlo directamente a la mesa activa.</p>
            <div id="grid-platillos-pos" class="grid-pos"></div>
          </section>

          <section class="tarjeta" id="zona-ticket">
            <h2 style="margin-top: 0; color: var(--neon-cyan);">Caja y Ticket</h2>
            <div style="display: flex; gap: 10px; margin-bottom: 15px;">
              <select id="select-ticket-folio" style="flex: 1; display: none;"></select>
              <button id="btn-ver-ticket" class="btn-primario" style="width: 100%;">Refrescar Ticket Actual</button>
              <button id="btn-imprimir" class="btn-primario" style="display: none;">📄 PDF</button>
            </div>
            <div id="ticket-contenido" style="background: white; color: black; padding: 20px; border-radius: 8px; display: none; margin-bottom: 15px;"></div>
            <div id="zona-cobro" style="display: none; background: rgba(1, 6, 18, 0.5); padding: 15px; border-radius: 8px; border: 1px solid var(--neon-cyan);">
              <label style="display: block; font-size: 0.85em; color: var(--neon-cyan); margin-bottom: 8px;">Liquidación de Cuenta</label>
              <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
                <select id="select-pago" style="flex: 1;"><option value="Efectivo">💵 Efectivo</option><option value="Tarjeta">💳 Tarjeta</option></select>
                <button id="btn-cobrar" class="btn-exito" style="flex: 1; min-width: 150px;">Cobrar y Cerrar</button>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div id="vista-cocina" style="display: none;"><section class="tarjeta"><h2 style="color: var(--neon-naranja);">Comandas Entrantes</h2><div id="lista-cocina" class="grid-menu"></div></section></div>
      
      <div id="vista-menu" style="display: none;">
        <section class="tarjeta">
          <h2 style="color: var(--neon-turquesa);">✨ Agregar Nuevo Platillo</h2>
          <form id="form-platillo" class="form-columna">
            <div style="display: flex; gap: 12px; flex-wrap: wrap;"><div class="grupo-input" style="flex: 2;"><input type="text" name="nombre" placeholder="Nombre (Ej. Tacos)" required></div><div class="grupo-input" style="flex: 1;"><select name="categoria" required><option value="" disabled selected>Categoría...</option><option value="Entradas">🥗 Entradas</option><option value="Plato Fuerte">🌮 Plato Fuerte</option><option value="Bebidas">🍹 Bebidas</option><option value="Postres">🍰 Postres</option></select></div></div>
            <textarea name="descripcion" placeholder="Descripción breve..." required rows="2"></textarea><div class="grupo-input" style="width: 50%;"><input type="number" step="0.01" name="precio" placeholder="Precio ($)" required></div>
            <button type="submit" class="btn-primario" style="margin-top: 5px;">Guardar Platillo</button>
          </form>
        </section>
        <section class="tarjeta" style="border-color: var(--neon-naranja);"><h2 style="margin-top: 0; color: var(--neon-naranja);">Ficha Técnica (Ingredientes)</h2><form id="form-receta" class="formulario" style="align-items: flex-end;"><div class="grupo-input" style="flex: 2;"><label>Platillo</label><select id="select-receta-platillo" name="id_platillo" required></select></div><div class="grupo-input" style="flex: 2;"><label>Insumo</label><select id="select-receta-ingrediente" name="id_componente" required></select></div><div class="grupo-input" style="flex: 1;"><label>Cant.</label><input type="number" step="0.01" name="cantidad" required></div><button type="submit" class="btn-alerta">Vincular</button></form></section>
        <section class="tarjeta"><h2>Menú Actual</h2><div id="lista-menu" class="grid-menu"></div></section>
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
          <h2 style="margin-top: 0; color: var(--neon-turquesa);">Alta de Cuentas y Personal</h2>
          <p style="font-size: 0.85em; color: var(--texto-sec); margin-top: -10px;">Registra a los empleados y asígnales credenciales de acceso al sistema.</p>
          <form id="form-empleado" class="form-columna">
            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
              <div class="grupo-input" style="flex: 2;">
                <label>Nombre Completo</label>
                <input type="text" name="nombre" placeholder="Ej. Ana Pérez" required>
              </div>
              <div class="grupo-input" style="flex: 2;">
                <label>Correo Electrónico (Para Login)</label>
                <input type="email" name="email" placeholder="mesero@escom.ipn.mx" required>
              </div>
            </div>
            
            <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
              <div class="grupo-input" style="flex: 2;">
                <label>Contraseña (Mínimo 6 caracteres)</label>
                <input type="password" name="password" placeholder="******" required minlength="6">
              </div>
              <div style="flex: 1; display: flex; align-items: center; gap: 10px; margin-top: 20px; background: rgba(255, 56, 96, 0.1); padding: 10px; border-radius: 8px; border: 1px solid var(--neon-rojo);">
                <input type="checkbox" name="es_admin" id="es_admin" style="width: 20px; height: 20px; cursor: pointer;">
                <label for="es_admin" style="color: var(--neon-rojo); cursor: pointer; margin: 0;">¿Hacer Administrador?</label>
              </div>
            </div>
            <button type="submit" class="btn-exito" style="margin-top: 15px;">Crear Cuenta en Base de Datos</button>
          </form>
        </section>
        <section class="tarjeta">
          <h2>Plantilla de Empleados</h2>
          <div id="lista-empleados" class="grid-menu"></div>
        </section>
      </div>

      <div id="vista-reportes" style="display: none;">
        <section class="tarjeta">
          <h2 style="color: var(--neon-turquesa);">Corte de Caja</h2>
          <button id="btn-generar-reporte" class="btn-primario" style="margin-bottom: 20px; width: 100%;">Procesar Datos</button>
          <div id="contenido-reporte" style="display: none; background: rgba(1, 6, 18, 0.8); padding: 20px; border-radius: 8px; border: 1px solid var(--neon-turquesa);">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; text-align: center;">
              <div style="padding: 15px; border-radius: 8px; border: 1px solid var(--neon-cyan); box-shadow: 0 0 10px rgba(16, 185, 129, 0.2);"><h3 style="margin:0;color:var(--neon-cyan);">Ingreso Total</h3><p id="rep-total" style="font-size: 2em; margin: 10px 0 0 0; color: white; font-weight: bold;">$0.00</p></div>
              <div style="padding: 15px; border-radius: 8px; border: 1px solid var(--neon-turquesa); box-shadow: 0 0 10px rgba(15, 240, 252, 0.2);"><h3 style="margin:0;color:var(--neon-turquesa);">Mesas Cobradas</h3><p id="rep-mesas" style="font-size: 2em; margin: 10px 0 0 0; color: white; font-weight: bold;">0</p></div>
            </div>
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
  if(vistaDestino === 'vista-pedidos') cargarDropdownsPedidos();
}

document.getElementById('nav-pedidos').addEventListener('click', () => cambiarVista('vista-pedidos', 'nav-pedidos'));
document.getElementById('nav-cocina').addEventListener('click', () => cambiarVista('vista-cocina', 'nav-cocina'));
document.getElementById('nav-menu').addEventListener('click', () => cambiarVista('vista-menu', 'nav-menu'));
document.getElementById('nav-inventario').addEventListener('click', () => cambiarVista('vista-inventario', 'nav-inventario'));
document.getElementById('nav-personal').addEventListener('click', () => cambiarVista('vista-personal', 'nav-personal'));
document.getElementById('nav-reportes').addEventListener('click', () => cambiarVista('vista-reportes', 'nav-reportes'));

async function cargarDropdownsPedidos() {
  const { data: pedidos } = await supabase.from('PEDIDO').select('folio_pedido, id_mesa').eq('estado', 'Abierto');
  dibujarMapaMesas(pedidos);
  
  const opciones = pedidos && pedidos.length > 0 ? pedidos.map(p => `<option value="${p.folio_pedido}">Mesa ${p.id_mesa} (Folio #${p.folio_pedido})</option>`).join('') : '<option value="">Ninguna mesa activa</option>';
  document.getElementById('select-folios').innerHTML = opciones; 
  document.getElementById('select-ticket-folio').innerHTML = opciones;
  
  const { data: platillos } = await supabase.from('PLATILLO').select('*');
  if (platillos) {
    document.getElementById('select-receta-platillo').innerHTML = platillos.map(p => `<option value="${p.id_platillo}">${p.nombre}</option>`).join(''); 
    let htmlMenu = '';
    platillos.forEach(p => {
      let icono = '🍽️'; 
      if(p.categoria === 'Bebidas') icono = '🍹'; 
      if(p.categoria === 'Postres') icono = '🍰'; 
      if(p.categoria === 'Entradas') icono = '🥗'; 
      if(p.categoria === 'Plato Fuerte') icono = '🌮';
      htmlMenu += `<button class="btn-pos" onclick="agregarPlatilloDirecto(${p.id_platillo}, ${p.precio})"><span class="icono">${icono}</span><span class="nombre">${p.nombre}</span><span class="precio">$${p.precio}</span></button>`;
    });
    document.getElementById('grid-platillos-pos').innerHTML = htmlMenu;
  }
}

function dibujarMapaMesas(pedidos) {
  const TOTAL_MESAS = 8; 
  let html = '';
  for (let i = 1; i <= TOTAL_MESAS; i++) {
    const mesaOcupada = pedidos ? pedidos.find(p => p.id_mesa === i) : null;
    if (mesaOcupada) { 
      html += `<div class="mesa-visual mesa-ocupada" onclick="seleccionarMesaOcupada(${mesaOcupada.folio_pedido})"><span class="mesa-numero">${i}</span><span class="mesa-estado">Ocupada<br>#${mesaOcupada.folio_pedido}</span></div>`; 
    } else { 
      html += `<div class="mesa-visual mesa-libre" onclick="abrirMesaRapida(${i})"><span class="mesa-numero">${i}</span><span class="mesa-estado">Libre</span></div>`; 
    }
  }
  document.getElementById('mapa-mesas').innerHTML = html;
}

window.abrirMesaRapida = async function(numMesa) {
  const meseroActivo = document.getElementById('select-mesero-turno').value;
  if(!meseroActivo) { alert("⚠️ Selecciona a un mesero en turno en la parte superior."); return; }
  if (confirm(`¿Abrir cuenta en la Mesa ${numMesa}?`)) {
    const { error } = await supabase.from('PEDIDO').insert([{ id_mesa: numMesa, id_empleado_mesero: parseInt(meseroActivo), estado: 'Abierto', hora_apertura: new Date().toISOString() }]);
    if (!error) { cargarDropdownsPedidos(); }
  }
};

window.seleccionarMesaOcupada = function(folio) {
  document.getElementById('select-folios').value = folio; 
  document.getElementById('select-ticket-folio').value = folio;
  document.getElementById('btn-ver-ticket').click(); 
  document.getElementById('zona-ticket').scrollIntoView({ behavior: 'smooth' });
};

window.agregarPlatilloDirecto = async function(idPlatillo, precio) {
  const folio = document.getElementById('select-folios').value;
  if(!folio) { alert("⚠️ Selecciona una mesa roja (ocupada) primero para agregarle platillos."); return; }
  const { data: lineas } = await supabase.from('DETALLE_PEDIDO').select('num_linea').eq('folio_pedido', folio).order('num_linea', { ascending: false }).limit(1);
  await supabase.from('DETALLE_PEDIDO').insert([{ folio_pedido: folio, num_linea: (lineas && lineas.length > 0) ? lineas[0].num_linea + 1 : 1, id_platillo: idPlatillo, cantidad_servida: 1, precio_unitario: precio }]);
  document.getElementById('select-ticket-folio').value = folio; 
  document.getElementById('btn-ver-ticket').click();
};

document.getElementById('btn-ver-ticket').addEventListener('click', async () => {
  const folio = document.getElementById('select-ticket-folio').value;
  if(!folio) return;
  const { data } = await supabase.from('DETALLE_PEDIDO').select('cantidad_servida, precio_unitario, PLATILLO ( nombre )').eq('folio_pedido', folio);
  const cont = document.getElementById('ticket-contenido');
  if (!data || data.length === 0) { 
    cont.style.display = 'block'; 
    cont.innerHTML = `<p style="text-align:center; color: black;">Mesa sin consumos cargados.</p>`; 
    document.getElementById('zona-cobro').style.display = 'none'; 
    document.getElementById('btn-imprimir').style.display = 'none'; 
    return; 
  }
  
  let total = 0;
  let html = `<div style="text-align: center; border-bottom: 2px dashed #000; padding-bottom: 10px; margin-bottom: 10px;"><h3 style="margin: 0; color: #000; font-size: 1.2em;">RESTAURANTE ESCOM</h3><p style="margin: 5px 0 0 0; color: #000;">Folio #${folio}</p></div><table style="width: 100%; color: #000; font-family: monospace; font-size: 0.95em; border-collapse: collapse;">`;
  data.forEach(i => { 
    const subtotal = i.cantidad_servida * i.precio_unitario; 
    total += subtotal; 
    html += `<tr><td style="padding: 4px 0; text-align: left;">${i.cantidad_servida}x ${i.PLATILLO.nombre}</td><td style="padding: 4px 0; text-align: right;">$${subtotal.toFixed(2)}</td></tr>`; 
  });
  html += `</table><div style="border-top: 2px dashed #000; margin-top: 10px; padding-top: 10px;"><table style="width: 100%; color: #000; font-weight: bold; font-size: 1.2em;"><tr><td style="text-align: left;">TOTAL:</td><td style="text-align: right;" id="ticket-total" data-valor="${total}">$${total.toFixed(2)}</td></tr></table></div>`;
  cont.innerHTML = html; 
  cont.style.display = 'block'; 
  document.getElementById('zona-cobro').style.display = 'block'; 
  document.getElementById('btn-imprimir').style.display = 'block';
});

document.getElementById('btn-imprimir').addEventListener('click', () => {
  const elementoTicket = document.getElementById('ticket-contenido');
  const folio = document.getElementById('select-ticket-folio').value;
  const estiloOriginal = elementoTicket.style.cssText;
  elementoTicket.style.cssText += 'width: 260px; margin: 0 auto; background: white; padding: 15px; border: none;';
  const opcionesPDF = { margin: 5, filename: `Ticket_Folio_${folio}.pdf`, image: { type: 'jpeg', quality: 1 }, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'mm', format: [80, 200], orientation: 'portrait' } };
  const btn = document.getElementById('btn-imprimir'); 
  const textoOriginal = btn.innerText; 
  btn.innerText = "⏳ Generando..."; 
  btn.disabled = true;
  html2pdf().set(opcionesPDF).from(elementoTicket).save().then(() => { 
    btn.innerText = textoOriginal; 
    btn.disabled = false; 
    elementoTicket.style.cssText = estiloOriginal; 
  });
});

document.getElementById('btn-cobrar').addEventListener('click', async () => {
  const folio = document.getElementById('select-ticket-folio').value;
  const spanTotal = document.getElementById('ticket-total');
  if (!spanTotal || parseFloat(spanTotal.dataset.valor) <= 0) { alert("❌ Error: Mesa vacía."); return; }
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
  cargarDropdownsPedidos(); 
  cargarInventario();
});

async function cargarEmpleados() {
  const { data } = await supabase.from('EMPLEADO').select('*').order('id_empleado', { ascending: true });
  if (data) {
    document.getElementById('select-mesero-turno').innerHTML = data.map(e => `<option value="${e.id_empleado}">${e.nombre}</option>`).join('');
    document.getElementById('lista-empleados').innerHTML = data.map(e => `<div class="item-menu" style="border-left: 4px solid var(--neon-turquesa); display: flex; justify-content: space-between; align-items: center;"><strong style="color: white; font-size: 1.1em;">🤵 ${e.nombre}</strong><button onclick="eliminarEmpleado(${e.id_empleado})" class="btn-peligro" style="padding: 5px 10px; font-size: 0.8em;">🗑️ Borrar</button></div>`).join('');
  }
}

document.getElementById('form-empleado').addEventListener('submit', async (e) => {
  e.preventDefault(); 
  const f = new FormData(e.target);
  const nombre = f.get('nombre');
  const email = f.get('email');
  const password = f.get('password');
  const esAdmin = f.get('es_admin') === 'on';

  const btn = e.target.querySelector('button');
  btn.innerText = "⏳ Creando cuenta..."; 
  btn.disabled = true;

  const { data: authData, error: authError } = await supabase.auth.signUp({ email: email, password: password });
  
  if (authError) {
    alert("❌ Error de Seguridad: " + authError.message);
    btn.innerText = "Crear Cuenta en Base de Datos"; 
    btn.disabled = false; 
    return;
  }

  const { data: empData, error: empError } = await supabase.from('EMPLEADO').insert([{ nombre: nombre }]).select();
  
  if (esAdmin && empData && empData.length > 0) {
    await supabase.from('ADMINISTRADOR').insert([{ id_empleado: empData[0].id_empleado, usuario: email }]);
  }

  alert("✅ ¡Cuenta creada exitosamente! Tu sesión de Administrador se cerrará ahora.");
  
  e.target.reset(); 
  btn.innerText = "Crear Cuenta en Base de Datos"; 
  btn.disabled = false;
  cargarEmpleados();
  document.getElementById('btn-logout').click();
});

window.eliminarEmpleado = async function(id) {
  if(confirm("¿Estás seguro de eliminar a este empleado?")) {
    const { error } = await supabase.from('EMPLEADO').delete().eq('id_empleado', id);
    if(error) alert("Error: " + error.message); 
    else cargarEmpleados();
  }
}

async function cargarInventario() {
  const { data } = await supabase.from('COMPONENTE').select('*').order('id_componente', { ascending: false });
  if (data) {
    document.getElementById('lista-inventario').innerHTML = data.map(ing => {
      const alertaStock = ing.stock_actual <= 50 ? `<span style="color: var(--neon-rojo); font-weight: bold; font-size: 0.85em; float: right;">⚠️ BAJO</span>` : '';
      return `<div class="item-menu" style="border-left: 4px solid ${ing.stock_actual <= 50 ? 'var(--neon-rojo)' : 'var(--neon-cyan)'};"><strong style="color: white; font-size: 1.1em;">${ing.nombre}</strong> ${alertaStock}<p style="margin: 5px 0; color: var(--texto-sec); font-size: 0.9em;">Stock: <span style="color: ${ing.stock_actual <= 50 ? 'var(--neon-rojo)' : 'var(--neon-cyan)'}; font-weight: bold;">${ing.stock_actual} ${ing.unidad_medida}</span></p></div>`;
    }).join('');
    document.getElementById('select-receta-ingrediente').innerHTML = data.map(ing => `<option value="${ing.id_componente}">${ing.nombre} (${ing.unidad_medida})</option>`).join('');
  }
}

document.querySelector('#form-inventario').addEventListener('submit', async (e) => { 
  e.preventDefault(); 
  const f = new FormData(e.target); 
  await supabase.from('COMPONENTE').insert([{ nombre: f.get('nombre'), costo: parseFloat(f.get('costo')), stock_actual: parseFloat(f.get('stock')), unidad_medida: f.get('unidad_medida') }]); 
  alert("Agregado"); 
  e.target.reset(); 
  cargarInventario(); 
});

async function cargarMenu() { 
  const { data } = await supabase.from('PLATILLO').select('*'); 
  if (data) { 
    document.getElementById('lista-menu').innerHTML = data.map(p => { 
      let i='🍽️'; 
      if(p.categoria==='Bebidas') i='🍹'; 
      if(p.categoria==='Postres') i='🍰'; 
      if(p.categoria==='Entradas') i='🥗'; 
      if(p.categoria==='Plato Fuerte') i='🌮'; 
      return `<div class="item-menu" style="border-left: 4px solid var(--neon-turquesa);"><div><div style="display: flex; justify-content: space-between;"><strong style="color: white; font-size: 1.2em;">${i} ${p.nombre}</strong><span style="color: var(--neon-cyan); font-weight: 900;">$${p.precio}</span></div><p style="margin: 8px 0; color: var(--texto-sec); font-size: 0.85em; font-style: italic;">"${p.descripcion}"</p></div><div><span style="display: inline-block; padding: 4px 8px; background: rgba(15, 240, 252, 0.1); color: var(--neon-turquesa); border: 1px solid var(--neon-turquesa); border-radius: 6px; font-size: 0.7em;">${p.categoria}</span></div></div>`; 
    }).join(''); 
  } 
}

document.querySelector('#form-platillo').addEventListener('submit', async (e) => { 
  e.preventDefault(); 
  const f = new FormData(e.target); 
  const p = parseFloat(f.get('precio')); 
  if(p<=0){ alert("Error"); return; } 
  await supabase.from('PLATILLO').insert([{ nombre: f.get('nombre'), descripcion: f.get('descripcion'), precio: p, categoria: f.get('categoria') }]); 
  alert("Guardado"); 
  e.target.reset(); 
  cargarMenu(); 
  cargarDropdownsPedidos(); 
});

document.querySelector('#form-receta').addEventListener('submit', async (e) => { 
  e.preventDefault(); 
  const f = new FormData(e.target); 
  const p = parseInt(f.get('id_platillo')); 
  const { data: pso } = await supabase.from('COMPONENTE_RECETA').select('num_paso').eq('id_platillo', p).order('num_paso', { ascending: false }).limit(1); 
  await supabase.from('COMPONENTE_RECETA').insert([{ id_platillo: p, num_paso: (pso && pso.length>0)?pso[0].num_paso+1:1, id_componente: parseInt(f.get('id_componente')), cantidad_requerida: parseFloat(f.get('cantidad')) }]); 
  alert("Vinculado"); 
  e.target.reset();
});

function activarWebSocketsCocina() {
  supabase.channel('canal-cocina').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'DETALLE_PEDIDO' }, async (payload) => {
    const nuevo = payload.new; 
    const { data } = await supabase.from('PLATILLO').select('nombre').eq('id_platillo', nuevo.id_platillo).single();
    document.getElementById('lista-cocina').innerHTML += `<div class="item-menu" style="border-left: 4px solid var(--neon-naranja); background: rgba(1,6,18,0.8);"><small style="color: var(--texto-sec);">Folio #${nuevo.folio_pedido}</small><br><strong style="font-size: 1.3em; color: white;">${nuevo.cantidad_servida}x ${data ? data.nombre : 'Platillo'}</strong><button class="btn-exito" style="width: 100%; margin-top: 15px; padding: 8px;" onclick="this.parentElement.remove()">Listo ✔️</button></div>`;
  }).subscribe();
}

document.getElementById('btn-generar-reporte').addEventListener('click', async () => { 
  const { data: p } = await supabase.from('PEDIDO').select('folio_pedido').eq('estado', 'Cerrado'); 
  if(!p || p.length===0){ alert("Sin datos"); return; } 
  const f = p.map(x=>x.folio_pedido); 
  const { data: d } = await supabase.from('DETALLE_PEDIDO').select('cantidad_servida, precio_unitario').in('folio_pedido', f); 
  let t=0; 
  d.forEach(x=>t+=x.cantidad_servida*x.precio_unitario); 
  document.getElementById('rep-total').innerText = `$${t.toFixed(2)}`; 
  document.getElementById('rep-mesas').innerText = p.length; 
  document.getElementById('contenido-reporte').style.display='block'; 
});

document.querySelector('#form-login').addEventListener('submit', async (e) => {
  e.preventDefault(); 
  const emailInput = e.target.email.value;
  const { error } = await supabase.auth.signInWithPassword({ email: emailInput, password: e.target.password.value });
  if (error) { alert("Credenciales incorrectas"); return; }
  const { data: adminData } = await supabase.from('ADMINISTRADOR').select('*').eq('usuario', emailInput);
  esAdmin = (adminData && adminData.length > 0);
  arrancarApp();
});

document.getElementById('btn-logout').addEventListener('click', async () => { 
  await supabase.auth.signOut(); 
  document.getElementById('seccion-login').style.display = 'block'; 
  document.getElementById('seccion-sistema').style.display = 'none'; 
});

function arrancarApp() {
  document.getElementById('seccion-login').style.display = 'none'; 
  document.getElementById('seccion-sistema').style.display = 'block';
  if (esAdmin) { 
    document.getElementById('nav-menu').style.display = 'block'; 
    document.getElementById('nav-inventario').style.display = 'block'; 
    document.getElementById('nav-personal').style.display = 'block'; 
    document.getElementById('nav-reportes').style.display = 'block'; 
  } else { 
    document.getElementById('nav-menu').style.display = 'none'; 
    document.getElementById('nav-inventario').style.display = 'none'; 
    document.getElementById('nav-personal').style.display = 'none'; 
    document.getElementById('nav-reportes').style.display = 'none'; 
  }
  cargarEmpleados(); 
  cargarDropdownsPedidos(); 
  cargarMenu(); 
  cargarInventario(); 
  activarWebSocketsCocina();
}

supabase.auth.getSession().then(async ({ data: { session } }) => { 
  if (session) {
    const { data: adminData } = await supabase.from('ADMINISTRADOR').select('*').eq('usuario', session.user.email);
    esAdmin = (adminData && adminData.length > 0); 
    arrancarApp(); 
  } 
});