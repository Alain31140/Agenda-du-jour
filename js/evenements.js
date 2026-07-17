/* ==================================================
   AGENDA DU JOUR
   Page Événements
================================================== */


const EVENEMENTS_DATA_URL =
    "data/evenements.json";


const EVENEMENTS_IMAGE_URL =
    "images/evenements/";


/* ==================================================
   DATE DU JOUR
================================================== */

function obtenirCleEvenementsDuJour() {

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
   PROTECTION DU HTML
================================================== */

function echapperHTMLEvenement(
    valeur
) {

    return String(
        valeur ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


/* ==================================================
   IDENTIFIANT DE LA FICHE
================================================== */

function creerIdentifiantEvenement(
    evenement,
    index
) {

    if (
        evenement.id
    ) {

        return evenement.id;

    }


    const base =
        evenement.titre
        ||
        `evenement-${index}`;


    return String(
        base
    )
        .normalize(
            "NFD"
        )
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .toLowerCase()
        .replace(
            /[^a-z0-9]+/g,
            "-"
        )
        .replace(
            /^-|-$/g,
            ""
        )
        +
        `-${index}`;

}


/* ==================================================
   NORMALISATION DU JSON
================================================== */

function normaliserEvenement(
    evenement
) {

    return {

        id:
            evenement.id
            ||
            "",


        titre:
            evenement.titre
            ||
            evenement.title
            ||
            "Événement non renseigné",


        annee:
            evenement.annee
            ??
            evenement.year
            ??
            null,


        type:
            evenement.type
            ||
            "histoire",


        resume:
            evenement.resume
            ||
            evenement.summary
            ||
            "",


        lieu:
            evenement.lieu
            ||
            "",


        faitsMarquants:
            Array.isArray(
                evenement.faits_marquants
            )
                ? evenement.faits_marquants
                : [],


        consequences:
            Array.isArray(
                evenement.consequences
            )
                ? evenement.consequences
                : [],


        image:
            evenement.image
            ||
            "",


        wiki:
            evenement.wiki
            ||
            ""

    };

}


/* ==================================================
   TYPE D'ÉVÉNEMENT
================================================== */

function obtenirInformationsTypeEvenement(
    typeEvenement
) {

    const type =
        String(
            typeEvenement
            ||
            ""
        )
            .toLowerCase()
            .trim();


    const types = {

        histoire: {
            icone:
                "📜",

            libelle:
                "Histoire"
        },


        politique: {
            icone:
                "🏛️",

            libelle:
                "Politique"
        },


        science: {
            icone:
                "🔬",

            libelle:
                "Science"
        },


        technologie: {
            icone:
                "💻",

            libelle:
                "Technologie"
        },


        culture: {
            icone:
                "🎭",

            libelle:
                "Culture"
        },


        sport: {
            icone:
                "🏅",

            libelle:
                "Sport"
        },


        economie: {
            icone:
                "💶",

            libelle:
                "Économie"
        },


        économie: {
            icone:
                "💶",

            libelle:
                "Économie"
        }

    };


    return (
        types[type]
        ||
        {
            icone:
                "📌",

            libelle:
                type
                    ? type.charAt(0).toUpperCase()
                        +
                        type.slice(1)
                    : "Événement"
        }
    );

}


/* ==================================================
   SOURCE DE L'IMAGE
================================================== */

function obtenirSourceImageEvenement(
    image
) {

    const valeur =
        String(
            image
            ||
            ""
        ).trim();


    if (
        !valeur
    ) {

        return "";

    }


    if (
        valeur.startsWith(
            "http://"
        )
        ||
        valeur.startsWith(
            "https://"
        )
    ) {

        return valeur;

    }


    return (
        EVENEMENTS_IMAGE_URL
        +
        valeur
    );

}


/* ==================================================
   IMAGE DE SECOURS
================================================== */

function creerPlaceholderEvenement() {

    return `

        <div class="personnalite-placeholder evenement-placeholder">

            <div class="personnalite-placeholder-icone">

                📜

            </div>

            <div>

                Illustration non disponible

            </div>

        </div>

    `;

}


/* ==================================================
   RÉSUMÉ PAR DÉFAUT
================================================== */

function obtenirResumeEvenement(
    evenement
) {

    if (
        evenement.resume
    ) {

        return evenement.resume;

    }


    return (
        `${evenement.titre} est un fait marquant associé à cette date.`
    );

}