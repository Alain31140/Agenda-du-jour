function afficherHeader() {

    const emplacement =
        document.getElementById(
            "barre-navigation"
        );

    if (!emplacement) {
        return;
    }

    emplacement.innerHTML = `
        <nav class="entete-navigation">

            <a
                href="index.html"
                class="entete-lien"
            >
                🏠 Accueil
            </a>

            <a
                href="menu.html"
                class="entete-lien"
            >
                ☰ Menu
            </a>

        </nav>
    `;
}

document.addEventListener(
    "DOMContentLoaded",
    afficherHeader
);