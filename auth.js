import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
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

/* 🔥 ADMIN */
const ADMIN_EMAIL = "pl017barbosa@gmail.com";

/* ELEMENTOS */
const loginLink = document.getElementById("login-link");
const footerLogin = document.getElementById("footer-login-link");
const userMenu = document.getElementById("user-menu");
const userName = document.getElementById("user-name");
const userPhoto = document.getElementById("user-photo");
const adminLink = document.getElementById("admin-link"); // ✅ FIX AQUI

/* LOGIN */
document.getElementById("google-login")?.addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    await fetch("set_session.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email })
    });

    location.href = "index.html";

  } catch (e) {
    console.error(e);
  }
});

/* STATE */
onAuthStateChanged(auth, (user) => {

  if (!user) {
    if (loginLink) loginLink.style.display = "block";
    if (footerLogin) footerLogin.style.display = "block";
    if (userMenu) userMenu.style.display = "none";
    if (adminLink) adminLink.style.display = "none";
    return;
  }

  // UI normal
  if (loginLink) loginLink.style.display = "none";
  if (footerLogin) footerLogin.style.display = "none";
  if (userMenu) userMenu.style.display = "flex";

  if (userName) userName.textContent = user.displayName || "Utilizador";
  if (userPhoto) userPhoto.src = user.photoURL || "img/Logo.png";

  console.log("EMAIL DETECTADO:", user.email);

  /* 🔥 ADMIN CHECK FORTE */
  const email = (user.email || "").toLowerCase();
  const admin = ADMIN_EMAIL.toLowerCase();

  if (adminLink) {
    if (email === admin) {
      adminLink.classList.remove("d-none");
      adminLink.style.display = "block";
      console.log("ADMIN LIBERADO");
    } else {
      adminLink.classList.add("d-none");
      adminLink.style.display = "none";
      console.log("ADMIN BLOQUEADO");
    }
  }
});

/* LOGOUT */
document.addEventListener("click", async (e) => {
  if (e.target.id === "logout-btn") {
    await signOut(auth);
    location.reload();
  }
});
