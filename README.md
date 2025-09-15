# TODO-API

## Base de données

Voici les étapes pour créer la basa de données selon une approche code first.

1. Copier le fichier .env.example et le renommer .env
2. Compléter la configuration en remplissant les valeurs manquantes après le =. Dans notre cas, il ne manquerait que le `DB_PASSWORD=ton_mot_de_passe`.
3. Dans mariaDB, créer la base de données todo_api
4. exécuter la commande `npm run db:push` pour créer la base de données. La table est générée à partir du fichier `schema.ts`. Va y jeter un coup d'oeil.
5. Une fois que c'est fait, exécute `npm run dev` pour démarrer le serveur et va sur `http://localhost:3001/health`. Tu devrais avoir `"database": "healthy"` d'affihché.
6. C'est drizzle qui sera notre ORM pour cette session.

### Questions à répondre :

1. Quel commande permet de démarrer ton serveur node.js?
2. Où sont storées les variables qui servent à configurer la base de données?
3. Comment sont lues ces variables qui sont dans le fichier .env?
4. Comment la table todos a-t-elle été créée?
5. Dans quel dossier se situe la configuration de la base de données?
6. Comment ferais-tu pour modifier
   1. Le nom de la base de données
   2. Le type de base de données
   3. Le nom d'une colonne

## Swagger
Il est possible de tester l'API à partir du fichier swagger.yml. Voici le lien `http://localhost:3001/swagger/`. Tu peux ajouter cette ligne une fois que ton site sera dé
ployé.
```
servers:
  - url: http://localhost:3001
  - url: lien vers ton site web déployé
```

### Questions à répondre :

1. À partir du fichier swagger, exécute le get sur /todos. Que reçois-tu?
2. Que font les verbes GET, POST, PATCH et DELETE?
3. Est-ce que POST / todos fonctionne? Non? C'est normal, on va le coder au prochain cours!


## Déploiement

J'aimerais que tu déploies cet API sur un VPS digital ocean. Les contraintes sont les suivantes :
- Ton api doit être accessible sur une addresse de type fqdn (fully qualified domain name) ex : antoine.com  et non pas une adresse IP.
- Ton api doit être déployée une fois buildée (`npm run build`) sur le serveur. Un dossier nommé dist sera créé et c'est le fichier server.js qu'il faut démarrer.
- Jamais le fichier .env doit être dans ton projet (il contient le mot de passe vers ta base de données). Tu dois donc gérer les variables d'environnement dans le serveur directement.
  - Soit tu crée un autre fichier .env (moins sécuritaire car il contient des informations critiques)
  - Soit tu lance le serveur avec une ligne dans ce genre : `PORT=3001 NODE_ENV=production DB_HOST=localhost ...ETC..... node dist/server.js`
- (optionnel, mais obligatoire plus tard) Ton API doit être disponible en https. Avec nginx, c'est très simple à mettre en place.

Astuce : Crée un fichier bash qui permet d'automatiser le déploiement de ton API losrqu'il a des modifications. Les opérations qui ne sont qu'effectuées une seule fois (comme installer et configurer le serveur ngnix) ne devraient pas faire partie de ce script. Par contre, la migration de la base de données, la ligne de commande pour démarrer le serveur, sont des éléments que tu devrais retrouver dans ton script.

Enrichissement : Il est possible d'effectuer un déploiement automatique en exécutant ton script suite à une modification de ton projet dans github, je te montrerai comment faire plus tard dans le cours, mais cela ne sera pas obligatoire.


## Node.js

### NodeJS
En te basant sur le swagger, ajoute les routes POST, PATCH et DELETE ainsi que toute la logique qui s'y rattache en te basant sur les get.

### Quelques questions
1. Explique cette blague https://www.reddit.com/r/ProgrammerHumor/comments/1h4v9i3/dontyouhateitwhenthathappens/#lightbox
2. Ordonne les couches suivantes selon note architecture. (Controlleur, Service, Repo, errorHandlerMiddleware, )
3. Quel est le rôle du controlleur?
4. Quel est le rôle du service?
5. Quel est le rôle du repository?
6. Dans notre projet, est-ce qu'il y a des DTOS et des DAOS?
7. Serais-tu capable d'ajouter la logique dans notre projet pour un login?

### Swagger
Ajoute dans le swagger la route pour aller chercher un TODO/ID
