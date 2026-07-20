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

    const nouvelleLuneReference =
        new Date(
            2000,
            0,
            6,
            18,
            14
        );

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

    let icone;
    let nom;
    let image;

    if (
        ageLune < 1.85
        ||
        ageLune >= 27.68
    ) {

        icone =
            "🌑";

        nom =
            "Nouvelle lune";

        image =
            "nouvelle-lune.png";

    } else if (
        ageLune < 5.54
    ) {

        icone =
            "🌒";

        nom =
            "Premier croissant";

        image =
            "premier-croissant.png";

    } else if (
        ageLune < 9.23
    ) {

        icone =
            "🌓";

        nom =
            "Premier quartier";

        image =
            "premier-quartier.png";

    } else if (
        ageLune < 12.92
    ) {

        icone =
            "🌔";

        nom =
            "Lune gibbeuse croissante";

        image =
            "gibbeuse-croissante.png";

    } else if (
        ageLune < 16.61
    ) {

        icone =
            "🌕";

        nom =
            "Pleine lune";

        image =
            "pleine-lune.png";

    } else if (
        ageLune < 20.30
    ) {

        icone =
            "🌖";

        nom =
            "Lune gibbeuse décroissante";

        image =
            "gibbeuse-decroissante.png";

    } else if (
        ageLune < 23.99
    ) {

        icone =
            "🌗";

        nom =
            "Dernier quartier";

        image =
            "dernier-quartier.png";

    } else {

        icone =
            "🌘";

        nom =
            "Dernier croissant";

        image =
            "dernier-croissant.png";
    }

    return {
        icone,
        nom,
        image,
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

            <div class="lune-image">

                <img
                    src="${IMAGE_URL}lune/${lune.image}"
                    alt="${lune.nom}"
                >

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