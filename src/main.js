import './style.css'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qkovcumfzicpepcyjkzq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrb3ZjdW1memljcGVwY3lqa3pxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NDE5MDAsImV4cCI6MjA5MjQxNzkwMH0.z7BzjaL5IXwLye04gqEtvC_DIm6MaYR1oL2OKADuRz4' // <-- ¡Tu llave aquí!

const supabase = createClient(supabaseUrl, supabaseKey)

// ==========================================
// 1. ESTRUCTURA HTML DE LA PÁGINA
// ==========================================
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
        <button id="nav-reportes" class="btn-inactivo" style="flex: 1; min-width: 100px;">Finanzas 📊</button>
        <button id="btn-logout" class="btn-peligro" style="min-width: 100px;">Salir</button>
      </nav>

      <div id="vista-pedidos">
        
        <section class="tarjeta">
          <h2 style="margin-top: 0; color: var(--neon-turquesa);">📍 Mapa Interactivo del Salón</h2>
          <p style="font-size: 0.85em; color: var(--texto-sec); margin-top: -10px;">Haz clic en una mesa verde para abrir cuenta, o en una roja para gestionarla.</p>
          <div id="mapa-mesas" class="grid-mesas"></div>
        </section>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
          
          <section class="tarjeta" id="zona-agregar-platillo">
            <h2 style="margin-top: 0; color: var(--neon-naranja);">Agregar Consumo</h2>
            <form id="form-detalle" class="form-columna">
              <div class="grupo-input"><label>Folio Activo</label><select id="select-folios" name="folio_pedido" required></select></div>
              <div class="grupo-input"><label>Platillo</label><select id="select-platillos" name="id_platillo" required></select></div>
              <div class="grupo-input"><label>Cantidad</label><input type="number" name="cantidad" value="1" min="1" required></div>
              <button type="submit" class="btn-alerta">+ Enviar a Cocina</button>
            </form>
          </section>

          <section class="tarjeta" id="zona-ticket">
            <h2 style="margin-top: 0; color: var(--neon-cyan);">Caja y Ticket</h2>
            <div style="display: flex; gap: 10px; margin-bottom: 15px;">
              <select id="select-ticket-folio" style="flex: 1;"></select>
              <button id="btn-ver-ticket" class="btn-primario">Consultar</button>
            </div>
            
            <div id="ticket-contenido" style="background: white; color: black; padding: 20px; border-radius: 8px; font-family: monospace; font-size: 1.1em; display: none; margin-bottom: 15px; border: 2px dashed #ccc;"></div>

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
          <h2 style="color: var(--neon-turquesa);">Crear Platillo</h2>
          <form id="form-platillo" class="form-columna">
            <input type="text" name="nombre" placeholder="Nombre" required><textarea name="descripcion" placeholder="Descripción" required rows="2"></textarea>
            <div style="display: flex; gap: 12px;"><input type="number" step="0.01" name="precio" placeholder="Precio ($)" required style="flex: 1;"><select name="categoria" style="flex: 1;"><option value="Entradas">Entradas</option><option value="Plato Fuerte">Plato Fuerte</option></select></div>
            <button type="submit" class="btn-primario">Guardar Platillo</button>
          </form>
        </section>
        <section class="tarjeta" style="border-color: var(--neon-naranja);">
          <h2 style="margin-top: 0; color: var(--neon-naranja);">Ficha Técnica (Asignar Ingredientes)</h2>
          <form id="form-receta" class="formulario" style="align-items: flex-end;">
            <div class="grupo-input" style="flex: 2;"><label>Platillo</label><select id="select-receta-platillo" name="id_platillo" required></select></div>
            <div class="grupo-input" style="flex: 2;"><label>Ingrediente del Almacén</label><select id="select-receta-ingrediente" name="id_componente" required></select></div>
            <div class="grupo-input" style="flex: 1;"><label>Cant. por porción</label><input type="number" step="0.01" name="cantidad" placeholder="Ej. 1.5" required></div>
            <button type="submit" class="btn-alerta">Vincular</button>
          </form>
        </section>
        <section class="tarjeta"><h2>Menú Actual</h2><div id="lista-menu" class="grid-menu"></div></section>
      </div>

      <div id="vista-inventario" style="display: none;">
        <section class="tarjeta">
          <h2 style="margin-top: 0; color: var(--neon-turquesa);">Ingresar Insumo</h2>
          <form id="form-inventario" class="form-columna">
            <input type="text" name="nombre" placeholder="Nombre del insumo" required>
            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
              <div class="grupo-input" style="flex: 1;"><label>Costo Unitario ($)</label><input type="number" step="0.01" name="costo" placeholder="0.00" required></div>
              <div class="grupo-input" style="flex: 1;"><label>Stock Inicial</label><input type="number" step="0.01" name="stock" placeholder="Cantidad" required></div>
              <div class="grupo-input" style="flex: 1;"><label>Unidad</label><select name="unidad_medida"><option value="pz">Piezas (pz)</option><option value="g">Gramos (g)</option><option value="kg">Kilos (kg)</option><option value="ml">Mililitros (ml)</option><option value="l">Litros (l)</option></select></div>
            </div>
            <button type="submit" class="btn-exito" style="margin-top: 10px;">Guardar en Almacén</button>
          </form>
        </section>
        <section class="tarjeta"><h2>Almacén Actual</h2><div id="lista-inventario" class="grid-menu"></div></section>
      </div>

      <div id="vista-reportes" style="display: none;">
        <section class="tarjeta">
          <h2 style="color: var(--neon-turquesa);">Corte de Caja</h2>
          <button id="btn-generar-reporte" class="btn-primario" style="margin-bottom: 20px; width: 100%;">Procesar Datos Financieros</button>
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

// ==========================================
// 2. SISTEMA DE ROLES Y NAVEGACIÓN
// ==========================================
let esAdmin = false;

function cambiarVista(vistaDestino, btnActivo) {
  const vistas = ['vista-pedidos', 'vista-cocina', 'vista-menu', 'vista-inventario', 'vista-reportes'];
  const botones = ['nav-pedidos', 'nav-cocina', 'nav-menu', 'nav-inventario', 'nav-reportes'];
  
  vistas.forEach(v => document.getElementById(v).style.display = (v === vistaDestino) ? 'block' : 'none');
  botones.forEach(b => document.getElementById(b).className = (b === btnActivo) ? 'btn-primario' : 'btn-inactivo');
  
  if(vistaDestino === 'vista-pedidos') cargarDropdownsPedidos();
}

document.getElementById('nav-pedidos').addEventListener('click', () => cambiarVista('vista-pedidos', 'nav-pedidos'));
document.getElementById('nav-cocina').addEventListener('click', () => cambiarVista('vista-cocina', 'nav-cocina'));
document.getElementById('nav-menu').addEventListener('click', () => cambiarVista('vista-menu', 'nav-menu'));
document.getElementById('nav-inventario').addEventListener('click', () => cambiarVista('vista-inventario', 'nav-inventario'));
document.getElementById('nav-reportes').addEventListener('click', () => cambiarVista('vista-reportes', 'nav-reportes'));


// ==========================================
// 3. EVENTOS OPERATIVOS (MAPA, PEDIDOS, COBRO)
// ==========================================
async function cargarDropdownsPedidos() {
  const { data: pedidos } = await supabase.from('PEDIDO').select('folio_pedido, id_mesa').eq('estado', 'Abierto');
  
  // Dibujar el mapa interactivo
  dibujarMapaMesas(pedidos);

  const opciones = pedidos ? pedidos.map(p => `<option value="${p.folio_pedido}">Mesa ${p.id_mesa} (Folio #${p.folio_pedido})</option>`).join('') : '';
  document.getElementById('select-folios').innerHTML = opciones; document.getElementById('select-ticket-folio').innerHTML = opciones;
  
  const { data: platillos } = await supabase.from('PLATILLO').select('*');
  if (platillos) {
    const optsPlatillos = platillos.map(p => `<option value="${p.id_platillo}" data-precio="${p.precio}">${p.nombre} - $${p.precio}</option>`).join('');
    document.getElementById('select-platillos').innerHTML = optsPlatillos;
    document.getElementById('select-receta-platillo').innerHTML = optsPlatillos; 
  }
}

// LOGICA DEL MAPA VISUAL
function dibujarMapaMesas(pedidos) {
  const TOTAL_MESAS = 8; // Puedes cambiar la cantidad de mesas aquí
  let html = '';
  
  for (let i = 1; i <= TOTAL_MESAS; i++) {
    const mesaOcupada = pedidos ? pedidos.find(p => p.id_mesa === i) : null;
    
    if (mesaOcupada) {
      html += `
        <div class="mesa-visual mesa-ocupada" onclick="seleccionarMesaOcupada(${mesaOcupada.folio_pedido})">
          <span class="mesa-numero">${i}</span>
          <span class="mesa-estado">Ocupada<br>#${mesaOcupada.folio_pedido}</span>
        </div>`;
    } else {
      html += `
        <div class="mesa-visual mesa-libre" onclick="abrirMesaRapida(${i})">
          <span class="mesa-numero">${i}</span>
          <span class="mesa-estado">Libre</span>
        </div>`;
    }
  }
  document.getElementById('mapa-mesas').innerHTML = html;
}

// Funciones globales para que el HTML pueda detectarlas al hacer clic
window.abrirMesaRapida = async function(numMesa) {
  if (confirm(`¿Quieres abrir una cuenta en la Mesa ${numMesa}?`)) {
    // Intentamos hacer el insert en la base de datos
    const { error } = await supabase.from('PEDIDO').insert([{ 
      id_mesa: numMesa, 
      id_empleado_mesero: 1, 
      estado: 'Abierto', 
      hora_apertura: new Date().toISOString() 
    }]);
    
    // Si PostgreSQL rechaza la operación, mostramos el error real
    if (error) {
      alert("❌ Error de Base de Datos:\n" + error.message + "\n\n(Sugerencia: Revisa si esta mesa existe en tu tabla MESA).");
    } else {
      cargarDropdownsPedidos();
    }
  }
};

window.seleccionarMesaOcupada = function(folio) {
  document.getElementById('select-folios').value = folio;
  document.getElementById('select-ticket-folio').value = folio;
  document.getElementById('btn-ver-ticket').click();
  document.getElementById('zona-ticket').scrollIntoView({ behavior: 'smooth' });
};


document.querySelector('#form-detalle').addEventListener('submit', async (e) => {
  e.preventDefault(); const form = e.target; const folio = parseInt(form.folio_pedido.value); const selectP = form.id_platillo;
  const { data: lineas } = await supabase.from('DETALLE_PEDIDO').select('num_linea').eq('folio_pedido', folio).order('num_linea', { ascending: false }).limit(1);
  await supabase.from('DETALLE_PEDIDO').insert([{ folio_pedido: folio, num_linea: (lineas && lineas.length > 0) ? lineas[0].num_linea + 1 : 1, id_platillo: parseInt(selectP.value), cantidad_servida: parseInt(form.cantidad.value), precio_unitario: parseFloat(selectP.options[selectP.selectedIndex].dataset.precio) }]);
  form.cantidad.value = 1; if(document.getElementById('select-ticket-folio').value == folio) document.getElementById('btn-ver-ticket').click();
});

document.getElementById('btn-ver-ticket').addEventListener('click', async () => {
  const folio = document.getElementById('select-ticket-folio').value;
  if(!folio) return;
  const { data } = await supabase.from('DETALLE_PEDIDO').select('cantidad_servida, precio_unitario, PLATILLO ( nombre )').eq('folio_pedido', folio);
  const cont = document.getElementById('ticket-contenido');
  if (!data || data.length === 0) { cont.style.display = 'block'; cont.innerHTML = `<p style="text-align:center;">Mesa sin consumos cargados.</p>`; document.getElementById('zona-cobro').style.display = 'none'; return; }
  
  let total = 0, html = `<div style="text-align: center; border-bottom: 2px dashed #ccc; padding-bottom: 10px; margin-bottom: 10px;"><h3>RESTAURANTE ESCOM</h3><p>Folio #${folio}</p></div>`;
  data.forEach(i => { total += i.cantidad_servida * i.precio_unitario; html += `<div style="display: flex; justify-content: space-between;"><span>${i.cantidad_servida}x ${i.PLATILLO.nombre}</span><span>$${(i.cantidad_servida * i.precio_unitario).toFixed(2)}</span></div>`; });
  html += `<div style="border-top: 2px dashed #ccc; margin-top: 10px; padding-top: 10px; display: flex; justify-content: space-between; font-weight: bold; font-size: 1.2em;"><span>TOTAL:</span><span id="ticket-total" data-valor="${total}">$${total.toFixed(2)}</span></div>`;
  
  cont.innerHTML = html; cont.style.display = 'block'; document.getElementById('zona-cobro').style.display = 'block';
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
  
  document.getElementById('ticket-contenido').style.display = 'none'; document.getElementById('zona-cobro').style.display = 'none';
  cargarDropdownsPedidos(); cargarInventario();
});

// ==========================================
// 4. CRUD DE MENÚ E INVENTARIO
// ==========================================
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
  e.preventDefault(); const f = new FormData(e.target);
  const { error } = await supabase.from('COMPONENTE').insert([{ id_restaurante: 1, nombre: f.get('nombre'), costo: parseFloat(f.get('costo')), stock_actual: parseFloat(f.get('stock')), unidad_medida: f.get('unidad_medida') }]);
  if (!error) { alert("¡Ingrediente agregado!"); e.target.reset(); cargarInventario(); } else { alert("Error: " + error.message); }
});

async function cargarMenu() { const { data } = await supabase.from('PLATILLO').select('*'); if (data) document.getElementById('lista-menu').innerHTML = data.map(p => `<div class="item-menu"><strong>${p.nombre}</strong><span>$${p.precio}</span></div>`).join(''); }
document.querySelector('#form-platillo').addEventListener('submit', async (e) => { e.preventDefault(); const f = new FormData(e.target); await supabase.from('PLATILLO').insert([{ id_restaurante: 1, nombre: f.get('nombre'), descripcion: f.get('descripcion'), precio: parseFloat(f.get('precio')), categoria: f.get('categoria') }]); alert("Platillo guardado"); e.target.reset(); cargarMenu(); cargarDropdownsPedidos(); });
document.querySelector('#form-receta').addEventListener('submit', async (e) => { e.preventDefault(); const f = new FormData(e.target); const idPlatillo = parseInt(f.get('id_platillo')); const { data: pasos } = await supabase.from('COMPONENTE_RECETA').select('num_paso').eq('id_platillo', idPlatillo).order('num_paso', { ascending: false }).limit(1); const { error } = await supabase.from('COMPONENTE_RECETA').insert([{ id_platillo: idPlatillo, num_paso: (pasos && pasos.length > 0) ? pasos[0].num_paso + 1 : 1, id_componente: parseInt(f.get('id_componente')), cantidad_requerida: parseFloat(f.get('cantidad')) }]); if (!error) { alert("¡Ingrediente vinculado!"); e.target.reset(); } else { alert("Error: " + error.message); }});

// ==========================================
// 5. WEBSOCKETS Y REPORTES
// ==========================================
function activarWebSocketsCocina() {
  supabase.channel('canal-cocina').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'DETALLE_PEDIDO' }, async (payload) => {
    const nuevo = payload.new; const { data } = await supabase.from('PLATILLO').select('nombre').eq('id_platillo', nuevo.id_platillo).single();
    document.getElementById('lista-cocina').innerHTML += `<div class="item-menu" style="border-left: 4px solid var(--neon-naranja); background: rgba(1,6,18,0.8);"><small style="color: var(--texto-sec);">Folio #${nuevo.folio_pedido}</small><br><strong style="font-size: 1.3em; color: white;">${nuevo.cantidad_servida}x ${data ? data.nombre : 'Platillo'}</strong><button class="btn-exito" style="width: 100%; margin-top: 15px; padding: 8px;" onclick="this.parentElement.remove()">Listo ✔️</button></div>`;
  }).subscribe();
}

document.getElementById('btn-generar-reporte').addEventListener('click', async () => { 
  const { data: p } = await supabase.from('PEDIDO').select('folio_pedido').eq('estado', 'Cerrado'); 
  if(!p || p.length===0){alert("Sin datos"); return;} 
  const f = p.map(x=>x.folio_pedido); 
  const { data: d } = await supabase.from('DETALLE_PEDIDO').select('cantidad_servida, precio_unitario').in('folio_pedido', f); 
  let t=0; d.forEach(x=>t+=x.cantidad_servida*x.precio_unitario); 
  document.getElementById('rep-total').innerText = `$${t.toFixed(2)}`; document.getElementById('rep-mesas').innerText = p.length; document.getElementById('contenido-reporte').style.display='block'; 
});

// ==========================================
// 6. AUTENTICACIÓN Y ARRANQUE
// ==========================================
document.querySelector('#form-login').addEventListener('submit', async (e) => {
  e.preventDefault(); const emailInput = e.target.email.value;
  const { error } = await supabase.auth.signInWithPassword({ email: emailInput, password: e.target.password.value });
  if (error) { alert("Credenciales incorrectas ❌: " + error.message); return; }
  const { data: adminData } = await supabase.from('ADMINISTRADOR').select('*').eq('usuario', emailInput);
  esAdmin = (adminData && adminData.length > 0);
  arrancarApp();
});

document.getElementById('btn-logout').addEventListener('click', async () => { await supabase.auth.signOut(); document.getElementById('seccion-login').style.display = 'block'; document.getElementById('seccion-sistema').style.display = 'none'; });

function arrancarApp() {
  document.getElementById('seccion-login').style.display = 'none'; document.getElementById('seccion-sistema').style.display = 'block';
  if (esAdmin) { document.getElementById('nav-menu').style.display = 'block'; document.getElementById('nav-inventario').style.display = 'block'; document.getElementById('nav-reportes').style.display = 'block'; } 
  else { document.getElementById('nav-menu').style.display = 'none'; document.getElementById('nav-inventario').style.display = 'none'; document.getElementById('nav-reportes').style.display = 'none'; }
  cargarDropdownsPedidos(); cargarMenu(); cargarInventario(); activarWebSocketsCocina();
}

supabase.auth.getSession().then(async ({ data: { session } }) => { 
  if (session) {
    const { data: adminData } = await supabase.from('ADMINISTRADOR').select('*').eq('usuario', session.user.email);
    esAdmin = (adminData && adminData.length > 0); arrancarApp(); 
  } 
});