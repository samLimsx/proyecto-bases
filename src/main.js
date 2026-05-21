import './style.css'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qkovcumfzicpepcyjkzq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrb3ZjdW1memljcGVwY3lqa3pxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NDE5MDAsImV4cCI6MjA5MjQxNzkwMH0.z7BzjaL5IXwLye04gqEtvC_DIm6MaYR1oL2OKADuRz4' // <-- ¡Tu llave aquí!

const supabase = createClient(supabaseUrl, supabaseKey)

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
      <nav class="nav-bar" style="flex-wrap: wrap;">
        <button id="nav-pedidos" class="btn-primario" style="flex: 1; min-width: 100px;">Pedidos</button>
        <button id="nav-cocina" class="btn-inactivo" style="flex: 1; min-width: 100px;">Cocina 👨‍🍳</button>
        <button id="nav-menu" class="btn-inactivo" style="flex: 1; min-width: 100px;">Menú y Recetas</button>
        <button id="nav-inventario" class="btn-inactivo" style="flex: 1; min-width: 100px;">Inventario 📦</button>
        <button id="nav-reportes" class="btn-inactivo" style="flex: 1; min-width: 100px;">Reportes 📊</button>
        <button id="btn-logout" class="btn-peligro" style="min-width: 100px;">Salir</button>
      </nav>

      <div id="vista-pedidos">
        <section class="tarjeta">
          <h2 style="margin-top: 0; color: var(--texto-secundario);">1. Abrir Mesa</h2>
          <form id="form-pedido" class="formulario" style="align-items: flex-end;">
            <div class="grupo-input"><label>Mesa</label><select name="id_mesa"><option value="1">Mesa 1</option><option value="2">Mesa 2</option><option value="3">Mesa 3</option><option value="4">Mesa 4</option></select></div>
            <div class="grupo-input"><label>Mesero</label><select name="id_mesero"><option value="1">Roberto Carlos</option></select></div>
            <button type="submit" class="btn-exito">Abrir</button>
          </form>
        </section>

        <section class="tarjeta">
          <h2 style="margin-top: 0; color: var(--texto-secundario);">2. Agregar a la Cuenta</h2>
          <form id="form-detalle" class="formulario" style="align-items: flex-end;">
            <div class="grupo-input" style="flex: 1;"><label>Folio</label><select id="select-folios" name="folio_pedido" required></select></div>
            <div class="grupo-input" style="flex: 2;"><label>Platillo</label><select id="select-platillos" name="id_platillo" required></select></div>
            <div class="grupo-input" style="flex: 0.5;"><label>Cant.</label><input type="number" name="cantidad" value="1" min="1" required></div>
            <button type="submit" class="btn-alerta">+ Agregar</button>
          </form>
        </section>

        <section class="tarjeta">
          <h2 style="margin-top: 0; color: var(--texto-secundario);">3. Caja y Ticket</h2>
          <div style="display: flex; gap: 10px; margin-bottom: 15px;">
            <select id="select-ticket-folio" style="flex: 1;"></select>
            <button id="btn-ver-ticket" class="btn-primario">Ver Ticket</button>
            <button id="btn-imprimir" class="btn-inactivo" style="display: none; background: white; color: black;">🖨️ Imprimir</button>
          </div>
          
          <div id="ticket-contenido" style="background: #000; color: #10b981; padding: 20px; border-radius: 8px; font-family: monospace; font-size: 1.1em; display: none; margin-bottom: 15px; border: 1px solid var(--borde);"></div>

          <div id="zona-cobro" style="display: none; background: var(--bg-fondo); padding: 15px; border-radius: 8px; border: 1px solid var(--borde);">
            <label style="display: block; font-size: 0.85em; color: var(--texto-secundario); margin-bottom: 8px;">Método de Pago</label>
            <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
              <select id="select-pago" style="flex: 1; min-width: 150px;"><option value="Efectivo">💵 Efectivo</option><option value="Tarjeta">💳 Tarjeta Bancaria</option></select>
              <button id="btn-cobrar" class="btn-exito" style="flex: 1; min-width: 200px;">Cobrar, Descontar Stock y Cerrar</button>
            </div>
          </div>
        </section>
      </div>

      <div id="vista-cocina" style="display: none;"><section class="tarjeta"><h2 style="color: var(--color-alerta);">Comandas Entrantes</h2><div id="lista-cocina" class="grid-menu"></div></section></div>
      
      <div id="vista-menu" style="display: none;">
        <section class="tarjeta">
          <h2>Registrar Platillo</h2>
          <form id="form-platillo" class="form-columna">
            <input type="text" name="nombre" placeholder="Nombre" required><textarea name="descripcion" placeholder="Descripción" required rows="2"></textarea>
            <div style="display: flex; gap: 12px;"><input type="number" step="0.01" name="precio" placeholder="Precio ($)" required style="flex: 1;"><select name="categoria" style="flex: 1;"><option value="Entradas">Entradas</option><option value="Plato Fuerte">Plato Fuerte</option></select></div>
            <button type="submit" class="btn-primario">Guardar Platillo</button>
          </form>
        </section>
        <section class="tarjeta" style="border-color: var(--color-alerta);">
          <h2 style="margin-top: 0; color: var(--color-alerta);">Ficha Técnica (Asignar Ingredientes)</h2>
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
          <h2 style="margin-top: 0;">Ingresar Nuevo Ingrediente</h2>
          <form id="form-inventario" class="form-columna">
            <input type="text" name="nombre" placeholder="Nombre del insumo" required>
            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
              <div class="grupo-input" style="flex: 1;"><label>Costo Unitario ($)</label><input type="number" step="0.01" name="costo" placeholder="0.00" required></div>
              <div class="grupo-input" style="flex: 1;"><label>Stock Inicial</label><input type="number" step="0.01" name="stock" placeholder="Cantidad" required></div>
              <div class="grupo-input" style="flex: 1;"><label>Unidad</label><select name="unidad_medida"><option value="pz">Piezas (pz)</option><option value="g">Gramos (g)</option><option value="kg">Kilogramos (kg)</option><option value="ml">Mililitros (ml)</option><option value="l">Litros (l)</option></select></div>
            </div>
            <button type="submit" class="btn-exito" style="margin-top: 10px;">Guardar en Almacén</button>
          </form>
        </section>
        <section class="tarjeta"><h2>Almacén Actual</h2><div id="lista-inventario" class="grid-menu"></div></section>
      </div>

      <div id="vista-reportes" style="display: none;">
        <section class="tarjeta">
          <h2>Análisis de Ventas</h2>
          <button id="btn-generar-reporte" class="btn-primario" style="margin-bottom: 20px; width: 100%;">Procesar Datos</button>
          <div id="contenido-reporte" style="display: none; background: var(--bg-fondo); padding: 20px; border-radius: 8px; border: 1px solid var(--borde);">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; text-align: center;">
              <div style="padding: 15px; border-radius: 8px; background: #064e3b; border: 1px solid #059669;"><h3 style="margin:0;color:#a7f3d0;">Ingreso Total</h3><p id="rep-total" style="font-size: 2em; margin: 10px 0 0 0; color: white;">$0.00</p></div>
              <div style="padding: 15px; border-radius: 8px; background: #1e3a8a; border: 1px solid #2563eb;"><h3 style="margin:0;color:#bfdbfe;">Mesas Cobradas</h3><p id="rep-mesas" style="font-size: 2em; margin: 10px 0 0 0; color: white;">0</p></div>
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
// 3. EVENTOS OPERATIVOS (PEDIDOS, INVENTARIO, COBRO)
// ==========================================
async function cargarDropdownsPedidos() {
  const { data: pedidos } = await supabase.from('PEDIDO').select('folio_pedido, id_mesa').eq('estado', 'Abierto');
  const opciones = pedidos ? pedidos.map(p => `<option value="${p.folio_pedido}">Folio: ${p.folio_pedido} (Mesa ${p.id_mesa})</option>`).join('') : '';
  document.getElementById('select-folios').innerHTML = opciones; document.getElementById('select-ticket-folio').innerHTML = opciones;
  const { data: platillos } = await supabase.from('PLATILLO').select('*');
  if (platillos) {
    const optsPlatillos = platillos.map(p => `<option value="${p.id_platillo}" data-precio="${p.precio}">${p.nombre} - $${p.precio}</option>`).join('');
    document.getElementById('select-platillos').innerHTML = optsPlatillos;
    document.getElementById('select-receta-platillo').innerHTML = optsPlatillos; 
  }
}

document.querySelector('#form-pedido').addEventListener('submit', async (e) => {
  e.preventDefault(); 
  const f = new FormData(e.target);
  const mesaDeseada = parseInt(f.get('id_mesa'));

  // VALIDACIÓN 1: Verificar si la mesa ya está abierta
  const { data: mesaActiva } = await supabase.from('PEDIDO')
    .select('id_mesa')
    .eq('id_mesa', mesaDeseada)
    .eq('estado', 'Abierto');

  if (mesaActiva && mesaActiva.length > 0) {
    alert(`❌ Operación denegada: La Mesa ${mesaDeseada} ya tiene una cuenta abierta.`);
    return; // Detenemos la ejecución aquí
  }

  // Si pasa la validación, insertamos el pedido
  await supabase.from('PEDIDO').insert([{ id_mesa: mesaDeseada, id_empleado_mesero: parseInt(f.get('id_mesero')), estado: 'Abierto', hora_apertura: new Date().toISOString() }]);
  alert("¡Mesa abierta correctamente!"); 
  cargarDropdownsPedidos();
});

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
  if (!data || data.length === 0) { cont.style.display = 'block'; cont.innerHTML = `<p style="text-align:center;">Mesa abierta sin consumos.</p>`; document.getElementById('zona-cobro').style.display = 'none'; document.getElementById('btn-imprimir').style.display = 'none'; return; }
  
  let total = 0, html = `<div style="text-align: center; border-bottom: 2px dashed #334155; padding-bottom: 10px; margin-bottom: 10px;"><h3>RESTAURANTE ESCOM</h3><p>Folio #${folio}</p></div>`;
  data.forEach(i => { total += i.cantidad_servida * i.precio_unitario; html += `<div style="display: flex; justify-content: space-between;"><span>${i.cantidad_servida}x ${i.PLATILLO.nombre}</span><span>$${(i.cantidad_servida * i.precio_unitario).toFixed(2)}</span></div>`; });
  html += `<div style="border-top: 2px dashed #334155; margin-top: 10px; padding-top: 10px; display: flex; justify-content: space-between; font-weight: bold; font-size: 1.2em;"><span>TOTAL:</span><span id="ticket-total" data-valor="${total}">$${total.toFixed(2)}</span></div><p style="text-align:center; font-size: 0.8em; margin-top: 20px;">¡Gracias por su preferencia!</p>`;
  
  cont.innerHTML = html; cont.style.display = 'block'; document.getElementById('zona-cobro').style.display = 'block'; document.getElementById('btn-imprimir').style.display = 'inline-block';
});

document.getElementById('btn-imprimir').addEventListener('click', () => { window.print(); });

document.getElementById('btn-cobrar').addEventListener('click', async () => {
  const folio = document.getElementById('select-ticket-folio').value;
  
  // VALIDACIÓN 2: Seguro Anti-Cobros Vacíos
  // Leemos el total que calculamos en la interfaz justo arriba
  const spanTotal = document.getElementById('ticket-total');
  if (!spanTotal || parseFloat(spanTotal.dataset.valor) <= 0) {
    alert("❌ Error: No puedes cobrar una mesa que no ha consumido nada. Cancela el pedido desde la base de datos.");
    return;
  }

  if (!confirm(`¿Cerrar Mesa (Folio #${folio})?`)) return;

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
  
  document.getElementById('ticket-contenido').style.display = 'none'; document.getElementById('zona-cobro').style.display = 'none'; document.getElementById('btn-imprimir').style.display = 'none';
  cargarDropdownsPedidos();
  cargarInventario();
});

// ==========================================
// 4. CRUD DE MENÚ E INVENTARIO
// ==========================================
async function cargarInventario() {
  const { data } = await supabase.from('COMPONENTE').select('*').order('id_componente', { ascending: false });
  if (data) {
    document.getElementById('lista-inventario').innerHTML = data.map(ing => {
      // VALIDACIÓN 3: Monitor de Stock Bajo
      const alertaStock = ing.stock_actual <= 50 
        ? `<span style="color: var(--color-peligro); font-weight: bold; font-size: 0.85em; float: right;">⚠️ BAJO</span>` 
        : '';
        
      return `
      <div class="item-menu" style="border-left: 4px solid ${ing.stock_actual <= 50 ? 'var(--color-peligro)' : 'var(--color-exito)'};">
        <strong style="color: white; font-size: 1.1em;">${ing.nombre}</strong> ${alertaStock}
        <p style="margin: 5px 0; color: var(--texto-secundario); font-size: 0.9em;">Stock: <span style="color: ${ing.stock_actual <= 50 ? 'var(--color-peligro)' : 'var(--color-exito)'}; font-weight: bold;">${ing.stock_actual} ${ing.unidad_medida}</span></p>
      </div>
      `;
    }).join('');
    
    document.getElementById('select-receta-ingrediente').innerHTML = data.map(ing => `<option value="${ing.id_componente}">${ing.nombre} (${ing.unidad_medida})</option>`).join('');
  }
}

document.querySelector('#form-inventario').addEventListener('submit', async (e) => {
  e.preventDefault(); const f = new FormData(e.target);
  const { error } = await supabase.from('COMPONENTE').insert([{ id_restaurante: 1, nombre: f.get('nombre'), costo: parseFloat(f.get('costo')), stock_actual: parseFloat(f.get('stock')), unidad_medida: f.get('unidad_medida') }]);
  if (!error) { alert("¡Ingrediente agregado al almacén!"); e.target.reset(); cargarInventario(); } else { alert("Error: " + error.message); }
});

async function cargarMenu() { const { data } = await supabase.from('PLATILLO').select('*'); if (data) document.getElementById('lista-menu').innerHTML = data.map(p => `<div class="item-menu"><strong>${p.nombre}</strong><span>$${p.precio}</span></div>`).join(''); }
document.querySelector('#form-platillo').addEventListener('submit', async (e) => { e.preventDefault(); const f = new FormData(e.target); await supabase.from('PLATILLO').insert([{ id_restaurante: 1, nombre: f.get('nombre'), descripcion: f.get('descripcion'), precio: parseFloat(f.get('precio')), categoria: f.get('categoria') }]); alert("Platillo guardado"); e.target.reset(); cargarMenu(); cargarDropdownsPedidos(); });

document.querySelector('#form-receta').addEventListener('submit', async (e) => {
  e.preventDefault(); const f = new FormData(e.target);
  const idPlatillo = parseInt(f.get('id_platillo'));
  const { data: pasos } = await supabase.from('COMPONENTE_RECETA').select('num_paso').eq('id_platillo', idPlatillo).order('num_paso', { ascending: false }).limit(1);
  const { error } = await supabase.from('COMPONENTE_RECETA').insert([{ id_platillo: idPlatillo, num_paso: (pasos && pasos.length > 0) ? pasos[0].num_paso + 1 : 1, id_componente: parseInt(f.get('id_componente')), cantidad_requerida: parseFloat(f.get('cantidad')) }]);
  if (!error) { alert("¡Ingrediente vinculado a la receta!"); e.target.reset(); } else { alert("Error al vincular: " + error.message); }
});

// ==========================================
// 5. WEBSOCKETS (COCINA) Y REPORTES
// ==========================================
function activarWebSocketsCocina() {
  supabase.channel('canal-cocina').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'DETALLE_PEDIDO' }, async (payload) => {
    const nuevo = payload.new;
    const { data } = await supabase.from('PLATILLO').select('nombre').eq('id_platillo', nuevo.id_platillo).single();
    document.getElementById('lista-cocina').innerHTML += `<div class="item-menu" style="border-left: 4px solid var(--color-alerta); background: #1e293b;"><small style="color: var(--texto-secundario);">Folio #${nuevo.folio_pedido}</small><br><strong style="font-size: 1.3em; color: white;">${nuevo.cantidad_servida}x ${data ? data.nombre : 'Platillo'}</strong><button class="btn-exito" style="width: 100%; margin-top: 15px; padding: 8px;" onclick="this.parentElement.remove()">Listo ✔️</button></div>`;
  }).subscribe();
}

document.getElementById('btn-generar-reporte').addEventListener('click', async () => { 
  const { data: p } = await supabase.from('PEDIDO').select('folio_pedido').eq('estado', 'Cerrado'); 
  if(!p || p.length===0){alert("Sin datos"); return;} 
  const f = p.map(x=>x.folio_pedido); 
  const { data: d } = await supabase.from('DETALLE_PEDIDO').select('cantidad_servida, precio_unitario').in('folio_pedido', f); 
  let t=0; d.forEach(x=>t+=x.cantidad_servida*x.precio_unitario); 
  document.getElementById('rep-total').innerText = `$${t.toFixed(2)}`; 
  document.getElementById('rep-mesas').innerText = p.length; 
  document.getElementById('contenido-reporte').style.display='block'; 
});

// ==========================================
// 6. AUTENTICACIÓN (ROLES) Y ARRANQUE
// ==========================================
document.querySelector('#form-login').addEventListener('submit', async (e) => {
  e.preventDefault(); const emailInput = e.target.email.value;
  const { error } = await supabase.auth.signInWithPassword({ email: emailInput, password: e.target.password.value });
  if (error) { alert("Credenciales incorrectas ❌: " + error.message); return; }
  const { data: adminData } = await supabase.from('ADMINISTRADOR').select('*').eq('usuario', emailInput);
  esAdmin = (adminData && adminData.length > 0);
  if (esAdmin) { alert("¡Bienvenido al sistema, Administrador! 👑"); } else { alert("Sesión iniciada como MESERO. Operaciones restringidas. 📝"); }
  arrancarApp();
});

document.getElementById('btn-logout').addEventListener('click', async () => { await supabase.auth.signOut(); document.getElementById('seccion-login').style.display = 'block'; document.getElementById('seccion-sistema').style.display = 'none'; });

function arrancarApp() {
  document.getElementById('seccion-login').style.display = 'none';
  document.getElementById('seccion-sistema').style.display = 'block';
  if (esAdmin) {
    document.getElementById('nav-menu').style.display = 'block'; document.getElementById('nav-inventario').style.display = 'block'; document.getElementById('nav-reportes').style.display = 'block';
  } else {
    document.getElementById('nav-menu').style.display = 'none'; document.getElementById('nav-inventario').style.display = 'none'; document.getElementById('nav-reportes').style.display = 'none';
  }
  cargarDropdownsPedidos(); cargarMenu(); cargarInventario(); activarWebSocketsCocina();
}

supabase.auth.getSession().then(async ({ data: { session } }) => { 
  if (session) {
    const { data: adminData } = await supabase.from('ADMINISTRADOR').select('*').eq('usuario', session.user.email);
    esAdmin = (adminData && adminData.length > 0);
    arrancarApp();
  } 
});