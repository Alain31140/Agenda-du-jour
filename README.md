# Agenda du Jour

Application web responsive présentant les informations liées à la date du jour.

## Fonctionnalités principales

- Date et heure en temps réel
- Message selon la tranche horaire
- Saint du jour
- Journée mondiale
- Célébration du mois
- Dicton du jour
- Phase de la Lune
- Soleil et météo locale
- Localisation GPS et carte interactive
- Culture du jour
- Personnalités du jour
- Événements du jour

## Organisation du projet

```text
Agenda-du-jour/
├── index.html
├── culture.html
├── personnalites.html
├── evenements.html
│
├── css/
│   └── style.css
│
├── js/
│   ├── app.js
│   ├── accueil.js
│   ├── compteur.js
│   ├── lune.js
│   ├── soleil-meteo.js
│   ├── localisation.js
│   ├── culture.js
│   ├── personnalites.js
│   └── evenements.js
│
├── data/
│   ├── accueil-langue.json
│   ├── celebrations-mensuelles.json
│   ├── culture.json
│   ├── dictons-du-jour.json
│   ├── evenements-enrichis.json
│   ├── journees-mondiales.json
│   ├── personnalites-enrichis-avec-images.json
│   └── saints.json
│
├── images/
│   ├── culture/
│   ├── lune/
│   ├── personnalites/
│   ├── evenements/
│   └── placeholders/
│
├── docs/
│   ├── schema-culture.md
│   ├── schema-personnalites.md
│   ├── schema-evenements.md
│   └── CHANGELOG.md
│
├── credits/
│   ├── images.json
│   ├── sources.json
│   └── licences.md
│
└── outils/
    ├── enrichir-culture.js
    ├── enrichir-personnalites.js
    └── enrichir-evenements.js
```

## Lancement en local

Le projet utilise `fetch()` pour charger les fichiers JSON. Il ne faut donc pas ouvrir `index.html` directement avec une adresse `file://`.

Dans Visual Studio Code :

1. Ouvrir le dossier `Agenda-du-jour`
2. Ouvrir `index.html`
3. Cliquer sur **Go Live**
4. Utiliser l’adresse locale, par exemple :

```text
http://127.0.0.1:5500/
```

## Mise en ligne

Le site est publié avec GitHub Pages.

Après modification :

1. Enregistrer les fichiers
2. Ouvrir GitHub Desktop
3. Créer un commit
4. Cliquer sur **Push origin**
5. Tester la version publiée

Adresse du site :

```text
https://alain31140.github.io/Agenda-du-jour/
```

## Données

Les fichiers JSON sont stockés dans le dossier `data/`.

La structure générale utilisée pour les contenus du jour est :

```json
{
  "16-07": {
    "items": []
  }
}
```

Chaque élément culturel peut contenir notamment :

```json
{
  "id": "film-metropolis-1927",
  "type": "film",
  "titre": "Metropolis",
  "createur": "Fritz Lang",
  "annee": 1927,
  "date_agenda": "16-07",
  "date_evenement": null,
  "date_precision": "a-verifier",
  "date_source": null,
  "resume": null,
  "importance": null,
  "tags": [],
  "image": null,
  "image_source": null,
  "image_auteur": null,
  "image_licence": null,
  "image_verifiee": false,
  "wiki": null,
  "sources": [],
  "statut_verification": "a-verifier"
}
```

## Règles éditoriales

- Ne jamais présenter une date comme certaine sans source fiable.
- Conserver la source des informations.
- Utiliser uniquement des images dont la licence est connue.
- Privilégier les images locales.
- Afficher un visuel de remplacement lorsqu’une image manque.
- Masquer les boutons inutiles lorsqu’un lien n’existe pas.
- Ne jamais laisser apparaître une image cassée ou un champ vide disgracieux.

## Crédits des images

Les informations de licence doivent être conservées dans le dossier `credits/`.

Exemple :

```json
{
  "culture/film/metropolis.jpg": {
    "source": "Wikimedia Commons",
    "auteur": "Auteur à préciser",
    "licence": "Domaine public",
    "url_source": "URL de la page du fichier"
  }
}
```

## État actuel

- Accueil opérationnel
- Données locales dans `data/`
- Lune opérationnelle
- Soleil et météo opérationnels
- Localisation et carte opérationnelles
- Menu principal opérationnel
- Page Culture opérationnelle
- Personnalités à développer
- Événements à développer
- Enrichissement des données en cours

## Auteur

Projet personnel réalisé et maintenu par Alain Danès.
