# E-Tergov Lab — Product & Legal Steering

## Purpose
Browser-based 3D cyber-forensics and criminal investigation simulator ("102 to Courtroom") built for the Law Enforcement Academy of the Republic of Uzbekistan (HMQA).

## Legal & Domain Rules
- All legal workflows, evidence passports, forensic reports, and courtroom rulings must strictly follow Uzbekistan's Criminal Code (JK) and Criminal Procedure Code (JPK), especially Articles 95-1 (inadmissible evidence), 137, 172, 180, 184, 203-205, 204-1, 204-2 (digital evidence), and 384.
- Keep 100% of user-facing UI text in standard Uzbek Latin script with formal legal terminology.

## Technical & UX Standards
- Always call `document.exitPointerLock?.()` before opening any modal from `ThreeDSceneViewer.tsx`.
- Wrap WebGL scenes in a React `ErrorBoundary` with a 2D fallback list.
- Ensure `@media print` hides all dark UI chrome and prints `#printable-protocol` cleanly on white paper.
- Wrap all Gemini API and Web Speech API calls in `try/catch` with offline deterministic fallback responses.
