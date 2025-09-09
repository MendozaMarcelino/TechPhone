// ========== FUNCIONALIDADES ADICIONALES PARA LA PAGINA ==========

// 🛒 CARRITO DE COMPRAS 
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let totalCarrito = 0;

// Crear icono de carrito en navbar
function crearCarrito() {
    const navbar = document.querySelector('.navbar');
    const carritoHTML = `
        <div class="carrito-container" style="position: relative; cursor: pointer;">
            <span style="font-size: 1.5rem;">🛒</span>
            <span class="carrito-count" style="position: absolute; top: -8px; right: -8px; background: #e74c3c; color: white; border-radius: 50%; width: 20px; height: 20px; font-size: 0.8rem; display: flex; align-items: center; justify-content: center;">${carrito.length}</span>
        </div>
    `;
    navbar.insertAdjacentHTML('beforeend', carritoHTML);
    
    // Event listener para mostrar carrito
    document.querySelector('.carrito-container').addEventListener('click', mostrarCarrito);
}

// Mostrar contenido del carrito
function mostrarCarrito() {
    if (carrito.length === 0) {
        alert('🛒 Tu carrito está vacío\n\n¡Agrega algunos productos increíbles!');
        return;
    }
    
    let mensaje = '🛒 TU CARRITO DE COMPRAS:\n\n';
    totalCarrito = 0;
    
    carrito.forEach((item, index) => {
        mensaje += `${index + 1}. ${item.nombre}\n   💰 ${item.precio}\n\n`;
        totalCarrito += parseFloat(item.precio.replace('$', '').replace(',', ''));
    });
    
    mensaje += `💳 TOTAL: $${totalCarrito.toLocaleString()}\n\n`;
    mensaje += '¿Deseas proceder al checkout?';
    
    if (confirm(mensaje)) {
        procesarCompra();
    }
}

// Procesar compra
function procesarCompra() {
    alert('🎉 ¡Compra procesada exitosamente!\n\n📦 Recibirás tu pedido en 24-48h\n📧 Te enviaremos el tracking por email\n\n¡Gracias por elegir TechPhone!');
    carrito = [];
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
}

// Actualizar contador del carrito
function actualizarContadorCarrito() {
    const contador = document.querySelector('.carrito-count');
    if (contador) {
        contador.textContent = carrito.length;
        contador.style.display = carrito.length > 0 ? 'flex' : 'none';
    }
}

// 🔍 BÚSQUEDA EN TIEMPO REAL
function crearBuscador() {
    const container = document.querySelector('.container');
    if (!container) return;
    
    const buscadorHTML = `
        <div class="buscador" style="margin-bottom: 2rem; text-align: center;">
            <input type="text" id="buscar-producto" placeholder="🔍 Buscar productos..." 
                   style="padding: 12px 20px; border: 2px solid #ecf0f1; border-radius: 25px; width: 300px; font-size: 1rem; outline: none; transition: all 0.3s;">
        </div>
    `;
    
    const pageHeader = document.querySelector('.page-header');
    if (pageHeader) {
        pageHeader.insertAdjacentHTML('afterend', buscadorHTML);
        
        // Event listener para búsqueda
        document.getElementById('buscar-producto').addEventListener('input', buscarProductos);
        
        // Estilo focus para el buscador
        document.getElementById('buscar-producto').addEventListener('focus', function() {
            this.style.borderColor = '#3498db';
            this.style.boxShadow = '0 0 10px rgba(52, 152, 219, 0.3)';
        });
        
        document.getElementById('buscar-producto').addEventListener('blur', function() {
            this.style.borderColor = '#ecf0f1';
            this.style.boxShadow = 'none';
        });
    }
}

// Función de búsqueda
function buscarProductos() {
    const termino = this.value.toLowerCase();
    const productos = document.querySelectorAll('.producto-card');
    
    productos.forEach(producto => {
        const nombre = producto.querySelector('h3').textContent.toLowerCase();
        const specs = Array.from(producto.querySelectorAll('.producto-specs li'))
            .map(li => li.textContent.toLowerCase()).join(' ');
        
        if (nombre.includes(termino) || specs.includes(termino)) {
            producto.style.display = 'block';
            producto.style.animation = 'fadeIn 0.3s ease-in';
        } else {
            producto.style.display = 'none';
        }
    });
}

// 💝 LISTA DE DESEOS
let listaDeseos = JSON.parse(localStorage.getItem('listaDeseos')) || [];

function agregarBotonDeseos() {
    const productos = document.querySelectorAll('.producto-card');
    
    productos.forEach(producto => {
        const actions = producto.querySelector('.producto-actions');
        if (actions && !producto.querySelector('.btn-deseos')) {
            const btnDeseos = document.createElement('button');
            btnDeseos.className = 'btn-deseos';
            btnDeseos.innerHTML = '❤️';
            btnDeseos.style.cssText = `
                background: #f39c12; color: white; padding: 12px; border: none; 
                border-radius: 8px; cursor: pointer; transition: all 0.3s; font-size: 1rem;
            `;
            
            btnDeseos.addEventListener('click', function() {
                const nombre = producto.querySelector('h3').textContent;
                toggleDeseos(nombre, this);
            });
            
            actions.appendChild(btnDeseos);
        }
    });
}

function toggleDeseos(nombre, boton) {
    const index = listaDeseos.indexOf(nombre);
    
    if (index === -1) {
        listaDeseos.push(nombre);
        boton.style.background = '#e74c3c';
        boton.innerHTML = '💖';
        mostrarNotificacion(`💖 ${nombre} agregado a favoritos`);
    } else {
        listaDeseos.splice(index, 1);
        boton.style.background = '#f39c12';
        boton.innerHTML = '❤️';
        mostrarNotificacion(`💔 ${nombre} removido de favoritos`);
    }
    
    localStorage.setItem('listaDeseos', JSON.stringify(listaDeseos));
}

// 📱 COMPARADOR DE PRODUCTOS
let productosComparar = [];

function agregarBotonComparar() {
    const productos = document.querySelectorAll('.producto-card');
    
    productos.forEach(producto => {
        const actions = producto.querySelector('.producto-actions');
        if (actions && !producto.querySelector('.btn-comparar')) {
            const btnComparar = document.createElement('button');
            btnComparar.className = 'btn-comparar';
            btnComparar.innerHTML = '⚖️';
            btnComparar.style.cssText = `
                background: #9b59b6; color: white; padding: 12px; border: none; 
                border-radius: 8px; cursor: pointer; transition: all 0.3s; font-size: 1rem;
            `;
            
            btnComparar.addEventListener('click', function() {
                const nombre = producto.querySelector('h3').textContent;
                const precio = producto.querySelector('.precio-actual').textContent;
                const specs = Array.from(producto.querySelectorAll('.producto-specs li'))
                    .map(li => li.textContent);
                
                agregarAComparar({nombre, precio, specs});
            });
            
            actions.appendChild(btnComparar);
        }
    });
}

function agregarAComparar(producto) {
    if (productosComparar.length >= 3) {
        alert('⚖️ Máximo 3 productos para comparar\n\nPrimero remueve alguno de la comparación');
        return;
    }
    
    if (productosComparar.find(p => p.nombre === producto.nombre)) {
        alert('📱 Este producto ya está en la comparación');
        return;
    }
    
    productosComparar.push(producto);
    mostrarNotificacion(`⚖️ ${producto.nombre} agregado a comparación (${productosComparar.length}/3)`);
    
    if (productosComparar.length >= 2) {
        setTimeout(() => {
            if (confirm('⚖️ ¿Quieres ver la comparación ahora?')) {
                mostrarComparacion();
            }
        }, 1000);
    }
}

function mostrarComparacion() {
    if (productosComparar.length < 2) {
        alert('⚖️ Necesitas al menos 2 productos para comparar');
        return;
    }
    
    let comparacion = '⚖️ COMPARACIÓN DE PRODUCTOS:\n\n';
    
    productosComparar.forEach((producto, index) => {
        comparacion += `${index + 1}. ${producto.nombre}\n`;
        comparacion += `   💰 ${producto.precio}\n`;
        comparacion += `   📋 Características:\n`;
        producto.specs.forEach(spec => {
            comparacion += `      • ${spec}\n`;
        });
        comparacion += '\n';
    });
    
    alert(comparacion);
    
    if (confirm('🗑️ ¿Limpiar comparación?')) {
        productosComparar = [];
        mostrarNotificacion('🧹 Comparación limpiada');
    }
}

// 🔔 SISTEMA DE NOTIFICACIONES
function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.textContent = mensaje;
    notificacion.style.cssText = `
        position: fixed; top: 100px; right: 20px; background: #2c3e50; color: white;
        padding: 15px 20px; border-radius: 10px; z-index: 10000; font-size: 0.9rem;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3); animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notificacion.remove(), 300);
    }, 3000);
}

// 🎨 ANIMACIONES OPTIMIZADAS
function agregarAnimaciones() {
    const style = document.createElement('style');
    style.textContent = `
        /* ANIMACIONES BÁSICAS */
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
        
        /* SOLO PARA PÁGINA PRINCIPAL */
        ${window.location.pathname.includes('index.html') || window.location.pathname === '/' ? `
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes bounceIn { 
            0% { opacity: 0; transform: scale(0.8); }
            100% { opacity: 1; transform: scale(1); }
        }
        
        body { animation: fadeIn 0.5s ease-out; }
        .hero { animation: fadeInUp 0.8s ease-out; }
        .feature-card { animation: scaleIn 0.5s ease-out; transition: transform 0.3s ease; }
        .feature-card:hover { transform: translateY(-8px); }
        .stat-item { animation: bounceIn 0.6s ease-out; }
        ` : ''}
        
        /* ANIMACIONES LIGERAS PARA PRODUCTOS */
        ${window.location.pathname.includes('productos.html') ? `
        .producto-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .producto-card:hover { transform: translateY(-5px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
        ` : ''}
        
        /* BOTONES SIMPLES */
        .cta-button, .btn-comprar, .btn-info, .submit-btn {
            transition: all 0.2s ease;
        }
        
        .cta-button:hover, .btn-comprar:hover, .btn-info:hover, .submit-btn:hover {
            transform: translateY(-2px);
        }
        
        /* LOADING SPINNER */
        .loading-spinner {
            width: 40px; height: 40px; border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db; border-radius: 50%;
            animation: spin 1s linear infinite; margin: 20px auto;
        }
        
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    `;
    document.head.appendChild(style);
}

// 🚀 MEJORAR FUNCIONALIDAD DE BOTONES EXISTENTES
function mejorarBotonesCompra() {
    document.querySelectorAll('.btn-comprar').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const producto = this.closest('.producto-card');
            const nombre = producto.querySelector('h3').textContent;
            const precio = producto.querySelector('.precio-actual').textContent;
            
            // Agregar al carrito
            carrito.push({nombre, precio});
            localStorage.setItem('carrito', JSON.stringify(carrito));
            actualizarContadorCarrito();
            
            // Animación del botón
            this.style.transform = 'scale(0.95)';
            this.textContent = '✅ Agregado';
            this.style.background = '#27ae60';
            
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                this.textContent = 'Comprar Ahora';
                this.style.background = '#27ae60';
            }, 1500);
            
            mostrarNotificacion(`🛒 ${nombre} agregado al carrito`);
        });
    });
}

// 📋 FUNCIONALIDAD BOTONES DE INFORMACIÓN
function agregarBotonesInfo() {
    document.querySelectorAll('.btn-info').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const producto = this.closest('.producto-card');
            const nombre = producto.querySelector('h3').textContent;
            const precio = producto.querySelector('.precio-actual').textContent;
            const specs = Array.from(producto.querySelectorAll('.producto-specs li'))
                .map(li => li.textContent).join('\n• ');
            
            const info = `📱 ${nombre}\n\n💰 Precio: ${precio}\n\n📋 Especificaciones:\n• ${specs}\n\n✅ Garantía: 2 años\n🚚 Envío: Gratis\n🔧 Soporte: 24/7`;
            
            alert(info);
        });
    });
}




// 📊 CONTADOR DE VISITAS
function contadorVisitas() {
    let visitas = localStorage.getItem('visitas') || 0;
    visitas++;
    localStorage.setItem('visitas', visitas);
    
}







// 🌙 MODO OSCURO
function agregarModoOscuro() {
    const navbar = document.querySelector('.navbar');
    const toggleHTML = `
        <button id="modo-oscuro" style="background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer; margin-left: 1rem;">
            🌙
        </button>
    `;
    navbar.insertAdjacentHTML('beforeend', toggleHTML);
    
    document.getElementById('modo-oscuro').addEventListener('click', function() {
        document.body.classList.toggle('modo-oscuro');
        this.textContent = document.body.classList.contains('modo-oscuro') ? '☀️' : '🌙';
        
        // Estilos para modo oscuro
        if (document.body.classList.contains('modo-oscuro')) {
            document.body.style.background = '#1a1a1a';
            document.body.style.color = '#fff';
            document.querySelectorAll('.producto-card').forEach(card => {
                card.style.background = '#2c2c2c';
                card.style.color = '#fff';
            });
        } else {
            document.body.style.background = '';
            document.body.style.color = '';
            document.querySelectorAll('.producto-card').forEach(card => {
                card.style.background = '';
                card.style.color = '';
            });
        }
    });
}

// 🌟 TRANSICIONES SIMPLES (SOLO PARA INDEX)
function iniciarTransicionPagina() {
    if (!window.location.pathname.includes('index.html') && window.location.pathname !== '/') {
        return; // No aplicar transiciones pesadas en productos
    }
    
    document.querySelectorAll('a[href$=".html"]').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.href && this.href !== window.location.href) {
                document.body.style.opacity = '0.8';
                document.body.style.transition = 'opacity 0.2s ease';
            }
        });
    });
}

// 🍔 MENÚ HAMBURGUESA
function inicializarMenuHamburguesa() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Cerrar menú al hacer clic en un enlace
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// 🎯 INICIALIZACIÓN OPTIMIZADA
document.addEventListener('DOMContentLoaded', function() {
    // Funcionalidades para todas las páginas
    crearCarrito();
    agregarAnimaciones();
    contadorVisitas();
    agregarModoOscuro();
    inicializarMenuHamburguesa();
    
    // Solo para página principal
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        iniciarTransicionPagina();
    }
    
    // Funcionalidades solo para página de productos
    if (document.querySelector('.productos-grid')) {
        crearBuscador();
        agregarBotonDeseos();
        agregarBotonComparar();
        mejorarBotonesCompra();
        agregarBotonesInfo();
        
        // Cargar estados guardados
        setTimeout(() => {
            listaDeseos.forEach(nombre => {
                const producto = Array.from(document.querySelectorAll('.producto-card'))
                    .find(p => p.querySelector('h3').textContent === nombre);
                if (producto) {
                    const btnDeseos = producto.querySelector('.btn-deseos');
                    if (btnDeseos) {
                        btnDeseos.style.background = '#e74c3c';
                        btnDeseos.innerHTML = '💖';
                    }
                }
            });
        }, 200);
    }
    
    actualizarContadorCarrito();
    
    // Mensaje de bienvenida simple
    setTimeout(() => {
        mostrarNotificacion('🎉 ¡Bienvenido a TechPhone!');
    }, 500);
    
    // Remover loader inicial
    setTimeout(() => {
        const loader = document.getElementById('pageLoader');
        if (loader) {
            loader.classList.add('hidden');
            setTimeout(() => loader.remove(), 300);
        }
    }, 400);
});

console.log('🚀 TechPhone JavaScript cargado - Funcionalidades activas: Carrito, Búsqueda, Favoritos, Comparador, Modo Oscuro, Animaciones Optimizadas');