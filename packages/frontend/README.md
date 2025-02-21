## Getting Started

Enter the nix shell:

```
nix develop
```

Then,

```
deno run dev
```

## Testing

After entering nix shell,

To run all tests:

```
deno test --allow-net --allow-env --no-check
```

To run a single test:

```
deno test src/hooks/useClientWithStateManager_test.tsx --allow-net --allow-env --no-check
```

You can also use the deno task command to run with all the necessary flags:

```
deno run test
```

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

## ClientWithStateManager class

A module that interacts with the state manager and relay client. It has methods
to initialize the state manager/db, connect to the relay, and send
authentication/subscription requests. It is initialized in the hook
[`useClientWithStateManager`](src/hooks/useClientWithStateManager.ts). It
encloses all the necessary logic for interacting with the state manager and
relay client.

## MassMarketContext

Preserves certain states across the app. These states and state setters are
accessible anywhere in the app. For example, since we need the same instance of
ClientWithStateManager across the app, we store it in the context.

## Interacting with the State Manager

Based on user actions, the frontend calls methods on the various shop object
managers (i.e. ListingManager, TagManager, etc.) to send shop events to the
relay when creating/updating data. The state manager then consumes the events
from the relay and updates the data in the db.

## Event Listeners

The app listens to events from the state manager to update the UI when data is
created or updated. The state manager emits events based on shop events received
through the stream. The listeners must be removed when the component unmounts to
avoid memory leaks.
