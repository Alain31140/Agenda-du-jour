# Schéma Personnalités — Agenda du jour

La structure principale reste :

```json
{
  "JJ-MM": []
}
```

## Champs d’une personnalité

- `id` : identifiant stable et unique, préfixé par `pers-`.
- `nom` : nom usuel affiché.
- `activite` : profession, fonction ou domaine principal.
- `type_evenement` : `naissance`, `deces`, `assassinat` ou autre type normalisé.
- `date_agenda` : date sous laquelle la fiche était classée dans l’ancien Agenda.
- `date_evenement` : date exacte vérifiée de naissance, décès ou événement.
- `date_precision` : `jour`, `mois`, `annee` ou `a-verifier`.
- `date_source` : source confirmant la date.
- `annee_naissance` : année de naissance.
- `annee_deces` : année de décès, ou `null`.
- `nationalite` : nationalité ou pays principal.
- `lieu_naissance` : lieu de naissance.
- `lieu_deces` : lieu de décès.
- `resume` : résumé biographique court et sourcé.
- `faits_marquants` : liste de faits importants.
- `oeuvres_principales` : œuvres ou réalisations majeures.
- `distinctions` : prix et distinctions.
- `importance` : note éditoriale facultative.
- `tags` : mots-clés utiles pour la recherche.
- `image` : chemin local privilégié ou URL provisoire.
- `image_type` : `locale`, `distante` ou `null`.
- `image_source`, `image_auteur`, `image_licence`, `image_url_source` : crédits.
- `image_verifiee` : validation de la licence.
- `wiki` : lien Wikipédia éventuel.
- `sources` : liste des sources documentaires.
- `liens` : identifiants vers Culture, Événements ou autres personnalités.
- `statut_verification` : état de validation éditoriale.

## Règles importantes

- Ne jamais transformer automatiquement `date_agenda` en date officielle.
- Ne présenter une date exacte qu’après vérification de `date_evenement`,
  `date_precision` et `date_source`.
- Privilégier une image locale dont la licence et l’auteur sont connus.
- Ne jamais afficher un lien ou une image cassée.
- Masquer les sections vides ou afficher un placeholder adapté.
