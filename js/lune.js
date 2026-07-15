/* ==================================================
   AGENDA DU JOUR
   Module Lune
================================================== */


/* ==================================================
   CALCUL DE LA PHASE LUNAIRE
================================================== */

function obtenirInformationsLune() {

    const maintenant =
        new Date();

    /*
       Date de référence :
       nouvelle lune du 6 janvier 2000
    */

    const nouvelleLuneReference =
        new Date(
            2000,
            0,
            6,
            18,
            14
        );

    /*
       Durée moyenne d'un cycle lunaire
       en jours
    */

    const cycleLunaire =
        29.53058867;


    const millisecondesParJour =
        1000 * 60 * 60 * 24;


    const joursEcoules =

        (
            maintenant
            -
            nouvelleLuneReference
        )

        /

        millisecondesParJour;


    let ageLune =

        joursEcoules

        %

        cycleLunaire;


    if (ageLune < 0) {

        ageLune +=
            cycleLunaire;

    }


    /*
       Éclairage approximatif
    */

    const eclairage =

        Math.round(

            (

                1

                -

                Math.cos(

                    2

                    *

                    Math.PI

                    *

                    ageLune

                    /

                    cycleLunaire

                )

            )

            /

            2

            *

            100

        );


    /*
       Détermination de la phase
    */

    let icone;

    let nom;


    if (

        ageLune < 1.85

        ||

        ageLune >= 27.68

    ) {

        icone = "🌑";

        nom =
            "Nouvelle lune";

    }

    else if (

        ageLune < 5.54

    ) {

        icone = "🌒";

        nom =
            "Premier croissant";

    }

    else if (

        ageLune < 9.23

    ) {

        icone = "🌓";

        nom =
            "Premier quartier";

    }

    else if (

        ageLune < 12.92

    ) {

        icone = "🌔";

        nom =
            "Lune gibbeuse croissante";

    }

    else if (

        ageLune < 16.61

    ) {

        icone = "🌕";

        nom =
            "Pleine lune";

    }

    else if (

        ageLune < 20.30

    ) {

        icone = "🌖";

        nom =
            "Lune gibbeuse décroissante";

    }

    else if (

        ageLune < 23.99

    ) {

        icone = "🌗";

        nom =
            "Dernier quartier";

    }

    else {

        icone = "🌘";

        nom =
            "Dernier croissant";

    }


    return {

        icone,

        nom,

        eclairage,

        age:

            Math.round(

                ageLune

            )

    };

}


/* ==================================================
   CRÉATION DE LA CARTE LUNE
================================================== */

function creerCarteLune() {

    const lune =
        obtenirInformationsLune();


    return `

        <article class="info-carte lune-carte">

            <div class="info-carte-titre">

                🌙 Lune

            </div>


            <div class="lune-icone">

                ${lune.icone}

            </div>


            <div class="lune-phase">

                ${lune.nom}

            </div>


            <div class="lune-details">

                Éclairage :

                <strong>

                    ${lune.eclairage} %

                </strong>

            </div>


            <div class="lune-age">

                Jour ${lune.age}

                du cycle lunaire

            </div>

        </article>

    `;

}