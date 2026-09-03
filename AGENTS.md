# AGENTS.md — VizhMarket

Instructions for AI coding agents working in this repo. Read this **before** writing code — it encodes decisions that are already made and verified. Do not re-litigate them or "modernize" them away.

---

## 1. Project snapshot

**VizhMarket (ویژ مارکت)** — Persian (Farsi, **RTL**) e-commerce storefront + admin panel. Users buy products; there is also an Amazon concierge/order flow.

| | |
|---|---|
| Framework | **Next.js 16.2.9** (App Router, Turbopack), **Cache Components enabled** (`next.config.mjs`) |
| Language | **JavaScript/JSX** (no TypeScript except `src/lib/prisma.ts`) |
| React | 19 |
| Styling | **Tailwind CSS v4**, shadcn/ui-style components in `src/components/ui/` (built on **@base-ui/react** primitives) |
| DB | **Prisma 7** + PostgreSQL (`@prisma/adapter-pg`), schema `prisma/schema.prisma` |
| Icons | `@tabler/icons-react` |
| Theme | `next-themes` (light/dark, class strategy) |
| Font | Vazirmatn (`next/font/google`), set as `--font-sans` |
| Package manager | **pnpm** |

### Commands
```bash
pnpm dev      # dev server
pnpm build    # production build (ALSO validates cache-components/PPR rules)
pnpm lint     # eslint (flat config)
npx prisma db push      # sync schema → DB  (there is NO migrations folder — never use migrate)
npx prisma generate     # regenerate client (required after schema edits; db push does NOT regenerate)
```
- DB connection lives in `.env` (`DATABASE_URL`) and `prisma7.config.ts`; it is reachable during `next build`.
- ⚠️ `package.json` still has a `seed` script but `scripts/` was deleted — don't reference or run it.

### Docs that live in this repo (read these, don't guess)
- Bundled Next.js docs: `node_modules/next/dist/docs/01-app/…` — notably:
  - `03-api-reference/01-directives/use-cache.md`
  - `03-api-reference/04-functions/cacheTag.md`, `cacheLife.md`, `updateTag.md`, `unstable_cache.md`
  - `02-guides/migrating-to-cache-components.md`
  - `03-api-reference/05-config/01-next-config-js/cacheComponents.md`
- Online equivalents: https://nextjs.org/docs/app/api-reference/directives/use-cache · …/functions/cacheTag · …/functions/cacheLife · …/functions/updateTag · error help: https://nextjs.org/docs/messages/blocking-route
- **Design skills (installed, see `skills-lock.json`)**:
  - `.agents/skills/frontend-design/SKILL.md` — visual design direction; read before building/rebuilding UI.
  - `.agents/skills/web-design-guidelines/SKILL.md` — Vercel Web Interface Guidelines audit (rules fetched from `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`). Apply when writing or reviewing UI.

---

## 2. Architecture map

```
prisma/schema.prisma              # single source of truth for the data model
src/lib/prisma.ts                 # Prisma client (default export)
src/lib/data/
  web-store.js                    # STOREFRONT cached queries  → cacheTags {products, categories}
  admin-store.js                  # ADMIN cached queries       → adminTags {products, categories, orders, users}
                                  #   + getAdminUserOrders(id) (tags users+orders), getAdminStats() (all tags)
src/lib/actions/
  admin-actions.js                # admin server actions ("use server") — uses updateTag
  order-actions.js                # checkout action — increments totalSold / decrements stock
src/lib/scraper-helpers.js        # isValidDomain() etc. (Amazon URL detection)
src/app/
  layout.js                       # root: html lang=fa dir=rtl, ThemeProvider, DirectionProvider(rtl), TooltipProvider
  loading.js / error.js / not-found.js  # site-wide route UI (skeleton / error boundary / 404)
  (home)/                         # STOREFRONT route group
    layout.js                     # fetches getNavCategories() → <Header/>, <Footer/>, skip-link, <main id="main">
    page.js                       # landing (LandingPage: sections, bestSellers, categories)
    store/page.js                 # /store  (Suspense + StoreSkeleton; reads searchParams inside)
    store/[category]/page.js      # category page (generateStaticParams + Suspense + CategorySkeleton)
    store/[category]/[product]/page.js  # product page (generateStaticParams + Suspense + ProductSkeleton)
    order/page.js                 # Amazon order flow
  admin/                          # admin panel (own layout + AdminSidebar)
    page.js                       # /admin dashboard: stat cards → getAdminStats()
    loading.js / error.js / not-found.js  # admin-scoped route UI (same design language as root ones)
    users/[id]/page.js            # user orders detail page → getAdminUserOrders(id) → <UserOrders/>
    products|categories|users|orders|weborders/  # section pages (weborders is a placeholder)
src/components/
  Header.jsx  Footer.jsx          # client header (categories bar, search, sheet) / server footer (dynamic categories)
  Landing/Landing.jsx             # landing sections
  store/                          # section-product-card, product-detail (specs table), store-browser (filters/sort), breadcrumb
  admin/                          # product-manager, category-manager, order-manager, user-manager,
                                  # user-orders (full order detail view), admin-sidebar, action-forms
  ui/                             # shadcn-style primitives (button, input, dialog, table, sheet, dropdown-menu, …)
public/assets/{products,variants,categories}/   # local images (see §7 Assets)
```
## 3. Next.js Cache Components — the rules (STABLE, do not regress)

`cacheComponents: true` is set in `next.config.mjs`. Consequences & house rules:

### 3.1 Caching data queries
All shared DB queries live in `src/lib/data/*` and use the `use cache` directive — **never** `unstable_cache` (deprecated in v16) and **never** route-segment `revalidate`/`fetchCache`.

```js
import { cacheTag, cacheLife } from "next/cache";

export async function getSomething(arg) {
  "use cache";                        // first statement of the function
  cacheTag(cacheTags.products, cacheTags.categories);  // tags → invalidated by tag name
  cacheLife("max");                   // cache until a tag is invalidated
  return prisma.…({ where: { … } });
}
```

- `cacheLife("max")` is the project default: data is cached indefinitely and invalidated **only** by tag invalidation (admin writes / orders).
- `cacheTag(...)` must be called **inside** the cached function scope.
- Function args are part of the cache key (e.g. `getCategoryPage(slug)` caches per slug).
- Do **not** read runtime data (`params`, `searchParams`, `cookies()`, `headers()`) inside a `use cache` scope — await them in the caller and pass primitives as arguments.

### 3.2 Cache tag registry (single source of truth)
| Tag | Defined in | What it covers |
|---|---|---|
| `products` | `web-store.js → cacheTags.products` | product queries, best-sellers, store listings |
| `categories` | `web-store.js → cacheTags.categories` | nav categories, landing sections, category pages |
| `orders` | `admin-store.js → adminTags.orders` | admin order lists |
| `users` | `admin-store.js → adminTags.users` | admin user lists |

Import the constants — **never hardcode tag strings** in actions.

### 3.3 Invalidation: `updateTag` vs `revalidateTag`
- **Server Actions (all admin writes)** → `updateTag(tag)`. Read-your-own-writes: the next read is guaranteed fresh (no stale-while-revalidate). This is the project convention.
- **Bulk/auxiliary contexts** (`revalidateAllTags` helper, route handlers if ever added) → `revalidateTag(tag)`. Without a profile argument it behaves equivalently to `updateTag`.
- `updateTag` throws outside a Server Action — action files start with `"use server"`, so it's safe there.

`revalidateCatalog()` in `admin-actions.js` invalidates **both** `products` and `categories` (a product change can change category sections); call it after any product/variant/category mutation.

### 3.4 Prerendering / PPR (this is what `next build` enforces)
With cache components, Next prerenders a **static shell**; anything dynamic must stream inside `<Suspense>`. Build errors to expect and how we fixed them:

- **`"Uncached data was accessed outside of <Suspense>"` (blocking-route)** → caused by awaiting `params`/`searchParams` (or uncached data) in a page outside a Suspense boundary. Fix pattern (already applied on `/store`, `/store/[category]`, `/store/[category]/[product]`):
  ```jsx
  import { Suspense } from "react";

  async function Content({ params }) {          // await runtime data HERE
    const { slug } = await params;
    const data = await getCachedThing(slug);    // cached fn, primitive arg
    if (!data) notFound();
    return <RealUI data={data} />;
  }

  export default function Page({ params }) {
    return (
      <Suspense fallback={<PageSkeleton />}>
        <Content params={params} />
      </Suspense>
    );
  }
  ```
- **`generateMetadata` cannot be wrapped in Suspense** → for dynamic routes that need `params` in metadata, add **`generateStaticParams`** (docs-sanctioned fix). Implemented via `getCategorySlugs()` / `getProductSlugs()`; slugs created after a build simply render on demand.
- Debug prerender failures with `npx next build --debug-prerender` (in PowerShell redirect to a file: `cmd /c "npx next build --debug-prerender > build-log.txt 2>&1"` — stack frames can be misattributed when source maps fail to parse).
- Navigation preserves component state (`<Activity>`): dialogs/dropdowns may stay open when navigating back. If a form/dialog must reset, reset it explicitly.

### 3.5 Data-visibility rule (business rule, enforced in queries)
- **Storefront** queries (`web-store.js`) filter **`isActive: true`** — inactive products are invisible to customers (`notFound()` on the product page).
- **Admin** queries (`admin-store.js`) fetch **all** rows, no `isActive` filter — admins must see everything.
- Orders invalidate `products` (totalSold feeds best-sellers/listings).

---

## 4. Server actions (admin) — conventions

- Files start with `"use server"`; every action takes **`FormData`** and returns `{ success: true }` or `{ error: "پیام خطا به فارسی" }`. Never throw to the UI; catch Prisma errors and map codes: `P2002` → duplicate slug/SKU, `P2003` → FK constraint (referenced by orders/products).
- Helpers already exist in `admin-actions.js` — reuse them: `str`, `num`, `bool(fd, key, fallback)`, `optionalStr`, `lines`, `numOrNull`, `slugify`, `generateProductSku`, `generateVariantSku`, `normalizeAssetPath`, `assetPath`, `assetPaths`, `attributesFrom` (reads repeatable `attrKey`/`attrValue` fields), `specsFrom` (repeatable `specKey`/`specValue` → `"key: value"` strings), `idsFrom`, `revalidateCatalog`.
- After every mutation call the right invalidation (§3.3).
## 5. Domain rules (already decided — keep them)

- **Slug** is **user input** (required field in forms); fallback to `slugify(title)` server-side if empty. Editing the product slug regenerates its SKU.
- **SKU is auto-generated**, never user-entered: product = `SKU-{slug}`, variant = `SKU-{product-slug}-{NN}` (NN = zero-padded variant count + 1). Variants keep their SKU on edit.
- **Category slug** is user input; update only applies it when provided.
- **`isActive`** (Boolean, default true): checkbox in the product form labeled «فعال (نمایش در فروشگاه)»; admin table shows a فعال/غیرفعال badge.
- **`specs`** (`String[]` on Product): each entry is one flat `"key: value"` string; admin edits via two-input rows (`specKey`/`specValue`); product page renders a «مشخصات محصول» 2-column table, splitting each entry on the **first** `:`.
- **Variant attributes**: key/value rows (`attrKey`/`attrValue`), optional — a variant may have none.
- **Prices** live on variants only (`aedPrice`, `irrPrice`); products have none.

## 6. UI / design conventions

- **RTL + Persian everywhere**; user-facing copy is Persian (concise, active voice). Keep `dir="rtl"` on shells; `dir="ltr"` on technical strings (SKUs, slugs, prices).
- Match existing styling: `rounded-2xl/3xl`, `border-border/50`, soft shadows, primary-tinted hover states, `tabular-nums` on prices/counts, Vazirmatn.
- **Admin forms** are built from shared primitives in `src/components/admin/action-forms.jsx`: `ActionDialog`, `EditActionDialog`, `DeleteActionDialog`, `BulkDeleteDialog`, `TextField`, `SelectField`, `CheckboxField`, `TextareaField`, plus `KeyValueFields` (dynamic key/value rows; Base-UI `Input` is controlled with `value` + **`onValueChange`**, not `onChange`).
- **Base UI quirks**: `Sheet*` / `DropdownMenu*` use the `render={<Element/>}` prop pattern.
- **Accessibility floor** (from web-design-guidelines, treat as requirements): `aria-label` on every icon-only button; `<button>` for actions, `<Link>` for navigation (never `<div onClick>`); images need `alt` + explicit `width`/`height`; `loading="lazy"` for below-fold images, `fetchPriority="high"` for the LCP hero image; visible `focus-visible:` rings; no `transition: all`; Persian typography (`…` not `...`); `Intl.NumberFormat("fa-IR")` for numbers (helper `formatIrr` exists — reuse it); empty states must render, not break.
- Landing/Header/Footer all read categories from `getNavCategories()` — keep them in sync, never hardcode category links.

### 6.1 Route-level UI pages (loading / error / not-found) — shared design language
Both the root (`src/app/loading.js|error.js|not-found.js`) and the admin panel (`src/app/admin/…`) have these; keep them visually identical when changing one:
- **Design**: centered layout (`py-24 text-center`), a `rounded-full` icon tile — `bg-muted border-border/50` (neutral) for not-found, `bg-destructive/10 border-destructive/30` (destructive) for error — `size={40} strokeWidth={1.8}` tabler icon, `text-xl font-bold` title, `text-sm text-muted-foreground` description, primary + outline `Button` row.
- **error.js** must be `"use client"`; receives `{ error, reset }`, calls `reset()` for «تلاش دوباره», logs via `console.error` in a `useEffect`.
- **Buttons that navigate** use Base UI's `render={<Link href="…" />}` — **`Button` does NOT support Radix-style `asChild`** (the prop silently does nothing).
- Admin loading skeleton = table-shaped; root loading skeleton = storefront (heading + category pills + 8-card product grid). All skeletons use `Skeleton` with `rounded-2xl/3xl/4xl`.
- Admin `not-found.js` renders inside the admin layout (sidebar stays visible) and only covers unknown `/admin/*` routes.

### 6.2 Admin panel conventions
- **Dashboard** (`/admin/page.js`): stat cards grid linking to each section, data from `getAdminStats()` (products, categories, users, orders, webOrders, variants). Do NOT reintroduce a redirect.
- **AdminSidebar**: `ADMIN_LINKS` with `{ href, label, icon, exact? }`; links with `exact: true` (only `/admin`) match `pathname === href`, others `pathname.startsWith(href)`. Adding `/admin`-prefixed links without `exact` would keep the dashboard permanently active.
- **Dialogs**: `ActionDialog` accepts `contentClassName` (pass `sm:max-w-2xl!` for the product form) and `onSuccess(result)` (fires after a successful action, receives its return value). Tailwind v4 `!` suffix is used to override the dialog primitive's default `sm:max-w-md`.
- **Inline category creation** (product form): `CategorySelector` opens a nested dialog calling `createCategory`, which returns `{ success, category: { id, name } }`; the new category is appended to client state and auto-selected. Categories are held in client state (`categoryList`) in `ProductManager` — new categories appear without a refetch.
- **Users** (`user-manager.jsx`): role changes go through a dialog (`RoleDialog`, shield icon → `updateUserRole`); the eye icon opens `UserOrdersDialog` (per-user store + web orders with items/qty/full address) and links to `/admin/users/{id}`.
- **Orders** (`order-manager.jsx`): eye icon opens `ViewOrderDialog` (full detail: customer, full shipping address, note, `OrderItemsTable`, status select, zarinpalref, timestamps). Customer identity lives on the **`order.user` relation** — `StoreOrder` has NO `customerName`/`customerPhone` columns; use the `customerOf(order)` helper (fallback «کاربر حذف‌شده» for `onDelete: SetNull`).
- **Full order detail rendering** is shared logic (`OrderItemsTable`-style: product/variant attributes/SKU/quantity/unit price/line total + totals row) — reuse the same shape in any new order view; `user-orders.jsx` is the reference for the page-level variant.
- Persian copy for order statuses lives in `STATUS_META` maps (`SUBMITTED/PAID/BOUGHT/SHIPPED_BY_STORE/SHIPPED/DELIVERED/CANCELLED`) — keep the admin + user-orders copies in sync.

## 7. Images / assets

- Local product/variant/category images live in `public/assets/{products,variants,categories}/` and are referenced as `/assets/...` (served from web root).
- Users may type paths **without** a leading slash — `normalizeAssetPath()` (in `admin-actions.js`) auto-prepends `/` for relative values and passes `http(s)://`, `data:`, `blob:` URLs through. Use `assetPath()`/`assetPaths()` when reading image form fields.
- `public/assets/README.md` documents the convention for humans.

## 8. Editing hazards (hard-won, follow these)
- **Never do shell text-surgery on files containing Persian text.** `Get-Content`/`Set-Content` round-trips re-encode UTF-8 and corrupt Persian strings (this bit us once and forced a git revert). Use the editor tool for all content edits; shell only for ASCII-only lines or whole-file delete/create.
- **The editing tool can inject invisible zero-width characters** (U+200B/U+200D/U+2060…) around `?? <number>` / `|| <number>` expressions when writing long JSX chunks. After writing such code, scan for them (eslint parse errors like `Unexpected token, expected "}"` are the usual symptom) and remove them. Where possible write plain arithmetic (`s + i.unitIrrPrice`, no `?? 0` / `|| 0` fallbacks) — required fields don't need them.
- `node --check` does **not** work on `.jsx`; rely on `npx eslint <file>` (fast, per-file) for syntax validation and `npx next build` for the real gate.
- JSX self-closers: an editor mishap once dropped the `>` from `</span` closers — if eslint reports a parse error you can't spot, check for malformed closing tags and `|| [ ]}`-style stray braces.
- `build-log.txt` is **tracked** in git (build debugging artifact). Builds here redirect into it (`cmd /c "npx next build > build-log.txt 2>&1"`) — run `git checkout -- build-log.txt` afterwards so it doesn't show as modified.
- `src/components/ui/select.jsx` is an untracked pre-existing file — leave it alone unless explicitly asked.

## 9. Validation checklist (run before saying "done")

1. `pnpm lint` → 0 errors. (`@next/next/no-img-element` warnings are pre-existing; don't chase them, but prefer `next/image` for new above-fold media.)
2. `npx prisma db push` **then** `npx prisma generate` after any `schema.prisma` edit.
3. `npx next build` → must exit 0. This is the real test of the cache-components rules (§3.4). If it fails with blocking-route, follow §3.4 — do **not** disable `cacheComponents` or reintroduce `force-dynamic`.

## 10. Known deviations / open items (safe to align)

- `src/lib/actions/order-actions.js` still uses `revalidateTag(cacheTags.products)` — equivalent today (no profile arg), but the convention is `updateTag` for Server Actions; align it if you touch that file.
- Header NAV_LINKS «درباره ما» / «تماس با ما» are placeholder `#` anchors (the handler skips them) — wire to real pages when they exist.
- Admin pages have no auth gate yet.
- `/admin/weborders` is a «به‌زودی» placeholder — the WebOrder model and `getAdminStats().webOrders` already exist; build the manager when asked.
- The storefront product page's «مشخصات محصول» table header row is (intentionally, per user request) left unfixed — its `TableHead` cells are commented out; don't "fix" it unprompted.
- `.hermes.md` is an older/other-agent memory file — this `AGENTS.md` is the authoritative instruction set.


