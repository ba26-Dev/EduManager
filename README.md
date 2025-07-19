# 🎓 EduManage — Gestion Scolaire Moderne

EduManage est une plateforme web moderne et sécurisée pour la gestion numérique des établissements scolaires. Développée avec React, TypeScript, Tailwind CSS et Axios, elle propose une interface fluide et responsive permettant la gestion complète des élèves, enseignants, classes et emplois du temps.

---

## 📦 Technologies utilisées

### Frontend :
- ⚛️ [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- 💨 [Tailwind CSS](https://tailwindcss.com/) — framework CSS moderne et responsive
- 📡 [Axios](https://axios-http.com/) — gestion des requêtes HTTP
- 🔑 JWT (JSON Web Token) — authentification sécurisée
- 🛣️ [React Router DOM](https://reactrouter.com/) — gestion des routes frontend
- 🛠️ [Heroicons](https://heroicons.com/) — icônes modernes optimisées pour Tailwind
- ⚡ [Vite](https://vitejs.dev/) — bundler rapide

### Backend :
- ☕ [Spring Boot](https://spring.io/projects/spring-boot) — API REST sécurisée
- 🍃 [MongoDB](https://www.mongodb.com/) — base de données NoSQL

---

## 📋 Prérequis

- **Backend :**
  - [Java 17+](https://adoptium.net/)
  - [Maven 3+](https://maven.apache.org/)
  - [MongoDB Community Edition](https://www.mongodb.com/try/download/community) (local ou Atlas)

- **Frontend :**
  - [Node.js 18+](https://nodejs.org/)
  - [npm 9+](https://www.npmjs.com/)

---

## 🛠️ Installation

```bash
# Cloner le projet
git clone https://github.com/ba26-Dev/EduManager.git
## Pour lancer le server frontend
cd frontend

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
## Pour lancer le server backEnd
sur un terminal et sur le meme repot
cd backEnd

mvn spring--boot:run
```
## 🔐 Authentification sécurisée (JWT)
Lors de la connexion, l'API renvoie un JWT au format :

```json
{
  "type": "Bearer",
  "token": "value_token",
  "role":"role-eleve"
}
```

- Ce token est automatiquement :

    - Stocké dans le localStorage.

    - Inclus dans le header Authorization pour toutes les requêtes API sécurisées.

## 📁 Structure du projet
 
```ini
backEnd
.
├── mvnw
├── mvnw.cmd
├── pom.xml
└── src
    ├── main
    │   ├── java
    │   │   └── unchk
    │   │       └── EduManager
    │   │           ├── controller
    │   │           │   ├── AdminController.java
    │   │           │   ├── AuthController.java
    │   │           │   ├── EleveController.java
    │   │           │   ├── EnseignantController.java
    │   │           │   └── UserController.java
    │   │           ├── Dto
    │   │           │   ├── CoursLayout.java
    │   │           │   ├── EleveDto.java
    │   │           │   ├── EleveInput.java
    │   │           │   ├── EnseignantDto.java
    │   │           │   ├── EnseignantInput.java
    │   │           │   ├── ParentDto.java
    │   │           │   ├── ParentInput.java
    │   │           │   ├── UserDto.java
    │   │           │   └── UserInput.java
    │   │           ├── EduManagerApplication.java
    │   │           ├── jwtToken
    │   │           │   ├── JwtFilter.java
    │   │           │   └── JwtUtils.java
    │   │           ├── mapping
    │   │           │   ├── MapperCours.java
    │   │           │   ├── MapperUser.java
    │   │           │   └── MapToUserInputConverter.java
    │   │           ├── model
    │   │           │   ├── Absence.java
    │   │           │   ├── Classeroom.java
    │   │           │   ├── Content.java
    │   │           │   ├── Cours.java
    │   │           │   ├── Eleve.java
    │   │           │   ├── EmploiDuTemps.java
    │   │           │   ├── Enseignant.java
    │   │           │   ├── Note.java
    │   │           │   ├── Parent.java
    │   │           │   ├── Sceance.java
    │   │           │   └── User.java
    │   │           ├── repository
    │   │           │   ├── AbsenceRepos.java
    │   │           │   ├── ClasseroomRepos.java
    │   │           │   ├── CoursRepos.java
    │   │           │   ├── EmploiDuTempsRepos.java
    │   │           │   ├── NoteRepos.java
    │   │           │   └── UserRepos.java
    │   │           ├── security
    │   │           │   ├── CorsConfig.java
    │   │           │   └── SecurityConfig.java
    │   │           ├── service
    │   │           │   ├── AbsenceService.java
    │   │           │   ├── ClasseSerive.java
    │   │           │   ├── CoursService.java
    │   │           │   └── UserService.java
    │   │           └── utils
    │   │               ├── Bulletin.java
    │   │               ├── Response.java
    │   │               ├── Role.java
    │   │               ├── Status.java
    │   │               ├── Types.java
    │   │               └── Utils.java
    │   └── resources
    │       └── application.properties


Pour frontend
.
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.cjs
├── public
│   └── vite.svg
├── README.md
├── src
│   ├── App.css
│   ├── App.tsx
│   ├── assets
│   │   └── react.svg
│   ├── components
│   │   ├── auth
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── dashboard
│   │   │   ├── ClasseroomDashbord.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── ParentDashboard.tsx
│   │   ├── layout
│   │   │   ├── Layout.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── Sidebar.tsx
│   │   └── ui
│   │       ├── ClasseroomCardList.tsx
│   │       ├── CoursCartList.tsx
│   │       ├── CreateAbsenceForm.tsx
│   │       ├── CreateClasseroom.tsx
│   │       ├── CreateCoursForm.tsx
│   │       ├── EmploiDuTempsCard.tsx
│   │       ├── EmploiDuTempsForm.tsx
│   │       ├── Profil.tsx
│   │       └── UserListCard.tsx
│   ├── context
│   │   └── AuthContext.tsx
│   ├── hooks
│   │   └── useAuth.ts
│   ├── index.css
│   ├── main.tsx
│   ├── pages
│   │   ├── DashboardPage.tsx
│   │   └── LoginPage.tsx
│   ├── services
│   │   └── api.ts
│   ├── types
│   │   └── auth.d.ts
│   └── vite-env.d.ts
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```
## L’API REST démarre sur :
`http://localhost:12000`

## Le frontend sera accessible sur :
`http://localhost:5173`
