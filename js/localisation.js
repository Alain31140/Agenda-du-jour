/* ==================================================
   AGENDA DU JOUR
   Module Localisation
================================================== */


/* ==================================================
   ÉTAT DU MODULE
================================================== */

let carteLocalisation = null;
let positionLocalisation = null;


/* ==================================================
   RECHERCHE DE L’ADRESSE
================================================== */

async function chargerAdressePosition(
    latitude,
    longitude
) {

    const parametres =
        new URLSearchParams({

            format: "jsonv2",

            lat:
                latitude.toString(),

            lon:
                longitude.toString(),

            zoom: "18",

            addressdetails: "1",

            "accept-language": "fr"

        });


    const url =
        "https://nominatim.openstreetmap.org/reverse?"
        +
        parametres.toString();


    const reponse =
        await fetch(url);


    if (!reponse.ok) {

        throw new Error(
            "Erreur adresse HTTP "
            +
            reponse.status
        );

    }


    return await reponse.json();

}


/* ==================================================
   CRÉATION DE LA CARTE LOCALISATION
================================================== */

async function creerCarteLocalisation() {

    try {

        /*
           Cette fonction existe déjà
           dans soleil-meteo.js
        */

        const position =
            await obtenirPositionVisiteur();


        positionLocalisation = {
            latitude:
                position.latitude,

            longitude:
                position.longitude
        };


        const resultat =
            await chargerAdressePosition(
                position.latitude,
                position.longitude
            );


        const adresse =
            resultat.display_name
            ||
            "Adresse non disponible";


        const latitudeAffichee =
            Number(
                position.latitude
            ).toFixed(5);


        const longitudeAffichee =
            Number(
                position.longitude
            ).toFixed(5);


        return `

            <article class="info-carte localisation-carte">

                <div class="info-carte-titre">

                    📍 Position

                </div>


                <div class="localisation-sous-titre">

                    📍 On est ici

                </div>


                <div class="localisation-adresse">

                    ${adresse}

                </div>


                <div class="localisation-coordonnees">

                    <div>

                        Lat :

                        <strong>
                            ${latitudeAffichee}
                        </strong>

                    </div>


                    <div>

                        Lon :

                        <strong>
                            ${longitudeAffichee}
                        </strong>

                    </div>

                </div>


                <div
                    id="conteneur-carte-position"
                    class="conteneur-carte-position"
                >

                    <div
                        id="carte-position"
                        class="carte-position"
                    ></div>

                    <button
                        type="button"
                        id="bouton-plein-ecran"
                        class="bouton-plein-ecran"
                        title="Afficher la carte en plein écran"
                        aria-label="Afficher la carte en plein écran"
                    >
                        ⛶
                    </button>

                </div>

            </article>

        `;


    } catch (erreur) {

        console.error(
            "Erreur localisation :",
            erreur
        );


        return `

            <article class="info-carte localisation-carte">

                <div class="info-carte-titre">

                    📍 Position

                </div>


                <div class="localisation-erreur">

                    Autorisez la localisation
                    pour connaître votre position.

                </div>

            </article>

        `;

    }

}


/* ==================================================
   INITIALISATION DU BOUTON
================================================== */

function initialiserLocalisation() {

    const conteneur =
        document.getElementById(
            "conteneur-carte-position"
        );

    const bouton =
        document.getElementById(
            "bouton-plein-ecran"
        );

    if (
        !conteneur
        ||
        !bouton
        ||
        !positionLocalisation
    ) {
        return;
    }


    /*
       La petite carte est affichée
       immédiatement.
    */

    afficherCarteLocalisation();


    bouton.addEventListener(
        "click",
        evenement => {

            evenement.stopPropagation();

            basculerCartePleinEcran();

        }
    );


    /*
       Un clic sur la petite carte
       l’ouvre également en grand.
    */

    conteneur.addEventListener(
        "click",
        evenement => {

            if (
                conteneur.classList.contains(
                    "plein-ecran"
                )
            ) {
                return;
            }

            if (
                evenement.target.closest(
                    ".leaflet-control"
                )
            ) {
                return;
            }

            basculerCartePleinEcran();

        }
    );
}

function basculerCartePleinEcran() {

    const conteneur =
        document.getElementById(
            "conteneur-carte-position"
        );

    const bouton =
        document.getElementById(
            "bouton-plein-ecran"
        );

    if (
        !conteneur
        ||
        !bouton
    ) {
        return;
    }


    const ouverture =
        !conteneur.classList.contains(
            "plein-ecran"
        );


    conteneur.classList.toggle(
        "plein-ecran",
        ouverture
    );


    document.body.classList.toggle(
        "carte-ouverte",
        ouverture
    );


    bouton.textContent =
        ouverture
            ? "✕"
            : "⛶";


    bouton.title =
        ouverture
            ? "Fermer la carte"
            : "Afficher la carte en plein écran";


    setTimeout(
        () => {

            if (carteLocalisation) {

                carteLocalisation
                    .invalidateSize();

            }

        },
        150
    );
}

/* ==================================================
   AFFICHAGE LEAFLET
================================================== */

function afficherCarteLocalisation() {

    const latitude =
        positionLocalisation.latitude;


    const longitude =
        positionLocalisation.longitude;


    if (!carteLocalisation) {

        carteLocalisation =
            L.map(
                "carte-position"
            ).setView(
                [
                    latitude,
                    longitude
                ],
                16
            );


        L.tileLayer(
            "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                maxZoom: 19,

                attribution:
                    "&copy; OpenStreetMap"
            }
        ).addTo(
            carteLocalisation
        );


        L.marker(
            [
                latitude,
                longitude
            ]
        )
            .addTo(
                carteLocalisation
            )
            .bindPopup(
                "📍 Vous êtes ici"
            )
            .openPopup();

    } else {

        carteLocalisation.setView(
            [
                latitude,
                longitude
            ],
            16
        );

    }


    /*
       Leaflet doit recalculer la taille
       après l’ouverture du conteneur
    */

    setTimeout(
        () => {

            carteLocalisation
                .invalidateSize();

        },
        100
    );

}