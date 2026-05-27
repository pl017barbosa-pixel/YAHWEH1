import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
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


// 🔥 ESTADO GLOBAL (FUNCIONA EM TODAS AS PÁGINAS)
onAuthStateChanged(auth, (user) => {

  const loginLink = document.getElementById("login-link");
  const userMenu = document.getElementById("user-menu");

  if (!loginLink || !userMenu) return;

  if (user) {

    loginLink.classList.add("d-none");
    userMenu.classList.remove("d-none");

    document.getElementById("user-name").innerText = user.displayName;
    document.getElementById("user-photo").src = user.photoURL;

  } else {

    loginLink.classList.remove("d-none");
    userMenu.classList.add("d-none");
  }
});


// 🔥 LOGOUT GLOBAL
document.addEventListener("click", async (e) => {

  if (e.target.id === "logout-btn") {

    await signOut(auth);
    location.reload();
  }
});
