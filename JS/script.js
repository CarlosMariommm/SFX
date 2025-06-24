const API_URL = 'https://6859c7169f6ef96111543487.mockapi.io/SFX/streetflex';
const IMG_API_URL = 'https://api.imgbb.com/1/upload?key=164fa41f5cbb07c3aa2b66d99b8dae07';


const productForm = document.getElementById('productForm');
const productType = document.getElementById('productType');
const productColor = document.getElementById('productColor');
const productSize = document.getElementById('productSize');
const productImage = document.getElementById('productImage');

const tshirtContainer = document.getElementById('tshirtContainer');
const hoodieContainer = document.getElementById('hoodieContainer');
const jeansContainer = document.getElementById('jeansContainer');
const clientProducts = document.getElementById('clientProducts');

const toggleViewBtn = document.getElementById('toggleViewBtn');
const adminView = document.getElementById('adminView');
const clientView = document.getElementById('clientView');

let isAdminView = true;
let products = [];

function fetchProducts() {
  products = [
    { id: 1, type: 'T-shirt', color: 'Negro', size: 'S, M, L', image: 'https://via.placeholder.com/100' },
    { id: 2, type: 'Hoodie', color: 'Gris', size: 'M, L', image: 'https://via.placeholder.com/100' },
    { id: 3, type: 'Jeans', color: 'Azul', size: '30, 32, 34', image: 'https://via.placeholder.com/100' }
  ];
  renderProducts();
  renderClientProducts();
}

function renderProducts() {
  tshirtContainer.innerHTML = '';
  hoodieContainer.innerHTML = '';
  jeansContainer.innerHTML = '';

  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'text-center';
    card.innerHTML = `
      <img src="${p.image}" width="80" height="80" alt="${p.type}" /><br>
      <strong>${p.type}</strong><br>
      <img src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png" width="24" title="Editar" class="icon-btn" onclick="editProduct(${p.id})" />
      <img src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png" width="24" title="Eliminar" class="icon-btn" onclick="deleteProduct(${p.id})" />
    `;
    if (p.type.toLowerCase().includes('t-shirt')) tshirtContainer.appendChild(card);
    else if (p.type.toLowerCase().includes('hoodie')) hoodieContainer.appendChild(card);
    else if (p.type.toLowerCase().includes('jeans')) jeansContainer.appendChild(card);
  });
}

function renderClientProducts() {
  clientProducts.innerHTML = '';
  products.forEach(p => {
    const div = document.createElement('div');
    div.className = 'col-6 col-md-3 product-card';
    div.innerHTML = `
      <img src="${p.image}" width="100%" alt="${p.type}" /><br>
      <strong>${p.type}</strong><br>
      <small>${p.color}</small><br>
      <small>${p.size}</small>
    `;
    clientProducts.appendChild(div);
  });
}

productForm.addEventListener('submit', e => {
  e.preventDefault();
  const file = productImage.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const newProduct = {
        id: Date.now(),
        type: productType.value,
        color: productColor.value,
        size: productSize.value,
        image: event.target.result
      };
      products.push(newProduct);
      renderProducts();
      renderClientProducts();
      productForm.reset();
    };
    reader.readAsDataURL(file);
  } else {
    alert('Por favor selecciona una imagen');
  }
});

function deleteProduct(id) {
  if (confirm('¿Deseas eliminar este producto?')) {
    products = products.filter(p => p.id !== id);
    renderProducts();
    renderClientProducts();
  }
}

function editProduct(id) {
  const producto = products.find(p => p.id === id);
  if (!producto) return;
  const nuevoTipo = prompt('Nuevo tipo:', producto.type);
  const nuevoColor = prompt('Nuevo color:', producto.color);
  const nuevaTalla = prompt('Nuevas tallas:', producto.size);
  producto.type = nuevoTipo;
  producto.color = nuevoColor;
  producto.size = nuevaTalla;
  renderProducts();
  renderClientProducts();
}

toggleViewBtn.addEventListener('click', () => {
  isAdminView = !isAdminView;
  adminView.classList.toggle('d-none', !isAdminView);
  clientView.classList.toggle('d-none', isAdminView);
  toggleViewBtn.title = isAdminView ? 'Cambiar a vista cliente' : 'Cambiar a vista administrador';
});

fetchProducts();

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