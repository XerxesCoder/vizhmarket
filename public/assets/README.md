# Assets

Put local images here so the store can serve them at `/assets/...`.

Because Next.js serves the `public/` folder from the web root, any file placed in
`public/assets/...` is publicly reachable at `/assets/...`.

## Suggested layout

```
public/
  assets/
    products/     → upload product images here  (referenced as /assets/products/<file>)
    variants/     → upload variant images here  (referenced as /assets/variants/<file>)
    categories/   → upload category images here (referenced as /assets/categories/<file>)
```

## How to reference them in the admin

In the admin forms, enter the path one per line (or a single path for categories):

- Products: `/assets/products/1.jpg`
- Variants: `/assets/variants/red-1.jpg`
- Categories: `/assets/categories/shoes.jpg`

A leading `/` is optional — the server action auto-prepends `/` to relative values
that aren't `http(s)://`, `data:`, or `blob:` URLs, so both `assets/products/1.jpg`
and `/assets/products/1.jpg` resolve to `public/assets/products/1.jpg`.