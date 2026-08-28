# Source Audit

Audit date: 2026-07-31  
Product publication scope: NEXA CM3500-24S, 3.5 kW, 24 VDC

## Supplied files

| File | SHA-256 | Pages | Audit result | Published use |
|---|---|---:|---|---|
| `CM3500-24S Persian User Manual.pdf` | `6fc1574f260e98ecc01fc1756ccba4dc4beb994696880034a508e277606347b0` | 29 | Product model and specifications verified | Primary Persian technical source |
| `CM3500-24S Persian Quick Start.pdf` | `e999b6c0a60694200297bff0262994702502229b47071aa0f683abdade5e9703` | 14 | Product identity and onboarding scope verified | Persian quick-reference source |
| `manual-sunverteracm35kw(2).pdf` | `362b1451a9cc8e6331d3e0c7f472a1583a20bf3f1eda05a786499fbe2f7da1a2` | 27 | NEXA-branded 3.5 kW manual, image-only | Primary English procedures, settings, faults, and wiring source |
| `manual-sunverteracm35kw(3).pdf` | `6d4ce541c1a8764f87e6fca7d956f100003af5fbde4bc80d0a0b5e91b119db87` | 28 | Original reference manual with non-NEXA branding | Audit and comparison only |
| `image(5).png` | `455fcc2d59d6a7b22b5c503c0da1605dc204332add3022cda0858320212909f1` | n/a | Exact supplied NEXA logo verified | Production brand source |
| `Pasted text.txt` | `88f8266102e0046474dbac7cf720e62fa2aefbbe821666893178a0ab81f1f9d6` | n/a | Project brief and acceptance criteria | Build requirements |

The preserved source files are under `source-documents/`. Web-readable copies are under `apps/web/public/documents/`.

## Product identity finding

The supplied Persian manual explicitly identifies `CM3500-24S`. The specification tables verify:

- 3.5 kVA / 3.5 kW rated output
- 24 VDC battery system
- 230 VAC output regulation at ±5%
- 4,000 W rated PV input
- 500 VDC maximum PV open-circuit voltage
- 30 to 500 VDC MPPT range
- 15 A maximum PV input current

The supplied English NEXA manual title is ACM3.5KW and its multi-model tables include 1.5, 2.5, 3.5, and 5.5 kW variants. They do not include a 6.5 kW model.

## Missing-source finding

No standalone datasheet was supplied. No second model-specific image, manual, or datasheet was supplied. No supplied source verifies a NEXA 6.5 kW product.

The repository therefore contains exactly two selection entries:

1. `CM3500-24S`, verified and usable.
2. `model-02-source-required`, disabled and explicitly marked missing.

The second entry has no copied specifications, settings, faults, or lessons. This prevents accidental inheritance from the 3.5 kW product.

## Image audit

The source product photograph was extracted from the cover of the original English reference manual. It showed another brand mark. A precise object edit replaced only that mark with the exact supplied NEXA logo. The enclosure shape, LCD, vents, shadows, perspective, and product proportions were preserved.

Production exports:

- transparent master PNG
- transparent WebP cutout
- web hero WebP
- mobile WebP
- hotspot WebP

The unedited extracted image is retained for provenance under `assets/products/model-01/source-original.png` and is never shipped to either application.

## Page-reference convention

Page references in `packages/product-content` use physical PDF page numbers so that a reviewer can open the supplied file and reach the cited page directly. Each published lesson, setting, fault, specification, connection fact, and anatomy point includes a source reference.

## Publication rule

A value is published only when:

1. the product identity applies to CM3500-24S;
2. the value is legible in a supplied source;
3. the page and section can be cited;
4. no unresolved source conflict changes the safe interpretation.

Anything else remains missing or is documented only in the conflict report.
