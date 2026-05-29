import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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

const ADMIN_EMAIL = "pl017@gmail.com";

// ELEMENTOS
const loginLink = document.getElementById("login-link");
const footerLogin = document.getElementById("footer-login-link");
const userMenu = document.getElementById("user-menu");
const userName = document.getElementById("user-name");
const userPhoto = document.getElementById("user-photo");

const adminItem = document.getElementById("admin-item");

// LOGIN
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

// STATE
onAuthStateChanged(auth, (user) => {

  if (user) {

    loginLink?.style && (loginLink.style.display = "none");
    footerLogin?.style && (footerLogin.style.display = "none");

    userMenu?.style && (userMenu.style.display = "flex");

    if (userName) userName.textContent = user.displayName || "Utilizador";
    if (userPhoto) {
      userPhoto.src = user.photoURL || "img/Logo.png";
    }

    // 🚨 REGRA FINAL DO ADMIN (IMPLACÁVEL)
    if (adminItem) {
      if (user.email === ADMIN_EMAIL) {
        adminItem.style.display = "block";
      } else {
        adminItem.style.display = "none";
      }
    }

  } else {

    loginLink?.style && (loginLink.style.display = "block");
    footerLogin?.style && (footerLogin.style.display = "block");

    userMenu?.style && (userMenu.style.display = "none");

    if (adminItem) adminItem.style.display = "none";
  }
});

// LOGOUT
document.addEventListener("click", async (e) => {
  if (e.target.id === "logout-btn") {
    await signOut(auth);
    location.reload();
  }
});
