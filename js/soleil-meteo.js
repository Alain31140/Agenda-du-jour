/* ==================================================
   AGENDA DU JOUR
   Module Soleil et météo locale
================================================== */


/* ==================================================
   ÉTAT DU MODULE
================================================== */

let coucherSoleilActuel = null;
let leverSoleilActuel = null;
let intervalleSoleil = null;


/* ==================================================
   GÉOLOCALISATION
================================================== */

function obtenirPositionVisiteur() {

    return new Promise(
        (resolve, reject) => {

            if (!navigator.geolocation) {

                reject(
                    new Error(
                        "Géolocalisation non disponible"
                    )
                );

                return;
            }

            navigator.geolocation.getCurrentPosition(

                position => {

                    resolve({
                        latitude:
                            position.coords.latitude,

                        longitude:
                            position.coords.longitude
                    });
                },

                erreur => {

                    reject(erreur);
                },

                {
                    enableHighAccuracy: false,
                    timeout: 10000,
                    maximumAge: 300000
                }
            );
        }
    );
}


/* ==================================================
   INTERPRÉTATION DU CODE MÉTÉO
================================================== */

function traduireCodeMeteo(code) {

    const descriptions = {

        0: [
            "☀️",
            "Ciel dégagé"
        ],

        1: [
            "🌤️",
            "Principalement dégagé"
        ],

        2: [
            "⛅",
            "Quelques nuages"
        ],

        3: [
            "☁️",
            "Ciel couvert"
        ],

        45: [
            "🌫️",
            "Brouillard"
        ],

        48: [
            "🌫️",
            "Brouillard givrant"
        ],

        51: [
            "🌦️",
            "Bruine légère"
        ],

        53: [
            "🌦️",
            "Bruine modérée"
        ],

        55: [
            "🌧️",
            "Bruine forte"
        ],

        61: [
            "🌦️",
            "Pluie légère"
        ],

        63: [
            "🌧️",
            "Pluie modérée"
        ],

        65: [
            "🌧️",
            "Forte pluie"
        ],

        71: [
            "🌨️",
            "Faibles chutes de neige"
        ],

        73: [
            "🌨️",
            "Chutes de neige"
        ],

        75: [
            "❄️",
            "Fortes chutes de neige"
        ],

        80: [
            "🌦️",
            "Averses légères"
        ],

        81: [
            "🌧️",
            "Averses"
        ],

        82: [
            "⛈️",
            "Fortes averses"
        ],

        95: [
            "⛈️",
            "Orage"
        ],

        96: [
            "⛈️",
            "Orage avec grêle"
        ],

        99: [
            "⛈️",
            "Fort orage avec grêle"
        ]
    };

    return (
        descriptions[code]
        ||
        [
            "🌡️",
            "Conditions météo inconnues"
        ]
    );
}


/* ==================================================
   FORMATAGE
================================================== */

function formaterHeureSoleil(date) {

    return new Intl.DateTimeFormat(
        "fr-FR",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    ).format(date);
}


function formaterDureeSecondes(secondes) {

    const valeur =
        Math.max(
            0,
            Math.floor(secondes)
        );

    const heures =
        Math.floor(
            valeur / 3600
        );

    const minutes =
        Math.floor(
            (valeur % 3600) / 60
        );

    const secondesRestantes =
        valeur % 60;

    return (
        `${heures}h ` +
        `${String(minutes).padStart(2, "0")}min ` +
        `${String(secondesRestantes).padStart(2, "0")}s`
    );
}


/* ==================================================
   CHARGEMENT OPEN-METEO
================================================== */

async function chargerSoleilMeteo(
    latitude,
    longitude
) {

    const parametres =
        new URLSearchParams({

            latitude:
                latitude.toString(),

            longitude:
                longitude.toString(),

            current:
                [
                    "temperature_2m",
                    "weather_code"
                ].join(","),

            daily:
                [
                    "sunrise",
                    "sunset",
                    "daylight_duration"
                ].join(","),

            timezone:
                "auto",

            forecast_days:
                "1"
        });

    const url =
        "https://api.open-meteo.com/v1/forecast?"
        +
        parametres.toString();

    const reponse =
        await fetch(url);

    if (!reponse.ok) {

        throw new Error(
            "Erreur météo HTTP "
            +
            reponse.status
        );
    }

    return await reponse.json();
}


/* ==================================================
   CRÉATION DE LA CARTE SOLEIL + MÉTÉO
================================================== */

async function creerCarteSoleilMeteo() {

    try {

        const position =
            await obtenirPositionVisiteur();

        const donnees =
            await chargerSoleilMeteo(
                position.latitude,
                position.longitude
            );

        const lever =
            new Date(
                donnees.daily.sunrise[0]
            );

        const coucher =
            new Date(
                donnees.daily.sunset[0]
            );

        leverSoleilActuel =
            lever;

        coucherSoleilActuel =
            coucher;

        const dureeJour =
            formaterDureeSecondes(
                donnees.daily
                    .daylight_duration[0]
            );

        const temperature =
            Number(
                donnees.current
                    .temperature_2m
            ).toLocaleString(
                "fr-FR",
                {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1
                }
            );

        const [
            iconeMeteo,
            texteMeteo
        ] =
            traduireCodeMeteo(
                donnees.current.weather_code
            );

        const codeMeteo =
            donnees.current.weather_code;

        return `

            <article
                class="
                    info-carte
                    soleil-meteo-carte
                    meteo-code-${codeMeteo}
                "
            >

                <div class="info-carte-titre">
                    ☀️ Soleil
                </div>

                <div class="soleil-ligne">

                    🌅 Lever :

                    <strong>
                        ${formaterHeureSoleil(
                            lever
                        )}
                    </strong>

                </div>

                <div class="soleil-ligne">

                    🌇 Coucher :

                    <strong>
                        ${formaterHeureSoleil(
                            coucher
                        )}
                    </strong>

                </div>

                <div class="soleil-ligne">

                    ☀️ Durée du jour :

                    <strong>
                        ${dureeJour}
                    </strong>

                </div>

                <div
                    id="compte-rebours-soleil"
                    class="compte-rebours-soleil"
                >

                    Calcul du temps restant…

                </div>

                <div class="meteo-separateur"></div>

                <div class="meteo-icone">
                    ${iconeMeteo}
                </div>

                <div class="meteo-description">
                    ${texteMeteo}
                </div>

                <div class="meteo-temperature">

                    🌡️ ${temperature} °C

                </div>

            </article>

        `;

    } catch (erreur) {

        console.error(
            "Erreur Soleil / météo :",
            erreur
        );

        return `

            <article
                class="
                    info-carte
                    soleil-meteo-carte
                    meteo-indisponible
                "
            >

                <div class="info-carte-titre">
                    ☀️ Soleil
                </div>

                <div class="meteo-erreur">

                    📍 Autorisez la localisation
                    pour afficher la météo locale
                    et les horaires du Soleil.

                </div>

            </article>

        `;
    }
}


/* ==================================================
   MISE À JOUR DU COMPTE À REBOURS
================================================== */

function actualiserCompteReboursSoleil() {

    const element =
        document.getElementById(
            "compte-rebours-soleil"
        );

    if (
        !element
        ||
        !coucherSoleilActuel
        ||
        !leverSoleilActuel
    ) {
        return;
    }

    const maintenant =
        new Date();

    let texte = "";

    if (
        maintenant
        <
        leverSoleilActuel
    ) {

        const secondes =
            (
                leverSoleilActuel
                -
                maintenant
            )
            /
            1000;

        texte = `

            ⏳ Temps restant avant le lever du soleil :

            <strong>
                ${formaterDureeSecondes(
                    secondes
                )}
            </strong>

        `;

    } else if (
        maintenant
        <
        coucherSoleilActuel
    ) {

        const secondes =
            (
                coucherSoleilActuel
                -
                maintenant
            )
            /
            1000;

        texte = `

            ⏳ Temps restant avant le coucher du soleil :

            <strong>
                ${formaterDureeSecondes(
                    secondes
                )}
            </strong>

        `;

    } else {

        texte =
            "🌙 Le soleil est couché pour aujourd’hui.";
    }

    element.innerHTML =
        texte;
}


/* ==================================================
   DÉMARRAGE DU COMPTE À REBOURS
================================================== */

function demarrerCompteReboursSoleil() {

    if (intervalleSoleil) {

        clearInterval(
            intervalleSoleil
        );
    }

    actualiserCompteReboursSoleil();

    intervalleSoleil =
        setInterval(
            actualiserCompteReboursSoleil,
            1000
        );
}