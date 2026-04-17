# Contributing to Debt Intelligence System

First off, thank you for considering contributing to the Debt Intelligence System! It's people like you that make this open-source tool helpful for everyone looking to manage their debt efficiently.

## Where do I go from here?

If you've noticed a bug or have a feature request, make sure to check our [Issues](../../issues) tab first to see if it's already being discussed. If it's not, go ahead and open a new issue!

## Ground Rules

We expect all contributors to adhere to our [Code of Conduct](./CODE_OF_CONDUCT.md) when participating in this project. Please read it to understand the expectations for behavior in our community spaces.

## Getting Started

1.  **Fork the repository** to your own GitHub account.
2.  **Clone the project** to your local machine:
    ```bash
    git clone https://github.com/YOUR_USERNAME/debt-intelligence-system.git
    cd debt-intelligence-system
    ```
3.  **Install dependencies** for both backend and frontend:
    ```bash
    # Install backend dependencies
    cd backend
    npm install

    # Install frontend dependencies
    cd ../frontend
    npm install
    ```
4.  **Create a branch** for your specific feature or fix:
    ```bash
    git checkout -b feature/your-feature-name
    # or
    git checkout -b fix/your-bug-fix
    ```

## Development Workflow

1.  **Backend Development:**
    *   Navigate to the `backend` directory.
    *   Copy `.env.example` to `.env` and set up your PostgreSQL database url.
    *   Run `npx prisma migrate dev` to setup the database.
    *   Start the server: `npm run dev`.

2.  **Frontend Development:**
    *   Navigate to the `frontend` directory.
    *   Start the Vite development server: `npm run dev`.

3.  **Make your changes.** Be sure to test that your changes work well with other parts of the application.

## Submitting a Pull Request

1.  **Commit your changes** with a descriptive commit message. We recommend following the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification (e.g., `feat(frontend): add new debt component`, `fix(backend): correct interest calculation`).
    ```bash
    git add .
    git commit -m "feat(module): description of changes"
    ```
2.  **Push your branch** to your fork:
    ```bash
    git push origin feature/your-feature-name
    ```
3.  **Open a Pull Request** against the `master` branch of the main repository.
4.  **Describe your changes** in the PR description concisely. Reference any relevant issue numbers.

## Reporting Bugs

When reporting bugs, please provide a clear description of the issue.

*   **Describe the bug:** What did you expect to happen, and what happened instead?
*   **To Reproduce:** Steps to reproduce the behavior.
*   **Environment:**
    *   OS (e.g., Windows, macOS, Linux)
    *   Browser (e.g., Chrome, Safari)
    *   Node version
*   **Screenshots/Details:** Add screenshots or terminal output to help explain your problem.

Thank you for contributing!
