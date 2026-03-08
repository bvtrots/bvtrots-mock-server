# 🖥 bvtrots Test Server

<p align="center">
  <img src="public/img/app-screenshot.jpg" alt="CloudPix Interface" width="600px">
</p>

<p align="center">
  <strong>A highly scalable mock backend built with TypeScript and Feature-Sliced Design (FSD) principles for multi-project support.</strong>
</p>

---

## 📖 Overview
Unlike standard mock servers, this project implements a **modular architecture** that separates core infrastructure from application-specific business logic. This allows the server to act as a universal backend for multiple independent frontend platforms simultaneously.

---

## 🏗️ Architecture: Feature-Sliced Design (FSD)

The server is organized into layers to ensure maximum scalability and clean separation of concerns:

* **Shared Layer**: Contains the "engine" of the server — universal CRUD conductors, database interaction logic (`db-engine.ts`), and base TypeScript interfaces.
* **Entities Layer**: Houses project-specific logic (e.g., `cloudpix-platform`). Each entity defines its own routes and data models.
* **App Layer**: The entry point (`server.ts`) that initializes the environment and connects all modules.

---

## 🛠 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Runtime** | Node.js (v20+) |
| **Language** | TypeScript (Strict Mode) |
| **Core Engine** | [json-server](https://github.com/typicode/json-server) |
| **File Handling** | Multer |
| **Deployment** | Render (Web Service) |
| **Dev Tools** | tsx, typescript, @types/node |

---

## 🎯 Key Features & Engineering Challenges

* ⚡ **Live Mock API**: Powered by `json-server`, providing full REST architectural constraints.
* 🏗️ **FSD Implementation**: Logic is decoupled, allowing the core engine to remain untouched when adding new frontend projects.
* 💾 **State Persistence**: Data is managed via JSON files, acting as a lightweight document-based store.
* 📁 **Media Support**: Integrated **Multer** for handling multipart/form-data (image and file uploads).
* 📡 **Cloud Deployment**: Hosted on **Render**, providing a public entry point for SPAs.

---

## 📂 Project Structure

```text
bvtrots-test-server/
├── data/               # Persistent JSON storage organized by project
│   └──  cloudpix-platform/
├── public/             # Static assets organized by project
├── src/
│   ├── app/            # Application bootstrap (server.ts)
│   ├── entities/       # Project-specific logic (Routes & Models)
│   │   └──cloudpix-platform/
│   └── shared/         # Core infrastructure (The "Engine")
│       ├── api/        # Base CRUD conductors
│       ├── db/         # Database manipulation (db-engine.ts)
│       ├── lib/        # Reusable utilities (storage.ts)
│       └── types/      # Universal TS definitions
└── package.json        # Unified dependency management
```

---

## 🔗 Connected Applications
The following applications are currently running on this server:

📸 [CloudPix Platform](https://github.com/bvtrots/cloudpix-platform) — Photo Sharing Ecosystem.

---

## ⚙️ Installation & Setup
1. Clone the repository

        git clone git@github.com:bvtrots/bvtrots-test-server.git
        cd bvtrots-test-server


2. Install dependencies

        npm install


3. Run the server development (tsx watch)

        npm run dev


4. Production (tsc build & run)

         npm run build && npm start

---


## 📜 Commit Convention
To maintain a clean and readable history, this project follows a semantic commit convention with emojis:

| Tag | Emoji | Meaning |
| :--- | :--- | :--- |
| **feat** | ✨ | New feature or functionality |
| **fix** | 💊 | Bug fixes and code repairs |
| **refactor** | ♻️ | Code restructuring without changing functionality |
| **style** | 🎨 | UI/UX, CSS, and layout improvements |
| **build** | ⚙️ | Build system configuration or dependencies |
| **chore** | 🔧 | Maintenance, config tweaks, or tool updates |
| **docs** | 📝 | Documentation and comments |

---

## 📝 Engineering Commentary

This server is designed as a **pluggable framework** for rapid backend prototyping. Its core feature is the ability to support an unlimited number of independent frontend applications within a single runtime.

By leveraging a **Shared/Entity** architecture, the core engine remains completely agnostic of the business logic. To connect a new application, you only need to define its specific CRUD logic and data models in the `entities` layer. The shared `crud.conductor.ts` then automatically orchestrates these definitions, providing a consistent and scalable API. This approach eliminates code duplication and allows for near-instant deployment of new mock environments.


<p align="center">
Developed with ❤️ by <strong><a href="https://github.com/bvtrots">bvtrots</a></strong>
</p>