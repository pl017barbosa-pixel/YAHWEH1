import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// 🔥 FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyC7q5DQbxcJFmYigbNf5HI1iZa5RRtkHgw",
  authDomain: "yahweh-9d256.firebaseapp.com",
  projectId: "yahweh-9d256",
  storageBucket: "yahweh-9d256.firebasestorage.app",
  messagingSenderId: "821003721700",
  appId: "1:821003721700:web:4e44bb93f8c482feeb85f1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// 🔥 FUNÇÃO PARA GUARDAR DADOS NO MYSQL (COM DEPURAÇÃO)
async function persistirUsuarioNoMySQL(user) {
  const formData = new FormData();
  formData.append('email', user.email);
  formData.append('nome', user.displayName);

  try {
    const response = await fetch('save_user.php', {
      method: 'POST',
      body: formData
    });
    const resultado = await response.text();
    console.log("Resposta do servidor MySQL:", resultado); 
  } catch (error) {
    console.error("Erro na comunicação com o servidor:", error);
  }
}

// 🔥 TOAST SYSTEM
function showToast(type, title, text) {
  const container = document.getElementById("custom-toast");
  if (!container) return;
  const colors = { success: "#C8A96B", error: "#ff4d4d", logout: "#B39256", info: "#4da6ff" };
  const color = colors[type] || "#C8A96B";
  const toast = document.createElement("div");
  toast.style.cssText = `position:fixed; bottom:30px; right:30px; background:#111; border:1px solid ${color}; color:${color}; padding:15px 18px; border-radius:12px; font-family:Cinzel, serif; z-index:99999; box-shadow:0 0 25px rgba(0,0,0,0.6); animation: fadeIn 0.3s ease; min-width:220px;`;
  toast.innerHTML = `<div style="font-weight:700; margin-bottom:5px;">${title}</div><div style="font-size:0.9rem;">${text}</div>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// 🔥 ELEMENTOS
const loginBtn = document.getElementById("google-login");
const erro = document.getElementById("mensagem-erro");
const loginLink = document.getElementById("login-link");
const footerLogin = document.getElementById("footer-login-link");
const userMenu = document.getElementById("user-menu");
const userName = document.getElementById("user-name");
const userPhoto = document.getElementById("user-photo");

// 🔥 LOGIN GOOGLE
if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Chamada para salvar no MySQL
      await persistirUsuarioNoMySQL(user);

      showToast("success", "BEM-VINDO", `Login efetuado com sucesso, ${user.displayName}`);
      setTimeout(() => { window.location.href = "index.html"; }, 1200);
    } catch (error) {
      console.error(error);
      if (erro) { erro.style.display = "block"; erro.innerText = "⚠ Erro ao iniciar sessão."; }
      showToast("error", "ERRO DE LOGIN", "Não foi possível iniciar sessão.");
    }
  });
}

// 🔥 ESTADO GLOBAL
onAuthStateChanged(auth, (user) => {
  if (!loginLink || !userMenu) return;
  if (user) {
    loginLink.classList.add("d-none");
    userMenu.classList.remove("d-none");
    if (footerLogin) footerLogin.style.display = "none";
    if (userName) userName.innerText = user.displayName;
    if (userPhoto) userPhoto.src = user.photoURL;
  } else {
    loginLink.classList.remove("d-none");
    userMenu.classList.add("d-none");
    if (footerLogin) footerLogin.style.display = "block";
  }
});

// 🔥 CLICKS GLOBAIS
document.addEventListener("click", async (e) => {
  if (e.target.id === "logout-btn") {
    await signOut(auth);
    showToast("logout", "SESSÃO ENCERRADA", "Saiu da conta com sucesso.");
    setTimeout(() => { location.reload(); }, 1200);
  }
  if (e.target.id === "open-settings") {
    const user = auth.currentUser;
    if (!user) return;
    document.getElementById("edit-name").value = user.displayName || "";
    document.getElementById("edit-email").value = user.email || "";
  }
  if (e.target.id === "save-settings") {
    const user = auth.currentUser;
    if (!user) return;
    const newName = document.getElementById("edit-name").value;
    try {
      await updateProfile(user, { displayName: newName });
      showToast("success", "PERFIL ATUALIZADO", "Nome atualizado com sucesso.");
      setTimeout(() => { location.reload(); }, 1200);
    } catch (error) {
      showToast("error", "ERRO", "Não foi possível atualizar o nome.");
    }
  }
});
