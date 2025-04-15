document.addEventListener('DOMContentLoaded', function() {

    const form = document.getElementById('reservaForm');
    if (!form) return; 

    const nombreInput = document.getElementById('nombre');
    const apellidosInput = document.getElementById('apellidos');
    const dniInput = document.getElementById('dni');
    const telefonoInput = document.getElementById('telefono');
    const emailInput = document.getElementById('email');
    const fechaInput = document.getElementById('fecha');
    const horaInput = document.getElementById('hora');
    const modeloSelect = document.getElementById('modelo');
    const duracionInput = document.getElementById('duracion');
    const metodosPagoRadios = document.getElementsByName('metodoPago');
    const comprobanteInput = document.getElementById('comprobante');

    // Elementos de UI (Tu código original)
    const biciPreviewContainer = document.getElementById('biciPreviewContainer');
    const biciPreview = document.getElementById('biciPreview');
    const modeloSeleccionado = document.getElementById('modeloSeleccionado');
    const precioPorHoraDisplay = document.getElementById('precioPorDos');
    const resumenModelo = document.getElementById('resumenModelo');
    const resumenDuracion = document.getElementById('resumenDuracion');
    const resumenPrecioBase = document.getElementById('resumenPrecioBase');
    const resumenTotal = document.getElementById('resumenTotal');
    const yapleQrContainer = document.getElementById('yapleQrContainer');
    const comprobanteContainer = document.getElementById('comprobanteContainer');
    const cuentaBancariaContainer = document.getElementById('cuentaBancariaContainer');

    // Modal de Confirmación/Error (Tu código original, pero obtenemos más partes)
    const modal = document.getElementById('confirmacionModal');
    const modalTituloEl = modal ? modal.querySelector('h2') : null; 
    const modalMensajePrincipalEl = modal ? modal.querySelector('p:first-of-type') : null; 
    const modalMensajeSecundarioEl = modal ? modal.querySelector('p:nth-of-type(2)') : null; 
    const spanClose = modal ? modal.querySelector('.close') : null;
    const btnConfirmarAceptar = modal ? modal.querySelector('#btnConfirmar') : null;

    // --- Almacenamiento Temporal de Datos (Tu código original) ---
    let formData = JSON.parse(localStorage.getItem('reservaFormData')) || {};
    function guardarDatos() {
        formData = {
             nombre: nombreInput ? nombreInput.value : '',
             apellidos: apellidosInput ? apellidosInput.value : '',
             dni: dniInput ? dniInput.value : '',
             telefono: telefonoInput ? telefonoInput.value : '',
             email: emailInput ? emailInput.value : '',
             fecha: fechaInput ? fechaInput.value : '',
             hora: horaInput ? horaInput.value : '',
             modelo: modeloSelect ? modeloSelect.value : '',
             duracion: duracionInput ? duracionInput.value : ''
        };
        for (const radio of metodosPagoRadios) { if (radio.checked) formData.metodoPago = radio.value; }
        localStorage.setItem('reservaFormData', JSON.stringify(formData));
    }

    function cargarDatosAlmacenados() {
        if (Object.keys(formData).length > 0) {
            for (const key in formData) {
                const input = document.getElementById(key);
                if (input) {

                    if (!input.value) {
                         input.value = formData[key];
                    }
                    if (key === 'modelo' && formData[key]) {
                         if (typeof actualizarVistaPreviaBicicleta === 'function') {
                            actualizarVistaPreviaBicicleta();
                         }
                    }
                }
            }

            if (typeof calcularTotal === 'function') calcularTotal();
            if (typeof actualizarMetodoPago === 'function') {

                 // Restaurar selección de método de pago
                 for (const radio of metodosPagoRadios) {
                     if (radio.value === formData.metodoPago) {
                         radio.checked = true;
                         break; 
                     }
                 }
                 actualizarMetodoPago(); 
             }
        }
    }

     window.addEventListener('load', cargarDatosAlmacenados);

    // Función para mostrar/ocultar el modal y establecer su contenido
    function mostrarModal(titulo, mensajePrincipal, mensajeSecundario = "", esError = false) {
        if (modal && modalTituloEl && modalMensajePrincipalEl) {
            modalTituloEl.textContent = titulo;
            modalMensajePrincipalEl.textContent = mensajePrincipal;

            if (modalMensajeSecundarioEl) {
                 if (mensajeSecundario) {
                     modalMensajeSecundarioEl.textContent = mensajeSecundario;
                     modalMensajeSecundarioEl.style.display = 'block';
                 } else {
                     modalMensajeSecundarioEl.style.display = 'none';
                 }
            }

            modal.style.borderColor = esError ? '#dc3545' : ''; 
             if (btnConfirmarAceptar) { 
                 btnConfirmarAceptar.textContent = esError ? 'Entendido' : 'Aceptar';
             }

            modal.style.display = 'block';
        } else {
            console.error("Elementos del modal #confirmacionModal no encontrados.");
            alert(titulo + "\n" + mensajePrincipal + (mensajeSecundario ? "\n" + mensajeSecundario : "")); 
        }
    }

    function ocultarModal() {
        if (modal) modal.style.display = 'none';
    }

    if (spanClose) spanClose.onclick = ocultarModal;
    if (btnConfirmarAceptar) btnConfirmarAceptar.onclick = ocultarModal; 
    window.addEventListener('click', (event) => {
        if (modal && event.target == modal) ocultarModal();
    });


    function actualizarVistaPreviaBicicleta() { 
        const selectedOption = modeloSelect.options[modeloSelect.selectedIndex];
        if (selectedOption.value) {
            const imagenSrc = selectedOption.getAttribute('data-imagen');
            const precioBase = selectedOption.getAttribute('data-precio');
            const precioPorHora = parseFloat(precioBase || 0) / 2;
            if (biciPreview) biciPreview.src = imagenSrc;
            if (modeloSeleccionado) modeloSeleccionado.textContent = selectedOption.textContent;
            if (precioPorHoraDisplay) precioPorHoraDisplay.textContent = `S/. ${precioPorHora.toFixed(2)} por hora`;
            if (resumenModelo) resumenModelo.textContent = selectedOption.textContent;
            if (resumenPrecioBase) resumenPrecioBase.textContent = `S/. ${precioPorHora.toFixed(2)} por hora`;
            if (biciPreviewContainer) biciPreviewContainer.style.display = 'flex';
        } else {
             if (biciPreviewContainer) biciPreviewContainer.style.display = 'none';
             if (precioPorHoraDisplay) precioPorHoraDisplay.textContent = 'S/. 0.00';
             if (resumenModelo) resumenModelo.textContent = '-';
             if (resumenPrecioBase) resumenPrecioBase.textContent = 'S/. 0.00';
        }
        calcularTotal(); 
    }
    function calcularTotal() { 
        const selectedOption = modeloSelect.options[modeloSelect.selectedIndex];
        const duracion = parseInt(duracionInput.value) || 0;
        if (selectedOption.value && duracion > 0) {
            const precioBase = parseFloat(selectedOption.getAttribute('data-precio') || 0);
            const precioPorHora = precioBase / 2;
            const total = precioPorHora * duracion;
            if (resumenDuracion) resumenDuracion.textContent = `${duracion} hora${duracion > 1 ? 's' : ''}`;
            if (resumenTotal) resumenTotal.textContent = `S/. ${total.toFixed(2)}`;
        } else {
            if (resumenDuracion) resumenDuracion.textContent = '0 horas';
            if (resumenTotal) resumenTotal.textContent = 'S/. 0.00';
        }
    }
    function actualizarMetodoPago() { 
        let metodoPagoSeleccionado = '';
        for (const radio of metodosPagoRadios) { if (radio.checked) metodoPagoSeleccionado = radio.value; }
        if (cuentaBancariaContainer) cuentaBancariaContainer.style.display = (metodoPagoSeleccionado === 'transferencia') ? 'block' : 'none';
        if (comprobanteContainer) comprobanteContainer.style.display = (metodoPagoSeleccionado === 'transferencia') ? 'block' : 'none';
    }

    function limitarLetras(inputElement, maxLength) {
        let value = inputElement.value;
        let lettersOnly = value.replace(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]/g, '');
        let lettersCount = lettersOnly.replace(/\s/g, '').length;
        if (lettersCount > maxLength) {
            let currentLength = 0; let truncatedValue = '';
            for (let i = 0; i < lettersOnly.length; i++) {
                truncatedValue += lettersOnly[i];
                if (lettersOnly[i] !== ' ') currentLength++;
                if (currentLength >= maxLength) break;
            } lettersOnly = truncatedValue;
        }
        if (inputElement.value !== lettersOnly) inputElement.value = lettersOnly;
     }
    if (nombreInput) nombreInput.addEventListener('input', () => limitarLetras(nombreInput, 10));
    if (apellidosInput) apellidosInput.addEventListener('input', () => limitarLetras(apellidosInput, 10));
    if (dniInput) { dniInput.addEventListener('input', (e) => { let v = e.target.value.replace(/\D/g, ''); e.target.value = v.slice(0, 8); }); }
    if (telefonoInput) {
        telefonoInput.addEventListener('input', (e) => {
            let digits = e.target.value.replace(/\D/g, '');
            if (digits.length > 0 && !digits.startsWith('9')) digits = '9' + digits.substring(1);
            if (digits.length > 0 && !digits.startsWith('9')) digits = '';
            digits = digits.slice(0, 9);
            let formattedValue = '';
            if (digits.length > 6) formattedValue = digits.slice(0, 3) + ' ' + digits.slice(3, 6) + ' ' + digits.slice(6);
            else if (digits.length > 3) formattedValue = digits.slice(0, 3) + ' ' + digits.slice(3);
            else formattedValue = digits;
            if (e.target.value !== formattedValue) e.target.value = formattedValue;
        });
     }

    if (modeloSelect) modeloSelect.addEventListener('change', () => {
        actualizarVistaPreviaBicicleta(); 
        guardarDatos(); 
    });
    if (duracionInput) duracionInput.addEventListener('input', () => { 
        calcularTotal();
        guardarDatos(); 
    });
    for (const radio of metodosPagoRadios) {
        radio.addEventListener('change', () => {
            actualizarMetodoPago();
            guardarDatos(); 
        });
    }

    const allInputsForSave = form.querySelectorAll('input, select');
     allInputsForSave.forEach(input => {
        input.addEventListener('change', guardarDatos);
     });

    form.addEventListener('submit', function(e) {
        e.preventDefault(); 

        // Recolección de valores
        const nombre = nombreInput.value.trim();
        const apellidos = apellidosInput.value.trim();
        const dni = dniInput.value.trim();
        const telefono = telefonoInput.value.trim(); 
        const email = emailInput.value.trim();
        const fecha = fechaInput.value;
        const hora = horaInput.value;
        const modelo = modeloSelect.value;
        const duracion = duracionInput.value;
        let metodoPago = '';
        for (const radio of metodosPagoRadios) { if (radio.checked) metodoPago = radio.value; }
        const comprobanteFile = comprobanteInput ? comprobanteInput.files[0] : null;

        // --- VALIDACIONES ESTRICTAS ---
        const nombreSinEspacios = nombre.replace(/\s/g, '');
        if (!/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/.test(nombre) || nombreSinEspacios.length === 0) return mostrarModal('Error en Datos', 'Nombre: Solo se permiten letras y no puede estar vacío.', "", true);
        if (nombreSinEspacios.length > 10) return mostrarModal('Error en Datos', 'Nombre: No debe exceder las 10 letras (sin contar espacios).', "", true);
        const apellidosSinEspacios = apellidos.replace(/\s/g, '');
        if (!/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/.test(apellidos) || apellidosSinEspacios.length === 0) return mostrarModal('Error en Datos', 'Apellidos: Solo se permiten letras y no puede estar vacío.', "", true);
        if (apellidosSinEspacios.length > 10) return mostrarModal('Error en Datos', 'Apellidos: No deben exceder las 10 letras (sin contar espacios).', "", true);
        if (!/^[0-9]{8}$/.test(dni)) return mostrarModal('Error en Datos', 'DNI: Debe contener exactamente 8 números.', "", true);
        if (!['0', '1', '4', '6', '7'].includes(dni.charAt(0))) return mostrarModal('Error en Datos', 'DNI: El primer dígito no es válido (debe ser 0, 1, 4, 6 o 7).', "", true);
        const telefonoSinEspacios = telefono.replace(/\s+/g, '');
         if (!/^[9][0-9]{8}$/.test(telefonoSinEspacios)) return mostrarModal('Error en Datos', 'Teléfono: Debe ser un celular válido de 9 dígitos que empiece con 9.', "", true);
        const regexCorreo = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        if (!regexCorreo.test(email)) return mostrarModal('Error en Datos', 'Correo Electrónico: El formato no es válido.', "", true);
        if (!fecha) return mostrarModal('Error en Reserva', 'Debe seleccionar una Fecha de Reserva.', "", true);
        const hoy = new Date();
        const fechaSeleccionada = new Date(fecha + 'T' + (hora || '00:00')); 
        hoy.setHours(0, 0, 0, 0); 

        // Ajustar la fecha seleccionada a medianoche local para evitar problemas de zona horaria en la comparación de fechas pasadas
        const fechaSeleccionadaMedianoche = new Date(fecha);
        fechaSeleccionadaMedianoche.setHours(0,0,0,0);

        if (fechaSeleccionadaMedianoche < hoy) {
             return mostrarModal('Error en Reserva', 'La Fecha de Reserva no puede ser una fecha pasada.', "", true);
        }
        if (!hora) return mostrarModal('Error en Reserva', 'Debe seleccionar una Hora de Reserva.', "", true);
        if (!modelo) return mostrarModal('Error en Reserva', 'Debe seleccionar un Modelo de Bicicleta.', "", true);
        const duracionNum = parseInt(duracion);
        if (isNaN(duracionNum) || duracionNum < 1 || duracionNum > 20) return mostrarModal('Error en Reserva', 'La Duración del Alquiler debe ser un número entre 1 y 20 horas.', "", true);
        if (!metodoPago) return mostrarModal('Error en Pago', 'Debe seleccionar un Método de Pago.', "", true);
        if (metodoPago === 'transferencia' && !comprobanteFile)


        console.log("Formulario válido. Datos (simulado):", { nombre, apellidos, dni, telefono: telefonoSinEspacios, email, fecha, hora, modelo, duracion: duracionNum, metodoPago, comprobante: comprobanteFile ? comprobanteFile.name : 'N/A' });

        mostrarModal('Reserva Exitosa',
                     'Su reserva o alquiler ha sido realizada con éxito.',
                     'Recibirá un correo de confirmación (simulado).');

        localStorage.removeItem('reservaFormData');
        form.reset();

        actualizarVistaPreviaBicicleta(); 
        actualizarMetodoPago(); 

    });

    // Verificar si el usuario está logueado
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    if (!isLoggedIn) {

        window.location.href = 'Login.html';
        return; 
    }

    actualizarVistaPreviaBicicleta();
    actualizarMetodoPago();

}); 