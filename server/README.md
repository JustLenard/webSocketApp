# Chat Application Backend Server

This README file provides instructions for setting up and running the backend server of the Chat Application. The server
is built using TypeScript and NestJS, and it includes various features such as authentication with JWT, real-time
messaging with WebSockets, OpenAI integration for bot users, automatic data population, and typing indicators. Getting
Started

## Table of Contents

-   [Project Overview](#project-overview)
-   [Prerequisites](#prerequisites)
-   [Installation](#installation)
-   [Configuration](#configuration)
-   [Start Application](#start)
-   [Features](#features)
-   [Usage](#usage)
-   [License](#license)
-   [Contact Information](#contact-information)

## Prerequisites

To run the Chat Application backend server, you need to have the following software and environment variables
configured:

-   [Node.js](link)
-   [Yarn (Node Package Manager)](link)
-   [PostgreSQL](link)

...

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/JustLenard/webSocketApp.git
    ```

2. **Change directory to server:**

    ```bash
    cd server
    ```

3. **Install dependencies:**

    ```bash
    yarn
    ```

### Configuration

The backend server uses environment variables for configuration. Create a `.env` file in the server directory based on
the `.env.example` file provided. Modify the values as needed for your environment.

Here are the key environment variables:

-   **App port:** The port on which the server will run (default is 5000).

    ```
    PORT=5000
    ```

-   **JWT:** Set the access and refresh token secrets for authentication.

    ```
    ACCESS_TOKEN_SECRET=yourStrongSecret
    REFRESH_TOKEN_SECRET=yourStrongSecret
    ```

-   **OpenAi:** Provide your OpenAI API key and organization ID for bot user integration.

    ```
    OPENAI_API_KEY=yourOpenAiKey
    ORGANIZATION_ID=yourOpenAiOrganizationId
    ```

-   **PostgreSQL connection data:** Configure the PostgreSQL database connection details, including host, port,
    username, password, and database name.

    ```
    PG_HOST=localhost
    PG_PORT=5432
    PG_USERNAME=postgres
    PG_PASSWORD=yourSecretPassword
    PG_DATABASE=ChatApp
    ```

-   **CORS:** Specify the allowed origin for CORS (Cross-Origin Resource Sharing).

    ```
    ALLOWED_ORIGIN=http://localhost:5173
    ```

-   **Cookie:** Set the domain for cookies.

    ```
    DOMAIN=localhost
    ```

-   **Timezone:** Leave this as UTC.

    ```
    TZ=UTC
    ```

-   **Create admin user:** Define the initial admin user's name and password for the application.
    ```
    ADMIN_NAME=admin
    ADMIN_PASSWORD=admin123
    ```

## Start Application

    ```
    yarn run dev
    ```

## Features

...

## Usage

...

## License

...

## Contact Information

...

```

```

```

```
