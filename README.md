# GCP Material App

This project is a React application bootstrapped with [Create React App](https://github.com/facebook/create-react-app), styled with Material UI, and configured for deployment on Google Cloud Platform (GCP) App Engine. It features file upload functionality with signed URLs, modern TypeScript, and a robust developer workflow.

## Main Technologies & Tools

- **React 19**: Modern UI library for building interactive user interfaces.
- **TypeScript**: Strongly-typed language that builds on JavaScript, providing type safety.
- **Material UI (MUI)**: Component library for fast and beautiful UI development.
- **@emotion/react & @emotion/styled**: CSS-in-JS libraries used by MUI for styling.
- **react-medium-image-zoom**: Provides image zoom functionality in the UI.
- **Google Cloud Platform (GCP) App Engine**: The app is configured for deployment on GCP using App Engine Standard Environment.
- **Cloud Build**: Automated build and deployment using [cloudbuild.yaml](cloudbuild.yaml).
- **Husky & lint-staged**: Git hooks for enforcing code quality and linting before commits.
- **Commitlint**: Enforces conventional commit messages.
- **Jest & React Testing Library**: For unit and integration testing.
- **ESLint**: Linting for code quality and consistency.

## Project Structure

- `/src`: Main source code (React components, theme, config, etc.)
- `/public`: Static assets and HTML template.
- `/build`: Production build output (generated).
- `/keys`: (gitignored) for storing sensitive credentials locally.
- `.husky/`: Git hooks for pre-commit and commit-msg.
- `app.yaml`: GCP App Engine configuration.
- `cloudbuild.yaml`: GCP Cloud Build pipeline configuration.
- `.eslintrc.json`: ESLint configuration.
- `tsconfig.json`: TypeScript configuration.

## Key Features

- **File Upload with Signed URLs**: Users can upload images or PDFs, which are sent to a backend that provides a signed URL for secure upload to cloud storage.
- **Material UI Theming**: Custom theme defined in [`src/theme.ts`](src/theme.ts) for consistent look and feel.
- **Responsive Design**: Uses MUI’s responsive utilities for mobile-friendly layouts.
- **Image Preview & Zoom**: Uploaded images are previewed and can be zoomed in using `react-medium-image-zoom`.
- **Environment-based Config**: API base URL and Google Client ID are managed via environment variables and [`src/config/app.config.ts`](src/config/app.config.ts).
- **Automated Quality Checks**: Pre-commit hooks and linting ensure code quality.

## Development

### Install dependencies

```sh
npm install
```

### Start the development server

```sh
npm start
```

### Run tests

```sh
npm test
```

### Build for production

```sh
npm run build
```

### Lint code

```sh
npm run lint
```


## Deployment

Deployment is automated via GCP Cloud Build and App Engine. See [cloudbuild.yaml](cloudbuild.yaml) and [app.yaml](app.yaml) for details.

## Environment Variables

- `REACT_APP_API_BASE_URL`: Base URL for backend API.
- `REACT_APP_GOOGLE_CLIENT_ID`: Google OAuth client ID.

These are set in your environment or via Cloud Build substitutions.

## CI/CD Pipeline

This project uses Google Cloud Build for continuous integration and deployment (CI/CD), targeting Google App Engine as the hosting platform.

- **Cloud Build**: The build and deployment process is defined in [cloudbuild.yaml](cloudbuild.yaml). When you push changes to your repository, Cloud Build automatically:
  1. Installs dependencies (`npm install`).
  2. Builds the React app for production (`npm run build`), injecting environment variables for API endpoints and Google OAuth.
  3. Deploys the built app to Google App Engine using the configuration in [app.yaml](app.yaml).

- **App Engine**: [app.yaml](app.yaml) specifies the Node.js runtime and static file handlers. The built React app is served as a static site from the `/build` directory.

- **Environment Variables**: Cloud Build passes environment variables (`REACT_APP_API_BASE_URL`, `REACT_APP_GOOGLE_CLIENT_ID`) to the build process, ensuring the deployed app is correctly configured for its environment.

- **Automation**: This setup enables automated deployments on every commit, ensuring your app is always up-to-date with the latest code changes.

For more details, see [cloudbuild.yaml](cloudbuild.yaml) and [app.yaml](app.yaml).

## Commitlint and Conventional Commits

This project uses **Commitlint** and **Husky** to enforce [Conventional Commits](https://www.conventionalcommits.org/) for all commit messages. This helps maintain a clear, consistent commit history and enables automated versioning and changelog generation if needed.

- **Commitlint** checks commit messages against the conventional commit specification.
- **Husky** sets up a `commit-msg` Git hook to run Commitlint automatically on every commit.
- If a commit message does not follow the convention (e.g., `feat: add upload button`), the commit will be rejected until the message is fixed.

You can find the configuration in `.husky/` and `commitlint.config.js`.


## Security

- Sensitive keys are stored in the `/keys` directory, which is gitignored.
- Uses signed URLs for secure file uploads.

## License

This project is licensed under the MIT License.

---

For more details, see the source files and comments throughout the codebase.