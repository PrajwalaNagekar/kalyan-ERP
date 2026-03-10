

# Master Update — Phased Implementation Plan

This update contains 12+ major feature areas. Implementing everything at once would produce unreliable results. I'll break it into 4 focused batches, starting with the most critical fixes the user explicitly flagged.

---

## Batch A (This Implementation): Login Rework + Sidebar Restructuring + Access Denied Page + RoleGuard Enhancement

These are the "ERRORS YOU FOUND" fixes and the foundation everything else depends on.

### 1. Rework Login Page (`src/pages/Login.tsx`)
- **Remove**: Email input field entirely
- **Remove**: "Enter Demo Mode" button and divider
- **Keep**: Role dropdown (Admin / Operations Manager / Finance & Ops Controller / Karigar)
- **New flow**: Select role → show Password field + Sign In button → on submit, call `enterDemoMode(roleGroup)` with the selected role (prototype mode, no real auth needed) → navigate to `DEFAULT_LANDING`
- **2FA simulation**: After password for Admin and Finance roles, show an OTP input step (6-digit, simulated — any 6 digits accepted) before proceeding
- **Audit**: Log login attempt to simulated audit store

### 2. Restructure Sidebar Modules Per Role (`src/config/rbac.ts` + `src/components/sidebar/navigationItems.ts`)

Update `NAV_VISIBILITY` and `ROLE_PERMISSIONS` to match the spec exactly:

| Admin | Operations | Finance | Karigar |
|---|---|---|---|
| Dashboard | Branch Dashboard | POS & Billing | Karigar Panel |
| Gold Rate & Pricing (rename Live Price Manager) | POS & Billing | Inventory Operations (new) | — |
| Central Inventory | App Customers | Financial Module (new) | — |
| Branch Management | App Marketing | Financial Reports (new) | — |
| Analytics & Reports | Staff Management | Audit Center (view) | — |
| Financial Overview (new, maps to Financials) | Branch Inventory (new) | — | — |
| System Settings | Branch Reports (new) | — | — |
| Audit Logs (new) | Ticket Mgmt (future) | — | — |

Key changes to `navigationItems.ts`:
- Rename "Live Price Manager" → "Gold Rate & Pricing"
- Rename "Financials" → "Financial Overview"
- Add "Audit Logs" nav item (points to `/settings` audit tab or a new `/audit` route)
- Add "Branch Inventory" and "Branch Reports" as standalone items for Operations role
- Admin must NOT see "POS & Billing" in sidebar
- Operations must NOT see Central Inventory, System Settings, Analytics, Vendors, Quality

Update `NAV_VISIBILITY` to enforce the table above. Update `ROLE_PERMISSIONS` route prefixes accordingly.

### 3. Access Denied Page (`src/pages/AccessDenied.tsx`)
- New page: "Access Denied — Insufficient Permissions" with maroon alert icon
- Two buttons: "Back to Dashboard" (navigates to role's DEFAULT_LANDING) and "Contact Admin"
- Update `RoleGuard` to redirect to `/access-denied` instead of silently redirecting to landing page

### 4. Update RoleGuard (`src/components/RoleGuard.tsx`)
- Instead of `<Navigate to={DEFAULT_LANDING}>`, redirect to `/access-denied`
- Add route for `/access-denied` in `App.tsx`

### 5. Update Dashboard labels
- Admin dashboard: keep as-is (already shows "Central Dashboard")
- Operations: show "Branch Dashboard — Jayanagar" with branch-locked badge
- Finance: show "Finance Dashboard — Execution Mode"
- Karigar: show "Production Dashboard — Karigar Panel" with "Assigned Orders Only" indicator

### 6. Header role badge
- Already implemented — verify it shows role + scope badge
- For Operations/Finance, add branch name to badge: "OPERATIONS | Jayanagar"

---

## Future Batches (not implemented now)

**Batch B**: Toggle Control Center + Audit Center expansion + Feature disabled states
**Batch C**: Exchange & Buyback detailed workflows + Approval queues + Ticket Management
**Batch D**: RBAC Editor + 2FA enhancement + Financial/Inventory module pages for Finance role

---

## Files Modified in Batch A

| File | Change |
|---|---|
| `src/pages/Login.tsx` | Remove email, remove demo button, add 2FA OTP step for Admin/Finance |
| `src/config/rbac.ts` | Update NAV_VISIBILITY, ROLE_PERMISSIONS to match exact spec |
| `src/components/sidebar/navigationItems.ts` | Rename items, reorder for role clarity |
| `src/components/RoleGuard.tsx` | Redirect to /access-denied |
| `src/pages/AccessDenied.tsx` | New page |
| `src/App.tsx` | Add /access-denied route |
| `src/pages/Dashboard.tsx` | Minor label updates for branch name display |
| `src/components/AppLayout.tsx` | Add branch name to role badge for scoped roles |

