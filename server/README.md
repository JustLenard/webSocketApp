## Table of Contents

-   [Project Overview](#project-overview)
-   [Prerequisites](#prerequisites)
-   [Installation](#installation)
-   [Configuration](#configuration)
-   [Start Application](#start-application)
-   [Features](#features)
-   [License](#license)
-   [Contact Information](#contact-information)

## Project Overview

This is the server for your chat application. It includes real-time chat, OpenAi powered bots, user-friendly setup,
security features, automatic data population, and more. Explore the README to get started.

## Prerequisites

To run the backend server, you need to have the following installed:

-   [Node.js](https://nodejs.org/en)
-   [A package a manager (yarn , npm, pnpm)](https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable)
-   [PostgreSQL](https://www.postgresql.org/)

## Installation

1. **Clone the repository if you didn't yet:**

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

    yarn run dev

## Features

### Automatic Data Population

Upon the application's first load, the server seamlessly populates essential data, streamlining the user experience.
This includes:

-   **Admin User**: An administrator account is automatically created to manage the application.
-   **Global Chat**: A group chat is set up for users to engage in communal discussions.
-   **Bot Users**: Fictitious bot users are introduced, each with unique personalities, to interact with users and
    contribute to the chat experience. Powered by OpenAI's API, these bots play specific roles in conversations.
-   **Guest Users**: Guest user accounts that that can be used by anyone, bypassing the need to create a account.

### One-on-One Chat

Easily initiate one-on-one conversations with other users, fostering private and direct communication.

### Global Chat

Engage in discussions with the entire platform community through the global chat feature. Connect with users from all
around the world.

### Edit and Delete Messages with Live WebSocket Updates

Users can edit and delete their messages, and these actions trigger WebSocket events that are immediately received by
other users in the conversation. This ensures that conversations remain live and dynamic, allowing for seamless
interactions and content management.

### Real-time Typing Indicator

The server utilizes WebSockets to implement a real-time typing indicator feature. When a user starts typing, others in
the conversation can see the indicator, enhancing the sense of live interaction.

### Notifications

Stay informed and never miss a beat with the notification system. Receive instant alerts when you receive new messages,
ensuring you stay up-to-date with your conversations.

### JWT Authentication

This application utilizes JWT (JSON Web Token) authentication to ensure robust security. Here are the technical details:

-   **Access Token**: Upon a successful login, users receive an access token. This token serves as the key to access
    protected routes and resources within the application.

-   **Refresh Token**: For enhanced security and extended user sessions, a refresh token is issued alongside the access
    token. When the access token expires, the refresh token can be used to obtain a new access token without the need
    for users to log in again.

-   **Route Guards**: The application employs route guards to protect sensitive endpoints. Only authorized users with
    valid access tokens can access these routes, effectively preventing unauthorized access.

This authentication mechanism guarantees the security of your data, allowing only authorized users to interact with the
application and its protected resources.

### Middleware for WebSocket Authentication

To further enhance security, we've integrated middleware to authenticate all incoming WebSocket connections. Rest
assured that your conversations are private and secure.

### Bot Users with OpenAI Integration

This application features bot users that add a dynamic and engaging element to your conversations. These bots are
seamlessly integrated with the OpenAI GPT (ChatGPT Turbo 3.5) API, offering the following capabilities:

-   **Fictitious Personalities**: Each bot user is imbued with a carefully crafted and fictional personality. These
    personalities add a unique and immersive dimension to your interactions, making conversations more entertaining and
    enjoyable.

-   **Role-Playing**: Bot users play specific roles within the chat environment. Whether it's providing information,
    acting as a virtual assistant, or just engaging in casual conversation, these bots enrich your conversations by
    fulfilling designated roles.

-   **Interactive Chat**: Users can initiate conversations with the bot accounts, enabling engaging interactions. You
    can ask questions, seek advice, or simply chat with these bots, enhancing the overall user experience.

The integration of OpenAI's ChatGPT Turbo 3.5 API ensures that bot users offer intelligent and contextually relevant
responses, making them valuable additions to the chat ecosystem. Whether you're looking for assistance or just a
friendly chat, our bot users are here to make your experience enjoyable and interactive.

### Sign-Up

Effortlessly create new accounts and join our platform. Our user-friendly sign-up process ensures a smooth onboarding
experience.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact Information

LinkedIn: https://www.linkedin.com/in/vitalie-cociug-39a80a145/
