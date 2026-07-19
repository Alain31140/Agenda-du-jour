/* ==================================================
   AGENDA DU JOUR
   Module Accueil
================================================== */


/* ==================================================
   DONNÉES DE L'ACCUEIL
================================================== */

let donneesAccueil = {
    saints: {},
    dictons: {},
    journees: {},
    celebrations: {},
    langues: {}
};


/* ==================================================
   CHARGEMENT D'UN FICHIER JSON
================================================== */

async function chargerJSON(nomFichier) {

    try {

        const reponse = await fetch(
            DATA_URL +
            nomFichier +
            "?v=" +
            Date.now()
        );

        if (!reponse.ok) {
            throw new Error(
                "Erreur HTTP " +
                reponse.status
            );
        }

        return await reponse.json();

    } catch (erreur) {

        console.error(
            "Erreur de chargement :",
            nomFichier,
            erreur
        );

        return {};
    }
}


/* ==================================================
   CHARGEMENT DES DONNÉES
================================================== */

async function chargerDonneesAccueil() {

    const [
        saints,
        dictons,
        journees,
        celebrations,
        langues
    ] = await Promise.all([

        chargerJSON("saints.json"),

        chargerJSON(
            "dictons-du-jour.json"
        ),

        chargerJSON(
            "journees-mondiales.json"
        ),

        chargerJSON(
            "celebrations-mensuelles.json"
        ),

        chargerJSON(
            "accueil-langue.json"
        )

    ]);

    donneesAccueil.saints =
        saints;

    donneesAccueil.dictons =
        dictons;

    donneesAccueil.journees =
        journees;

    donneesAccueil.celebrations =
        celebrations;

    donneesAccueil.langues =
        langues;

        console.log(
    "JSON accueil chargé :",
    donneesAccueil.langues
);

    console.log(
        "🏠 Données accueil chargées",
        donneesAccueil
    );
}


/* ==================================================
   OUTILS DATE
================================================== */

function obtenirCleDuJour() {

    const maintenant =
        new Date();

    const jour =
        String(
            maintenant.getDate()
        ).padStart(
            2,
            "0"
        );

    const mois =
        String(
            maintenant.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    return `${jour}-${mois}`;
}


function obtenirCleDuMois() {

    return String(
        new Date().getMonth() + 1
    ).padStart(
        2,
        "0"
    );
}

/* ==================================================
   LANGUE DU VISITEUR
================================================== */

function obtenirLangueAccueil() {

    let langue =
        navigator.language
            ?.substring(0, 2)
            .toLowerCase()
        || "fr";

    if (
        !donneesAccueil.langues[langue]
    ) {
        langue = "fr";
    }

    return langue;
}


/* ==================================================
   DATE COMPLÈTE
================================================== */

function obtenirDateComplete(langue) {

    return new Intl.DateTimeFormat(
        langue,
        {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    ).format(
        new Date()
    );
}

/* ==================================================
   MESSAGE SELON L'HEURE
================================================== */

function obtenirMessageHeure() {

    const heure =
        new Date().getHours();

    if (heure < 6) {
        return "🦉 Les chouettes sont encore réveillées...";
    }

    if (heure < 8) {
        return "🥐 Réveil ! Petit déjeuner en cours.";
    }

    if (heure < 11) {
        return "☀️ Bonne matinée !";
    }

    if (heure < 12) {
        return "🍹 L’apéro se rapproche...";
    }

    if (heure < 14) {
        return "🍽️ Bon appétit !";
    }

    if (heure < 15) {
        return "😴 C’est l’heure de la sieste !";
    }

    if (heure < 18) {
        return "🍵 It's tea time";
    }

    if (heure < 19) {
        return "🍹 L’apéro se rapproche...";
    }

    if (heure < 21) {
        return "🍽️ Bon appétit !";
    }

    if (heure < 23) {
        return "📺 Soirée TV tranquille";
    }

    return "🌙 Bonne nuit...";
}

/* ==================================================
   AFFICHAGE DE L'ACCUEIL
================================================== */

async function afficherAccueil() {

    const application =
        document.getElementById(
            "app"
        );

    if (!application) {
        return;
    }

    const compteurVisites =
        await lireCompteurVisites();

    const cle =
        obtenirCleDuJour();

    const cleMois =
        obtenirCleDuMois();

    const langue =
        obtenirLangueAccueil();

);

    const messageHeure =
        obtenirMessageHeure();


    const traduction =
        donneesAccueil.langues[langue]
        || donneesAccueil.langues.fr;

    const saint =
        donneesAccueil.saints[cle];

    const dictonBrut =
        donneesAccueil.dictons[cle];

    const dicton =
        typeof dictonBrut === "string"
            ? dictonBrut
            : (
                dictonBrut?.text
                ||
                dictonBrut?.label
                ||
                "Dicton indisponible"
            );

    const journee =
        donneesAccueil.journees[cle];

    const celebration =
        donneesAccueil.celebrations[
            cleMois
        ];

    const imageCelebration =
    celebration?.image
        ? (
            "images/celebrations-mensuelles/"
            +
            celebration.image
        )
        : "";

    const journeeAffichee =
        journee?.label
            ? journee.label
                .split("|")
                .map(
                    element =>
                        "🌍 " +
                        element.trim()
                )
                .join("<br>")
            : "🌍 Aucune journée mondiale renseignée";

    const carteSoleilMeteo =
        await creerCarteSoleilMeteo();

    const carteLocalisation =
        await creerCarteLocalisation();  

    application.innerHTML = `

        <section class="accueil-principal">

            <div class="accueil-bienvenue">

               <div class="accueil-titre">

                    <span class="drapeau-accueil">
                        ${traduction.flag}
                    </span>

                    <span class="texte-accueil">
                        ${traduction.welcome}
                    </span>

                </div>

                <div class="accueil-compteur">

                    <span class="compteur-yeux">
                        👀
                    </span>

                    Déjà

                    <strong>
                        ${compteurVisites.toLocaleString(
                            langue
                        )}
                    </strong>

                    curieux ont découvert mon calendrier

                </div>

            </div>


            <article class="accueil-carte">

                <div class="accueil-carte-titre">
                    📅 Nous sommes le
                </div>

                <div class="date-du-jour">

                    ${obtenirDateComplete(
                        langue
                    )}

                </div>

                <div
                    id="heure-du-jour"
                    class="heure-du-jour"
                ></div>

                <div class="message-heure">
                    ${messageHeure}
                </div>

            </article>


            <article class="accueil-carte">

                <div class="accueil-carte-titre">
                    🙏 Aujourd’hui, nous fêtons
                </div>

                <div class="saint-du-jour">

                    ${saint?.label
                        || "Saint non renseigné"}

                </div>

            </article>


            <article class="accueil-carte">

                <div class="journee-du-jour">
                    ${journeeAffichee}
                </div>

            </article>


            ${celebration ? `

                <article class="accueil-carte celebration-mois">

                    <div class="accueil-carte-titre">
                        📅 Célébration du mois
                    </div>

                    <div
                        class="celebration-contenu
                        ${imageCelebration
                            ? ""
                            : "sans-image"}"
                    >

                        ${imageCelebration ? `

                            <div class="celebration-image">

                                <img
                                    src="${imageCelebration}"
                                    alt="${celebration.titre || ""}"
                                    onerror="
                                        const contenu =
                                            this.closest(
                                                '.celebration-contenu'
                                            );

                                        this.parentElement.remove();

                                        if (contenu) {
                                            contenu.classList.add(
                                                'sans-image'
                                            );
                                        }
                                    "
                                >

                            </div>

                        ` : ""}

                        <div class="celebration-texte">

                            <h3>
                                ${celebration.titre || ""}
                            </h3>

                            <p>
                                ${celebration.description || ""}
                            </p>

                        </div>

                    </div>

                </article>

            ` : ""}


            <article class="accueil-carte dicton-carte">

                <div class="accueil-carte-titre">
                    💬 Le dicton du jour
                </div>

                <blockquote>
                    ${dicton}
                </blockquote>

            </article>

           <div class="widgets-principaux">

                ${creerCarteLune()}

                ${carteSoleilMeteo}

                ${carteLocalisation}
            </div>    

        </section>
    `;

    demarrerHorloge();

    demarrerCompteReboursSoleil();

    initialiserLocalisation();
}


/* ==================================================
   HORLOGE
================================================== */

function demarrerHorloge() {

    const elementHeure =
        document.getElementById(
            "heure-du-jour"
        );

    const elementMessage =
        document.getElementById(
            "message-heure"
        );

    if (!elementHeure) {
        return;
    }

    function actualiserHeure() {

        const maintenant =
            new Date();

        elementHeure.textContent =
            new Intl.DateTimeFormat(
                navigator.language,
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                }
            ).format(
                maintenant
            );

        if (elementMessage) {
            elementMessage.innerHTML =
                messageHeure(
                    maintenant.getHours()
                );
        }
    }

    actualiserHeure();

    setInterval(
        actualiserHeure,
        1000
    );
}