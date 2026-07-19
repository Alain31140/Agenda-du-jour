function afficherFooter() {

    const emplacement =
        document.getElementById(
            "pied-page"
        );

    if (!emplacement) {
        return;
    }

    emplacement.innerHTML = `
        <footer class="pied-page-fixe">

            <div class="pied-page-liens">

                <a href="a-propos.html">
                    ℹ️ À propos
                </a>

                <a href="credits.html">
                    📚 Sources
                </a>

                <a href="versions.html">
                    📝 Versions
                </a>

                <a href="confidentialite.html">
                    🔒 Confidentialité
                </a>

                <a href="message.html?origine=Accueil">
                    💬 Contact
                </a>

            </div>

            <div class="pied-page-version">
                Agenda du Jour — Version 1.0
            </div>

        </footer>
    `;
}

document.addEventListener(
    "DOMContentLoaded",
    afficherFooter
);