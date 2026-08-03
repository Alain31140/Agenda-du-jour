/* ==================================================
   STATISTIQUES ANONYMES DE VISITE

   - Aucun nom, e-mail, GPS ou adresse IP n'est envoyé
     volontairement par le site.
   - Un identifiant aléatoire temporaire relie les pages
     consultées dans un même onglet.
   - Make regroupera ces signaux et enverra une seule
     notification récapitulative après inactivité.
     test
================================================== */

(() => {
    "use strict";

    const WEBHOOK_VISITES =
    "https://hook.eu1.make.com/na702ao24jhdj5c84xbmbfmee3n5pkxt";

    const CLE_SESSION = "agenda_visite_anonyme_v1";

    const maintenantISO = () => new Date().toISOString();

    function maintenantFrancais() {
    return new Date().toLocaleString("fr-FR", {
        timeZone: "Europe/Paris",
        dateStyle: "short",
        timeStyle: "medium"
    });
}
    function creerIdentifiantTemporaire() {
        if (window.crypto?.randomUUID) {
            return window.crypto.randomUUID();
        }

        return [
            Date.now().toString(36),
            Math.random().toString(36).slice(2),
            Math.random().toString(36).slice(2)
        ].join("-");
    }

    function typeAppareil() {
        const agent = navigator.userAgent || "";

        if (/ipad|tablet|playbook|silk/i.test(agent)) {
            return "tablette";
        }

        if (/mobi|iphone|ipod|android/i.test(agent)) {
            return "téléphone";
        }

        return "ordinateur";
    }

    function systemeExploitation() {
        const agent = navigator.userAgent || "";

        if (/windows/i.test(agent)) return "Windows";
        if (/iphone|ipad|ipod/i.test(agent)) return "iOS / iPadOS";
        if (/android/i.test(agent)) return "Android";
        if (/macintosh|mac os x/i.test(agent)) return "macOS";
        if (/linux/i.test(agent)) return "Linux";

        return "Inconnu";
    }

    function navigateurUtilise() {
        const agent = navigator.userAgent || "";

        if (/edg/i.test(agent)) return "Edge";
        if (/opr|opera/i.test(agent)) return "Opera";
        if (/firefox|fxios/i.test(agent)) return "Firefox";
        if (/chrome|crios/i.test(agent) && !/edg|opr/i.test(agent)) {
            return "Chrome";
        }
        if (/safari/i.test(agent) && !/chrome|crios|android/i.test(agent)) {
            return "Safari";
        }

        return "Inconnu";
    }
    function nomRubrique() {
        const fichier =
            window.location.pathname.split("/").pop() || "index.html";

        const rubriques = {
            "index.html": "Accueil",
            "": "Accueil",
            "menu.html": "Menu",
            "culture.html": "Culture",
            "personnalites.html": "Personnalités",
            "evenements.html": "Événements",
            "message.html": "Contact",
            "a-propos.html": "À propos",
            "confidentialite.html": "Confidentialité",
            "credits.html": "Crédits",
            "versions.html": "Versions"
        };

        return rubriques[fichier] || document.title || fichier;
    }

    function lireSession() {
        try {
            const brute = sessionStorage.getItem(CLE_SESSION);
            return brute ? JSON.parse(brute) : null;
        } catch (erreur) {
            console.warn("Session de visite illisible :", erreur);
            return null;
        }
    }

    function enregistrerSession(session) {
        try {
            sessionStorage.setItem(CLE_SESSION, JSON.stringify(session));
        } catch (erreur) {
            console.warn("Session de visite non enregistrée :", erreur);
        }
    }

    function origineVisite(sessionExistante) {
        const parametres = new URLSearchParams(window.location.search);
        const source = (parametres.get("src") || "").toLowerCase();

        if (source === "qr") {
            return "QR code";
        }

        return sessionExistante?.origine || "Lien direct";
    }

    let session = lireSession();

    if (!session) {
        session = {
            identifiant: creerIdentifiantTemporaire(),
            debut: maintenantISO(),
            derniereActivite: maintenantISO(),
            secondesActives: 0,
            origine: origineVisite(null),
            appareil: typeAppareil(),
            os: systemeExploitation(),
            navigateur: navigateurUtilise(),        
            rubriques: []
        };
    } else {
        session.origine = origineVisite(session);
    }

    const rubrique = nomRubrique();

    if (!session.rubriques.includes(rubrique)) {
        session.rubriques.push(rubrique);
    }

    session.derniereActivite = maintenantISO();
    enregistrerSession(session);

    let dernierChrono = Date.now();

    function actualiserTempsActif() {
        const courant = Date.now();

        if (document.visibilityState === "visible" && document.hasFocus()) {
            const ecoulees = Math.max(
                0,
                Math.round((courant - dernierChrono) / 1000)
            );

            // Évite qu'un ordinateur réveillé après une longue veille
            // ajoute artificiellement plusieurs heures de visite.
            session.secondesActives += Math.min(ecoulees, 90);
        }

        dernierChrono = courant;
        session.derniereActivite = maintenantISO();
        enregistrerSession(session);
    }

    function creerDonnees(typeSignal) {
        actualiserTempsActif();

        const donnees = new URLSearchParams();
        donnees.set("typeSignal", typeSignal);
        donnees.set("identifiant", session.identifiant);
        donnees.set("debut", session.debut);
        donnees.set("derniereActivite", session.derniereActivite);
        donnees.set("secondesActives", String(session.secondesActives));
        donnees.set("origine", session.origine);
        donnees.set("appareil", session.appareil);
        donnees.set("os", session.os);
        donnees.set("navigateur", session.navigateur);
        donnees.set("rubrique", rubrique);
        donnees.set("rubriques", session.rubriques.join(" → "));
        donnees.set("lieu", session.lieu || "Non renseigné");
        donnees.set("coordonnees",session.coordonnees || "Non disponibles");
        donnees.set("debutFrancais", maintenantFrancais());
        return donnees;
    }

    function envoyerSignal(typeSignal, utiliserBeacon = false) {
        const donnees = creerDonnees(typeSignal);

        if (utiliserBeacon && navigator.sendBeacon) {
            const envoye = navigator.sendBeacon(WEBHOOK_VISITES, donnees);

            if (envoye) {
                return;
            }
        }

    

        fetch(WEBHOOK_VISITES, {
            method: "POST",
            body: donnees,
            keepalive: true,
            cache: "no-store"
        }).catch((erreur) => {
            console.warn("Signal de visite non transmis :", erreur);
        });
    }

    function signalerActivite() {
        session.derniereActivite = maintenantISO();
        enregistrerSession(session);
    }

    ["click", "touchstart", "keydown", "scroll"].forEach((evenement) => {
        window.addEventListener(evenement, signalerActivite, {
            passive: true
        });
    });

    window.addEventListener("pagehide", () => {
        envoyerSignal("sortie-page", true);
    });

    window.addEventListener("pagehide", () => {
        envoyerSignal("sortie-page", true);
    });

    window.addEventListener("pageshow", () => {
        dernierChrono = Date.now();
    });
    function demanderLocalisationPuisEnvoyer() {
        if (!navigator.geolocation) {
            session.lieu = "Localisation indisponible";
            session.coordonnees = "Non disponibles";

            enregistrerSession(session);
            envoyerSignal("ouverture-page");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                session.coordonnees =
                    `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

                session.lieu = await rechercherCommune(
                    latitude,
                    longitude
                );

                enregistrerSession(session);
                envoyerSignal("ouverture-page");
            },

            (erreur) => {
                session.coordonnees = "Non disponibles";

                if (erreur.code === erreur.PERMISSION_DENIED) {
                    session.lieu = "Localisation refusée";
                } else if (erreur.code === erreur.TIMEOUT) {
                    session.lieu = "Localisation non obtenue à temps";
                } else {
                    session.lieu = "Localisation indisponible";
                }

                enregistrerSession(session);
                envoyerSignal("ouverture-page");
            },

            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 300000
            }
        );
    }
        async function rechercherCommune(latitude, longitude) {
            const url =
                "https://nominatim.openstreetmap.org/reverse" +
                `?format=jsonv2` +
                `&lat=${encodeURIComponent(latitude)}` +
                `&lon=${encodeURIComponent(longitude)}` +
                "&addressdetails=1" +
                "&zoom=10" +
                "&accept-language=fr";

            try {
                const reponse = await fetch(url, {
                    method: "GET",
                    headers: {
                        Accept: "application/json"
                    },
                    cache: "no-store"
                });

                if (!reponse.ok) {
                    throw new Error(
                        `Erreur de géocodage : ${reponse.status}`
                    );
                }

                const resultat = await reponse.json();
                const adresse = resultat.address || {};

                return (
                    adresse.city ||
                    adresse.town ||
                    adresse.village ||
                    adresse.municipality ||
                    adresse.commune ||
                    adresse.county ||
                    "Commune inconnue"
                );
            } catch (erreur) {
                console.warn(
                    "Recherche de la commune impossible :",
                    erreur
                );

                return "Commune inconnue";
            }
        }
    demanderLocalisationPuisEnvoyer();
})();
