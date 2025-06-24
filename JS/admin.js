const API_URL = 'https://6859c7169f6ef96111543487.mockapi.io/SFX/streetflex'; // Reemplaza con tu URL de MockAPI
const IMG_API_URL = 'https://api.imgbb.com/1/upload?key=164fa41f5cbb07c3aa2b66d99b8dae07'; // Reemplaza con tu key de ImgBB
 
const form            = document.getElementById('producto-form');
const typeEl          = document.getElementById('type');
const colorEl         = document.getElementById('color');
const sizeEl          = document.getElementById('size');
const imagenFileEl    = document.getElementById('imagen-file');
const imagenUrlEl     = document.getElementById('imagen-url');
const idEl            = document.getElementById('producto-id');
const cancelBtn       = document.getElementById('btn-cancel');
const submitBtn       = document.getElementById('btn-submit');
const tbody           = document.getElementById('productos-tbody');

window.addEventListener('DOMContentLoaded', cargarProductos);
 
async function cargarProductos() {
  try {
    const res  = await fetch(API_URL);
    const data = await res.json();
    cargarTabla(data);
  } catch (err) {
    console.error('Error al cargar productos:', err);
    tbody.innerHTML = '<tr><td colspan="5">Error al cargar productos.</td></tr>';
  }
}

function cargarTabla(productos) {
    tbody.innerHTML = '';
   
    if (!productos.length) {
      tbody.innerHTML = '<tr><td colspan="5">No hay productos.</td></tr>';
      return;
    }
   
    productos.forEach(p => {
        tbody.innerHTML += `
        <tr>
          <td><img src="${p.image}" alt="${p.type}" width="60" /></td>
          <td>${p.type}</td>
          <td>${p.color}</td>
          <td>${p.size}</td>
          <td>
            <!-- Ícono EDITAR -->
            <img
      src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png"
              width="24"
              title="Editar"
              class="icon-btn"
      onclick="cargarParaEditar('${p.id}')"
            />
            <!-- Ícono ELIMINAR -->
            <img
      src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png"
              width="24"
              title="Eliminar"
              class="icon-btn"
      onclick="borrarProducto('${p.id}')"
            />
          </td>
        </tr>
      `;
    });
    
    
    
  }

  async function borrarProducto(id) {
    if (!confirm('¿Eliminar este producto?')) return;
   
    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
   
    alert('Producto eliminado');
    cargarProductos();
  }

  async function cargarParaEditar(id) {
    const res = await fetch(`${API_URL}/${id}`);
    const p   = await res.json();
   
    typeEl.value       = p.type;
    colorEl.value      = p.color;
    sizeEl.value       = p.size;
    imagenUrlEl.value  = p.image;
    imagenFileEl.value = '';
  idEl.value = p.id;
   
    submitBtn.textContent = 'Actualizar';
    cancelBtn.hidden = false;
  }

  cancelBtn.addEventListener('click', () => {
    form.reset();
    idEl.value = '';
    submitBtn.textContent = 'Agregar';
    cancelBtn.hidden = true;
  });

  async function subirImagen(file) {
    const fd = new FormData();
    fd.append('image', file);
   
    const res = await fetch(IMG_API_URL, {
      method: 'POST',
      body: fd
    });
   
    const obj = await res.json();
  return obj.data.url;
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
   
    let imageUrl = imagenUrlEl.value;
   
    if (imagenFileEl.files.length > 0) {
      imageUrl = await subirImagen(imagenFileEl.files[0]);
    }
   
    const payload = {
      type:  typeEl.value,
      color: colorEl.value,
      size:  sizeEl.value,
      image: imageUrl
    };
   
    if (idEl.value) {
      // Actualizar
      await fetch(`${API_URL}/${idEl.value}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
   
      alert('Producto actualizado');
    } else {
      // Crear nuevo
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
   
      alert('Producto agregado');
    }
   
    form.reset();
    idEl.value = '';
    submitBtn.textContent = 'Agregar';
    cancelBtn.hidden = true;
    cargarProductos();
  });