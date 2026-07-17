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
/* ==================================================
   LISTE DE DÉTAILS
================================================== */

function creerListeEvenement(
    titre,
    elements,
    icone
) {

    if (
        !Array.isArray(
            elements
        )
        ||
        elements.length === 0
    ) {

        return "";

    }


    return `

        <section class="personnalite-section-detail evenement-section-detail">

            <h4>

                ${icone} ${titre}

            </h4>

            <ul>

                ${elements

                    .map(
                        element => `

                            <li>

                                ${echapperHTMLEvenement(
                                    element
                                )}

                            </li>

                        `
                    )

                    .join("")}

            </ul>

        </section>

    `;

}


/* ==================================================
   CRÉATION D'UNE FICHE
================================================== */

function creerFicheEvenement(
    evenementBrut,
    index
) {

    const evenement =
        normaliserEvenement(
            evenementBrut
        );


    const identifiant =
        creerIdentifiantEvenement(
            evenement,
            index
        );


    const informationsType =
        obtenirInformationsTypeEvenement(
            evenement.type
        );


    const titre =
        echapperHTMLEvenement(
            evenement.titre
        );


    const annee =
        evenement.annee
            ? echapperHTMLEvenement(
                evenement.annee
            )
            : "Année non renseignée";


    const image =
        obtenirSourceImageEvenement(
            evenement.image
        );


    const resume =
        echapperHTMLEvenement(
            obtenirResumeEvenement(
                evenement
            )
        );


    const wiki =
        String(
            evenement.wiki
            ||
            ""
        ).trim();


    return `

        <article
            class="personnalite-element evenement-element"
            data-evenement-id="${identifiant}"
        >

            <button
                type="button"
                class="personnalite-element-bouton evenement-element-bouton"
                aria-expanded="false"
                aria-controls="detail-${identifiant}"
            >

                <span class="personnalite-element-fleche evenement-element-fleche">

                    ▶

                </span>


                <span class="personnalite-element-identite evenement-element-identite">

                    <strong>

                        ${titre}

                    </strong>

                    <small>

                        ${informationsType.icone}

                        ${echapperHTMLEvenement(
                            informationsType.libelle
                        )}

                    </small>

                </span>


                <span class="personnalite-element-evenement evenement-element-type">

                    ${informationsType.icone}

                    ${echapperHTMLEvenement(
                        informationsType.libelle
                    )}

                </span>


                <span class="personnalite-element-annees evenement-element-annee">

                    ${annee}

                </span>

            </button>


            <div
                id="detail-${identifiant}"
                class="personnalite-detail evenement-detail"
                hidden
            >

                <div class="personnalite-barre-fermeture">

                    <button
                        type="button"
                        class="bouton-fermer-personnalite bouton-fermer-evenement"
                        aria-label="Fermer cette fiche"
                    >

                        ✕

                        <span>

                            Fermer

                        </span>

                    </button>

                </div>


                <div class="personnalite-fiche evenement-fiche">

                    <div class="personnalite-portrait evenement-illustration">

                        ${image ? `

                            <img
                                src="${echapperHTMLEvenement(
                                    image
                                )}"
                                alt="Illustration de ${titre}"
                                loading="lazy"
                            >

                        ` : creerPlaceholderEvenement()}

                    </div>


                    <div class="personnalite-contenu evenement-contenu">

                        <div class="personnalite-badge-evenement evenement-badge-type">

                            ${informationsType.icone}

                            ${echapperHTMLEvenement(
                                informationsType.libelle
                            )}

                        </div>


                        <h2>

                            ${titre}

                        </h2>


                        <div class="personnalite-dates evenement-date">

                            ${annee}

                        </div>


                        ${evenement.lieu ? `

                            <div class="personnalite-informations evenement-informations">

                                <div>

                                    📍

                                    <strong>
                                        Lieu :
                                    </strong>

                                    ${echapperHTMLEvenement(
                                        evenement.lieu
                                    )}

                                </div>

                            </div>

                        ` : ""}


                        <p class="personnalite-resume evenement-resume">

                            ${resume}

                        </p>


                        ${creerListeEvenement(
                            "Faits marquants",
                            evenement.faitsMarquants,
                            "✨"
                        )}


                        ${creerListeEvenement(
                            "Conséquences",
                            evenement.consequences,
                            "🔎"
                        )}


                        ${wiki ? `

                            <a
                                class="personnalite-lien-externe evenement-lien-externe"
                                href="${echapperHTMLEvenement(
                                    wiki
                                )}"
                                target="_blank"
                                rel="noopener noreferrer"
                            >

                                En savoir plus →

                            </a>

                        ` : ""}

                    </div>

                </div>

            </div>

        </article>

    `;

}

/* ==================================================
   FERMETURE D'UNE FICHE
================================================== */

function fermerFicheEvenement(
    element
) {

    const detail =
        element.querySelector(
            ".evenement-detail"
        );


    const bouton =
        element.querySelector(
            ".evenement-element-bouton"
        );


    const fleche =
        element.querySelector(
            ".evenement-element-fleche"
        );


    if (
        !detail
        ||
        !bouton
        ||
        !fleche
    ) {

        return;

    }


    detail.hidden =
        true;


    bouton.setAttribute(
        "aria-expanded",
        "false"
    );


    fleche.textContent =
        "▶";

}


/* ==================================================
   FERMETURE DES AUTRES FICHES
================================================== */

function fermerToutesLesFichesEvenements(
    exception = null
) {

    document
        .querySelectorAll(
            ".evenement-element"
        )
        .forEach(
            element => {

                if (
                    element !== exception
                ) {

                    fermerFicheEvenement(
                        element
                    );

                }

            }
        );

}


/* ==================================================
   INITIALISATION DES INTERACTIONS
================================================== */

function initialiserInteractionsEvenements() {

    document
        .querySelectorAll(
            ".evenement-element"
        )
        .forEach(
            element => {

                const bouton =
                    element.querySelector(
                        ".evenement-element-bouton"
                    );


                const detail =
                    element.querySelector(
                        ".evenement-detail"
                    );


                const fleche =
                    element.querySelector(
                        ".evenement-element-fleche"
                    );


                const boutonFermer =
                    element.querySelector(
                        ".bouton-fermer-evenement"
                    );


                if (
                    !bouton
                    ||
                    !detail
                    ||
                    !fleche
                    ||
                    !boutonFermer
                ) {

                    return;

                }


                bouton.addEventListener(
                    "click",
                    () => {

                        const ouverture =
                            detail.hidden;


                        fermerToutesLesFichesEvenements(
                            element
                        );


                        detail.hidden =
                            !ouverture;


                        bouton.setAttribute(
                            "aria-expanded",
                            String(
                                ouverture
                            )
                        );


                        fleche.textContent =
                            ouverture
                                ? "▼"
                                : "▶";


                        if (
                            ouverture
                        ) {

                            setTimeout(
                                () => {

                                    element.scrollIntoView({

                                        behavior:
                                            "smooth",

                                        block:
                                            "start"

                                    });

                                },
                                80
                            );

                        }

                    }
                );


                boutonFermer.addEventListener(
                    "click",
                    () => {

                        fermerFicheEvenement(
                            element
                        );


                        bouton.scrollIntoView({

                            behavior:
                                "smooth",

                            block:
                                "center"

                        });


                        bouton.focus();

                    }
                );


                const image =
                    element.querySelector(
                        ".evenement-illustration img"
                    );


                if (
                    image
                ) {

                    image.addEventListener(
                        "error",
                        () => {

                            image.parentElement.innerHTML =
                                creerPlaceholderEvenement();

                        }
                    );

                }

            }
        );

}


/* ==================================================
   AFFICHAGE DE LA PAGE
================================================== */

async function afficherEvenementsDuJour() {

    const contenu =
        document.getElementById(
            "evenements-contenu"
        );


    const dateElement =
        document.getElementById(
            "evenements-date"
        );


    if (
        !contenu
    ) {

        return;

    }


    try {

        const reponse =
            await fetch(

                EVENEMENTS_DATA_URL

                +

                "?v="

                +

                Date.now()

            );


        if (
            !reponse.ok
        ) {

            throw new Error(
                `Erreur HTTP ${reponse.status}`
            );

        }


        const donnees =
            await reponse.json();


        const cle =
            obtenirCleEvenementsDuJour();


        const evenements =
            Array.isArray(
                donnees[cle]
            )
                ? donnees[cle]
                : [];


        const dateComplete =
            new Intl.DateTimeFormat(

                "fr-FR",

                {

                    day:
                        "numeric",

                    month:
                        "long"

                }

            ).format(
                new Date()
            );


        if (
            dateElement
        ) {

            dateElement.textContent =
                `Les faits marquants survenus un ${dateComplete}`;

        }


        if (
            evenements.length === 0
        ) {

            contenu.innerHTML = `

                <section class="personnalites-vide evenements-vide">

                    <div class="personnalites-vide-icone">

                        📜

                    </div>

                    <h2>

                        Aucun événement renseigné pour cette date

                    </h2>

                    <p>

                        Cette journée pourra être enrichie prochainement.

                    </p>

                </section>

            `;

            return;

        }


        contenu.innerHTML = `

            <div class="personnalites-dossier evenements-dossier">

                <div class="personnalites-introduction evenements-introduction">

                    <strong>

                        ${evenements.length}

                    </strong>

                    événement${

                        evenements.length > 1
                            ? "s"
                            : ""

                    } à découvrir

                </div>


                <div class="personnalites-liste evenements-liste">

                    ${evenements

                        .map(
                            creerFicheEvenement
                        )

                        .join("")}

                </div>

            </div>

        `;


        initialiserInteractionsEvenements();


    } catch (
        erreur
    ) {

        console.error(
            "Erreur Événements :",
            erreur
        );


        contenu.innerHTML = `

            <section class="personnalites-vide evenements-vide">

                <div class="personnalites-vide-icone">

                    ⚠️

                </div>

                <h2>

                    Impossible de charger les événements

                </h2>

                <p>

                    Vérifie que le fichier
                    data/evenements.json
                    est bien présent.

                </p>

            </section>

        `;

    }

}


/* ==================================================
   DÉMARRAGE
================================================== */

document.addEventListener(

    "DOMContentLoaded",

    afficherEvenementsDuJour

);