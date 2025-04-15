
document.addEventListener('DOMContentLoaded', () => {
    // Verificar si hay una sesión activa
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    const currentPage = window.location.pathname.split('/').pop();
    
    const protectedPages = ['Reser-Alqui.html' , 'Historial.html'];
    
    const publicPages = ['Login.html', 'Principal.html', 'ModeBici.html'];
    
    if (protectedPages.includes(currentPage) && !isLoggedIn) {

        window.location.href = 'Login.html';
    }
    
    if (currentPage === 'Login.html' && isLoggedIn) {
        window.location.href = 'Reser-Alqui.html';
    }
    
    updateNavigation(isLoggedIn);
});

function updateNavigation(isLoggedIn) {
    const nav = document.querySelector('nav ul');
    if (!nav) return;
    
    if (isLoggedIn) {
        // Usuario con sesión activa
        nav.innerHTML = `
            <li><a href="Principal.html">Inicio</a></li>
            <li><a href="ModeBici.html">Modelos de Bicicletas</a></li>
            <li><a href="Reser-Alqui.html">Reservas y Alquiler</a></li>
            <li><a href="Historial-Alq.html">Historial de Alquileres</a></li> 
            <li><a href="#" id="logout-link">Cerrar Sesión</a></li>
        `;
        
        // Agregar funcionalidad de cierre de sesión
        const logoutLink = document.getElementById('logout-link');
        if (logoutLink) {
            logoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('loggedIn');
                localStorage.removeItem('userEmail');
                window.location.href = 'Principal.html';
            });
        }
    } else {
        // Usuario sin sesión
        nav.innerHTML = `
            <li><a href="Principal.html">Inicio</a></li>
            <li><a href="ModeBici.html">Modelos de Bicicletas</a></li>
            <li><a href="Login.html">Iniciar Sesión</a></li>
        `;
    }
}