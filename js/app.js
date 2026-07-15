/* ==================================================
   AGENDA DU JOUR
   Point d'entrée principal de l'application
================================================== */


/* ==================================================
   CONFIGURATION
================================================== */

// Dépôt contenant les fichiers JSON et les images

const DATA_URL =
    "https://raw.githubusercontent.com/Alain31140/repo/main/";


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


    if (message) {

        message.textContent =
            "✅ Les données de l’Agenda du jour sont chargées.";

    }


    console.log(
        "Bibliothèque de données :",
        DATA_URL
    );

}