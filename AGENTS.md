<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Project Rules & Best Practices

## Tech Stack

- **Framework**: Next.js 16 with the App Router (`src/app/`)
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS v4
- **Forms**: `react-hook-form` + `@hookform/resolvers` + `zod`
- **Icons**: `lucide-react`
- **Validation**: `zod` v4

## Dev Workflow

```bash
npm run dev    # start local dev server
npm run build  # production build (only when explicitly requested)
npm run lint   # ESLint check
```

Environment variables live in `.env.development` (dev) and `.env.local` (local overrides, gitignored).
Required vars: `CLIENT_ID`, `CLIENT_SECRET`, `SPOTIFY_SHOW_ID`.

---

## TypeScript Rules

### Use `type`, never `interface`

```ts
// ✅
type SearchFormProps = {
  onSearch: (query: string) => void;
  isLoading: boolean;
};

// ❌
interface SearchFormProps { ... }
```

### Everything must be typed — no `any`

- Do not use `any` unless it is the only option and you leave a comment explaining why.
- Prefer `unknown` over `any` when the type is truly unknown, and narrow it with a guard.
- Use `z.infer<typeof schema>` to derive types from Zod schemas instead of duplicating them.

```ts
// ✅
type Episode = z.infer<typeof episodeSchema>;

// ❌
const data: any = await res.json();
```

### Use arrow functions

All functions — standalone helpers, component handlers, callbacks — should use arrow function syntax.

```ts
// ✅
const fetchEpisodes = async (token: string): Promise<Episode[]> => { ... };

// ❌
async function fetchEpisodes(token: string): Promise<Episode[]> { ... }
```

Exception: Next.js route handler exports (`export async function GET(...)`) must use the `function` keyword because Next.js expects named exports.

### Use constants and enums for hardcoded values

- Magic strings and numbers must be extracted to named constants or TypeScript `enum`s.
- Place them in the appropriate shared constants file (see folder conventions below).

```ts
// ✅ — src/constants/spotify.ts
export const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';
export const EPISODES_PAGE_LIMIT = 50;
export const MAX_PAGES = 10;
export const CACHE_REVALIDATE_SECONDS = 3600;

// ✅ — enum for a closed set of values
export enum SearchType {
  Episode = 'episode',
  Show = 'show',
}

// ❌ — inline magic value
const res = await fetch(`${base}?limit=50`);
```

---

## React Rules

### Never use `React.FC` / `React.FunctionComponent`

Define components as plain arrow functions and let TypeScript infer the return type.

```tsx
// ✅
const PodcastCard = ({ podcast }: PodcastCardProps) => {
  return <div>...</div>;
};

export default PodcastCard;

// ❌
const PodcastCard: React.FC<PodcastCardProps> = ({ podcast }) => { ... };
```

### Always use `useForm` for forms

All forms must be powered by `react-hook-form` with a Zod resolver. Never use uncontrolled `useState` for form fields.

```tsx
const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: { query: '' },
});
```

### Always use Zod for validation

Anywhere data needs to be validated or parsed (forms, API responses, environment variables), use a Zod schema. Never validate manually with `if` chains.

```ts
// ✅
const episodeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});

// ❌
if (!data.id || typeof data.id !== 'string') { ... }
```

### Atomic components — split by concern

When a component grows or contains clearly separate responsibilities (layout sections, distinct UI concerns), split it into smaller focused components. Each component should do one thing.

```
src/components/
  podcast-card/
    PodcastCard.tsx          # orchestrator / public export
    PodcastCardImage.tsx     # thumbnail + alt handling
    PodcastCardMeta.tsx      # title, date, duration
    PodcastCardActions.tsx   # play button, external link
  search-form/
    SearchForm.tsx
    SearchInput.tsx
    SearchButton.tsx
```

### Avoid prop drilling — use context/providers

If a value needs to pass through more than two levels of components, extract it into a React Context with a typed provider and a custom hook.

```ts
// src/contexts/SearchContext.tsx
type SearchContextValue = { ... };
const SearchContext = createContext<SearchContextValue | null>(null);

export const useSearch = (): SearchContextValue => {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error('useSearch must be used within SearchProvider');
  return ctx;
};
```

---

## Folder & File Conventions

```
src/
  app/                     # Next.js App Router pages & API routes
    api/
      spotify/
        search/route.ts    # GET /api/spotify/search
    layout.tsx
    page.tsx
    globals.css
  components/              # React components (atomic, split by concern)
    search-form/
    podcast-card/
  contexts/                # React Contexts and providers
  constants/               # Shared constants and enums, grouped by subject
    spotify.ts             # Spotify API constants
    ui.ts                  # UI / layout constants
  types/                   # Shared TypeScript types, grouped by subject
    spotify.ts             # Episode, Show, SpotifyApiResponse, etc.
    api.ts                 # Generic API response types
  utils/                   # Pure helper/utility functions, grouped by subject
    spotify.ts             # e.g. formatDuration, buildSpotifyUrl
    string.ts              # e.g. truncate, slugify
  config/                  # App-level configuration (env vars, SDK config)
    spotify.ts
```

**Rules:**
- A utility function that handles Spotify data belongs in `utils/spotify.ts`.
- A utility that formats strings belongs in `utils/string.ts`.
- Shared types for Spotify entities go in `types/spotify.ts`.
- Shared constants go in `constants/<subject>.ts`, never inlined in components.
- A component's internal sub-components live in its own subdirectory under `components/`.

---

## API Route Conventions

- Route handler exports (`GET`, `POST`, …) use `function` keyword (Next.js requirement).
- All internal helpers within route files use arrow functions.
- Replace `any` with proper types or Zod-parsed types. Prefer parsing the Spotify response with a Zod schema.
- Use Next.js `next: { revalidate }` caching on expensive external fetches.

---

## Code Style

- Prettier is configured in `.prettierrc` — let it handle formatting.
- ESLint is configured in `eslint.config.mjs` — fix all warnings before committing.
- Do not suppress ESLint rules with inline comments unless absolutely necessary; if you do, add a comment explaining why.
- Import order: external packages → internal aliases (`@/`) → relative paths.
