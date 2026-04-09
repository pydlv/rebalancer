# Rebalancer

A browser-based investment portfolio rebalancer that helps you keep your holdings aligned with your target allocations.

**Live app:** https://pydlv.github.io/rebalancer/

## Features

- **Hierarchical holdings** — Organize investments into nested categories (e.g., Stocks → US Stocks → Large Cap)
- **Target allocation tracking** — Set a target percentage for each holding and get a warning when allocations don't add up to 100%
- **Rebalancing targets** — A dedicated Targets table shows the actual balance, target balance, and the difference for every holding so you know exactly what to buy or sell
- **Move mode** — Drag holdings between categories to reorganize your portfolio structure
- **Import / Export** — Save your portfolio to a JSON file and reload it at any time
- **Local persistence** — Portfolio data is automatically saved to browser local storage between sessions

## Getting started

```bash
yarn install
```

### Run in development mode (hot-reload)

```bash
yarn serve
```

### Build for production

```bash
yarn build
```

### Run unit tests

```bash
yarn test:unit
```

## Tech stack

- [Vue 2](https://v2.vuejs.org/) + [TypeScript](https://www.typescriptlang.org/)
- [Vuex](https://vuex.vuejs.org/) with [vuex-class-modules](https://github.com/gertqin/vuex-class-modules)
- [Bootstrap Vue](https://bootstrap-vue.org/)

## Configuration

See the [Vue CLI Configuration Reference](https://cli.vuejs.org/config/).
