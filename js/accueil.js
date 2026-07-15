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

async function chargerJSON(
    nomFichier
) {

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

        chargerJSON(
            "saints.json"
        ),

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

function obtenirDateComplete(
    langue
) {

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


    const langue =
        obtenirLangueAccueil();


    const traduction =
        donneesAccueil.langues[langue];


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


    application.innerHTML = `

        <section class="accueil-principal">


            <div class="accueil-bienvenue">

                <div class="accueil-titre">

                    <span>

                        ${traduction.flag}

                    </span>

                    ${traduction.welcome}

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
                >

                </div>


            </article>


            <article class="accueil-carte">


                <div class="accueil-carte-titre">

                    🙏 Aujourd’hui, nous fêtons

                </div>


                <div class="saint-du-jour">

                    ${

                        saint?.label

                        ||

                        "Saint non renseigné"

                    }

                </div>


            </article>


            <article class="accueil-carte">


                <div class="journee-du-jour">

                    ${journeeAffichee}

                </div>


            </article>


            <article class="accueil-carte">


                <div class="accueil-carte-titre">

                    💬 Le dicton du jour

                </div>


                <blockquote>

                    ${dicton}

                </blockquote>


            </article>


        </section>

    `;


    demarrerHorloge();

}


/* ==================================================
   HORLOGE
================================================== */

function demarrerHorloge() {

    const element =
        document.getElementById(
            "heure-du-jour"
        );


    if (!element) {

        return;

    }


    function actualiserHeure() {

        element.textContent =

            new Intl.DateTimeFormat(

                navigator.language,

                {

                    hour: "2-digit",

                    minute: "2-digit",

                    second: "2-digit"

                }

            ).format(
                new Date()
            );

    }


    actualiserHeure();


    setInterval(

        actualiserHeure,

        1000

    );

}