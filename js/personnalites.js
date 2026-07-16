/* ==================================================
   AGENDA DU JOUR
   Page Personnalités
================================================== */


const PERSONNALITES_DATA_URL =
    "data/personnalites.json";


const PERSONNALITES_IMAGE_URL =
    "images/personnalites/";


/* ==================================================
   OUTILS DATE
================================================== */

function obtenirClePersonnalitesDuJour() {

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

function echapperHTMLPersonnalite(
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
   CRÉATION D'UN IDENTIFIANT
================================================== */

function creerIdentifiantPersonnalite(
    personne,
    index
) {

    if (personne.id) {

        return personne.id;

    }


    const base =
        personne.nom
        ||
        personne.name
        ||
        `personnalite-${index}`;


    return String(base)

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
   COMPATIBILITÉ ANCIEN / NOUVEAU JSON
================================================== */

function normaliserPersonnalite(
    personne
) {

    return {

        id:
            personne.id
            ||
            "",


        nom:
            personne.nom
            ||
            personne.name
            ||
            "Personnalité non renseignée",


        activite:
            personne.activite
            ||
            personne.job
            ||
            "Activité non renseignée",


        typeEvenement:
            personne.type_evenement
            ||
            personne.type
            ||
            "naissance",


        anneeNaissance:
            personne.annee_naissance
            ??
            personne.year
            ??
            null,


        anneeDeces:
            personne.annee_deces
            ??
            personne.death
            ??
            null,


        nationalite:
            personne.nationalite
            ||
            "",


        lieuNaissance:
            personne.lieu_naissance
            ||
            "",


        lieuDeces:
            personne.lieu_deces
            ||
            "",


        resume:
            personne.resume
            ||
            "",


        faitsMarquants:
            Array.isArray(
                personne.faits_marquants
            )
                ? personne.faits_marquants
                : [],


        oeuvresPrincipales:
            Array.isArray(
                personne.oeuvres_principales
            )
                ? personne.oeuvres_principales
                : [],


        distinctions:
            Array.isArray(
                personne.distinctions
            )
                ? personne.distinctions
                : [],


        image:
            personne.image
            ||
            "",


        wiki:
            personne.wiki
            ||
            "",


        sources:
            Array.isArray(
                personne.sources
            )
                ? personne.sources
                : []

    };

}


/* ==================================================
   LIBELLÉ NAISSANCE / DÉCÈS
================================================== */

function obtenirInformationsEvenement(
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


    if (
        type === "deces"
        ||
        type === "décès"
        ||
        type === "mort"
    ) {

        return {

            icone:
                "🕯️",

            libelle:
                "Décès"

        };

    }


    if (
        type === "assassinat"
    ) {

        return {

            icone:
                "⚫",

            libelle:
                "Assassinat"

        };

    }


    return {

        icone:
            "🎂",

        libelle:
            "Naissance"

    };

}


/* ==================================================
   AFFICHAGE DES ANNÉES
================================================== */

function formaterAnneesPersonnalite(
    personne
) {

    const naissance =
        personne.anneeNaissance;


    const deces =
        personne.anneeDeces;


    if (
        naissance
        &&
        deces
    ) {

        return `${naissance} — ${deces}`;

    }


    if (naissance) {

        return `Né(e) en ${naissance}`;

    }


    if (deces) {

        return `Décédé(e) en ${deces}`;

    }


    return "Dates non renseignées";

}


/* ==================================================
   ÂGE THÉORIQUE
================================================== */

function calculerAgePersonnalite(
    personne
) {

    if (
        !personne.anneeNaissance
    ) {

        return "";

    }


    const anneeActuelle =
        new Date().getFullYear();


    if (
        personne.anneeDeces
    ) {

        const ageAuDeces =
            personne.anneeDeces
            -
            personne.anneeNaissance;


        return (
            ageAuDeces > 0
                ? `${ageAuDeces} ans`
                : ""
        );

    }


    const age =
        anneeActuelle
        -
        personne.anneeNaissance;


    return (
        age > 0
            ? `${age} ans`
            : ""
    );

}


/* ==================================================
   SOURCE DE L'IMAGE
================================================== */

function obtenirSourceImagePersonnalite(
    image
) {

    const valeur =
        String(
            image
            ||
            ""
        ).trim();


    if (!valeur) {

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
        PERSONNALITES_IMAGE_URL
        +
        valeur
    );

}


/* ==================================================
   PLACEHOLDER
================================================== */

function creerPlaceholderPersonnalite() {

    return `

        <div class="personnalite-placeholder">

            <div class="personnalite-placeholder-icone">

                👤

            </div>

            <div>

                Portrait non disponible

            </div>

        </div>

    `;

}


/* ==================================================
   RÉSUMÉ PAR DÉFAUT
================================================== */

function obtenirResumePersonnalite(
    personne
) {

    if (
        personne.resume
    ) {

        return personne.resume;

    }


    const nom =
        personne.nom;


    const activite =
        personne.activite;


    return (
        `${nom} est connu(e) notamment comme ${activite.toLowerCase()}. `
        +
        "Cette fiche pourra être progressivement enrichie avec une biographie, "
        +
        "ses principales réalisations et des informations sourcées."
    );

}


/* ==================================================
   CRÉATION D'UNE LISTE DE DÉTAILS
================================================== */

function creerListePersonnalite(
    titre,
    elements,
    icone
) {

    if (
        !Array.isArray(elements)
        ||
        elements.length === 0
    ) {

        return "";

    }


    return `

        <section class="personnalite-section-detail">

            <h4>

                ${icone} ${titre}

            </h4>

            <ul>

                ${elements

                    .map(
                        element => `

                            <li>

                                ${echapperHTMLPersonnalite(
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

function creerFichePersonnalite(
    personneBrute,
    index
) {

    const personne =
        normaliserPersonnalite(
            personneBrute
        );


    const identifiant =
        creerIdentifiantPersonnalite(
            personne,
            index
        );


    const evenement =
        obtenirInformationsEvenement(
            personne.typeEvenement
        );


    const nom =
        echapperHTMLPersonnalite(
            personne.nom
        );


    const activite =
        echapperHTMLPersonnalite(
            personne.activite
        );


    const annees =
        echapperHTMLPersonnalite(
            formaterAnneesPersonnalite(
                personne
            )
        );


    const age =
        calculerAgePersonnalite(
            personne
        );


    const image =
        obtenirSourceImagePersonnalite(
            personne.image
        );


    const resume =
        echapperHTMLPersonnalite(
            obtenirResumePersonnalite(
                personne
            )
        );


    const wiki =
        String(
            personne.wiki
            ||
            ""
        ).trim();


    const informationsComplementaires = [

        personne.nationalite
            ? `
                <div>
                    🌍
                    <strong>Nationalité :</strong>
                    ${echapperHTMLPersonnalite(
                        personne.nationalite
                    )}
                </div>
            `
            : "",


        personne.lieuNaissance
            ? `
                <div>
                    📍
                    <strong>Lieu de naissance :</strong>
                    ${echapperHTMLPersonnalite(
                        personne.lieuNaissance
                    )}
                </div>
            `
            : "",


        personne.lieuDeces
            ? `
                <div>
                    🕯️
                    <strong>Lieu de décès :</strong>
                    ${echapperHTMLPersonnalite(
                        personne.lieuDeces
                    )}
                </div>
            `
            : ""

    ]
        .filter(
            Boolean
        )
        .join("");


    return `

        <article
            class="personnalite-element"
            data-personnalite-id="${identifiant}"
        >

            <button
                type="button"
                class="personnalite-element-bouton"
                aria-expanded="false"
                aria-controls="detail-${identifiant}"
            >

                <span class="personnalite-element-fleche">

                    ▶

                </span>


                <span class="personnalite-element-identite">

                    <strong>

                        ${nom}

                    </strong>

                    <small>

                        ${activite}

                    </small>

                </span>


                <span class="personnalite-element-evenement">

                    ${evenement.icone}

                    ${evenement.libelle}

                </span>


                <span class="personnalite-element-annees">

                    ${annees}

                </span>

            </button>


            <div
                id="detail-${identifiant}"
                class="personnalite-detail"
                hidden
            >

                <div class="personnalite-barre-fermeture">

                    <button
                        type="button"
                        class="bouton-fermer-personnalite"
                        aria-label="Fermer cette fiche"
                    >

                        ✕

                        <span>

                            Fermer

                        </span>

                    </button>

                </div>


                <div class="personnalite-fiche">

                    <div class="personnalite-portrait">

                        ${image ? `

                            <img
                                src="${echapperHTMLPersonnalite(
                                    image
                                )}"
                                alt="Portrait de ${nom}"
                                loading="lazy"
                            >

                        ` : creerPlaceholderPersonnalite()}

                    </div>


                    <div class="personnalite-contenu">

                        <div class="personnalite-badge-evenement">

                            ${evenement.icone}

                            ${evenement.libelle}

                        </div>


                        <h2>

                            ${nom}

                        </h2>


                        <div class="personnalite-activite">

                            ${activite}

                        </div>


                        <div class="personnalite-dates">

                            ${annees}

                            ${age ? `

                                <span>

                                    • ${age}

                                </span>

                            ` : ""}

                        </div>


                        ${informationsComplementaires ? `

                            <div class="personnalite-informations">

                                ${informationsComplementaires}

                            </div>

                        ` : ""}


                        <p class="personnalite-resume">

                            ${resume}

                        </p>


                        ${creerListePersonnalite(
                            "Faits marquants",
                            personne.faitsMarquants,
                            "✨"
                        )}


                        ${creerListePersonnalite(
                            "Œuvres ou réalisations principales",
                            personne.oeuvresPrincipales,
                            "📚"
                        )}


                        ${creerListePersonnalite(
                            "Distinctions",
                            personne.distinctions,
                            "🏆"
                        )}


                        ${wiki ? `

                            <a
                                class="personnalite-lien-externe"
                                href="${echapperHTMLPersonnalite(
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

function fermerFichePersonnalite(
    element
) {

    const detail =
        element.querySelector(
            ".personnalite-detail"
        );


    const bouton =
        element.querySelector(
            ".personnalite-element-bouton"
        );


    const fleche =
        element.querySelector(
            ".personnalite-element-fleche"
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

function fermerToutesLesFichesPersonnalites(
    exception = null
) {

    document
        .querySelectorAll(
            ".personnalite-element"
        )
        .forEach(
            element => {

                if (
                    element !== exception
                ) {

                    fermerFichePersonnalite(
                        element
                    );

                }

            }
        );

}


/* ==================================================
   INITIALISATION DES INTERACTIONS
================================================== */

function initialiserInteractionsPersonnalites() {

    document
        .querySelectorAll(
            ".personnalite-element"
        )
        .forEach(
            element => {

                const bouton =
                    element.querySelector(
                        ".personnalite-element-bouton"
                    );


                const detail =
                    element.querySelector(
                        ".personnalite-detail"
                    );


                const fleche =
                    element.querySelector(
                        ".personnalite-element-fleche"
                    );


                const boutonFermer =
                    element.querySelector(
                        ".bouton-fermer-personnalite"
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


                        fermerToutesLesFichesPersonnalites(
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

                        fermerFichePersonnalite(
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
                        ".personnalite-portrait img"
                    );


                if (
                    image
                ) {

                    image.addEventListener(
                        "error",
                        () => {

                            image.parentElement.innerHTML =
                                creerPlaceholderPersonnalite();

                        }
                    );

                }

            }
        );

}


/* ==================================================
   AFFICHAGE DE LA PAGE
================================================== */

async function afficherPersonnalitesDuJour() {

    const contenu =
        document.getElementById(
            "personnalites-contenu"
        );


    const dateElement =
        document.getElementById(
            "personnalites-date"
        );


    if (
        !contenu
    ) {

        return;

    }


    try {

        const reponse =
            await fetch(

                PERSONNALITES_DATA_URL

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
            obtenirClePersonnalitesDuJour();


        const personnalites =
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
                `Ils sont nés ou ont marqué un ${dateComplete}`;

        }


        if (
            personnalites.length === 0
        ) {

            contenu.innerHTML = `

                <section class="personnalites-vide">

                    <div class="personnalites-vide-icone">

                        👤

                    </div>

                    <h2>

                        Aucune personnalité renseignée pour cette date

                    </h2>

                    <p>

                        Cette journée pourra être enrichie prochainement.

                    </p>

                </section>

            `;

            return;

        }


        contenu.innerHTML = `

            <div class="personnalites-dossier">

                <div class="personnalites-introduction">

                    <strong>

                        ${personnalites.length}

                    </strong>

                    personnalité${

                        personnalites.length > 1
                            ? "s"
                            : ""

                    } à découvrir

                </div>


                <div class="personnalites-liste">

                    ${personnalites

                        .map(
                            creerFichePersonnalite
                        )

                        .join("")}

                </div>

            </div>

        `;


        initialiserInteractionsPersonnalites();


    } catch (
        erreur
    ) {

        console.error(
            "Erreur Personnalités :",
            erreur
        );


        contenu.innerHTML = `

            <section class="personnalites-vide">

                <div class="personnalites-vide-icone">

                    ⚠️

                </div>

                <h2>

                    Impossible de charger les personnalités

                </h2>

                <p>

                    Vérifie que le fichier
                    data/personnalites.json
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

    afficherPersonnalitesDuJour

);