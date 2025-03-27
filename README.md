# router_example

[![Coverage Status](https://img.shields.io/badge/dynamic/json?url=https://aboutroots.github.io/vue-router-example/coverage/coverage-summary.json&label=coverage&query=$.total.statements.pct&suffix=%&color=brightgreen)](https://aboutroots.github.io/vue-router-example/coverage/)
[![Vercel](https://img.shields.io/badge/demo-online-brightgreen)](https://vue-router-example.vercel.app)

The app is available at: https://vue-router-example.vercel.app

## this is a demo of:

- vue 2.6 "crm-like" app with TS + pinia
- application state driving URL params `App → Store → Route (reflecting state)`
- single service for updating URL params based on state, with:
  - prevention of duplicated navigation
  - batching almost-simultaneous updates into one
- single service for detecting changes to the URL params and applying appropriate actions
- single service for loading and setting initial application values at the startup
- ability to fetch data on demand via the store
- generic modals driven by modals store
  - modals are unmounted when not used
  - fade in vue transition, css-only
- global loading state accessible from all places
- example unit tests in place
- no teleport used
- no watchers used
- no jquery

## Data flow

```mermaid
---
config:
  theme: base
  look: classic
  layout: dagre
---
flowchart TD
    Start([App Start]) --> AppCreation[App Creation]
    AppCreation --> ApplicationLoop[Idle State]

     subgraph AppCreation
        direction TB
        LoadConfig[Load Config from API] --> StoreConfig[Store Config]
        StoreConfig --> CheckParams{Has URL Params?}
        CheckParams -->|Yes| ParseQueryParams1[Parse URL Params]
        ParseQueryParams1 --> LoadFromParams[Execute store actions to load data based on params]
        CheckParams -->|No| CheckAllLoaded
        LoadFromParams --> CheckAllLoaded{All required initial data loaded?}
        CheckAllLoaded -->|Yes| AppLoaded
        CheckAllLoaded --> |No| SetDefaults[Set Default Values]
        SetDefaults --> AppLoaded

    end
    subgraph ApplicationLoop
        direction TB
        Wait[Wait for Input] --> CheckInput{Input Type}
        CheckInput -->|User interacts with UI| Components
        CheckInput -->|Manual URL Update| ParseQueryParams[Parse URL Params]
        Components --> |trigger store change| startAction[start store action]

        subgraph UpdateQueryParams[QueryUpdater service]
            direction TB
            QueryUpdater -->|debounce updates| UpdateParams

        end

        subgraph UpdateStore[Pinia stores]
            startAction --> UpdateURL{needs to update URL? }
            UpdateURL --> |Yes, in this case URL must reflect state| QueryUpdater
            UpdateURL --> |No, it would cause a loop or there is nothing that should be reflected in the URL| DoNothing
            startAction --> fetchAndSetData

        end

        fetchAndSetData --> |propagate changes| Components


     subgraph ParseQueryParams[Navigation Guard - parse query params]
            direction TB
            StartParse[Start Parse] --> Validate{Are params valid?}
            Validate -->|Valid| startAction

        end
    UpdateParams --> StartParse

    end

```

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
