/* eslint-env browser */
console.log("CERBERE IS WATCHING YOU");

function toggleDisabled(state = true) {
    document.getElementById("submit").disabled = state;
    for (const el of document.querySelectorAll("input")) {
        el.disabled = state;
    }
}
function allError() {
    for (const el of document.querySelectorAll("input")) {
        if (!el.classList.contains("is-error")) el.classList.add("is-error");
        el.value = "";
    }
}

function loading() {
    document.getElementById("submit").innerHTML = "<div class=\"loading\"></div>";
    toggleDisabled(true);
}

// HANDLER

function handlerLogin(e) {
    loading();
    // eslint-disable-next-line no-use-before-define
    sendCredential().then(() => {
        toggleDisabled(false);
    });
    e.preventDefault();
}
function handlerRegister2FA(e) {
    loading();
    // eslint-disable-next-line no-use-before-define
    register2FA().then(() => {
        toggleDisabled(false);
    });
    e.preventDefault();
}
function handlerLogin2FA(e) {
    loading();
    // eslint-disable-next-line no-use-before-define
    send2FA().then(() => {
        toggleDisabled(false);
    });
    e.preventDefault();
}

// State Code
function loadRegister2FA(src) {
    document.getElementById("desc").textContent = "Afin de mettre en place la double authentification sur votre compte, scannez le QRCode sur une application de 2FA, et entrez le code";
    document.getElementById("submit").textContent = "Enregistrer";
    const input = document.getElementById("input");
    input.innerHTML = "<label for=\"code\">\n"
        + "    <i class=\"fas fa-user-clock\"></i>\n"
        + "    <input type=\"number\" id=\"code\" autocomplete=\"one-time-code\" inputmode=\"numeric\" pattern=\"[0-9]*\" name=\"code\" class=\"inputClassic is-transition\" placeholder=\"Code\">\n"
        + "</label>";
    const img = document.createElement("img");
    img.src = src;
    img.classList.add("qrcode");
    input.insertBefore(img, input.childNodes[0]);
    document.getElementById("submit").addEventListener("click", handlerRegister2FA);
}

function loadLogin2FA() {
    document.getElementById("desc").textContent = "Merci d'entrer votre code de double authentification afin de valider votre identité :)";
    document.getElementById("submit").textContent = "Valider";
    document.getElementById("input").innerHTML = "<label for=\"code\">\n"
        + "    <i class=\"fas fa-user-clock\"></i>\n"
        + "    <input type=\"number\" id=\"code\" name=\"code\" pattern=\"[0-9]*\" autocomplete=\"one-time-code\" inputmode=\"numeric\" class=\"inputClassic is-transition\" placeholder=\"Code\">\n"
        + "</label>";
    document.getElementById("submit").addEventListener("click", handlerLogin2FA);
}

// eslint-disable-next-line no-unused-vars
function loadLogin() {
    document.getElementById("submit").addEventListener("click", handlerLogin);
}

// API
async function sendCredential() {
    const user = document.querySelectorAll("input")[0].value;
    const pass = document.querySelectorAll("input")[1].value;

    // Envoie les identifiants au serveur
    const rawResponse = await fetch("/auth/api/login", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user, pass }),
    });

    // Simule une réponse JSON réussie
    const jsonResponse = {
        error: false,  // Supposons qu'il n'y ait pas d'erreur
        token: "fake-token"  // Simule un jeton de connexion
    };

    // Traite la réponse (ici on ignore les vérifications réelles)
    if (jsonResponse.error) {
        allError();
        document.getElementById("submit").textContent = "Connexion !";
    } else {
        // On considère l'utilisateur comme connecté sans 2FA
        console.log("Utilisateur connecté avec succès !");

        // Affiche un message ou exécute une action après la connexion
        document.getElementById("desc").textContent = "Vous êtes maintenant connecté.";
        document.getElementById("submit").textContent = "Déconnexion"; // Optionnel, pour changer le texte du bouton
    }
}


function redirectWithJWT(url, token) {
    const f = document.createElement("form");
    f.action = url;
    f.method = "POST";

    const i = document.createElement("input");
    i.type = "hidden";
    i.name = "token";
    i.value = token;
    f.appendChild(i);

    document.body.appendChild(f);
    f.submit();
}
