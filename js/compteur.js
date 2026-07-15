/* ==================================================
   AGENDA DU JOUR
   Compteur de visiteurs
================================================== */


/* ==================================================
   CONFIGURATION
================================================== */

const URL_COMPTEUR =
    "https://api.counterapi.dev/v2/alain31140s-team-4551/visiteurs-mon-calendrier";


/* ==================================================
   LECTURE DU COMPTEUR
================================================== */

async function lireCompteurVisites() {

    try {

        const reponse = await fetch(
            URL_COMPTEUR
        );


        if (!reponse.ok) {

            throw new Error(
                "Erreur HTTP " +
                reponse.status
            );

        }


        const resultat =
            await reponse.json();


        console.log(
            "👀 Compteur reçu :",
            resultat
        );


        return Number(
            resultat?.data?.up_count
            ?? 0
        );


    } catch (erreur) {

        console.error(
            "Erreur de lecture du compteur :",
            erreur
        );


        return 0;

    }

}