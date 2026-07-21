# ContractIQ Frontend

React + Vite + Tailwind CSS frontend for ContractIQ. See the
[root README](../README.md) and [docs/SETUP.md](../docs/SETUP.md) for the
full project overview and setup instructions.

## Commands

```bash
npm install
npm run dev      # dev server, http://localhost:5173
npm run build    # production build
npm run lint     # oxlint
```

## Structure

```
src/api/         Axios client + auth/contracts API calls
src/context/      Auth state (AuthContext)
src/components/   Reusable UI (Navbar, cards, ProtectedRoute, ...)
src/pages/        Route-level pages
```
