document.addEventListener('DOMContentLoaded', () => {
    // --- Datos Simulados (Reemplazar con API/Backend en app real) ---
    const historialAlquileresCompleto = [
        { dniUsuario: "12345678", nombreUsuario: "Juan Perez", fechaRegistro: "2024-01-15", fechaAlquiler: "2024-03-20", horaAlquiler: "10:00", modeloBici: "Trek Marlin 5", duracion: 2, costoTotal: 18.00, estado: "Completado" },
        { dniUsuario: "12345678", nombreUsuario: "Juan Perez", fechaRegistro: "2024-01-15", fechaAlquiler: "2024-04-01", horaAlquiler: "14:30", modeloBici: "Electra Townie Path Go! 10D", duracion: 3, costoTotal: 15.00, estado: "Completado" },
        { dniUsuario: "12345678", nombreUsuario: "Juan Perez", fechaRegistro: "2024-01-15", fechaAlquiler: "2025-01-10", horaAlquiler: "09:00", modeloBici: "Specialized Allez Sport", duracion: 4, costoTotal: 28.00, estado: "Completado" },
        { dniUsuario: "12345678", nombreUsuario: "Juan Perez", fechaRegistro: "2024-01-15", fechaAlquiler: "2025-02-25", horaAlquiler: "11:00", modeloBici: "Trek Marlin 5", duracion: 1, costoTotal: 9.00, estado: "Completado" },
        { dniUsuario: "12345678", nombreUsuario: "Juan Perez", fechaRegistro: "2024-01-15", fechaAlquiler: "2025-04-05", horaAlquiler: "16:00", modeloBici: "Giant XTC SLR 2", duracion: 3, costoTotal: 30.00, estado: "Completado" },
        { dniUsuario: "87654321", nombreUsuario: "Maria Garcia", fechaRegistro: "2024-02-10", fechaAlquiler: "2024-05-15", horaAlquiler: "15:00", modeloBici: "Schwinn Surbuban Deluxe", duracion: 1, costoTotal: 8.50, estado: "Completado" },
        { dniUsuario: "87654321", nombreUsuario: "Maria Garcia", fechaRegistro: "2024-02-10", fechaAlquiler: "2025-03-01", horaAlquiler: "10:00", modeloBici: "Electra Townie Path Go! 10D", duracion: 5, costoTotal: 25.00, estado: "Completado" }
    ];

    const filtroDniInput = document.getElementById('filtro-dni');
    const filtroNombreInput = document.getElementById('filtro-nombre');
    const btnBuscar = document.getElementById('btn-buscar-historial');
    const btnMostrarTodo = document.getElementById('btn-mostrar-todo');
    const historialTbody = document.getElementById('historial-tbody');
    const mensajeNoHistorial = document.getElementById('mensaje-no-historial');
    const tablaContainer = document.getElementById('tabla-container');
    const infoUsuarioContainer = document.getElementById('info-usuario');
    const usuarioNombreSpan = document.getElementById('usuario-nombre');
    const usuarioDniSpan = document.getElementById('usuario-dni');
    const usuarioFechaRegistroSpan = document.getElementById('usuario-fecha-registro');
    const mensajeDescuentoDiv = document.getElementById('mensaje-descuento');

    function mostrarHistorial(alquileres) {
        historialTbody.innerHTML = '';

        if (!alquileres || alquileres.length === 0) {
            mensajeNoHistorial.style.display = 'block';
            tablaContainer.style.display = 'none';
            // No ocultamos la info del usuario si es el usuario logueado
            // infoUsuarioContainer.style.display = 'none';
            mensajeDescuentoDiv.style.display = 'none'; // Ocultar descuentos si no hay historial
        } else {
            mensajeNoHistorial.style.display = 'none';
            tablaContainer.style.display = 'block';
            // La info del usuario se muestra en cargarHistorialUsuarioLogueado
            // mostrarInfoUsuario(alquileres[0]); // No mostrar aquí si ya se mostró al cargar
            evaluarDescuentos(alquileres);

            alquileres.forEach(alquiler => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${formatearFecha(alquiler.fechaAlquiler)}</td>
                    <td>${alquiler.horaAlquiler}</td>
                    <td>${alquiler.modeloBici}</td>
                    <td>${alquiler.duracion}</td>
                    <td>S/. ${alquiler.costoTotal.toFixed(2)}</td>
                    <td>${alquiler.estado}</td>
                `;
                historialTbody.appendChild(fila);
            });
        }
    }

    function mostrarInfoUsuario(dni, nombre, apellidos, fechaRegistro) {
         if (dni && nombre && apellidos && fechaRegistro) {
            usuarioNombreSpan.textContent = `${nombre} ${apellidos}`;
            usuarioDniSpan.textContent = dni;
            usuarioFechaRegistroSpan.textContent = formatearFecha(fechaRegistro);
            infoUsuarioContainer.style.display = 'block';
        } else {
            infoUsuarioContainer.style.display = 'none';
        }
    }

     function evaluarDescuentos(alquileres) {
        const umbralRecurrente = 5;
        if (alquileres && alquileres.length >= umbralRecurrente) {
            mensajeDescuentoDiv.innerHTML = `¡Felicidades! Eres un cliente recurrente. Disfruta de un <strong>10% de descuento</strong> en tus próximos alquileres.`;
            mensajeDescuentoDiv.style.display = 'block';
        } else {
            mensajeDescuentoDiv.style.display = 'none';
        }
    }

    function filtrarHistorialUsuarioLogueado() {
        const dniUsuario = localStorage.getItem('userDNI');
        if (!dniUsuario) return []; // Si no hay DNI de usuario, devuelve vacío

        const nombreFiltro = filtroNombreInput.value.trim().toLowerCase(); // Ahora solo filtramos por nombre si es necesario

        const historialFiltrado = historialAlquileresCompleto.filter(alquiler => {
            // Asegurarse que el alquiler pertenece al usuario logueado
            if (alquiler.dniUsuario !== dniUsuario) {
                return false;
            }
            // Si hay texto en el filtro de nombre, aplicarlo (puedes filtrar por modelo, fecha, etc. aquí también)
            const nombreMatch = nombreFiltro ? alquiler.modeloBici.toLowerCase().includes(nombreFiltro) || alquiler.fechaAlquiler.includes(nombreFiltro) : true;
             // Ejemplo: buscar en modelo o fecha
             // const nombreMatch = nombreFiltro ? alquiler.nombreUsuario.toLowerCase().includes(nombreFiltro) : true; // Si buscaras por nombre de usuario (ya lo tenemos)

            return nombreMatch;
        });
        mostrarHistorial(historialFiltrado);
    }


     function formatearFecha(fechaString) {
         try {
            const partes = fechaString.split('-');
            if (partes.length === 3) {
                const [year, month, day] = partes;
                if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
                    return `${day}/${month}/${year}`;
                }
            }
            return fechaString;
         } catch (e) {
             return fechaString;
         }
     }

    function cargarHistorialUsuarioLogueado() {
        const dni = localStorage.getItem('userDNI');
        const nombre = localStorage.getItem('userName');
        const apellidos = localStorage.getItem('userLastName');
        const fechaRegistro = localStorage.getItem('userRegisterDate');

        if (dni && nombre && apellidos && fechaRegistro) {
            mostrarInfoUsuario(dni, nombre, apellidos, fechaRegistro);
            filtroDniInput.value = dni; // Pre-rellenar DNI
            filtroDniInput.disabled = true; // Deshabilitar filtro DNI
            filtroNombreInput.placeholder = "Buscar por Modelo o Fecha (YYYY-MM-DD)"; // Actualizar placeholder

            const historialUsuario = historialAlquileresCompleto.filter(a => a.dniUsuario === dni);
            mostrarHistorial(historialUsuario);
        } else {
            // No hay usuario logueado o faltan datos, mostrar mensaje general
             mensajeNoHistorial.innerHTML = '<p>Inicia sesión para ver tu historial de alquileres.</p>';
             mensajeNoHistorial.style.display = 'block';
             tablaContainer.style.display = 'none';
             infoUsuarioContainer.style.display = 'none';
             // Deshabilitar filtros si no hay usuario
             filtroDniInput.disabled = true;
             filtroNombreInput.disabled = true;
             btnBuscar.disabled = true;
             btnMostrarTodo.disabled = true;
        }
    }


    btnBuscar.addEventListener('click', filtrarHistorialUsuarioLogueado);

    filtroNombreInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            filtrarHistorialUsuarioLogueado();
        }
    });

    btnMostrarTodo.addEventListener('click', () => {
        // Limpia el filtro de nombre/modelo/fecha y recarga el historial completo del usuario
        filtroNombreInput.value = '';
        cargarHistorialUsuarioLogueado();
    });

    // --- Inicialización ---
    cargarHistorialUsuarioLogueado();

}); // Fin DOMContentLoaded