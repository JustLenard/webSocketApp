## Table of Contents

-   [Project Overview](#project-overview)
-   [Prerequisites](#prerequisites)
-   [Installation](#installation)
-   [Configuration](#configuration)
-   [Start Application](#start-application)
-   [Technologies Used](#technologies-used)
-   [Folder Structure](#folder-structure)
-   [License](#license)
-   [Contact Information](#contact-information)

## Project Overview

This README provides an overview of the Chat Application, a real-time chat platform built using modern web technologies.
The application allows users to communicate with each other in real-time, providing a seamless chatting experience. It
utilizes a variety of technologies on the frontend to deliver a responsive and user-friendly interface.

## Prerequisites

To run the frontend application, you need to have the following installed:

-   [Node.js](https://nodejs.org/en)
-   [A package a manager (yarn , npm, pnpm)](https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable)

## Installation

1. **Clone the repository if you didn't yet:**

    ```bash
    git clone https://github.com/JustLenard/webSocketApp.git
    ```

2. **Change directory to client:**

    ```bash
    cd client
    ```

3. **Install dependencies:**

    ```bash
    yarn
    ```

### Configuration

The backend server uses environment variables for configuration. Create a `.env` file in the server directory based on
the `.env.example` file provided. Modify the values as needed for your environment.

Here are the key environment variables:

-   **Server API endpoint:** You will be making all the api calls to this endpoint

    ```
    VITE_APP_API="http://localhost:5000/api"
    ```

-   **Server URL:** Used to make a ws connection

    ```
    VITE_SERVER_URL="http://localhost:5000"
    ```

-   **A user's credentials:** Used to fill up the login form for easier loign. Optional

    ```
    VITE_USERNAME="yourUsername"
    VITE_PASSWORD="yourPassword"
    ```

## Start Application

    yarn run dev

## Technologies Used

The frontend of the Chat Application is built using the following technologies:

-   **React with TypeScript**: The core framework for building the user interface.
-   **Context and Redux Slice**: Used for managing and storing application states efficiently.
-   **Axios and Axios Interceptors**: Employed for making HTTP requests to the server and handling them gracefully.
-   **Material-UI (MUI)**: Used for styling the application and ensuring a consistent and appealing user interface.
-   **react-hook-form**: A library for building forms in React applications. It simplifies form handling, validation,
    and form state management.
-   **yup**: A JavaScript schema validation library that is often used in conjunction with `react-hook-form` to provide
    robust form validation.
-   **socket.io**: A real-time, bidirectional communication library for handling WebSocket connections. It enables
    real-time chat functionality in the application.

## Folder Structure

The Chat Application follows a well-organized folder structure for easier development and maintenance. Here's a brief
overview of the main directories:

-   `/src`: Contains the source code for the frontend application.
    -   `/assets`: Includes assets like the application's icons.
    -   `/axios`: Holds instances of Axios for making HTTP requests to the server.
    -   `/components`: Contains reusable React components used throughout the application.
    -   `/hooks`: Custom React hooks used to abstract and share logic across components.
    -   `/pages`: Houses the different pages of the application, typically corresponding to different views or routes.
    -   `/providers`: Contains context providers used for state management.
    -   `/redux`: Contains Redux slices and the Redux store setup for managing global application state.
    -   `/router`: Manages routing logic, including route definitions and navigation components.
    -   `/types`: Stores all application-specific TypeScript type definitions.
    -   `/utils`: Includes utility functions and constants that are used throughout the application.
    -   `/yup`: Contains Yup schema validations used for form validation.

This organized structure helps maintain clarity and separation of concerns, making it easier to navigate and extend the
application as needed.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact Information

LinkedIn: https://www.linkedin.com/in/vitalie-cociug-39a80a145/
