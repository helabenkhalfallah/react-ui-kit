# Comment améliorer les performances d'une AWT-React ?

## A. Pourquoi se soucier de la performance ?

Les performances Web sont importantes pour l'accessibilité et sont fortement corrélées à l'expérience utilisateur. C'est pourquoi nous devons nous soucier des performances Web.

**Une bonne performance est un atout. Une mauvaise performance est une responsabilité.**

Il a été démontré que les sites performants augmentent la rétention des visiteurs et leur satisfaction. Inversement, la lenteur du contenu conduit à l'abandon du site, certains visiteurs partent pour ne jamais revenir. La réduction de la quantité de données qui passe entre le client et le serveur réduit les coûts pour toutes les parties. La réduction de la taille des fichiers HTML/CSS/JavaScript et multimédia réduit à la fois le temps de chargement et la consommation d'énergie d'un site.

**La perception de la performance du site est l'expérience utilisateur!**

---

## B. Les étapes de chargements d'une page web (Critical Rendering Path)

Offrir une expérience Web rapide nécessite beaucoup de travail de la part du navigateur. La plupart de ce travail nous est caché en tant que développeurs Web : nous écrivons le balisage et une belle page apparaît à l'écran. Mais comment le navigateur passe-t-il exactement de la consommation de notre code HTML, CSS et JavaScript aux pixels rendus à l'écran ?

L'optimisation des performances consiste à comprendre ce qui se passe dans ces étapes intermédiaires entre la réception des octets HTML, CSS et JavaScript et le traitement requis pour les transformer en pixels rendus - c'est ce qu'on appelle: **Critical Rendering Path**.

🔵 Considérons ce code html :

```js
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Critical Path: No Style</title>
  </head>
  <body>
    <p>Hello <span>web performance</span> students!</p>
    <div><img src="awesome-photo.jpg" /></div>
  </body>
</html>
```

🔵 Avant que ce code soit affiché à l'écran, il passe par plusieurs étapes :

---

![image](https://sgithub.fr.world.socgen/storage/user/18840/files/624fb385-0353-4fc3-82ca-96434ec45122)

---

🔵 Modifions ce code html pour importer un `css` externe :

```js
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <link href="style.css" rel="stylesheet" />
  </head>
  <body>
    <p>Hello <span>web performance</span> students!</p>
    <div><img src="awesome-photo.jpg" /></div>
  </body>
</html>
```

🔵 Le temps de traitement maintenant est : 

---

![image](https://sgithub.fr.world.socgen/storage/user/18840/files/fc56c777-a1fd-469b-b79b-6230a66ce260)

---

Nous avons besoin à la fois du HTML et du CSS pour construire la page. **En conséquence, HTML et CSS sont des ressources critiques : le CSS n'est récupéré qu'après que le navigateur a obtenu le document HTML**.

🔸 Ainsi on a besoin de :
- **2 ressources critiques**
- 2 allers-retours ou plus pour la longueur minimale du chemin critique
- **ce qui fait 9 KB d'octets critiques**

🔵 Ajoutons maintenant un script `javascript` :

```js
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <link href="style.css" rel="stylesheet" />
  </head>
  <body>
    <p>Hello <span>web performance</span> students!</p>
    <div><img src="awesome-photo.jpg" /></div>
    <script src="app.js"></script>
  </body>
</html>
```

🔵 Le temps de traitement maintenant est : 

---

![image](https://sgithub.fr.world.socgen/storage/user/18840/files/08bdcfec-11af-4483-b26e-d2cc6b5763b2)

---

🔸 Ainsi on a besoin de :
- **3 ressources critiques**
- 2 allers-retours ou plus pour la longueur minimale du chemin critique
- **ce qui fait 11 KB d'octets critiques**

🔵 Changeons le chargement du script `javascript` en asynchrone:

```js
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <link href="style.css" rel="stylesheet" />
  </head>
  <body>
    <p>Hello <span>web performance</span> students!</p>
    <div><img src="awesome-photo.jpg" /></div>
    <script src="app.js" async></script>
  </body>
</html>
```

🔵 Le temps de traitement maintenant est : 

---

![image](https://sgithub.fr.world.socgen/storage/user/18840/files/aa2e2c47-f1b8-414c-ba58-8dfc538d87c6)

---

🔸 Un script asynchrone présente plusieurs avantages :
- le script ne bloque plus l'analyseur et ne fait pas partie du chemin de rendu critique.
- en conséquence, notre page optimisée est maintenant revenue à deux ressources critiques (HTML et CSS), avec une longueur de chemin critique minimale de deux allers-retours et **un total de 9 Ko d'octets critiques**.

🔵 Changeons l'appel aux styles (css) au moment de l'impression uniquement (`media="print`) :

```js
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <link href="style.css" rel="stylesheet" media="print" />
  </head>
  <body>
    <p>Hello <span>web performance</span> students!</p>
    <div><img src="awesome-photo.jpg" /></div>
    <script src="app.js" async></script>
  </body>
</html>
```

🔵 Le temps de traitement maintenant est : 

---

![image](https://sgithub.fr.world.socgen/storage/user/18840/files/f8803e72-92e2-4dba-8b04-3b4ce8f86cd6)

---

- Étant donné que la ressource style.css n'est utilisée que pour l'impression, le navigateur n'a pas besoin de la bloquer pour afficher la page. 
- Par conséquent, dès que la construction du DOM est terminée, le navigateur dispose de suffisamment d'informations pour afficher la page. 
- Par conséquent, cette page n'a qu'une seule ressource critique (le document HTML) et la longueur minimale du chemin de rendu critique est d'un aller-retour.

**🔸 Déterminer les caractéristiques de chemin de rendu critique signifie être en mesure d'identifier les ressources critiques et également de comprendre comment le navigateur planifiera leurs extractions.**

**🔸 La façon (async) et le temps (print) de charger les ressources critiques impactent directement les performances de chargement de la page.**

## C. Un indicateur web pour chaque étape de chargement (Core Web Vitals et autres)

Au cours des dernières années, les membres de l'équipe Chrome, en collaboration avec le groupe de travail sur les performances Web du W3C, ont travaillé à la normalisation d'un ensemble de nouvelles API et de mesures qui mesurent plus précisément la façon dont les utilisateurs perçoivent les performances d'une page Web:
- Is it happening?
- Is it useful?
- Is it usable?
- Is it delightful?

---

![image](https://sgithub.fr.world.socgen/storage/user/18840/files/df0abdaf-2c3d-4f86-918a-47133f7ea984)

---

Il existe plusieurs autres types de mesures qui sont pertinentes pour la façon dont les utilisateurs perçoivent les performances :
- Perceived load speed (exp: FCP, LCP, CLS, ...)
- Load responsiveness (exp: FID, TTI, ...)
- Runtime responsiveness (exp: INP, CLS, ...)
- Visual stability (exp: CLS, ...)
- Smoothness

---

### 1. First Contentful Paint (FCP)

✳️ Ce métrique mesure le temps entre le début du chargement de la page et le moment où une partie du contenu de la page est affichée à l'écran.

---

![image](https://sgithub.fr.world.socgen/storage/user/18840/files/02920433-d1c9-43b4-b8c1-1a281eff18c4)

---

✳️ Le score recommandé pour FCP :

---

![image](https://sgithub.fr.world.socgen/storage/user/18840/files/e441abc0-e2e0-49dd-8c2f-5f65b0267674)

---

✳️ Comment améliorer le FCP ?
- Éliminez les render-blocking resources (css, js, img, ...)
- Évitez les énormes charges du réseau
- Évitez une taille DOM excessive
- Réduisez les temps de réponse du serveur (TTFB)
- Évitez les redirections de pages
- Assurez-vous que le texte reste visible pendant le chargement de la police Web
- Gardez le nombre de requêtes bas et les tailles de transfert petites

---

### 2. First Input Delay (FID)

✳️ Le FID, soit le First Input Delay consiste à mesurer le temps de réaction entre le moment où l'internaute **va interagir sur une page pour la première fois et la réponse du navigateur**. Si par exemple l'internaute clique sur un bouton, sur un lien ou sur un élément du menu, combien de temps le navigateur va mettre pour répondre à sa requête ? C'est la question à laquelle la métrique FID souhaite répondre.

✳️ Le score recommandé pour FID :

---

![image](https://sgithub.fr.world.socgen/storage/user/18840/files/211f7cce-7787-4739-a0a3-dde2bfce2445)

---

- L'objectif parfait serait d’avoir un site qui réagit à une interaction sur le site en moins de 100 millisecondes.
- Au-delà de ce temps, cela peut être frustrant pour l'utilisateur et l'empêche d'avoir un parcours fluide sur le site.

**🔸 Important:** Les utilisateurs peuvent rencontrer des retards de manière différente, en fonction de leur matériel et des conditions du réseau. Par exemple, le chargement de sites sur une connexion Wi-Fi rapide sera différent de celui d'un réseau 3G.

✳️ Comment améliorer le FID ?
- Réduire le temps d'exécution de JavaScript.
- Minimiser le travail du thread principal.
- Gardez le nombre de requêtes bas et les tailles de transfert petites.

---

### 3. Largest Contentful Paint (LCP)

✳️ Le LCP consiste à mesurer la vitesse de chargement d'une page web. 

✳️ Cette métrique va permettre de calculer précisément **le temps que met le premier – et le plus grand – élément à apparaître sur le site**. Cela peut être une image, une vidéo ou un bloc de texte, cela va dépendre de ce que contient le site en question.

> A study conducted by Akamai found that 53 percent of mobile site visitors will leave a page that takes longer than three seconds to load. [Source](https://www.portent.com/blog/analytics/research-site-speed-hurting-everyones-revenue.htm#:~:text=The%20first%205%20seconds%20of,(between%20seconds%200%2D5))

✳️ Le score recommandé pour LCP :

---

![image](https://sgithub.fr.world.socgen/storage/user/18840/files/85dad70b-6cde-4bd7-b43b-c66b6e9cea72)

---

- Un chargement de page optimal, selon Google, serait ainsi inférieur à 2,5 secondes. 
- Par contre, si le temps d’affichage de votre page dépasse les 4 secondes, il sera considéré comme médiocre.

✳️ Comment améliorer le LCP ?
- Si vos images prennent plus de temps à charger, vous devez optimiser la taille et le placement de vos images.
- Si vous utilisez une carroussel (slider) d'images, pensez à charger les images d'une façon [lazy](http://xblocks.socgen/icd/demo/#/client/awt-react-optimisation-webpack?id=c4-import-dynamique-des-ressources-d%c3%a9caler-le-chargement-des-ressources-statiques) et d'activer l'option [lazy](http://xblocks.socgen/icd/demo/#/client/awt-react-optimisation-webpack?id=c6-lazy-load-dans-les-carroussels-ou-les-sliders) dans les carroussels ou sliders.
- Optez pour des layouts (pages) qui ne sont pas trop chargées et qui peuvent être optimisées pour un chargement plus rapide ([pagination ou load more](http://xblocks.socgen/icd/demo/#/client/awt-react-optimisation-webpack?id=c7-pagination-des-grandes-listes).
- Optimisez le chargements des layouts en utilisant la technique [lazy et Suspense](http://xblocks.socgen/icd/demo/#/client/awt-react-optimisation-webpack?id=c3-import-dynamique-des-composants-lazy-components).
- Les ressources statiques bloquant le rendu, retardent l'analyse du code HTML initial et, par conséquent, abaissent les scores LCP. Il est donc essentiel d'optimiser [ces ressources](http://xblocks.socgen/icd/demo/#/client/awt-react-optimisation-webpack?id=c4-import-dynamique-des-ressources-d%c3%a9caler-le-chargement-des-ressources-statiques).
- Différez les scripts JS non critiques.

[Plus de détails](https://web.dev/optimize-lcp/)

---

### 4. Cumulative Layout Shift (CLS)

✳️ Le Cumulative Layout Shift ou « décalage cumulatif de mise en page » mesure la stabilité visuelle. Souvent, les éléments d’une page se déplacent au fur et à mesure que le contenu se charge et s'affiche sur l'écran – une expérience assez lassante et qui conduit généralement à de nombreux clics au mauvais endroit, ce qui embrouille l'expérience de navigation.

✳️ Le score recommandé pour CLS :

---

![image](https://sgithub.fr.world.socgen/storage/user/18840/files/1fbcf6f9-dbe8-4c3c-93df-5baf50ac079e)

---

✳️ Comment améliorer le CLS ?
- Incluez toujours des attributs de taille sur vos images et éléments vidéo, ou réservez autrement l'espace requis avec quelque chose comme des boîtes de rapport d'aspect CSS. Cette approche garantit que le navigateur peut allouer la bonne quantité d'espace dans le document pendant le chargement de l'image.
- N'insérez jamais de contenu au-dessus du contenu existant, sauf en réponse à une interaction de l'utilisateur. Cela garantit que tous les changements de mise en page qui se produisent sont attendus.
- Animez les transitions de manière à fournir un contexte et une continuité d'un état à l'autre.

---

### 5. Core Web Vitals

Core Web Vitals repose sur trois mesures. Chacun d’entre eux touche un aspect essentiel pour qu’une page soit rapide et offre une bonne expérience utilisateur:

---

![image](https://sgithub.fr.world.socgen/storage/user/18840/files/d14dd4d4-676e-4da1-9a37-cedf6c2074fa)

---

### 6. Le bundle Javascript

Le temps de téléchargement de bundle **dépend de sa taille et du type de la connectivité (3G, 4G, ...).**

⛔ **Plus la taille du bundle est grande, plus le temps de chargement sera important. Cela conduira à l'affichage d'une page blanche jusqu'à ce que le bundle soit totalement téléchargé**. 

> **Every 100 KB compressed Javascript = 3-4s increase in time to interactive on a 3G connection.**

L'expérience utilisateur est dégradée par :
- un temps de chargement long.
- un temps long pour avoir un premier affichage (First Contentful Paint).
- un temps long avant que l'utilisateur commence à interagir (Time to Interactive).

> Small Javascript bundles improve download speeds, lower memory usage and reduce CPU costs.

💦 La taille maximale du bundle recommandée en version gzip: **360 KB** :

**💡 Plus d'informations:**
- [Mobile & Web Performance](https://infrequently.org/2021/03/the-performance-inequality-gap/)
- [The Cost Of JavaScript in 2019](https://speakerdeck.com/addyosmani/the-cost-of-javascript-in-2019-concatenateconf)
- [Speed at Scale: Web Performance Tips and Tricks](https://speakerdeck.com/addyosmani/speed-at-scale-web-performance-tips-and-tricks-from-the-trenches)

---

### 7. Que doit-on retenir ?

* La taille du bundle a une influence directe sur le temps de chargement de la page, le temps d'optimisation, le temps d'exécution.
* Tout traitement long Javascript bloque l'affichage et l'interraction avec le site.
* Le code JS doit être optimisé mais aussi les styles et les layouts.
* Décaler le chargement des ressources non essentielles et les charger au besoin.

> **Fast at : download, parse, compile & execute.**

---

## D. Comment analyser et suivre l'évolution des performances ?

### 1. Définir des Budgets (ou des seuils) de performance

**Un budget de performance est une limite pour éviter les régressions**. Il peut s'appliquer à un fichier, un type de fichier, tous les fichiers chargés sur une page, une métrique spécifique (par exemple, Time to Interactive), une métrique personnalisée (par exemple, Time to Hero Element), ou un seuil sur une période de temps.

Un budget existe pour refléter des objectifs atteignables. **C'est un compromis entre l'expérience utilisateur et d'autres indicateurs de performance (par exemple, le taux de conversion).**

Ces objectifs peuvent être:
- Basé sur le **timing** (par exemple, Time to Interactive, First Contentful Paint).
- Basé sur la **quantité** (par exemple, quantité de fichiers JS / taille totale de l'image).
- Basé sur des **règles** (par exemple, Pagespeed index, Lighthouse score).

---

![image](https://sgithub.fr.world.socgen/storage/user/18840/files/a77b7d0e-0f02-4bb2-90f3-3e8d92995d81)

---

Exemples de budgets:
- Notre page produit doit contenir moins de 170 Ko de JavaScript sur mobile.
- Notre page de recherche doit inclure moins de 2 Mo d'images sur ordinateur.
- Notre page d'accueil doit se charger et devenir interactive en < 5s sur Slow 3G/Moto G4.
- Notre blog doit marquer > 80 sur les audits de performance Lighthouse.

Leur objectif principal est d'éviter les régressions, mais ils peuvent fournir des informations sur les tendances prévisionnelles (c'est-à-dire qu'en septembre, 50% du budget a été dépensé en une semaine).

De plus, il peut découvrir les besoins de développement (c'est-à-dire qu'une grande bibliothèque avec des alternatives plus petites est souvant choisie pour résoudre un problème courant).

[Budgets de performance](https://developer.mozilla.org/fr/docs/Web/Performance/Performance_budgets).

---

### 2. Suivre la santé d'une AWT

[Plus de détails - Comment vérifier la "santé" d'une AWT React ?](http://xblocks.socgen/icd/demo/#/client/awt-react-project-sante.md)

---

### 3. Les DevTools

#### a. Webpack Bundle Analyze

⛔ **L'outil primordial à lancer au fur et à mesure de développement est webpack bundle analyzer.**

Toutes les awt-react (à partir de la v4) ont un script npm ```analyze```:

```
"analyze": "webpack --config ./webpack/webpack.prod.js  --profile --json > stats-prod.json && webpack-bundle-analyzer stats-prod.json dist/",
```

Cet outil permet d'analyser le bundle en mode production (ce qui va être déployé en PROD).

💡 **Si vous constatez un grand bloc de bundle, appliquez les techniques d'optimisations décrites ci-après.**

---

#### b. Chrome Devtools: LightHouse, Performances et Network

- [Comment utiliser LightHouse?](https://developer.chrome.com/docs/lighthouse/overview/)
- [Comment analyser les performances d'exécution ?](https://developer.chrome.com/docs/devtools/evaluate-performance/)
- [Comment analyser les traffics réseau ?](https://developer.chrome.com/docs/devtools/network/)
- [Couverture : recherche des codes JavaScript et CSS inutilisés.](https://developer.chrome.com/docs/devtools/coverage/)

---

## E. Les techniques d'optimisations : 

🔴 Les techniques sont classées par ordre de priorité (de moins impactant au plus impactant).

🔴 Après chaque modification, il est fortement conseillé de lancer le projet en local `npm start` et de s'assurer que le projet se lance sur les différents navigateurs `IE`, `Chrome` et `Firefox`.

### 1. Remplacement des dépendances volumineuses :

| Dépendance      | Alternatives |
| ----------- | ----------- |
| momentjs      | [date-fns](https://date-fns.org/)       |
| lodash   | API native node-js, awt-react-extras ou lodash-es |
| @babel/polyfill | [core-js/es](https://github.com/zloirock/core-js) |

⛔ Il est fortement conseillé de mettre à jour les [dépendances obsolètes](http://xblocks.socgen/icd/demo/#/awt_5.2_react_modernisation.md).

⛔ Il est fortement conseillé de supprimer les dépendances non utilisées.

⛔ Il est fortement conseillé d'utiliser les dépendances exposant un import modulaire (par exemple [core-js/es](https://github.com/zloirock/core-js) et [date-fns](https://date-fns.org/)). L'outil [bundlephobia](https://bundlephobia.com/) peut aider dans cette étape.

⛔ Il est fortement conseillé de vérifier, dans le `package.json`, que la section `dependencies` ne contient que les dépendances nécessaires à l'exécution de l'application. Les dépendances servant uniquement à la compilation ou au build ou à la génération de code comme les `awt-react-cli` doivent être déclarées dans la section `devDependencies`. Sinon le bundle sera impacté par des modules non nécessaires à l'exécution de l'application.

⛔ Si l'application n'est pas tenue d'être compatible `IE`, il est recommandé de supprimer les **polyfills** non nécessaires (exemple [PCH](https://sgithub.fr.world.socgen/AppliDigitalClient/bddf_awt_pch_front/commit/26944875dbcee5342d124fa8ca3bd4ade22336eb#diff-fbc6c1d4c3b6db8fb54278582eb1d965ed644e97509e130346ae130da5406cb3)).

![image](https://sgithub.fr.world.socgen/storage/user/18840/files/7b057608-ae4f-4b93-8666-8286f46366ac)

---

### 2. Supressions des ressources et des fichiers non utilisés :

Analyser le bundle et l'application pour supprimer les ressources (images, json, ...) et les fichiers non utilisés.

---

### 3. Diviser les fichiers constantes et utilitaires :

⛔ Il est fortement conseillé de divisier les fichiers constantes et utilitaires par `feature`.

⛔ Il est fortement conseillé d'importer que le nécessaire pour une `feature`.

Par exemple, si des méthodes utilitaires sont utilisées dans la feature `virements` uniquement, le fichier utilitaire doit être mis dans le dossier `commons` de la feature concernée et non dans le dossier `commons` transverse à toutes les features.

---

### 4. Les techniques d'optimisations Javascript/React : 

#### a. Déclaration et appel des composants React (Lazy Evaluation)

☑️ Il est recommandé de déclarer les composants React de cette façon:
```js
const MyComponent = ({data, onClick}) => <>My View Content</>
```

Exemple :
```js
// good
const MyAwesomeComponent  = ({
  data,
  onClick,
}) => (
  <SGButtonGroup
    align="center"
    layout="row"
  >
    {data?.map((item) => (
      <SGButton
        id={item?.id}
        disabled={item?.disabled}
        onClick={onClick}
        type={item?.type}
      >
        {item?.libelle}
      </SGButton>
    ))}
  </SGButtonGroup>
);
```

☑️ Il est recommandé d'appeler les composants React de cette façon (component):
```js
<MyComponent 
 data={[...]}
 onClick={() => ...}
/>
```

Exemple :
```js
// good
  <>
   <SGTitle
      fontWeight="semibold"
   >
      Page Title
   </SGTitle>
    <MyAwesomeComponent
      data={[
        {
          id: 'unique_id_1',
          disabled: false,
          type: 'primary',
          libelle: 'Oui',
        },
        {
          id: 'unique_id_2',
          disabled: false,
          type: 'secondary',
          libelle: 'Non',
        },
      ]}
      onClick={() => ...}
    />
    <SGAlert
     ...
```

⛔ Il n'est pas recommandé de déclarer les composants React de cette façon : 
```js
const MyComponent = (data, onClick) => <>My View Content</>
```

Exemple :
```js
// bad
const MyBadComponent = (data, onClick) => (
  <SGButtonGroup
    align="center"
    layout="row"
  >
    {data?.map((item) => (
      <SGButton
        id={item?.id}
        disabled={item?.disabled}
        onClick={item?.onClick}
        type={item?.type}
      >
        {item?.libelle}
      </SGButton>
    ))}
  </SGButtonGroup>
);
```

⛔ Il n'est pas recommandé d'appeler les composants React de cette façon (fonction) :
```js
{MyComponent(data, onClick)}
```

Exemple : 
```js
  <>
   <SGTitle
      fontWeight="semibold"
   >
      Page Title
   </SGTitle>
      {MyBadComponent(data, () => ...)}
    <SGAlert
     ...
```

> If we called Comments() as a function, it would execute immediately regardless of whether Page wants to render them or not :
```js
// bad
// {
//   type: Page,
//   props: {
//     children: Comments() // Always runs!
//   }
// }
<Page>
  {Comments()}
</Page>
```

> But if we pass a React element, we don't execute Comments ourselves at all:
```js
// good

// {
//   type: Page,
//   props: {
//     children: { type: Comments }
//   }
// }
<Page>
  <Comments />
</Page>
```

> This lets React decide when and whether to call it. If our Page component ignores its children prop and renders "Please log in" instead, React won't even attempt to call the Comments function. 

> This is good because it both lets us avoid unnecessary rendering work that would be thrown away, and makes the code less fragile. (We don't care if Comments throws or not when the user is logged out — it won't be called.)

[Plus de d'informations](https://overreacted.io/react-as-a-ui-runtime/#lazy-evaluation)

---

#### b. L'utilisation des key déterministes et stables dans les listes et les tableaux

☑️ Il est fortement recommandé d'utiliser des key déterministes et stables dans les listes et les tableaux : 

**Avant une mise à jour de DOM :** 
```js
<ul>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>
```

**Après une mise à jour de DOM :** 
```js
<ul>
  <li key="2014">Connecticut</li>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>
```

React sait que l'élément avec la clé '2014' est le nouveau, et les éléments avec les clés '2015' et '2016' sont juste déplacés.

> When children have keys, React uses the key to match children in the original tree with children in the subsequent tree.

> **Keys should be stable, predictable, and unique**. Unstable keys (like those produced by Math.random()) will cause many component instances and DOM nodes to be unnecessarily recreated, which can cause performance degradation and lost state in child components. [React Reconciliation](https://reactjs.org/docs/reconciliation.html#keys)

> What's a good value for a key? An easy way to answer this is to ask: **when would you say an item is the “same” even if the order changed?** For example, in our shopping list, the product ID uniquely identifies it between siblings.

```js
// good
const todoItems = todos.map((todo) =>
  <li key={todo.id}>
    {todo.text}
  </li>
);

// bad
const todoItems = todos.map((todo, index) =>
  <li key={index}>
    {todo.text}
  </li>
);

// good
<li key={item.id}>{item.name}</li>

// bad
<li key={v4()}>{item.name}</li>

// bad 
<li key={Math.random()}>{item.name}</li>

// bad 
<li key={index}>{item.name}</li>
```
**⛔ Il n'est pas recommandé d'utiliser des key aléatoires, random() ou la librairie uuid (v4()).**

**⛔ Il n'est pas recommandé d'utiliser les index comme des keys.** [React Keys](https://reactjs.org/docs/lists-and-keys.html#keys)

> We don't recommend using indexes for keys if the order of items may change. This can negatively impact performance and may cause issues with component state. [Index as a key is an anti-pattern](https://robinpokorny.medium.com/index-as-a-key-is-an-anti-pattern-e0349aece318)

[React-JS Runtime UI](https://sgithub.fr.world.socgen/AppliDigitalClient/ref_awt_gfm_documentation_wiki/blob/master/docs/files/formations-socle-frontend-react/2021/07-React-JS%20Runtime%20UI.pdf)

---

#### c. Import Dynamique, Code Splitting & Lazy Loading

##### c.0. Il s'agit de quoi ?

[Code Splitting](https://webpack.js.org/guides/code-splitting/)

> Code splitting is one of the most compelling features of webpack. This feature allows you to split your code into various bundles which can then be loaded on demand or in parallel. It can be used to achieve smaller bundles and control resource load prioritization which, if used correctly, can have a major impact on load time.

**La technique de code splitting ou la création des chuncks permet de réduire la taille de bundle en créant des chuncks qui ne seront chargés qu'à la demande.**

> Code-splitting your app can help you “lazy-load” just the things that are currently needed by the user, which can dramatically improve the performance of your app. 

[Code Splitting React](https://reactjs.org/docs/code-splitting.html)

> Lazy, or "on demand", loading is a great way to optimize your site or application. This practice essentially involves splitting your code at logical breakpoints, and then loading it once the user has done something that requires, or will require, a new block of code.

[Lazy Loading](https://webpack.js.org/guides/lazy-loading/)

![image](https://sgithub.fr.world.socgen/storage/user/18840/files/464829c2-b0e6-499b-8a1e-e45d3cb8b1cb)

> Le mot-clé import peut être utilisé comme une fonction afin d'importer dynamiquement un module (utile lorsqu'on souhaite charger un module selon une condition donnée ou faire du chargement à la demande). Lorsqu'il est utilisé de cette façon, il renvoie une [promesse / promise](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/import#imports_dynamiques) :

```js
import('/modules/mon-module.js')
  .then((module) => {
    // Faire quelque chose avec le module
  });
  
let module = await import('/modules/mon-module.js');
```

---

##### c.1. Import dynamique des routes: Lazy routes

Il est recommandé d'utiliser des lazy routes plutôt que les routes ordinaires.

**Le passage par des lazy routes va créer automatiquement (sans aucune configuration supplémentaire) des chuncks séparés pour chaque routes. Dans le bundle principale ne restera que les modules en commun.**

**⛔ Pour que webpack puisse bien splitter le bundle, il faut s'assurer que la route n'est appelée qu'en lazy: elle n'est pas importée d'une façon ordinaire ou référencée dans un index ou un fichier particulier (un import ordinaire + un import lazy => l'import ordinaire qui va l'importer).**

**Pour avoir une Optimistic UI c'est à dire une vue plus responsive, le temps de chargement de la route et de mount de composant, Suspense va afficher le fallback (loader).**

✴️ Import :

```js
const ConsultSendingDetailsPage = (
  lazy(() => (
    import('./features/support/pages/ConsultSendingDetailsPage')
  ))
);
```

✴️ Appel :

```js
const Router = ({ configuration, }) => {
  return (
    <Suspense fallback={<div />}>
      <ConfigProvider
        theme={Base2Theme}
        config={{
          lang: 'fr_FR',
          enableAutoMargin: true,
        }}
      >
        <HashRouter>
          <Route
            path={CONSULT_SENDING_DETAILS_PAGE}
            component={ConsultSendingDetailsPage}
          />
          <Redirect
            from="/"
            to={CONSULT_SENDING_DETAILS_PAGE}
          />
        </HashRouter>
      </ConfigProvider>
    </Suspense>
  );
};
```

[Route Code Split](https://reactjs.org/docs/code-splitting.html#route-based-code-splitting)

![image](https://sgithub.fr.world.socgen/storage/user/18840/files/b2109e22-c79d-4ec4-8532-c86225ec6ab3)

---

##### c.2. Import dynamique du ConfigProvider (SGC+)

🔴 Cette technique ne peut réussir que si les pages (les routes) sont importées d'une façon lazy (cqf étape c.1.).

🔴 S'assurer que le `ConfigProvider` n'est appelé qu'une seule fois au niveau du [Routes.js](https://sgithub.fr.world.socgen/X-Blocks/xbl.start.generator-awt/blob/master/generators/front-v5/templates/js/modules/front-js/js/Routes.js#L62).


1️⃣  Supprimer l'appel au `ConfigProvider` dans le fichier `Routes.js`:

**✴️ Avant:** 

```js
import { ConfigProvider, } from 'sg_npm_components-plus-core';
import { Base2Theme, } from 'sg-themes';


...
const Router = ({ configuration, }) => {
  return (
    <Suspense fallback={<div />}>
      <ConfigProvider
        theme={Base2Theme}
        config={{
          lang: 'fr_FR',
          enableAutoMargin: true,
        }}
      >
        <HashRouter>
          <Route
            path={CONSULT_SENDING_DETAILS_PAGE}
            component={ConsultSendingDetailsPage}
          />
          <Redirect
            from="/"
            to={CONSULT_SENDING_DETAILS_PAGE}
          />
        </HashRouter>
      </ConfigProvider>
    </Suspense>
  );
};
```

**✴️ Après :**

```js
const Router = ({ configuration, }) => {
  return (
    <Suspense fallback={<div />}>
        <HashRouter>
          <Route
            path={CONSULT_SENDING_DETAILS_PAGE}
            component={ConsultSendingDetailsPage}
          />
          <Redirect
            from="/"
            to={CONSULT_SENDING_DETAILS_PAGE}
          />
        </HashRouter>
    </Suspense>
  );
};
```

2️⃣ Créer dans le package **hocs (High Order Components)** un fichier avec le nom `withThemeProvider.jsx` :

[Exemple d'un projet](https://sgithub.fr.world.socgen/AppliDigitalClient/bddf_awt_wtr/blob/master/modules/front-js/js/commons/hocs/withThemeProvider.jsx).

```js
import React, { Component, } from 'react';
import Base2Theme from 'sg-themes/es/base2-theme/Base2Theme';
import ConfigProvider from 'sg_npm_components-plus-core/es/ConfigProvider';

const withThemeProvider = () => (WrappedComponent) => {
  class ThemeComponent extends Component {
    componentDidMount() {

    }

    render() {
      return (
        <ConfigProvider
          theme={Base2Theme}
          config={{
            lang: 'fr_FR',
          }}
        >
          <WrappedComponent
            {...this.props}
          />
        </ConfigProvider>
      );
    }
  }
  return ThemeComponent;
};

export default withThemeProvider;
```

3️⃣ Attacher le HOC `withThemeProvider.jsx` comme décorateur dans chaque page :

```js
...
  @withThemeProvider()
  class FaqHomePage extends Component {
    // default props
    static defaultProps = {
      faqView: null,
    };

...
```

4️⃣ Ou si vous utilisez un HOC pour gérer le layout de la page [withPageLayout](https://sgithub.fr.world.socgen/AppliDigitalClient/bddf_awt_wtr/blob/master/modules/front-js/js/commons/hocs/withPageLayout.jsx#L37), dans ce cas vous devez attacher `withThemeProvider.jsx` une seule fois au niveau de `withPageLayout`:

```js
...
const withPageLayout = ({
  page,
  title,
  currentStep,
  showSteps,
  showFaq = true,
}) => (WrappedComponent) => {
  @withThemeProvider()
  class PageLayout extends Component {
    // default props
    static defaultProps = {
      faqView: null,
    };
...
```

✅ Cette technique permettra de détacher la partie node-modules contenant le `ConfigProvider`:

**✴️ Avant :**

![image](https://sgithub.fr.world.socgen/storage/user/18840/files/6927b673-a30f-4c2f-9c2f-09ff1eec0688)

**✴️ Après :**

![image](https://sgithub.fr.world.socgen/storage/user/18840/files/cfe22a0c-8b91-4d26-9563-5dcfaa7d6a2e)

---

##### c.3. Import dynamique des composants: Lazy components

🔴 Il est recommandé d'utiliser Suspense & Lazy pour  :
- les composants lourds et qui prennent beaucoup de temps pour être charger et "mount" (ex : grand formulaire)
- les composants affichés de manière conditionnelle ([conditional rendering](https://xblocks.socgen/icd/demo/#/client/awt-v4-pattern-react?id=conditional-rendering))
- les composants affichés de manière conditionnelle selon l'écran avec [useMediaQuery](https://socle.applis.bad.socgen/icd/static/sg-components-plus/latest/index.html?path=/docs/2-0-avenir-2-5-organismes-sgmediaquery-usemediaquery--use-media-query-breakpoints) ou [SGMediaQuery](https://socle.applis.bad.socgen/icd/static/sg-components-plus/latest/index.html?path=/docs/2-0-avenir-2-5-organismes-sgmediaquery-sgmediaquery--media-query).

**Le passage par lazy et Suspense va créer automatiquement (sans aucune configuration supplémentaire) un chunck séparé pour le composant qui sera chargé à la demande et en parallèle.**

**⛔ Pour que webpack puisse bien splitter le bundle, il faut s'assurer que le composant n'est appelée qu'en lazy: il n'est pas importé d'une façon ordinaire ou référencé dans un index ou un fichier particulier (un import ordinaire + un import lazy => l'import ordinaire qui va l'importer).**

**Pour avoir une Optimistic UI c'est à dire une vue plus responsive, le temps de chargement et de mount de composant, Suspense va afficher le fallback (loader).**

✴️ Import :

```js
const ViperDetailsView = (
  lazy(() => (
    import('../components/viper-details/ViperDetailsView')
  ))
);
```

✴️ Appel :

```js

        <Suspense fallback={<LoadingView />}>
            <ViperDetailsView
              disableSign={disableSign}
              disableDelete={!isEmpty(viperDelete) || false}
              isViperSouscris={isViperSouscris}
              isHabilitationSignViper={isHabilitationSignViper}
              isHabilitationSaisieViper={isHabilitationSaisieViper}
              isHabilitationDoubleSignViper={isHabilitationDoubleSignViper}
              configuration={configuration}
              periodicities={periodicities}
              viperDetails={viperDetails}
              viperDetailsLoading={isLoading}
              viperDetailsError={viperDetailsError}
            />
        </Suspense> 
```

---

##### c.4. Import dynamique des ressources: Décaler le chargement des ressources statiques

Il arrive parfois que vous chargiez des images ou des fichiers statiques (intégrées dans le projet) par exemple des images d'aide.

**L'import dynamique va automatiquement créer des chuncks séparés pour les ressources (sans aucune configuration supplémentaire de webpack).**

**⛔ Pour que webpack puisse bien splitter le bundle, il faut s'assurer que le fichier n'est appelée qu'en lazy: il n'est pas importé d'une façon ordinaire ou référencé dans un index ou un fichier particulier (un import ordinaire + un import lazy => l'import ordinaire qui va l'importer).**

1️⃣ Chargement des images statiques (intégrées dans le projet) en mode lazy :

✴️ Déclaration :

```js
import React, { useState, useEffect, } from 'react';
import PropTypes from 'prop-types';

const LazyImage = ({
  name,
  alt,
}) => {
  const [
    currentImage,
    setCurrentImage,
  ] = useState(null);

  useEffect(() => {
    import(`./images/${name}`).then(image => (
      image
        ? setCurrentImage(image.default)
        : setCurrentImage(null)));
  }, [
    name,
  ]);

  return (
    <img
      src={currentImage}
      alt={alt}
    />
  );
};


// prop type validation
LazyImage.propTypes = {
  name: PropTypes.string,
  alt: PropTypes.string,
};

// default prop
LazyImage.defaultProps = {
  name: null,
  alt: null,
};

export default LazyImage;
```

✴️ Appel :

```js
<LazyImage
  name="Présentation-1.png"
  alt="pane 1"
/>
```

2️⃣ Chargement des fichiers statiques (intégrés dans le projet) en mode lazy :

```js
const getLocalFaqQuery = (params) => import(`../commons/data/${params?.marche?.toLowerCase()}/wtr-faq-${params?.page}.json`);
```

Le chemin du fichier est dynamique.

💡 On peut aussi appeler la requête `getLocalFaqQuery` dans un service `Redux Saga` : 

```js
    const {
      title,
      description,
      faqList,
    } = yield call(getLocalFaqQuery, params) || {};
 
    // dispatch a failure action
    // to the store with the error
    yield put({
      type: GET_FAQ_REQUEST_SUCCESS,
      data: {
        title,
        description,
        faqList,
      },
    });
```

[Exemple Complet](https://sgithub.fr.world.socgen/AppliDigitalClient/bddf_awt_wtr/blob/master/modules/front-js/js/commons/hocs/faq/services/FaqService.js#L47)

---

##### c.5. Import dynamique : Décaler les librairies non essentielles à la construction initiale

Si une librairie n'est pas essentielle au démarrage ou à la construction initiale du composant, vous pouvez importer la librairie d'une façon dynamique.

**L'import dynamique va automatiquement créer un chunck séparé pour la librairie (sans aucune configuration supplémentaire de webpack).**

Dans l'exemple ci-dessous, la librairie Audience n'est nécessaire qu'au moment du click :

```js
/**
 * track event
 * @param eventName (libellé de l'évènement)
 */
const trackEvent = (eventName) => {
    // lazy load audience because we need only
    // when event occurs
    import('awt-audience').then((Audience) => {
      const params = {};
      params.x_this = this;
      params.eventName = eventName; // nom de l'event pour le web
      params.rub = eventName; // nom de l'event pour l'appli-native
      params.s2 = XITI_S2_ID;
      Audience.trackEvent(params);
    });
};
```

Il est inutile de charger la librairie dans les imports requis mais de décaler jusqu'au click sur le bouton pour tracker l'événement.

---

##### c.6. Lazy load dans les carroussels ou les sliders

Des librairies comme SGC+ ou React Slick, offrent la possibilité de charger les images dans un slider d'une façon lazy :

https://sgithub.fr.world.socgen/ITIM-CSB-DAC-PDT/MEM-FRONT/blob/mem-frontend-1.2.14/js/features/components/carousel/CarouselNews.jsx#L14

https://react-slick.neostack.com/docs/example/lazy-load/

Les images ne seront pas chargées toutes à la fois, mais à la demande et une par une => cela améliore le temps de premier chargement.

---

##### c.7. Pagination des grandes listes 

Si vous avez une grande quantité de données à afficher dans une liste ou un tableau, les techniques de "load more" et de "pagination" sont fortement recommandées :
- la pagination doit être gérée côté backend.
- en naviguant d'une page à l'autre, le frontend demande au backend la page suivante.

Cette technique améliore considérablement :
- le traitement frontend.
- le temps de rendering et l'arborescence html (au lieu d'afficher 100 éléments, on affiche 10 par 10).
- chargement à la demande.

Exemples : 

[Liste avec un chargement infini (scroll)](https://socle.applis.bad.socgen/icd/static/sg-components-plus/latest/?path=/docs/1-0-multienseignes-1-3-molecules-sglist-listcomplexe-listinfinite--list-infinite)

[Liste avec load more (bouton)](https://socle.applis.bad.socgen/icd/static/sg-components-plus/latest/?path=/docs/1-0-multienseignes-1-3-molecules-sglist-listcomplexe-listafficherplus--list-afficher-plus)

[Tableau avec une pagination dynamique](https://socle.applis.bad.socgen/icd/static/sg-components-plus/latest/?path=/docs/1-0-multienseignes-1-3-molecules-sgtable-tablepagination-tablepaginationdynamique--table-pagination-dynamique) 

---

##### d. Optimisation des appels Backend

- Vérifier la possibilité de grouper les appels backend.

- Grâce à Redux et au mécanisme de Single Page, vous pouvez éviter l'appel à un service si les données existent encore dans le store Redux et sont à jour.

Exemple, au lieu d'appeler à chaque fois, au niveau de `componentDidMount`, le service `faq` :

```js
    componentDidMount() {
      this.initPage();
    }

    initPage = () => {
      const {
        configuration,
        requestFaq,
      } = this.props || {};
      requestFaq({
        page,
        marche: configuration?.context?.marche,
      });
    };
```

On peut changer l'appel de cette façon :

```js
    componentDidMount() {
      this.initPage();
    }

    initPage = () => {
      const {
        configuration,
        requestFaq,
        faqData,
      } = this.props || {};
      
      if(!faqData){
         requestFaq({
          page,
          marche: configuration?.context?.marche,
        });
      }
    };
```

💡 Si la data `faqData` existe encore dans le store Redux, on ne déclenche pas l'appel au service `faq`.

**⛔ Attention: le store Redux est une cache non persistante, il est vidé à chaque rechargement de la page ou suite à un F5. Il n'est pas aussi partagé entre les onglets (sandbox).**

---

##### e. Exploitation des capacités React `shouldComponentUpdate` et `PureComponent` 

**⛔ Attention: Les techniques `shouldComponentUpdate` et `PureComponent` n'existent qu’en tant qu'optimisation de performance et non par défaut.**

Quand les props ou l'état local d'un composant changent, React décide si une mise à jour du DOM est nécessaire en comparant l'élément renvoyé avec l'élément du rendu précédent. Quand ils ne sont pas égaux, React met à jour le DOM.

Même si React ne met à jour que les nœuds DOM modifiés, refaire un rendu prend un certain temps. Dans la plupart des cas ce n’est pas un problème, mais si le ralentissement est perceptible, vous pouvez accélérer le processus en surchargeant la méthode `shouldComponentUpdate` du cycle de vie, qui est déclenchée avant le démarrage du processus de rafraîchissement. 

L'implémentation par défaut de cette méthode renvoie true, laissant ainsi React faire la mise à jour :

```js
shouldComponentUpdate(nextProps, nextState) {
  return true;
}
```

Une implémentation personnalisée de `shouldComponentUpdate` :

```js
class CounterButton extends React.Component {
  ...
  
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.color !== nextProps.color) {
      return true;
    }
    return false;
  }

  render() {
    return (
      ...
    );
  }
}
```

Le plus souvent, plutôt que d'écrire manuellement `shouldComponentUpdate`, vous pouvez plutôt choisir d'étendre [React.PureComponent](https://en.reactjs.org/docs/react-api.html#reactpurecomponent). Ça revient à implémenter `shouldComponentUpdate` avec une comparaison **shallow** des propriétés et état actuels et précédents.

[Plus d'informations](https://en.reactjs.org/docs/optimizing-performance.html#avoid-reconciliation).

---

#### f. memo ne doit pas être le choix par défaut 

> Before you apply optimizations like memo or useMemo, it might make sense to look if you can split the parts that change from the parts that don’t change.

[Before Memo](https://overreacted.io/before-you-memo/)

---

#### g. limiter l'utilisation de `useSelector` Redux

La version `useSelector` Redux contrairement à la version avec `connect` sur laquelle se base `Reduxify`, n'offre pas les mêmes optimisations :

 >  There are a couple of edge cases that can occur, and we're documenting those so that you can be aware of them. Unlike connect(), useSelector() does not prevent the component from re-rendering due to its parent re-rendering, even if the component's props did not change.

> Because of this, the "stale props" and "zombie child" issues may potentially re-occur in an app that relies on using hooks instead of connect().

[Plus d'informations](https://react-redux.js.org/api/hooks#usage-warnings)

`useSelector` est uniquement recommandé lorsqu'il s'agit :
- de lire l'awtContext [Exemple](https://sgithub.fr.world.socgen/AppliDigitalClient/bddf_awt_wtr/blob/master/modules/front-js/js/commons/dico/MarcheLocalizedFragment.jsx#L5).
- ou s'il y a une data dans le store utilisée uniquement par le dernier composant dans l'arborescence.

⛔ **Il est fortement conseillé de se limiter à 4 niveaux de profondeur pour éviter l'anti-pattern `nested props` (exemple : Page -> Form -> List -> Item).**

### 5. Les techniques d'optimisations webpack :

#### a. ESModules & Treeshaking

> ECMAScript Modules (ESM) is a specification for using Modules in the Web. It's supported by all modern browsers and the recommended way of writing modular code for the Web.

> Tree shaking is a term commonly used in the JavaScript context for dead-code elimination. It relies on the static structure of ES2015 module syntax, i.e. import and export. The name and concept have been popularized by the ES2015 module bundler rollup.

> So, what we've learned is that in order to take advantage of tree shaking, you must :
> - Use ES2015 module syntax (i.e. import and export).
> - Ensure no compilers transform your ES2015 module syntax into CommonJS modules (this is the default behavior of the popular Babel preset @babel/preset-env - see the documentation for more details).
> - Add a "sideEffects" property to your project's package.json file.
> - Use the production mode configuration option to enable various optimizations including minification and tree shaking.

[Treeshaking](https://webpack.js.org/guides/tree-shaking/#conclusion)

**Il est très important de vérifier si la librairie à utiliser supporte l'import modulaire ou non avant de l'utiliser (es-modules) afin d'éliminer le code non utilisé et n'importer que ce dont on a besoin.**

Exemples :

**SGC+ :**

https://sgithub.fr.world.socgen/AppliDigitalClient/sg_npm_sgc_components-plus/blob/develop/src/sg-button/package.json#L13

https://sgithub.fr.world.socgen/AppliDigitalClient/sg_npm_sgc_components-plus/blob/develop/src/sg-button/package.json#L40

**antd :**

https://bundlephobia.com/result?p=antd@4.14.0

---

#### b. Multi-entrées

La technique de multi-entrées est très utile lorsque l'application contient plusieurs features indépendantes avec un module en commun.

**Elle permet de créer un bundle séparé pour chaque entrée sans impact sur l'infrastructure (sans créer ni déployer de nouveaux artefacts).**

Chaque bundle est associé à une page html distincte.

**L'impact est qu'il n'est pas possible de naviguer en SPA d'une feature à l'autre dans ce cas : Il est nécessaire de changer l'url de la page HTML (et donc de recharger totalement la page)**

Les étapes de création de multi-entrées :

1. Au lieu d'avoir un seul point d'entrée dans webpack ([GKB AVANT](https://sgithub.fr.world.socgen/AppliDigitalClient/bddf_awt_gkb/blob/1.25.13/modules/front-js/webpack/webpack.dev.js#L5)) : 

```js
  entry: [ path.resolve(__dirname, '../js/index.js'), ],
```


2. On crée plusieurs entrées ([GKB APRES](https://sgithub.fr.world.socgen/AppliDigitalClient/bddf_awt_gkb/blob/1.25.13/modules/front-js/webpack/webpack.dev.js#L8)) : 

```js
entry:  {
    Sou: [
      path.resolve(__dirname, '../js/features/sou/index.js'),
    ],
    Decp: [
      path.resolve(__dirname, '../js/features/decp/index.js'),
    ],
    DematCodePin: [
      path.resolve(__dirname, '../js/features/demat-code-pin/index.js'),
    ],
  },
```

3. Au lieu d'avoir une seule sortie dans webpack ([GKB AVANT](https://sgithub.fr.world.socgen/AppliDigitalClient/bddf_awt_gkb/blob/1.25.13/modules/front-js/webpack/webpack.dev.js#L12)): 

```js
output: Object.assign(devConfig.output, {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/icd/static/gkb-front/',
    filename: 'awtGkbBuilder.js',
    libraryTarget: 'var',
    libraryExport: 'default',
    library: 'awtGkbBuilder',
  }),
```

4. On crée plusieurs sorties ([GKB APRES](https://sgithub.fr.world.socgen/AppliDigitalClient/bddf_awt_gkb/blob/1.25.13/modules/front-js/webpack/webpack.dev.js#L21)):

```js
  output: Object.assign(devConfig.output, {
    path: path.resolve(__dirname, '../dist'),
    filename: 'awtGkb[name]Builder.js',
    libraryTarget: 'var',
    libraryExport: 'default',
    library: 'awtGkb[name]Builder'
  }),
```

5. Faire ces changements dans l'awt-page.jsp : 

[Changement 1](https://sgithub.fr.world.socgen/AppliDigitalClient/bddf_awt_gkb/blob/1.25.13/modules/bff/src/main/webapp/WEB-INF/awt-page.jsp#L10)

[Changement 2](https://sgithub.fr.world.socgen/AppliDigitalClient/bddf_awt_gkb/blob/1.25.13/modules/bff/src/main/webapp/WEB-INF/awt-page.jsp#L26)

[Changement 3](https://sgithub.fr.world.socgen/AppliDigitalClient/bddf_awt_gkb/blob/1.25.13/modules/bff/src/main/webapp/WEB-INF/awt-page.jsp#L82)


6. Faire ces changements dans le fichier web.xml : 

[Ajout d'un builder isolé pour Sou](https://sgithub.fr.world.socgen/AppliDigitalClient/bddf_awt_gkb/blob/1.25.13/modules/bff/src/main/webapp/WEB-INF/web.xml#L144)

[Ajout d'un builder isolé pour Decp](https://sgithub.fr.world.socgen/AppliDigitalClient/bddf_awt_gkb/blob/1.25.13/modules/bff/src/main/webapp/WEB-INF/web.xml#L399)

7. Chaque feature aura sa route et index comme s'il s'agit d'une awt séparée : 

[Sou comme une awt séparée](https://sgithub.fr.world.socgen/AppliDigitalClient/bddf_awt_gkb/blob/1.25.13/modules/front-js/js/features/sou/index.js)

[Decp comme une awt séparée](https://sgithub.fr.world.socgen/AppliDigitalClient/bddf_awt_gkb/blob/1.25.13/modules/front-js/js/features/decp/index.js)

**A ce niveau chaque feature est une AWT séparée grâce à webpack, sans avoir besoin de créer des multi-frontends et un WAR de déploiement pour chaque feature.**

---

Ci-desous le résultat du bundle analyser après l'optimisation et l'application de cette technique de **multi-entrées** :

![BUNDLE_OPT_MULTI_ENTRIES_2.png](https://sgithub.fr.world.socgen/raw/AppliDigitalClient/awt_ref_documentation_wiki/master/docs/files/BUNDLE_OPT_MULTI_ENTRIES_2.png)

---

## Plus d'informations 

- [devtools-performance](https://www.debugbear.com/blog/devtools-performance)
- [speed-at-scale-web-performance-tips-and-tricks](https://speakerdeck.com/addyosmani/speed-at-scale-web-performance-tips-and-tricks-from-the-trenches)
- [evaluate-performance](https://developer.chrome.com/docs/devtools/evaluate-performance/#find_the_bottleneck)






# React-JS checklist :

⛔ Il est fortement recommandé d'utiliser les [awt-react-cli](https://sgithub.fr.world.socgen/SocleDigitalClient/sg_npm_dgt_awt_react-cli/blob/master/README.md) pour assurer une organisation standard et correcte, une nomenclature correcte et cohérente dans tout le projet.

**Cette checklist est à vérifier au cours de développement et au moment de la revue de la PR :**

1.	Vérifier les warning et les erreurs dans la console : **développez avec une console toujours ouverte**.

2.	L'utilisation et l'activation de [lint](/client/awt-v4-eslint.md) est obligatoire :
    - Ne jamais désactiver le lint (c'est une très mauvaise pratique de désactiver le lint).
    - Ne jamais désactiver Husky.
    - Ne jamais pusher un code non linté.

3.	Le code est-il **compatible IE/Chrome/Firefox ?**
    - Documentation [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Performance#browser_compatibility)
    - [caniuse](https://caniuse.com/)

4.	La validation des proptypes est [obligatoire](/client/awt-v4-react-proptypes-validation.md) :
    - Vérifier toujours la console.
    - Les proptypes vous permettent d’identifier facilement les changements dans les retours backend.
    - Utiliser Proptypes.any si et seulement si vous ne connaissez pas le format ou que le contenu est dynamique et variable.

5. Les noms des variables, fonctions, composants, classes et constantes sont **clairs et significatifs** ? Respectent-ils [la nomenclature recommandée](/client/awt-react-clean-code-normes?id=nomenclature) ?

6. Les `import` sont-ils bien [organisés](/client/awt-react-clean-code-normes?id=ordre-des-imports) et [formattés](/client/awt-react-clean-code-normes?id=les-imports-une-seule-ligne-vs-multi-lignes)?

7. Mon architecture est-elle bien pensée [Architecture recommandée](/client/awt-v4-architecture-front-react.md) ?

8. Les composants sont bien séparés ?
    - Séparation des concerns techniques : UI-Logic (appels backend, routage, ...) et UI (présentation uniquement). [Les patterns React](/client/awt-v4-pattern-react.md).
    - Séparation des concerns fonctionnels : chaque composant a un rôle fonctionnel bien précis (unique).

9.	Le composant **stateless de présentation est-il une fonction pure** ? 
    - Il ne dépend que de ses entrées (props) ? 
    - Il n'affecte pas les entrées ? 
    - Les props sont [readOnly](https://reactjs.org/docs/components-and-props.html#props-are-read-only) ?
    - Le state est-il bien géré (centralisation, lift up, single source of truth, prédictible) ? [Plus d'informations](https://reactjs.org/docs/lifting-state-up.html#gatsby-focus-wrapper).
    - Il ne crée aucun side-effect (aucun appel backend, aucun routage, ...)? 
    - Le composant stateless doit être sandboxé (isolé et autonome).
    - Est-ce qu'il est réutilisable ? 
    - Est-ce qu'il fait l'affichage uniquement ? [Exemple](https://sgithub.fr.world.socgen/AppliDigitalClient/bddf_awt_bwd_bourse/blob/orison3/modules/bwd-front-js/js/features/ost-a-saisir/components/OstASaisirView.jsx)
    - Est-ce qu'il prend uniquement le nécessaire en entrée ([réconciliation](https://reactjs.org/docs/reconciliation.html)) ? 
    - Le principe de Single Responsability est-il validé ?

10.	Les composants sont-ils couverts par des [tests unitaires](/client/awt-v4-react-unit-test.md) ? *Les tests unitaires (JEST/ENZYME/CHAI) sont obligatoires.*

11.	Les paramètres des fonctions sont-ils **immutables (After it has been created, it can never change) ?**

12.	Les fonctions sont elles **pures** ? (single responsability, concise, autonome, isolée, ne créent aucun side effects, n’agissent pas sur les entrées ..)

13.	Utilisez la **programmation fonctionnelle** : *(map, reduce, filter) plutôt que les for et les foreach, destruction, spread, REST.*

14.	Le code est-il **KISS (Keep It Stupid Simple)** ? Il ne faut jamais complexifier le développement pour pouvoir utiliser une API ou un composant.

15.	Le code est-il **défensive (en pensant au pire: null, undefined, mauvais type, ...)** ? Notamment la couche service qui est en relation avec le backend.

16.	Y-a-t-il un code dupliqué ?

17.	**Il n'est pas recommandé d'utiliser ou de laisser les console.log**.

18.	Analysez le bundle js en utilisant : **npm analyze** (changer/optimiser les APIs volumineuses, changer/optimiser le code).

19.	**Vérifier la performance en lançant les devTools** ([Comment optimiser le bundle webpack d'une AWT-React ?](https://xblocks.socgen/icd/demo/#/client/awt-react-optimisation-webpack.md)).

20. **Valider la structure HTML par le [W3C](https://validator.w3.org/#validate_by_input).**

21. **Vérifier le responsive et l'accessibilité : en faisant des tests manuels avec le clavier (touche tabulation, entrée, espace) et en utilisant les outils comme Lighthouse, axeDevTools ou Microsoft accessibility insight**.

[WCAG Checklists](https://www.wuhcag.com/wcag-checklist/)

[WCAG 2 Checklist](https://webaim.org/standards/wcag/checklist)

[a11y Checklist](https://www.a11yproject.com/checklist/)

[go/accessibilite](http://go/accessibilite)

**NB:**
- Lighthouse est intégré nativement avec les devtools chrome.
- axeDevTools est un addOn chrome qui peut être téléchargé depuis AppsOnDemand.

23. Une fois le build est terminé, **[vérifier la santé de l'application](https://sgithub.fr.world.socgen/AppliDigitalClient/ref_awt_gfm_documentation_wiki/blob/master/docs/client/awt-react-project-sante.md)**.





