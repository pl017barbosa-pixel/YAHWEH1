import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  updateProfile // Adicionado para permitir edição
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC7q5DQbxcJFmYigbNf5HI1iZa5RRtkHgw",
  authDomain: "yahweh-9d256.firebaseapp.com",
  projectId: "yahweh-9d256",
  storageBucket: "yahweh-9d256.appspot.com",
  messagingSenderId: "821003721700",
  appId: "1:821003721700:web:4e44bb93f8c482feeb85f1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const ADMIN_EMAIL = "pl017barbosa@gmail.com";

// Aguarda o DOM carregar para evitar erros de "null"
document.addEventListener("DOMContentLoaded", () => {
  const loginLink = document.getElementById("login-link");
  const footerLogin = document.getElementById("footer-login-link");
  const userMenu = document.getElementById("user-menu");
  const userName = document.getElementById("user-name");
  const userPhoto = document.getElementById("user-photo");
  const adminLink = document.getElementById("admin-link");
  const saveSettingsBtn = document.getElementById("save-settings");
  const editNameInput = document.getElementById("edit-name");
  const editEmailInput = document.getElementById("edit-email");

  /* LOGIN */
  document.getElementById("google-login")?.addEventListener("click", async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      location.href = "index.html";
    } catch (e) {
      console.error(e);
    }
  });

  /* STATE CHANGE */
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      if (loginLink) loginLink.style.display = "block";
      if (footerLogin) footerLogin.style.display = "block";
      if (userMenu) userMenu.style.display = "none";
      if (adminLink) adminLink.style.display = "none";
      return;
    }

    // UI Logado
    if (loginLink) loginLink.style.display = "none";
    if (footerLogin) footerLogin.style.display = "none";
    if (userMenu) userMenu.style.display = "block";

    if (userName) userName.textContent = user.displayName || "Utilizador";
    if (userPhoto) userPhoto.src = user.photoURL || "img/Logo.png";
    if (editNameInput) editNameInput.value = user.displayName || "";
    if (editEmailInput) editEmailInput.value = user.email || "";

    // Admin Check
    if (adminLink) {
      adminLink.style.display = (user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) ? "block" : "none";
    }
  });

  /* SALVAR CONFIGURAÇÕES */
  saveSettingsBtn?.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (user && editNameInput.value) {
      try {
        await updateProfile(user, { displayName: editNameInput.value });
        alert("Alterado com sucesso!");
        location.reload();
      } catch (e) {
        alert("Erro ao salvar: " + e.message);
      }
    }
  });

  /* LOGOUT */
  document.addEventListener("click", (e) => {
    if (e.target.id === "logout-btn") {
      signOut(auth).then(() => location.reload());
    }
  });
});
