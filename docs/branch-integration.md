# Branch integration record

Reviewed on 2026-11-27 against published main `1fcdfa13`.

All branch tips below are preserved as ancestors of main. Retired implementations were resolved with the `ours` merge strategy: their history is retained, while their source trees are not reintroduced into the current website. This is a historical resolution, not a claim that every old feature was ported.

| Branch | Reviewed tip | Resolution |
| --- | --- | --- |
| Local main | `41fe51c7` | README changes already published by equivalent commits `a9c98577` and `1fcdfa13`; reconciled histories. |
| origin/oldweb | `e18564e9` | Retired July 2024 static website; retain its history and keep the current application. |
| origin/savefile | `1243a9d1` | Retired July 2024 static portfolio and image updates; retain its history and keep the current application. |
| origin/testingnewweb | `5dd0b491` | Retired July 2024 website experiment; retain its history and keep the current application. |
| origin/improve-user-interface-286fa | `4b5e79b7` | October 2026 UI experiment predating the current exhibition redesign; keep the current design. Do not import its generated dist, vendored node_modules, or reduced .gitignore. |

No remote branches were deleted. Their original trees remain accessible through their commits.

README assets include all 48 supplied reference SVGs, the original William banner, and dedicated GARDA and IGOR project-link SVGs under `docs/readme-assets/`.
