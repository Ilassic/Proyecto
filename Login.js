document.addEventListener('DOMContentLoaded', () => {
    // --- Selección de Elementos ---
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginFormSection = document.getElementById('login-form');
    const registerFormSection = document.getElementById('register-form');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Inputs de Registro
    const nombreInput = document.getElementById('nombre-register');
    const apellidosInput = document.getElementById('apellidos-register');
    const dniInput = document.getElementById('dni-register');
    const telefonoInput = document.getElementById('telefono-register');
    const emailInput = document.getElementById('email-register');
    const passwordInput = document.getElementById('password-register');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const termsCheckbox = document.getElementById('terms');

    // Inputs de Login
    const emailLoginInput = document.getElementById('email-login');
    const passwordLoginInput = document.getElementById('password-login');

    // Checkboxes Mostrar Contraseña
    const showPasswordLogin = document.getElementById('show-password-login');
    const showPasswordRegister = document.getElementById('show-password-register');

    // Link Olvidaste Contraseña
    const forgotPasswordLink = document.querySelector('.forgot-password');

    // --- Lógica para Cambiar Pestañas (Login/Registro) ---
    if (loginTab && registerTab && loginFormSection && registerFormSection) {
        loginTab.addEventListener('click', () => {
            loginTab.classList.add('active'); registerTab.classList.remove('active');
            loginFormSection.classList.add('active'); registerFormSection.classList.remove('active');
        });
        registerTab.addEventListener('click', () => {
            registerTab.classList.add('active'); loginTab.classList.remove('active');
            registerFormSection.classList.add('active'); loginFormSection.classList.remove('active');
        });
    }

    // --- Lógica para Mostrar/Ocultar Contraseña ---
    function setupShowPasswordToggle(checkbox, passwordField) {
        if (checkbox && passwordField) {
            checkbox.addEventListener('change', function () {
                passwordField.type = this.checked ? 'text' : 'password';
            });
        }
    }
    setupShowPasswordToggle(showPasswordLogin, passwordLoginInput);
    setupShowPasswordToggle(showPasswordRegister, passwordInput);
 
    function obtenerUsuariosRegistrados() {
        const usuarios = localStorage.getItem('usuariosRegistrados');
        return usuarios ? JSON.parse(usuarios) : {};
    }
    function guardarUsuario(email, userData) {
        const usuarios = obtenerUsuariosRegistrados();
        usuarios[email.toLowerCase()] = userData;

        localStorage.setItem('usuariosRegistrados', JSON.stringify(usuarios));
    }

    // --- Lógica del Modal Principal (Errores/Confirmaciones) ---
    const modal = document.getElementById('mensajeModal');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalMensaje = document.getElementById('modal-mensaje');
    const cerrarModalBtn = modal ? modal.querySelector('.close') : null;
    const aceptarBtn = modal ? modal.querySelector('#btnAceptar') : null;

    function mostrarModal(titulo, mensaje) {
        if (modal && modalTitulo && modalMensaje) {
            modalTitulo.textContent = titulo;
            modalMensaje.textContent = mensaje;
            modal.style.display = 'block';
        } else {
            console.error("Error: Elementos del modal 'mensajeModal' no encontrados.");
            alert(titulo + "\n" + mensaje); 
        }
    }
    function ocultarModal() {
        if (modal) modal.style.display = "none";
    }
    if (cerrarModalBtn) cerrarModalBtn.onclick = ocultarModal;
    if (aceptarBtn) aceptarBtn.onclick = ocultarModal;

    // --- Lógica del Modal de Recuperación de Contraseña ---
    function mostrarModalRecuperacion() {
        let recuperacionModal = document.getElementById('recuperacionModal');
        if (!recuperacionModal) {
             const modalHTML = `
            <div id="recuperacionModal" class="modal" style="display: none;">
                <div class="modal-content">
                    <span class="close-recovery">&times;</span>
                    <h2>Recuperar Contraseña</h2><p>Ingresa tu correo electrónico registrado.</p>
                    <form id="recuperarForm"><div class="form-group"><label for="recovery-email">Correo Electrónico:</label><input type="email" id="recovery-email" name="recovery-email" required></div><div class="modal-footer"><button type="submit" class="btn-confirmar">Enviar Instrucciones</button></div></form>
                </div></div>`;
             document.body.insertAdjacentHTML('beforeend', modalHTML);
             recuperacionModal = document.getElementById('recuperacionModal');
             const closeRecoveryBtn = recuperacionModal ? recuperacionModal.querySelector('.close-recovery') : null;
             if(closeRecoveryBtn) closeRecoveryBtn.onclick = () => { if(recuperacionModal) recuperacionModal.style.display = 'none'; };
             const recuperarForm = document.getElementById('recuperarForm');
             if(recuperarForm) {
                 recuperarForm.onsubmit = (e) => {
                    e.preventDefault();
                    const email = document.getElementById('recovery-email').value.trim().toLowerCase();
                    const usuarios = obtenerUsuariosRegistrados();
                    if(recuperacionModal) recuperacionModal.style.display = 'none';
                    mostrarModal(usuarios[email] ? 'Correo Enviado (Simulado)' : 'Correo No Encontrado', usuarios[email] ? `Si ${email} está registrado, se han enviado instrucciones.` : `El correo electrónico ${email} no se encuentra registrado.`);
                };
             }
        }
        if (recuperacionModal) recuperacionModal.style.display = 'block';
    }

     // --- Listener Global para Cerrar Modales al Hacer Clic Fuera ---
    window.addEventListener('click', (event) => {
        if (modal && event.target == modal) ocultarModal();
        const recuperacionModal = document.getElementById('recuperacionModal');
        if (recuperacionModal && event.target == recuperacionModal) recuperacionModal.style.display = "none";
    });

    // --- Validaciones y Formateo en Tiempo Real para Registro ---

    // Función auxiliar para limitar letras (excluyendo espacios)
    function limitarLetras(inputElement, maxLength) {
        let value = inputElement.value;
        let lettersOnly = value.replace(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]/g, ''); 
        let lettersCount = lettersOnly.replace(/\s/g, '').length; 

        if (lettersCount > maxLength) {
            let currentLength = 0;
            let truncatedValue = '';
            for (let i = 0; i < lettersOnly.length; i++) {
                truncatedValue += lettersOnly[i];
                if (lettersOnly[i] !== ' ') {
                    currentLength++;
                }
                if (currentLength >= maxLength) {
                    break;
                }
            }
             lettersOnly = truncatedValue;
        }
         // Actualizar valor solo si cambió para evitar bucles infinitos
        if (inputElement.value !== lettersOnly) {
            inputElement.value = lettersOnly;
        }
    }

    // Nombre: Solo letras, max 10 (sin espacios)
    if (nombreInput) {
        nombreInput.addEventListener('input', () => limitarLetras(nombreInput, 10));
    }

    // Apellidos: Solo letras, max 10 (sin espacios)
    if (apellidosInput) {
        apellidosInput.addEventListener('input', () => limitarLetras(apellidosInput, 10));
    }

    // DNI: Solo números, max 8
    if (dniInput) {
        dniInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, ''); 
            e.target.value = value.slice(0, 8); 
        });
    }

    if (telefonoInput) {
        telefonoInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, ''); 

            if (value.length > 0 && !value.startsWith('9')) {
                value = '9' + value.substring(1); 
            }
       
             if (value.length > 0 && !value.startsWith('9')){
                 value = ''; 
             }


            digits = value.slice(0, 9); 

            let formattedValue = '';
            if (digits.length > 6) formattedValue = digits.slice(0, 3) + ' ' + digits.slice(3, 6) + ' ' + digits.slice(6);
            else if (digits.length > 3) formattedValue = digits.slice(0, 3) + ' ' + digits.slice(3);
            else formattedValue = digits;

             if (e.target.value !== formattedValue) {
                e.target.value = formattedValue;
             }
        });
    }

     if(passwordInput){
     }
     
     if(confirmPasswordInput){
     }


    // --- Listener para el Formulario de Inicio de Sesión ---
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const correo = emailLoginInput.value.trim();
            const password = passwordLoginInput.value.trim();
            const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

            if (!regexCorreo.test(correo)) return mostrarModal('Error', 'Correo electrónico no válido.');
            if (!password) return mostrarModal('Error', 'Por favor, ingrese su contraseña.');

            const usuarios = obtenerUsuariosRegistrados();
            const usuarioRegistrado = usuarios[correo.toLowerCase()];

            if (usuarioRegistrado && usuarioRegistrado.password === password) {
                localStorage.setItem('loggedIn', 'true');
                localStorage.setItem('userEmail', usuarioRegistrado.email);
                localStorage.setItem('userDNI', usuarioRegistrado.dni);
                localStorage.setItem('userName', usuarioRegistrado.nombre);
                localStorage.setItem('userLastName', usuarioRegistrado.apellidos);
                localStorage.setItem('userRegisterDate', usuarioRegistrado.fechaRegistro);
                mostrarModal('¡Inicio de Sesión Exitoso!', 'Serás redirigido a la pantalla correspondiente para que puedas reservar el alquiler de tu bicicleta.');
                setTimeout(() => { window.location.href = "Reser-Alqui.html"; }, 2000);
            } else {
                mostrarModal('Error de Inicio de Sesión', 'El correo electrónico o la contraseña son incorrectos.');
            }
        });
    }

    // --- Listener para el Formulario de Registro (Validación Final) ---
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            // Obtener valores finales
            const nombre = nombreInput.value.trim();
            const apellidos = apellidosInput.value.trim();
            const dni = dniInput.value.trim(); 
            const telefono = telefonoInput.value.trim(); 
            const correo = emailInput.value.trim().toLowerCase();
            const password = passwordInput.value; // Sin trim para contraseñas
            const confirmPassword = confirmPasswordInput.value;
            const terms = termsCheckbox.checked;

            // 1. Nombre
            const nombreSinEspacios = nombre.replace(/\s/g, '');
            if (!/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/.test(nombre) || nombreSinEspacios.length === 0) {
                return mostrarModal('Error de Registro', 'Nombre: Solo se permiten letras y no puede estar vacío.');
            }
            if (nombreSinEspacios.length > 10) {
                 return mostrarModal('Error de Registro', 'Nombre: No debe exceder las 10 letras (sin contar espacios).');
            }

            // 2. Apellidos
            const apellidosSinEspacios = apellidos.replace(/\s/g, '');
            if (!/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/.test(apellidos) || apellidosSinEspacios.length === 0) {
                 return mostrarModal('Error de Registro', 'Apellidos: Solo se permiten letras y no puede estar vacío.');
            }
            if (apellidosSinEspacios.length > 10) {
                 return mostrarModal('Error de Registro', 'Apellidos: No deben exceder las 10 letras (sin contar espacios).');
            }

            // 3. DNI
            if (!/^[0-9]{8}$/.test(dni)) { // Exactamente 8 dígitos
                return mostrarModal('Error de Registro', 'DNI: Debe contener exactamente 8 números.');
            }
            const primerDigitoDNI = dni.charAt(0);
            if (!['0', '1', '4', '6', '7'].includes(primerDigitoDNI)) {
                return mostrarModal('Error de Registro', 'DNI: El primer dígito no es válido (debe ser 0, 1, 4, 6 o 7).');
            }

            // 4. Teléfono
            const telefonoSinEspacios = telefono.replace(/\s+/g, '');
             if (!/^[9][0-9]{8}$/.test(telefonoSinEspacios)) { // Empieza con 9 y tiene 8 dígitos más
                 return mostrarModal('Error de Registro', 'Teléfono: Debe ser un celular válido de 9 dígitos que empiece con 9.');
             }

            const regexCorreo = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
            if (!regexCorreo.test(correo)) {
                return mostrarModal('Error de Registro', 'Correo Electrónico: El formato no es válido.');
            }

             // 6. Contraseña
             if (password.length !== 12) {
                 return mostrarModal('Error de Registro', 'Contraseña: Debe tener exactamente 12 caracteres.');
             }

             // 7. Confirmar Contraseña
             if (password !== confirmPassword) {
                 return mostrarModal('Error de Registro', 'Confirmar Contraseña: Las contraseñas no coinciden.');
             }

             // 8. Términos y Condiciones
             if (!terms) {
                 return mostrarModal('Error de Registro', 'Debes aceptar los Términos y Condiciones.');
             }

             // --- Fin Validaciones ---


            // Verificar si email ya existe (después de pasar todas las validaciones)
            const usuarios = obtenerUsuariosRegistrados();
            if (usuarios[correo]) {
                return mostrarModal('Error de Registro', 'Este correo electrónico ya está registrado. Intenta iniciar sesión.');
            }

            const fechaRegistro = new Date().toISOString().split('T')[0];
            const nuevoUsuario = {
                nombre: nombre,
                apellidos: apellidos,
                dni: dni,
                telefono: telefonoSinEspacios, 
                email: correo,
                password: password, 
                fechaRegistro: fechaRegistro
            };
            guardarUsuario(correo, nuevoUsuario);

            // Iniciar sesión automáticamente tras registro
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('userEmail', nuevoUsuario.email);
            localStorage.setItem('userDNI', nuevoUsuario.dni);
            localStorage.setItem('userName', nuevoUsuario.nombre);
            localStorage.setItem('userLastName', nuevoUsuario.apellidos);
            localStorage.setItem('userRegisterDate', nuevoUsuario.fechaRegistro);

            mostrarModal('¡Registro Exitoso!', 'Tu cuenta ha sido creada. Serás redirigido a la pantalla correspondiente para que puedas reservar el alquiler de tu bicicleta.');
            setTimeout(() => { window.location.href = "Reser-Alqui.html"; }, 2000);
        });
    }

    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            mostrarModalRecuperacion();
        });
    }

});