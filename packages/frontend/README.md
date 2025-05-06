## Overview

The frontend UI supports both merchant and customer side of a crypto-native
shop. Merchants can register their shop with preferred currencies/chains, add
inventory, and keep track of orders from customers. On the customer side, users
can view listings, save listings to cart, and checkout their orders by various
payment methods. These methods include connecting to their digital wallet or
transferring tokens directly to a wallet address.

## Getting Started

Enter the nix shell in `Tennessine`:

```
nix develop
```

Then run the relay:

```
local-testnet
```

In a separate terminal, enter the nix shell again. Then in `packages/frontend`:

```
deno run dev
```

## Testing

After entering nix shell,

To run all tests:

```
deno test -A
```

To run a single test:

```
deno test src/hooks/useRelayEndpoint_test.ts -A
```

## Interacting with the State Manager

The frontend interacts with the state manager to send patches to the relay,
which creates and updates the state of the shop. The state manager is set up in
[`useStateManager`](src/hooks/useStateManager.ts). A keycard must be enrolled,
then addConnection must be called with the relay client to connect to.

Routes are passed in as the first argument of the **get** and **set** methods.
The routes the frontend currently interacts with are: **Manifest**,
**Listings**, **Orders**, and **Inventory**.

The routes can get more specific. For example, to retrieve data for listing with
ID 233, it would look something like: `stateManager.get(['Listings', 233])`.

For the **set** method, the second argument is the new state to update the route
with. You can also update just one property of a state. i.e.
`stateManager.set(['Listings', 233, 'Price'], 100n)`

## Event Listeners

The app listens to events from the state manager to update the UI when data is
created or updated. The state manager emits events when patches are sent or
received to the relay. The listeners must be removed when the component unmounts
to avoid memory leaks.

## MassMarketContext

Preserves certain states across the app. These states and state setters are
accessible anywhere in the app. For example, since we need the same instance of
ClientWithStateManager across the app, we store it in the context.

## Custom Hooks

All the custom hooks can be found in the [`hooks`](src/hooks) directory. These
hooks can be called anywhere in the app to fetch/calculate the necessary data.

Some of these hooks use [`useQuery`](src/hooks/useQuery.ts) which takes a
function and a dependency array. This hook behaves like a cache, so that if the
function has been called previously with no change in dependencies, the cached
result will be returned instead of being recalculated.

## TanStack Router

[`TanStack Router`](https://tanstack.com/router) is used for routing. The routes
can be found in the [`routes`](src/routes) directory.
[`routeTree.gen.ts`](src/routeTree.gen.ts) is automatically updated when routes
are added/removed.
