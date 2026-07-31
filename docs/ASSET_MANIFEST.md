# Asset Manifest

## Brand

| Asset | Purpose | Provenance |
|---|---|---|
| `assets/brand/nexa-logo-source.png` | canonical logo | exact supplied `image(5).png` |
| `apps/web/public/assets/brand/nexa-logo.png` | web logo | byte copy of canonical logo |
| `apps/mobile/assets/nexa-logo.png` | mobile logo | byte copy of canonical logo |
| mobile icon and splash PNGs | store and launch surfaces | generated from canonical logo on NEXA canvas |

## Product imagery

| Asset | Shipped | Purpose |
|---|---:|---|
| `assets/products/model-01/source-original.png` | no | preserved unedited extraction for audit |
| `assets/products/model-01/nexa-product-master.png` | no | transparent edited master |
| `assets/products/model-01/nexa-product-cutout.webp` | yes | transparent hero object |
| `assets/products/model-01/nexa-product-hero.webp` | yes | desktop product presentation |
| `assets/products/model-01/nexa-product-mobile.webp` | yes | mobile optimized product presentation |
| `assets/products/model-01/nexa-product-hotspots.webp` | yes | anatomy interaction |
| `assets/products/model-02/model-source-required.svg` | yes | honest missing-source placeholder |

The production model-01 image is a precise edit based on a manual cover extraction. Only the source brand mark was replaced with the supplied NEXA logo. Shape and product controls were preserved.

## Production hashes

| Asset | SHA-256 |
|---|---|
| canonical NEXA logo | `455fcc2d59d6a7b22b5c503c0da1605dc204332add3022cda0858320212909f1` |
| edited transparent master | `4b3a680edc59020ff06c2ddb29da8fd311308e22efe58d405d460402471b6cee` |
| transparent WebP cutout | `aaf2e87387446a2b65aea22608bcb9101299ec1a1d066b2c5c760f206a01def5` |
| web hero WebP | `f78b02ab1715e594230a85e528fe048f4704b15b088ae73e52271fbda89d6fa9` |
| mobile WebP | `d90f5b788c9059e0497e36fa8e622b359add24b90cbeb3161dbce79fd7d59410` |

The canonical, web, and mobile NEXA logo files have identical hashes. The master, cutout, mobile, and hotspot imagery retain alpha channels where needed.

## Generated SVG diagrams

| File | Topic |
|---|---|
| `energy-flow.svg` | solar, grid, battery, inverter, and load |
| `anatomy-callouts.svg` | external product anatomy |
| `mounting-clearance.svg` | installation clearance |
| `battery-wiring.svg` | battery connection |
| `ac-connection.svg` | AC input, output, and earth |
| `pv-connection.svg` | PV connection |
| `charging-curve.svg` | bulk, absorption, float, and equalization |
| `lcd-navigation.svg` | LCD button navigation |
| `troubleshooting-path.svg` | safe decision path |
| `safety-severity.svg` | safety severity |

All diagrams are repository-native SVG assets. They contain no raster screenshots and can be edited in a vector tool or directly in source.

## Design references

The four PNGs under `docs/design-references/` are exploratory design references generated before implementation. They are not application runtime assets.
