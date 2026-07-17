/* ==================================================
   PAGE MESSAGE
================================================== */


/*
    Remplacer cette adresse par l’URL
    du webhook fournie par Make.
*/

const WEBHOOK_MESSAGE =
    "COLLER_ICI_L_ADRESSE_DU_WEBHOOK_MAKE";


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
   INFORMATIONS TECHNIQUES
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
        WEBHOOK_MESSAGE ===
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

    /*
        Déclenche le glissement défini
        dans le CSS.
    */

    contenuMessage.classList.add(
        "envoye"
    );


    /*
        Attend la fin du glissement.
    */

    await attendreFinAnimation();


    /*
        Retire le contenu envoyé.
    */

    contenuMessage.hidden =
        true;


    /*
        Prépare la confirmation.
    */

    confirmation.hidden =
        false;


    /*
        Force le navigateur à afficher
        l’état initial avant d’ajouter
        la classe visible.
    */

    confirmation.getBoundingClientRect();


    /*
        Apparition de la confirmation.
    */

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