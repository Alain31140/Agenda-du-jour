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