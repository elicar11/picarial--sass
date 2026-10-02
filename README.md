# Picarial

Site vitrine d'un studio de création digitale basé à Madagascar. Page unique, responsive, construite avec **HTML**, **Sass** et **JavaScript** natif (sans framework).

> Projet réalisé dans le cadre du cours **TechWeb**.

![Aperçu du site Picarial](docs/apercu.png)

---

## Fonctionnalités

**Sections de la page**

| Section | Ancre | Contenu |
|---|---|---|
| Hero | `#` | Accroche, badge, boutons d'action, image |
| À propos | `#about` | Présentation de l'équipe et 4 chiffres clés |
| Services | `#services` | 4 cartes : Design UI/UX, Développement Web, Stratégie Digitale, Branding & Identité |
| Témoignages | `#testimonials` | 3 avis clients avec photo |
| Contact (CTA) | `#contact` | Appel à l'action « Démarrer un projet » |
| Footer | — | Navigation, coordonnées, mentions légales |


---

## Technologies

| Outil | Rôle |
|---|---|
| HTML5 | Structure de la page |
| [Sass](https://sass-lang.com/) (syntaxe SCSS, modules `@use`) | Styles |
| JavaScript (ES6+) | Interactions du header |
| Polices locales (`woff2`) | Poppins, Montserrat Alternates, Outfit, Manrope |
| Dart Sass (binaire inclus, Windows) | Compilation du Sass en CSS |

Aucune dépendance npm : le projet s'ouvre directement dans le navigateur.

---

## Structure du projet

```
Picarial/
├── index.html              # Page unique
├── style.css               # CSS compilé (généré par Sass, ne pas modifier à la main)
├── style.css.map           # Source map (retrouve la ligne Sass d'origine dans les DevTools)
│
├── js/
│   └── script.js           # Header : lien actif, burger, recherche, ombre au scroll
│
├── img/                    # Images (hero, à propos, avatars des témoignages)
├── fonts/                  # Polices locales au format woff2 (23 fichiers)
│
├── sass/                   # Sources Sass
│   ├── style.scss          # Point d'entrée : importe tous les fichiers
│   ├── utils/
│   │   ├── _variables.scss # Couleurs, polices, tailles, breakpoints
│   │   └── _mixins.scss    # Responsive, conteneurs, flex
│   ├── base/
│   │   ├── _fonts.scss     # @font-face générés depuis /fonts
│   │   ├── _reset.scss     # Reset CSS
│   │   └── _typography.scss
│   ├── layout/             # Une section de la page = un fichier
│   │   ├── _header.scss
│   │   ├── _hero.scss
│   │   ├── _about.scss
│   │   ├── _services.scss
│   │   ├── _testimonials.scss
│   │   ├── _cta.scss
│   │   └── _footer.scss
│   └── components/
│       └── _button.scss    # Boutons réutilisables (.btn)
│
└── dart-sass/              # Compilateur Sass autonome (Windows)
    └── sass.bat
```

---

## Lancer le projet

1. Récupérer le dossier `Picarial/`.
2. Ouvrir `index.html` dans un navigateur (double-clic).

Le site fonctionne sans serveur : les polices, les images et le CSS utilisent des chemins relatifs.
Pour un rechargement automatique pendant le développement, tu peux aussi utiliser l'extension **Live Server** de VS Code.

---

## Compiler le Sass

Le navigateur lit `style.css`. Après toute modification dans `sass/`, il faut recompiler.

### Sous Windows (compilateur inclus)

Depuis le dossier `Picarial/` :

```bat
:: Compiler une fois
dart-sass\sass.bat sass\style.scss style.css

:: Recompiler automatiquement à chaque modification (Ctrl + C pour arrêter)
dart-sass\sass.bat --watch sass\style.scss:style.css

:: Version minifiée pour la mise en ligne
dart-sass\sass.bat --style=compressed --no-source-map sass\style.scss style.css
```

### Sous macOS / Linux

Le binaire inclus est prévu pour Windows. Installe Sass avec npm :

```bash
npm install -g sass

sass --watch sass/style.scss:style.css
```

---

## Architecture Sass

Le projet suit une organisation inspirée du **pattern 7-1**, simplifiée :

| Dossier | Contenu | Règle |
|---|---|---|
| `utils/` | Variables et mixins | Ne génère aucun CSS |
| `base/` | Polices, reset, typographie de base | Styles globaux |
| `layout/` | Une section de la page par fichier | Un fichier = un bloc BEM |
| `components/` | Éléments réutilisables (boutons) | Utilisables partout |

- Tous les fichiers sont reliés par `style.scss` avec des **modules `@use`** (et non l'ancien `@import`).
- Chaque fichier importe ce dont il a besoin :
  ```scss
  @use "../utils/variables" as *;
  @use "../utils/mixins" as *;
  ```
- Les couleurs, polices, durées de transition et breakpoints sont définis dans `utils/_variables.scss` : pour changer l'identité visuelle, c'est le premier fichier à modifier.

---

## Responsive

Approche **desktop-first** : les styles par défaut correspondent à la maquette (1440 px), puis on adapte vers les petits écrans avec des `max-width`.

| Palier | Largeur | Mixin | Changements principaux |
|---|---|---|---|
| Desktop | > 1200 px | — (style par défaut) | Mise en page de la maquette |
| Laptop | ≤ 1200 px | `@include laptop` | Colonnes fluides, marges réduites |
| Tablet | ≤ 992 px | `@include tablet` | Sections empilées, **menu burger** |
| Mobile | ≤ 576 px | `@include mobile` | Boutons pleine largeur, tailles de texte réduites |

Exemple d'utilisation dans un fichier Sass :

```scss
.ma-section {
    padding: 120px 0;

    @include tablet {
        padding: 80px 40px;
    }

    @include mobile {
        padding: 60px 20px;
    }
}
```

> Dans chaque fichier, garde l'ordre **laptop → tablet → mobile** : un palier plus petit hérite des règles du palier plus grand.

Pour changer un breakpoint, modifie la variable dans `sass/utils/_variables.scss`
(et la valeur `993px` dans `js/script.js`, qui doit rester égale à `$breakpoint-tablet + 1`).

---

## Polices

Les polices sont hébergées localement (pas de Google Fonts) :

| Famille | Usage | Graisses |
|---|---|---|
| Poppins | Logo, navigation | 400 à 900 |
| Montserrat Alternates | Titres, textes | 400 à 900 |
| Outfit | Chiffres clés, noms | 400 à 900 |
| Manrope | Libellés, textes secondaires | 400 à 800 |

Les `@font-face` sont **générés automatiquement** par une boucle dans `sass/base/_fonts.scss`.
Pour ajouter une police : copier ses fichiers `woff2` dans `fonts/`

---

## Conventions de code

- **Nommage BEM** : `.bloc__element--modificateur`
  Exemples : `.header__link--active`, `.services__card-title`
- **Indentation** : 4 espaces
- **Un fichier Sass par section**, nommé avec un underscore (`_hero.scss`)
- Utiliser les variables de `utils/_variables.scss` plutôt qu'une couleur ou une police écrite en dur

---