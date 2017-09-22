# APV2014

Répertoire du code de présentation de l'APV 2014.

Code largement inspiré de celui de l'APV 2013.
## Description de l'authoring

### Architecture

L'authoring de l'APV comprend les menus de présentation du contenu ainsi que le lecteur vidéo. Le tout forme un site web local, codé en HTML et en CSS. L'objectif est de limiter au maximum la duplication de code HTML ; ainsi il n'y a dans le site que 6 pages différentes :
* le lecteur de la vidéo d'introduction ;
* la page du menu principal ;
* la page de n'importe quel menu redirigeant vers des projections (un menu ne peut pas contenir de vidéos !) ;
* la page de n'importe quelle projection redirigeant vers toutes les vidéos de cette projection ;
* le lecteur vidéo qui peut lire une vidéo particulière ou toutes les vidéos d'une projection à la suite ;
* la page des crédits.

Chaque page ou composant du site possède un fichier `.html` (template) qui contient le code nécessaire à l'affichage de la page ainsi qu'un fichier `.js` (controlleur), qui contient du code exécuté au chargement de la page et qui correspond à la logique derrière l'affichage de la page.

Ainsi les pages de projections ou de menu recoivent des paramètres GET dans leurs URL permettant de savoir quelle projection ou quel menu afficher. Le controlleur récupère ces paramètres et s'en sert pour chercher les données nécessaires à l'affichage dans les fichiers du dossier `source/data/`.

Le moteur de templating [pure.js](https://beebole.com/pure/) va ensuite utiliser les directives déclarées pour produire le code HTML correspondant grâce à des boucles. Un exemple de directive est : pour chaque `video` dans l'objet Javascript `videos`, répéter la balise HTML `<div class="video" src="">...</div>`  et remplir l'attribut `src` avec la valeur `video.src`.

De cette manière, il n'y a pas besoin de toucher au code HTML et Javascript du site d'une année sur l'autre : il suffit de mofidier les fichiers `videos.js` et `display.js` du dossier `source/data`.

### Templates

Les templates sont relativement concis puisque les balises destinées à être répétées n'apparaissent qu'une fois dans le code source ; c'est pure.js qui se charge de dérouler les boucles au chargement de la page.

Le CSS de la page, hérité de Nicolas Breton et du site de l'ADD 2011, est assez cryptique. Il est contenu entièrement dans le fichier monolithique `source/css/main.css`. Une grande partie du code de ce fichier ne sert d'ailleurs à rien, une des prochaines missions du respo authoring de l'APV sera donc de le nettoyer, de le refactorer et de le commenter.


### Controlleurs

Toutes les variables utilisées dans le code du controlleur ne sont pas utilisées dans le code du controlleur, ce qui est assez perturbant à la lecture du fichier. En effet c'est parce que plusieurs fichiers Javascript sont chargés par les pages et exécutés les uns à la suite des autres, le controlleur en dernier. Voici donc la liste des variables externes qui apparaissent dans les fichiers de controlleurs :
* le fichier `source/js/pure.js` définit la fonction `$(<html element>).render(<data>,<directive>)` dont on trouvera la documentation sur le [site de pure.js](https://beebole.com/pure/) ;
* le fichier `source/js/jquery.cycle.all.js` définit la fonction `$(<html element>).cycle(...)` dont on trouvera la documentation [ici](http://jquery.malsup.com/cycle/) ;
* le fichier `source/js/queryString.js` définit la variable `Querystring` par laquelle on peut accéder au paramètre GET ; par exemple on accède à la valeur `machin` de `...&truc=machin` par `QueryString.truc` ;
* le fichier `arrayToSlides.js` définit la fonction `slideify(<liste d'élements>,<true|false>)` qui découpe la liste d'éléments en plusieurs listes de même taille (8 avec la présentation acutelle), chaque petite liste correspondant aux éléments d'une slide. Le deuxième paramètre booléen active ou pas la fonction de réorganisation de la dernière slide. Cela est utile dans les menus car si la dernière slide ne contient que deux éléments, ils seront centrés. Ce paramètre est réglé sur `false` pour les projections car cela entre en conflit avec le système de lecture de toutes les vidéos d'une projection.

Le code des controlleurs est documenté et explique la fonction de chaque morceau de code. La définifion des directives de pure.js est l'élément le plus compliqué, mais on trouvera encore une fois l'explication de toutes les constructions sur le [site de pure.js](https://beebole.com/pure/).

### Fichiers de données

#### `display.js`

Ce fichier contient les locations dans l'arborescence de fichiers du site de tous les éléments graphiques de la présentation (sauf les posters des vidéos), regroupés dans un seul objet Javascript. On retrouvera souvent un champ `pathPrefix` dans l'objet qui est utilisé par le controlleur et qui permet de ne pas répéter le chemin complet des chemins à chaque fois. Attention, le `pathPrefix` est relatif au dossier où se trouve le fichier `.html` de la page en train d'être visionnée ; voilà pourquoi ils commencent tous par `../../`. Voici une description de la structure de l'objet dont il faudra modifier les valeurs d'une année sur l'autre.
* `intro` : éléments graphique de la page d'introduction.
* `menu` : éléments graphique de la page des menus. Pour chaque menu
    * `title` : image correspondant au titre du menu apparaissant en haut de la page.
    * `prev` : id du menu précédent, créant ainsi une arborescence dans la navigation des menus.
    * `background` : image de fond de la page du menu.
    * `sections` : liste des éléments du menu. Pour chaque élément on a :
        * `type` : égal à `projection` ou `menu`, selon si l'élément est une projection ou un autre menu.
        * `poster` : petite image s'affichant sur l'élément.
        * `title` : titre qui appraraîtra sur la page pour l'élément.          
        * `id` : id de l'élément (nom du menu ou de l'élément dans le fichier).
* `credits` : éléments graphique de la page des crédits.
    * `apj` : page APJ de l'APV qui apparaît dans les crédits.
* `projection` : éléments graphique de la page des projections. Pour chaque projection :
    * `titre` : idem que le `title` des menus, ce n'est pas bien de ne pas être cohérent avec la langue choisie.
* `common` : éléments graphiques communs à plusieurs pages. Chaque bouton a une image `main` et une image `hover` lorsque l'on passe le curseur dessus.

#### `videos.js`

Ce fichier contient toutes les informations relatives aux vidéos. Voici une description de la structure :
* `<nom de la projection>` : ce nom correpond à celui qui se trouve dans le champ `id` de `display.js`. pour chaque projection, on a :
    * `videoPathPrefix` : chemin relatif du dossier où se trouvent toutes les vidéos de la projection.
    * `posterPathPrefix` : chemin relatif du dossier où se trouvent tous les posters des vidéos de la projectio.
    * `videos` : pour chaque vidéo, on a :
        * `poster` : nom de l'image à utiliser comme poster pour la vidéo.
        * `src` : nom du fichier vidéo  à lire.
        * `title` : titre de la vidéo tel qu'il apparaît sur les menus.

## Mise à jour de l'authoring

Grâce à l'architecture du site, il suffit pour mettre à jour le site de présentation d'une année sur l'autre de :
* changer les fichiers d'images sauf les posters dans `source/image` en gardant le même nom de fichiers pour un changement de design ;
* changer les dossiers `source/images/menus`, `source/images/projections` et `source/image/posters` avec les nouveaux menus et projections ;
* changer `display.js` avec les noms et chemins des nouvelles projections ;
* changer `videos.js` avec les noms et chemins des nouvelles vidéos.

En pratique, il est possible de ne faire que la moitié du changement vu qu'une partie des projections JTX et autres amphis binets sont présents d'un APV sur l'autre. Dans un tel cas, autant garder les fichiers de posters originaux plutôt que de les refaire.

En bonus, on pourra s'attaquer au refactoring du CSS pour finir de rendre ce site de présentation proprement codé.

## Scripts
Les scripts utilisés par l'APV 2014 (en général écrits par l'APV 2013) ont été déplacés dans leur propre dépôt, APV-utilities.
