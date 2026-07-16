/* ==================================================
   AGENDA DU JOUR
   Page Culture
================================================== */

const CULTURE_DATA_URL =
    "data/culture.json";

const CULTURE_IMAGE_URL =
    "images/culture/";

let cultureOuverte = null;


/* ==================================================
   CONFIGURATION DES CATÉGORIES
================================================== */

const CATEGORIES_CULTURE = {

    concert: {
        libelle: "Concerts",
        icone: "🎤"
    },

    "opéra": {
        libelle: "Opéras",
        icone: "🎭"
    },

    opera: {
        libelle: "Opéras",
        icone: "🎭"
    },

    film: {
        libelle: "Cinéma",
        icone: "🎬"
    },

    livre: {
        libelle: "Livres",
        icone: "📚"
    },

    disque: {
        libelle: "Musique",
        icone: "🎵"
    },

    bd: {
        libelle: "Bandes dessinées",
        icone: "💬"
    },

    "jeu vidéo": {
        libelle: "Jeux vidéo",
        icone: "🎮"
    },

    "jeu-video": {
        libelle: "Jeux vidéo",
        icone: "🎮"
    },

    "série tv": {
        libelle: "Séries TV",
        icone: "📺"
    },

    "serie-tv": {
        libelle: "Séries TV",
        icone: "📺"
    },

    spectacle: {
        libelle: "Spectacles",
        icone: "🎪"
    },

    exposition: {
        libelle: "Expositions",
        icone: "🖼️"
    },

    "comédie musicale": {
        libelle: "Comédies musicales",
        icone: "🎶"
    },

    "comedie-musicale": {
        libelle: "Comédies musicales",
        icone: "🎶"
    }

};


/* ==================================================
   OUTILS
================================================== */

function obtenirCleCultureDuJour() {

    const date =
        new Date();

    const jour =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );

    const mois =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    return `${jour}-${mois}`;
}


function normaliserTypeCulture(type) {

    return String(
        type || "autre"
    )
        .trim()
        .toLowerCase();
}


function creerIdentifiantCulture(
    element,
    index
) {

    const base =
        element.id
        ||
        element.titre
        ||
        `culture-${index}`;

    return String(base)
        .normalize("NFD")
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


function echapperHTML(valeur) {

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
   COMPATIBILITÉ DES DEUX STRUCTURES JSON
================================================== */

function regrouperCultureParCategorie(
    donneesJour
) {

    const categories = {};

    if (!donneesJour) {
        return categories;
    }

    /*
       Ancienne structure :

       "16-07": {
           "items": [...]
       }
    */

    if (
        Array.isArray(
            donneesJour.items
        )
    ) {

        donneesJour.items.forEach(
            element => {

                const type =
                    normaliserTypeCulture(
                        element.type
                    );

                if (!categories[type]) {
                    categories[type] = [];
                }

                categories[type].push(
                    element
                );
            }
        );

        return categories;
    }

    /*
       Future structure :

       "16-07": {
           "film": [...],
           "livre": [...]
       }
    */

    Object.entries(
        donneesJour
    ).forEach(
        ([type, elements]) => {

            if (
                Array.isArray(elements)
                &&
                elements.length
            ) {

                categories[
                    normaliserTypeCulture(type)
                ] = elements;
            }
        }
    );

    return categories;
}


/* ==================================================
   IMAGE OU PLACEHOLDER
================================================== */

function obtenirSourceImageCulture(
    element
) {

    const image =
        String(
            element.image || ""
        ).trim();

    if (!image) {
        return "";
    }

    if (
        image.startsWith("http://")
        ||
        image.startsWith("https://")
    ) {
        return image;
    }

    return (
        CULTURE_IMAGE_URL
        +
        image
    );
}


function creerPlaceholderCulture(
    categorie
) {

    const configuration =
        CATEGORIES_CULTURE[categorie]
        ||
        {
            libelle: "Culture",
            icone: "🎭"
        };

    return `

        <div class="culture-placeholder">

            <span class="culture-placeholder-icone">
                ${configuration.icone}
            </span>

            <span>
                ${configuration.libelle}
            </span>

        </div>

    `;
}


/* ==================================================
   CRÉATION D’UNE FICHE
================================================== */

function creerFicheCulture(
    element,
    categorie,
    index
) {

    const identifiant =
        creerIdentifiantCulture(
            element,
            index
        );

    const titre =
        echapperHTML(
            element.titre
            ||
            "Découverte culturelle"
        );

    const createur =
        echapperHTML(
            element.createur
            ||
            "Créateur non renseigné"
        );

    const annee =
        element.annee
            ? echapperHTML(element.annee)
            : "Date non précisée";

    const resume =
        echapperHTML(
            element.resume
            ||
            obtenirResumeParDefaut(
                categorie
            )
        );

    const image =
        obtenirSourceImageCulture(
            element
        );

    const wiki =
        String(
            element.wiki
            ||
            element.lien
            ||
            ""
        ).trim();

    return `

        <article
            class="culture-element"
            data-culture-id="${identifiant}"
        >

            <button
                type="button"
                class="culture-element-bouton"
                aria-expanded="false"
                aria-controls="detail-${identifiant}"
            >

                <span class="culture-element-fleche">
                    ▶
                </span>

                <span class="culture-element-titre">
                    ${titre}
                </span>

                <span class="culture-element-annee">
                    ${annee}
                </span>

            </button>


            <div
                id="detail-${identifiant}"
                class="culture-detail"
                hidden
            >

                <div class="culture-barre-fermeture">

                    <button
                        type="button"
                        class="bouton-fermer-culture"
                        aria-label="Fermer cette fiche"
                    >
                        ✕
                        <span>
                            Fermer
                        </span>
                    </button>

                </div>


                <div class="culture-detail-contenu">

                    <div class="culture-visuel">

                        ${image ? `

                            <img
                                src="${echapperHTML(image)}"
                                alt="${titre}"
                                loading="lazy"
                                data-categorie="${categorie}"
                            >

                        ` : creerPlaceholderCulture(
                            categorie
                        )}

                    </div>


                    <div class="culture-detail-texte">

                        <h3>
                            ${titre}
                        </h3>

                        <p class="culture-createur">
                            ${createur}
                        </p>

                        <p class="culture-annee">
                            ${annee}
                        </p>

                        <p class="culture-resume">
                            ${resume}
                        </p>

                        ${wiki ? `

                            <a
                                class="culture-lien-externe"
                                href="${echapperHTML(wiki)}"
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
   CRÉATION D’UNE CATÉGORIE
================================================== */

function creerCategorieCulture(
    categorie,
    elements
) {

    const configuration =
        CATEGORIES_CULTURE[categorie]
        ||
        {
            libelle: categorie,
            icone: "🎭"
        };

    return `

        <section class="culture-categorie">

            <h2 class="culture-categorie-titre">

                <span>
                    ${configuration.icone}
                </span>

                ${configuration.libelle}

                <span class="culture-categorie-compteur">
                    ${elements.length}
                </span>

            </h2>

            <div class="culture-liste">

                ${elements
                    .map(
                        (element, index) =>
                            creerFicheCulture(
                                element,
                                categorie,
                                index
                            )
                    )
                    .join("")}

            </div>

        </section>

    `;
}


/* ==================================================
   AFFICHAGE DE LA PAGE
================================================== */

async function afficherCultureDuJour() {

    const application =
        document.getElementById(
            "culture-app"
        );

    const dateElement =
        document.getElementById(
            "culture-date"
        );

    try {

        const reponse =
            await fetch(
                CULTURE_DATA_URL
                +
                "?v="
                +
                Date.now()
            );

        if (!reponse.ok) {

            throw new Error(
                `Erreur HTTP ${reponse.status}`
            );
        }

        const donnees =
            await reponse.json();

        const cle =
            obtenirCleCultureDuJour();

        const donneesJour =
            donnees[cle];

        const categories =
            regrouperCultureParCategorie(
                donneesJour
            );

        const dateComplete =
            new Intl.DateTimeFormat(
                "fr-FR",
                {
                    day: "numeric",
                    month: "long"
                }
            ).format(
                new Date()
            );

        dateElement.textContent =
            `Les découvertes culturelles d’un ${dateComplete}`;
        if (
            Object.keys(categories).length === 0
        ) {

            application.innerHTML = `

                <section class="culture-vide">

                    <div>
                        🎭
                    </div>

                    <h2>
                        Pas encore de découverte aujourd’hui
                    </h2>

                    <p>
                        Revenez demain pour ouvrir une nouvelle page du carnet.
                    </p>

                </section>

            `;

            return;
        }

        application.innerHTML = `

            <div class="culture-cahier">

                ${Object.entries(categories)
                    .map(
                        ([categorie, elements]) =>
                            creerCategorieCulture(
                                categorie,
                                elements
                            )
                    )
                    .join("")}

            </div>

        `;

        initialiserInteractionsCulture();

    } catch (erreur) {

        console.error(
            "Erreur Culture :",
            erreur
        );

        application.innerHTML = `

            <section class="culture-vide">

                <div>
                    ⚠️
                </div>

                <h2>
                    Impossible de charger la Culture du jour
                </h2>

            </section>

        `;
    }
}


/* ==================================================
   INTERACTIONS ET BOUTON STICKY
================================================== */

function initialiserInteractionsCulture() {

    const elements =
        document.querySelectorAll(
            ".culture-element"
        );

    elements.forEach(
        element => {

            const bouton =
                element.querySelector(
                    ".culture-element-bouton"
                );

            const detail =
                element.querySelector(
                    ".culture-detail"
                );

            const boutonFermer =
                element.querySelector(
                    ".bouton-fermer-culture"
                );

            const fleche =
                element.querySelector(
                    ".culture-element-fleche"
                );

            bouton.addEventListener(
                "click",
                () => {

                    const ouverture =
                        detail.hidden;

                    fermerToutesLesFichesCulture(
                        element
                    );

                    detail.hidden =
                        !ouverture;

                    bouton.setAttribute(
                        "aria-expanded",
                        String(ouverture)
                    );

                    fleche.textContent =
                        ouverture
                            ? "▼"
                            : "▶";

                    if (ouverture) {

                        cultureOuverte =
                            element.dataset
                                .cultureId;

                        setTimeout(
                            () => {

                                element.scrollIntoView({
                                    behavior: "smooth",
                                    block: "start"
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

                    fermerFicheCulture(
                        element
                    );

                    bouton.focus();
                }
            );

            const image =
                element.querySelector(
                    ".culture-visuel img"
                );

            if (image) {

                image.addEventListener(
                    "error",
                    () => {

                        const categorie =
                            image.dataset.categorie;

                        image.parentElement.innerHTML =
                            creerPlaceholderCulture(
                                categorie
                            );
                    }
                );
            }
        }
    );
}


function fermerFicheCulture(element) {

    const detail =
        element.querySelector(
            ".culture-detail"
        );

    const bouton =
        element.querySelector(
            ".culture-element-bouton"
        );

    const fleche =
        element.querySelector(
            ".culture-element-fleche"
        );

    detail.hidden = true;

    bouton.setAttribute(
        "aria-expanded",
        "false"
    );

    fleche.textContent =
        "▶";

    cultureOuverte = null;
}


function fermerToutesLesFichesCulture(
    exception = null
) {

    document
        .querySelectorAll(
            ".culture-element"
        )
        .forEach(
            element => {

                if (element !== exception) {
                    fermerFicheCulture(
                        element
                    );
                }
            }
        );
}


/* ==================================================
   DÉMARRAGE
================================================== */

document.addEventListener(
    "DOMContentLoaded",
    afficherCultureDuJour
);

function obtenirResumeParDefaut(categorie) {

    const textes = {
        film:
            "Un film à découvrir ou à redécouvrir.",

        livre:
            "Un ouvrage qui a marqué son époque.",

        disque:
            "Un album ou un enregistrement à écouter.",

        concert:
            "Un rendez-vous musical mémorable.",

        bd:
            "Une bande dessinée à parcourir.",

        "jeu vidéo":
            "Un jeu vidéo qui a marqué son univers.",

        "jeu-video":
            "Un jeu vidéo qui a marqué son univers.",

        "série tv":
            "Une série à découvrir ou à revoir.",

        "serie-tv":
            "Une série à découvrir ou à revoir.",

        opéra:
            "Une œuvre lyrique à découvrir.",

        opera:
            "Une œuvre lyrique à découvrir.",

        exposition:
            "Une exposition ou une œuvre à explorer."
    };

    return (
        textes[categorie]
        ||
        "Une découverte culturelle à explorer."
    );
}