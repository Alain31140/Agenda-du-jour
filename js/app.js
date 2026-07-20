/* ==================================================
   AGENDA DU JOUR
   Point d'entrée principal de l'application
================================================== */


/* ==================================================
   CONFIGURATION
================================================== */

// Dépôt contenant les fichiers JSON et les images

// const DATA_URL = "data/";
//const DATA_URL =
//   "https://raw.githubusercontent.com/Alain31140/Agenda-data/main/json/";
const BASE_URL =
    "https://raw.githubusercontent.com/Alain31140/Agenda-data/main/";
const DATA_URL = BASE_URL + "json/";
const IMAGE_URL = BASE_URL + "images/";

/* ==================================================
   DÉMARRAGE DE L'APPLICATION
================================================== */

document.addEventListener(
    "DOMContentLoaded",
    demarrerApplication
);


/* ==================================================
   INITIALISATION
================================================== */

async function demarrerApplication() {

    console.log(
        "📅 Agenda du jour : démarrage"
    );

    const message =
        document.getElementById(
            "message-test"
        );

    if (message) {

        message.textContent =
            "⏳ Chargement des données de l’agenda…";

    }


    await chargerDonneesAccueil();
    afficherAccueil();

    if (window.location.hash === "#menu-principal") {

        setTimeout(() => {

            document
                .getElementById("menu-principal")
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

        }, 200);
}

    if (message) {

        message.textContent =
            "✅ Les données de l’Agenda du jour sont chargées.";

    }


    console.log(
        "Bibliothèque de données :",
        DATA_URL
    );

}