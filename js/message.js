/* ==================================================
   PAGE MESSAGE
================================================== */


/*
    Remplacer cette adresse par l’URL
    du webhook fournie par Make.
*/

const WEBHOOK_MESSAGE =
    "COLLER_ICI_L_ADRESSE_DU_WEBHOOK_MAKE";


const formulaire =
    document.getElementById(
        "formulaire-message"
    );

const champPrenom =
    document.getElementById(
        "message-prenom"
    );

const champEmail =
    document.getElementById(
        "message-email"
    );

const champMessage =
    document.getElementById(
        "message-texte"
    );

const compteurCaracteres =
    document.getElementById(
        "message-nombre-caracteres"
    );

const zoneErreur =
    document.getElementById(
        "message-erreur"
    );

const boutonEnvoyer =
    document.getElementById(
        "message-envoyer"
    );

const texteBouton =
    document.getElementById(
        "message-bouton-texte"
    );

const confirmation =
    document.getElementById(
        "message-confirmation"
    );


/* ==================================================
   COMPTEUR DE CARACTÈRES
================================================== */

champMessage.addEventListener(
    "input",
    () => {

        compteurCaracteres.textContent =
            champMessage.value.length;
    }
);


/* ==================================================
   OUTILS
================================================== */

function afficherErreur(message) {

    zoneErreur.textContent =
        message;

    zoneErreur.hidden =
        false;
}


function masquerErreur() {

    zoneErreur.textContent =
        "";

    zoneErreur.hidden =
        true;
}


function emailValide(email) {

    if (!email) {
        return true;
    }

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
    );
}


function definirEnvoiEnCours(enCours) {

    boutonEnvoyer.disabled =
        enCours;

    texteBouton.textContent =
        enCours
            ? "Envoi en cours..."
            : "Envoyer le message";
}


/* ==================================================
   ORIGINE DU MESSAGE
================================================== */

function obtenirRubriqueOrigine() {

    const parametres =
        new URLSearchParams(
            window.location.search
        );

    return (
        parametres.get("depuis")
        || document.referrer
        || "Accès direct"
    );
}


/* ==================================================
   INFORMATIONS TECHNIQUES SIMPLES
================================================== */

function obtenirInformationsTechniques() {

    return {

        langue:
            navigator.language || "",

        navigateur:
            navigator.userAgent || "",

        tailleEcran:
            `${window.screen.width} × ${window.screen.height}`,

        page:
            window.location.href,

        origine:
            obtenirRubriqueOrigine()
    };
}


/* ==================================================
   PRÉPARATION DES DONNÉES
================================================== */

function creerDonneesMessage() {

    const maintenant =
        new Date();

    const informations =
        obtenirInformationsTechniques();

    return {

        application:
            "Agenda du Jour",

        version:
            "1.0",

        date:
            maintenant.toLocaleDateString(
                "fr-FR"
            ),

        heure:
            maintenant.toLocaleTimeString(
                "fr-FR",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                }
            ),

        prenom:
            champPrenom.value.trim(),

        email:
            champEmail.value.trim(),

        message:
            champMessage.value.trim(),

        origine:
            informations.origine,

        page:
            informations.page,

        langue:
            informations.langue,

        navigateur:
            informations.navigateur,

        tailleEcran:
            informations.tailleEcran
    };
}


/* ==================================================
   VALIDATION
================================================== */

function verifierFormulaire() {

    const email =
        champEmail.value.trim();

    const message =
        champMessage.value.trim();

    masquerErreur();

    if (!message) {

        afficherErreur(
            "Veuillez écrire un message avant de l’envoyer."
        );

        champMessage.focus();

        return false;
    }

    if (message.length < 3) {

        afficherErreur(
            "Votre message est un peu trop court."
        );

        champMessage.focus();

        return false;
    }

    if (!emailValide(email)) {

        afficherErreur(
            "L’adresse e-mail indiquée ne semble pas valide."
        );

        champEmail.focus();

        return false;
    }

    return true;
}


/* ==================================================
   ENVOI VERS MAKE
================================================== */

async function envoyerMessage(donnees) {

    if (
        WEBHOOK_MESSAGE ===
        "COLLER_ICI_L_ADRESSE_DU_WEBHOOK_MAKE"
    ) {

        throw new Error(
            "Le webhook Make n’est pas encore configuré."
        );
    }

    const reponse =
        await fetch(
            WEBHOOK_MESSAGE,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(
                        donnees
                    )
            }
        );

    if (!reponse.ok) {

        throw new Error(
            `Erreur HTTP ${reponse.status}`
        );
    }
}


/* ==================================================
   VALIDATION DU FORMULAIRE
================================================== */

formulaire.addEventListener(
    "submit",
    async evenement => {

        evenement.preventDefault();

        if (!verifierFormulaire()) {
            return;
        }

        definirEnvoiEnCours(
            true
        );

        masquerErreur();

        const donnees =
            creerDonneesMessage();

        try {

            await envoyerMessage(
                donnees
            );

            formulaire.hidden =
                true;

            confirmation.hidden =
                false;

        } catch (erreur) {

            console.error(
                "Erreur lors de l’envoi :",
                erreur
            );

            afficherErreur(
                erreur.message ===
                "Le webhook Make n’est pas encore configuré."
                    ? "La page fonctionne, mais elle n’est pas encore reliée à Make."
                    : "Le message n’a pas pu être envoyé. Veuillez réessayer dans quelques instants."
            );

        } finally {

            definirEnvoiEnCours(
                false
            );
        }
    }
);