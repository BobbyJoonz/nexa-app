# Product Data Conflicts

## Resolution summary

| Topic | Supplied evidence | Resolution |
|---|---|---|
| Requested 6.5 kW model | No supplied file identifies or specifies a 6.5 kW model | Do not publish. Show a disabled second-model entry marked source required. |
| Standalone datasheet | No datasheet file among the attachments | `datasheetDocumentId` remains `null`. Manuals are not relabeled as datasheets. |
| Original English manual branding | Original reference manual cover contains a non-NEXA brand | Preserve for audit only. Do not ship original product imagery. Use exact NEXA logo in the edited production image. |
| English manual model tables | Tables include several power variants | Select only the 3.5 kW column when the row unambiguously applies. Prefer CM3500-24S Persian tables for model identity and physical values. |
| Persian and English pagination | Sections occur on different physical pages | Store file-specific physical PDF page references, not logical chapter numbering. |
| Lithium settings | Programs 41 and 42 are described, but device/firmware applicability may vary | Include as advanced documented programs with conservative wording. Do not claim communication support. |
| Equalization | Available in the manual but unsafe for some chemistries | Keep behind safety-critical education. Explicitly require battery-manufacturer instructions. |

## Non-inference policy

The following are intentionally not inferred:

- 6.5 kW electrical specifications
- a second model name
- a second model battery voltage
- communication protocols beyond what is explicitly documented
- protection-device ratings not unambiguously tied to the verified model
- field repair instructions
- live operating values in the LCD simulator

## Service boundary

Troubleshooting stops at observation, recording a code, non-invasive checks, and referral to a qualified installer or authorized service center. The UI never instructs the user to open the enclosure, bypass protection, or reconnect live wiring.
