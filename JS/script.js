const API_URL = 'https://6859c7169f6ef96111543487.mockapi.io/SFX/streetflex';
 
async function cargarProductosCliente() {
  try {
    const res = await fetch(API_URL);
    const productos = await res.json();
    mostrarProductosCliente(productos);
  } catch (err) {
    console.error('Error al cargar productos:', err);
    document.getElementById('clientProducts').innerHTML = '<p>Error al cargar productos.</p>';
  }
}
 
function mostrarProductosCliente(productos) {
  const contenedor = document.getElementById('clientProducts');
  contenedor.innerHTML = '';
  if (!productos.length) {
    contenedor.innerHTML = '<p>No hay productos disponibles.</p>';
    return;
  }
  productos.forEach(p => {
    const col = document.createElement('div');
    col.className = 'col-12 col-sm-6 col-md-4 col-lg-3 mb-4';
    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${p.image}" class="card-img-top" alt="${p.type}">
        <div class="card-body text-start">
          <h5 class="card-title">${p.type}</h5>
          <p class="card-text"><strong>Color:</strong> ${p.color}</p>
          <p class="card-text"><strong>Talla:</strong> ${p.size}</p>
        </div>
      </div>
    `;
    contenedor.appendChild(col);
  });
}
 
window.addEventListener('DOMContentLoaded', cargarProductosCliente);
 