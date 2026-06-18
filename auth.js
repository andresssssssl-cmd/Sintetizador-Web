// ==========================================
// CONFIGURACIÓN E IMPORTACIÓN DE FIREBASE
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDD6QEHD3qjWbzVvOo3y9m2awcxdT_J4zs",
    authDomain: "sintetizador-modular-adlt.firebaseapp.com",
    projectId: "sintetizador-modular-adlt",
    storageBucket: "sintetizador-modular-adlt.firebasestorage.app",
    messagingSenderId: "806800674827",
    appId: "1:806800674827:web:a206d32311d68437a1f70e",
    measurementId: "G-W5S0T6ZMH1"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Iniciar proveedor de Google
const googleProvider = new GoogleAuthProvider();

// ==========================================
// LÓGICA DE LA INTERFAZ DE AUTENTICACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const toggleAuthBtn = document.getElementById('toggle-auth');
    const authTitle = document.getElementById('auth-title');
    const authBtn = document.getElementById('auth-btn');
    const registerFields = document.getElementById('register-fields');
    const authForm = document.getElementById('auth-form');
    
    let isLoginMode = true;

    // Alternar entre Iniciar Sesión y Registro
    const toggleMode = () => {
        isLoginMode = !isLoginMode;
        if (isLoginMode) {
            authTitle.innerText = 'Iniciar Sesión';
            authBtn.innerText = 'Ingresar al Sintetizador';
            registerFields.classList.add('hidden');
            toggleAuthBtn.parentElement.innerHTML = '¿No tienes cuenta? <span id="toggle-auth">Regístrate aquí</span>';
        } else {
            authTitle.innerText = 'Crear Cuenta';
            authBtn.innerText = 'Registrarse';
            registerFields.classList.remove('hidden');
            toggleAuthBtn.parentElement.innerHTML = '¿Ya tienes cuenta? <span id="toggle-auth">Inicia sesión aquí</span>';
        }
        // Reconectar el evento al nuevo enlace generado
        document.getElementById('toggle-auth').addEventListener('click', toggleMode);
    };

    document.getElementById('toggle-auth').addEventListener('click', toggleMode);

    // Evitar que el sintetizador suene mientras escribes en los campos de texto
    document.querySelectorAll('#auth-form input').forEach(input => {
        input.addEventListener('keydown', e => e.stopPropagation());
        input.addEventListener('keyup', e => e.stopPropagation());
    });

    // Procesar el formulario con Firebase
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('auth-email').value;
        const password = document.getElementById('auth-password').value;

        try {
            authBtn.innerText = "Cargando...";
            authBtn.disabled = true;

            if (isLoginMode) {
                // --- INICIAR SESIÓN ---
                await signInWithEmailAndPassword(auth, email, password);
                abrirSintetizador();
            } else {
                // --- REGISTRO DE USUARIO ---
                const nombre = document.getElementById('reg-name').value.trim();
                const apellido = document.getElementById('reg-lastname').value.trim();
                const pais = document.getElementById('reg-country').value.trim();

                // Validación para hacer los campos obligatorios
                if (nombre === "" || apellido === "" || pais === "") {
                    alert("Por favor, completa todos los campos (Nombres, Apellidos y País) para poder registrarte.");
                    authBtn.innerText = 'Registrarse';
                    authBtn.disabled = false;
                    return; // Detiene el proceso aquí para que el usuario llene los datos
                }

                // 1. Crear usuario en Firebase Auth
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // 2. Guardar datos adicionales en Firestore
                await setDoc(doc(db, "usuarios", user.uid), {
                    nombres: nombre,
                    apellidos: apellido,
                    pais: pais,
                    email: email,
                    fechaRegistro: new Date().toISOString()
                });

                abrirSintetizador();
            }
        } catch (error) {
            console.error("Error de Firebase:", error.code);
            if (error.code === 'auth/email-already-in-use') alert("Este correo ya está registrado.");
            else if (error.code === 'auth/invalid-credential') alert("Correo o contraseña incorrectos.");
            else if (error.code === 'auth/weak-password') alert("La contraseña debe tener al menos 6 caracteres.");
            else alert("Ocurrió un error: " + error.message);
        } finally {
            authBtn.innerText = isLoginMode ? 'Ingresar al Sintetizador' : 'Registrarse';
            authBtn.disabled = false;
        }
    });

    // Función para ocultar el Login y mostrar el Sintetizador
    function abrirSintetizador() {
        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('synth-app').classList.remove('hidden');
    }
// ==========================================
    // LÓGICA DE RECUPERACIÓN DE CONTRASEÑA
    // ==========================================
    const forgotPassBtn = document.getElementById('forgot-pass-btn');

    // Ocultar el botón de recuperar contraseña si estamos en modo "Registro"
    document.getElementById('toggle-auth').addEventListener('click', () => {
        if (isLoginMode) {
            forgotPassBtn.classList.remove('hidden');
        } else {
            forgotPassBtn.classList.add('hidden');
        }
    });

    // Acción al hacer clic en "¿Olvidaste tu contraseña?"
    forgotPassBtn.addEventListener('click', async () => {
        const email = document.getElementById('auth-email').value;
        
        // Exigir que el correo esté escrito antes de enviar el enlace
        if (!email) {
            alert("Por favor, ingresa tu correo electrónico en la casilla de arriba y vuelve a hacer clic aquí.");
            return;
        }

        try {
            forgotPassBtn.innerText = "Enviando...";
            await sendPasswordResetEmail(auth, email);
            alert("¡Enlace enviado! Revisa tu bandeja de entrada (y la carpeta de spam) para restablecer tu contraseña.");
        } catch (error) {
            console.error("Error al enviar correo de recuperación:", error.code);
            if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email') {
                alert("No hay ningún usuario registrado con ese correo.");
            } else {
                alert("Ocurrió un error: " + error.message);
            }
        } finally {
            forgotPassBtn.innerText = "¿Olvidaste tu contraseña?";
        }
    });
});

// ==========================================
    // LÓGICA DE INGRESO CON GOOGLE
    // ==========================================
    const googleBtn = document.getElementById('google-btn');

    googleBtn.addEventListener('click', async () => {
        try {
            googleBtn.innerText = "Conectando...";
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Guardar o actualizar los datos del usuario de Google en Firestore
            // Usamos { merge: true } para no borrar datos si el usuario ya existía
            await setDoc(doc(db, "usuarios", user.uid), {
                nombres: user.displayName || "Usuario de Google",
                email: user.email,
                ultimoAcceso: new Date().toISOString()
            }, { merge: true });

            abrirSintetizador();
        } catch (error) {
            console.error("Error con Google:", error.code);
            alert("Hubo un problema al conectar con Google: " + error.message);
        } finally {
            googleBtn.innerHTML = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></svg> Continuar con Google`;
        }
    });