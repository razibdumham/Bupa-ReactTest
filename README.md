# Owners and Books

A responsive React application that retrieves book owners from the Bupa book API and displays their books in adult and children sections. Users can show every book or filter both sections to hardcover books.

## Live app

🚀 **[Owners and Books](https://bupa-react-test.vercel.app/)**

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
- **Get Books** clears the hardcover-only filter and fetches fresh data without reloading the page, then displays all books alphabetically.
- Shows a loading message while the request is pending and an error message with a **Retry** button if it fails.
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

## Assumptions

- TypeScript is not used because this is a small application; JavaScript keeps the implementation straightforward without adding a separate type-checking setup.
- Book data is fetched when the app loads (or when the page is refreshed) and again when **Get Books** is clicked. Changing the hardcover filter does not make another API request.
- Clicking **Get Books** does not refresh the page. It clears the hardcover filter, fetches fresh data, and shows all books in alphabetical order.
- API object keys are normalized to lowercase recursively before validation, so keys such as `AGE`, `BOOKS`, `NAME`, and `TYPE` are accepted.
- Owner records must include a valid `books` array. If the API provides that array under an empty key (`""`) or omits the key, that owner record and its books are skipped. The app displays a warning in the UI while still showing any valid owner records.

## API error handling and JSON validation

The API helper in `src/apiData/books.js` handles responses as follows:

- **HTTP 429 (rate limit):** reads the response body and uses its trimmed text as the error message. If the body is blank, it reports `Too many requests.`
- **Retry behavior:** requests are not retried automatically. HTTP 429 responses and blank response bodies display an error with a **Retry** button; clicking it makes a new request.
- **Other unsuccessful HTTP responses:** reports `Request failed: <status>`.
- **Blank response body:** rejects whitespace-only or empty response text with `The books API returned an empty response. Please try again.` The hook passes this error to the app, which displays it in the UI as an alert instead of showing empty book sections.
- **Invalid JSON:** reports that the API returned invalid JSON. The original parsing error is retained as the cause.
- **Unexpected JSON shape:** requires the parsed top-level value to be an array; otherwise it reports an unexpected response.
- **Record validation:** after recursively lowercasing object keys, keeps only owner records that have a numeric `age` and an array under `books`. For each valid owner, it keeps only book objects with string `name` and `type` fields. Invalid records and books are filtered out before rendering. An empty-string key is not accepted as a substitute for `books`, so those owner records are skipped and a UI warning is shown; valid records still display.

The `useBooks` hook passes an `AbortSignal` to the fetch request and aborts it when the component using the hook unmounts, preventing stale request results from updating state.

## Useful commands

```bash
npm run lint
npm run build
```
