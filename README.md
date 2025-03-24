# router_example

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

### Run your unit tests

```
yarn test:unit
```

### Lints and fixes files

```
yarn lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## Deployment to GitHub Pages

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Setup

1. In your GitHub repository settings, go to the "Pages" section.
2. Select "GitHub Actions" as the source.
3. Make sure the repository has GitHub Pages enabled.

### How it works

- When you push to the `master` branch, the GitHub Actions workflow will automatically:
  - Build your Vue application
  - Deploy it to GitHub Pages
- The app will be available at: `https://[your-username].github.io/vue-router-example/`

### Manual Deployment

If you want to deploy manually:

```
yarn build
```

Then upload the contents of the `dist` folder to your hosting provider.
