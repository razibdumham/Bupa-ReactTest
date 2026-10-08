# Owners and Books

A responsive React application that retrieves book owners from the Bupa book API and displays their books in adult and children sections. Users can show every book or filter both sections to hardcover books.

## Live app

🚀 **[Owners and Books](https://bupa-react-test.vercel.app/)**

## Design decisions

- React provides a component-based way to present API data and handle the app's filter and loading states.
- TypeScript is not used because this is a very small application; JavaScript keeps the implementation straightforward without adding a separate type-checking setup.
- The API is accessed through the same-origin `/api/v1/bookowners` path, with Vercel rewriting `/api/*` requests to the upstream API.

## Assumptions

- Book data is fetched when the app loads (or when the page is refreshed). Clicking **Retry** after a request error fetches the data again without reloading the page. Changing the hardcover filter or clicking **Get Books** does not make another API request.
- **Get Books** clears the hardcover-only filter and displays the already-fetched books in alphabetical order.
- If multiple books have the same name (ignoring letter case and surrounding spaces), the first one is kept and later duplicates are omitted.
- API object keys are normalized to lowercase recursively before validation, so keys such as `AGE`, `BOOKS`, `NAME`, and `TYPE` are accepted.
- Owner records must include a valid `books` array. If the API provides that array under an empty key (`""`) or omits the key, that owner record and its books are skipped. A warning appears in the UI while valid records continue to display.

## API error handling and JSON validation

The API helper in `src/apiData/books.js` handles responses as follows:

- **HTTP 429 (rate limit):** displays `Rate limit applied. Please retry after 2 seconds` and provides a **Retry** button. The user can retry after waiting; the app does not retry automatically.
- **Retry behavior:** clicking **Retry** makes one fresh API request. It is available for request failures, including HTTP 429 and blank response bodies.
- **Other unsuccessful HTTP responses:** reports `Request failed: <status>`.
- **Blank response body:** rejects whitespace-only or empty response text with `The books API returned an empty response. Please try again.` The hook passes this error to the app, which displays it in the UI as an alert instead of showing empty book sections.
- **Invalid JSON:** reports that the API returned invalid JSON. The original parsing error is retained as the cause.
- **Unexpected JSON shape:** requires the parsed top-level value to be an array; otherwise it reports an unexpected response.
- **Record validation:** after recursively lowercasing object keys, keeps only owner records that have a numeric `age` and an array under `books`. For each valid owner, it keeps only book objects with string `name` and `type` fields. Invalid records and books are filtered out before rendering. An empty-string key is not accepted as a substitute for `books`, so those owner records are skipped and a UI warning is shown; valid records still display.

The `useBooks` hook passes an `AbortSignal` to the fetch request and aborts it when the component using the hook unmounts, preventing stale request results from updating state.

## Screenshots

### Desktop

![Owners and Books desktop layout](public/assets/desktop-view.png)

### Mobile

![Owners and Books mobile layout](public/assets/mobile-view.png)

## Features

- Fetches book-owner data from `/api/v1/bookowners`.
- Groups owners by age: adults are older than 17; children are 17 or younger.
- Displays each group's books in separate sections, sorted alphabetically by book name (case-insensitive).
- **Hardcover only** filters both sections to books whose type is `Hardcover`.
- **Get Books** clears the hardcover-only filter and displays all already-fetched books alphabetically; it does not reload the page or make another API request.
- Shows a loading message while the request is pending and an error message with a **Retry** button if it fails.
- Shows a warning if owner records with missing or invalid book data are skipped, while continuing to display valid records.
- Adapts the layout for desktop and mobile screens.

## Requirements

- Node.js and npm
- Network access to the configured books API when running the app

## Run locally

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Open the local URL printed by Vite in your browser. The development server proxies `/api` requests to `https://digitalcodingtest.bupa.com.au`.

## Deploy to Vercel

Import the project repository into Vercel and deploy it with the default Vite settings. Vercel builds the app with `npm run build` and serves the generated `dist` directory. The included `vercel.json` rewrites `/api/*` requests to `https://digitalcodingtest.bupa.com.au/api/*`, so the app's request to `/api/v1/bookowners` is proxied in production as well as during local development.

To create and preview a production build:

```bash
npm run build
npm run preview
```

## Unit tests

Run the full test suite once:

```bash
npm test
```

Run Vitest in watch mode while developing:

```bash
npm run test:watch
```

The suite uses Vitest, jsdom, and React Testing Library. It covers the app's loading, error, age-grouping, and filter behavior; the `useBooks` hook's request lifecycle and cancellation; the API helper's HTTP handling and JSON validation; and the footer controls.

## Useful commands

```bash
npm run lint
npm run build
```
