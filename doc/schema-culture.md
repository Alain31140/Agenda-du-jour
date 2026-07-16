Bibliothèque
/schema-culture.md

# Schéma Culture — Agenda du jour

La structure principale reste :

```json
{
  "JJ-MM": {
    "items": []
  }
}
```

## Champs d’un item

- `id` : identifiant stable et unique.
- `type` : catégorie normalisée (`film`, `livre`, `disque`, `bd`, `jeu-video`, etc.).
- `titre` : titre de l’œuvre.
- `createur` : auteur, réalisateur, groupe, institution…
- `annee` : année connue dans l’ancien fichier.
- `date_agenda` : date sous laquelle l’item était classé dans l’ancien Agenda.
- `date_evenement` : date officielle de sortie, publication ou première, à renseigner.
- `date_precision` : `jour`, `mois`, `annee` ou `a-verifier`.
- `date_source` : URL ou référence confirmant la date.
- `resume` : résumé court rédigé ou vérifié.
- `importance` : note éditoriale facultative.
- `tags` : mots-clés de recherche.
- `image` : chemin local privilégié ou URL existante provisoire.
- `image_type` : `locale`, `distante` ou `null`.
- `image_source`, `image_auteur`, `image_licence`, `image_url_source` : crédits.
- `image_verifiee` : validation de la licence.
- `wiki` : lien Wikipédia éventuel.
- `lien` : ancien lien conservé.
- `sources` : liste des sources documentaires.
- `statut_verification` : état de validation éditoriale.

## Règle importante

La conversion ne transforme pas automatiquement `date_agenda` en date officielle.
Une œuvre ne doit apparaître dans « Un JJ mois » qu’après vérification de
`date_evenement`, `date_precision` et `date_source`.
