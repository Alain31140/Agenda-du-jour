/* ==================================================
   PAGE MESSAGE
================================================== */


/* ==================================================
   CONFIGURATION
================================================== */

const WEBHOOK_MESSAGE =
    "https://hook.eu1.make.com/m4us5n687vfnx1eyhtbj14nobamr86lw";

const TYPE_MESSAGE =
    "MSG";


/* ==================================================
   ÉLÉMENTS DE LA PAGE
================================================== */

const contenuMessage =
    document.getElementById(
        "message-contenu"
    );

const formulaire =
    document.getElementById(
        "message-formulaire"
    );

const champPrenom =
    document.getElementById(
        "prenom"
    );

const champEmail =
    document.getElementById(
        "email"
    );

const champMessage =
    document.getElementById(
        "message"
    );

const compteurCaracteres =
    document.getElementById(
        "message-compteur"
    );

const zoneRetour =
    document.getElementById(
        "message-retour"
    );

const boutonEnvoyer =
    document.getElementById(
        "message-bouton"
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
   ORIGINE DU MESSAGE
================================================== */

function obtenirOrigine() {

    const parametres =
        new URLSearchParams(
            window.location.search
        );

    const origineAdresse =
        parametres.get("origine");

    const origineMemorisee =
        sessionStorage.getItem(
            "origineMessage"
        );

    return (
        origineAdresse
        || origineMemorisee
        || "Accès direct"
    );
}


/* ==================================================
   VÉRIFICATION DES ÉLÉMENTS
================================================== */

if (

    !contenuMessage
    || !formulaire
    || !champPrenom
    || !champEmail
    || !champMessage
    || !compteurCaracteres
    || !zoneRetour
    || !boutonEnvoyer
    || !texteBouton
    || !confirmation

) {

    throw new Error(
        "Page Message : un élément HTML est introuvable."
    );

}


/* ==================================================
   COMPTEUR DE CARACTÈRES
================================================== */

function actualiserCompteur() {

    const nombre =
        champMessage.value.length;

    compteurCaracteres.textContent =
        `${nombre} / 1000`;

}

champMessage.addEventListener(
    "input",
    actualiserCompteur
);

actualiserCompteur();

/* ==================================================
   AFFICHAGE DES ERREURS
================================================== */

function afficherErreur(message) {

    zoneRetour.textContent =
        message;

    zoneRetour.hidden =
        false;

}


function masquerErreur() {

    zoneRetour.textContent =
        "";

    zoneRetour.hidden =
        true;

}


/* ==================================================
   VALIDATION DE L’ADRESSE E-MAIL
================================================== */

function emailValide(email) {

    if (!email) {
        return true;
    }

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
    );

}


/* ==================================================
   ÉTAT DU BOUTON
================================================== */

function definirEnvoiEnCours(enCours) {

    boutonEnvoyer.disabled =
        enCours;

    boutonEnvoyer.classList.toggle(
        "envoi-en-cours",
        enCours
    );

    boutonEnvoyer.setAttribute(
        "aria-busy",
        enCours
            ? "true"
            : "false"
    );

    texteBouton.textContent =
        enCours
            ? "Envoi en cours..."
            : "Envoyer mon message";

}


/* ==================================================
   INFORMATIONS TECHNIQUES
================================================== */

function obtenirInformationsTechniques() {

    return {

        origine:
            obtenirOrigine(),

        page:
            window.location.href,

        langue:
            navigator.language || "",

        navigateur:
            navigator.userAgent || "",

        tailleEcran:
            `${window.screen.width} × ${window.screen.height}`

    };

}


/* ==================================================
   IDENTIFIANT DU MESSAGE
================================================== */

function creerIdentifiant(maintenant) {

    const date =
        maintenant
            .toLocaleDateString("fr-FR")
            .replace(/\//g, "");

    const heure =
        maintenant
            .toLocaleTimeString(
                "fr-FR",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                }
            )
            .replace(/:/g, "");

    return `${TYPE_MESSAGE}-${date}-${heure}`;

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

        identifiant:
            creerIdentifiant(
                maintenant
            ),

        statut:
            "🟢 Nouveau",

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
   VALIDATION DU FORMULAIRE
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

        !WEBHOOK_MESSAGE

        || WEBHOOK_MESSAGE ===
        "COLLER_ICI_L_ADRESSE_DU_WEBHOOK_MAKE"

    ) {

        throw new Error(
            "WEBHOOK_NON_CONFIGURE"
        );

    }

    const reponse =
        await fetch(

            WEBHOOK_MESSAGE,

            {

                method:
                    "POST",

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
            `ERREUR_HTTP_${reponse.status}`
        );

    }

}


/* ==================================================
   ATTENTE DE L’ANIMATION
================================================== */

function attendreFinAnimation() {

    return new Promise(

        resolution => {

            let animationTerminee =
                false;

            function terminer() {

                if (animationTerminee) {
                    return;
                }

                animationTerminee =
                    true;

                contenuMessage.removeEventListener(
                    "transitionend",
                    terminer
                );

                resolution();

            }

            contenuMessage.addEventListener(

                "transitionend",

                terminer,

                {
                    once:
                        true
                }

            );

            /*
                Sécurité si le navigateur
                ne déclenche pas transitionend.
            */

            window.setTimeout(
                terminer,
                900
            );

        }

    );

}


/* ==================================================
   ANIMATION APRÈS ENVOI
================================================== */

async function afficherConfirmation() {

    contenuMessage.classList.add(
        "envoye"
    );

    await attendreFinAnimation();

    contenuMessage.hidden =
        true;

    confirmation.hidden =
        false;

    confirmation.getBoundingClientRect();

    confirmation.classList.add(
        "visible"
    );

    confirmation.focus();

}

/* ==================================================
   ENVOI DU FORMULAIRE
================================================== */

formulaire.addEventListener(

    "submit",

    async evenement => {

        evenement.preventDefault();

        if (!verifierFormulaire()) {
            return;
        }

        masquerErreur();

        definirEnvoiEnCours(
            true
        );

        const donnees =
            creerDonneesMessage();

        try {

            await envoyerMessage(
                donnees
            );

            await afficherConfirmation();

        } catch (erreur) {

            console.error(
                "Erreur lors de l’envoi :",
                erreur
            );

            if (
                erreur.message ===
                "WEBHOOK_NON_CONFIGURE"
            ) {

                afficherErreur(
                    "La page fonctionne, mais elle n’est pas encore reliée à Make."
                );

            } else {

                afficherErreur(
                    "Le message n’a pas pu être envoyé. Veuillez réessayer dans quelques instants."
                );

            }

        } finally {

            definirEnvoiEnCours(
                false
            );

        }

    }

);