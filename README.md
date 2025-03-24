# router_example

[![Coverage Status](https://img.shields.io/badge/dynamic/json?url=https://aboutroots.github.io/vue-router-example/coverage/coverage-summary.json&label=coverage&query=$.total.statements.pct&suffix=%&color=brightgreen)](https://aboutroots.github.io/vue-router-example/coverage/)
[![GitHub Pages](https://img.shields.io/badge/demo-online-brightgreen)](https://aboutroots.github.io/vue-router-example/)

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

### Run tests with coverage report

```
yarn test:coverage
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
  - Run tests with coverage reporting
  - Build your Vue application
  - Deploy the app and coverage reports to GitHub Pages
- The app will be available at: [https://aboutroots.github.io/vue-router-example/](https://aboutroots.github.io/vue-router-example/)
- Test coverage reports will be available at: [https://aboutroots.github.io/vue-router-example/coverage/](https://aboutroots.github.io/vue-router-example/coverage/)

### Manual Deployment

If you want to deploy manually:

```
yarn build
```

Then upload the contents of the `dist` folder to your hosting provider.
