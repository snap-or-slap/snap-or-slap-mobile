# SnapOrSlap Frontend Implementation Guide

## 1. Purpose of This Guide

This guide is the source of truth for implementing frontend screens and components in the SnapOrSlap mobile app.

Future code generation, refactor, and UI polish tasks must read and follow this guide before writing UI. The goal is to keep implementation consistent with the existing design system, Figma screen references, feature structure, and production expectations.

## 2. Project UI Source of Truth

UI implementation must be based on these sources, in this priority order:

1. Existing design-system components and tokens
2. Existing Figma screen reference images
3. Existing feature structure and business requirements

Key paths:

- Design system root: `src/design-system`
- Design-system components: `src/design-system/components`
- Design-system icons: `src/design-system/icons`
- Theme and tokens: `src/design-system/theme`, `src/design-system/tokens`
- Figma references: `src/figma-screen-references`

## 3. Mandatory Pre-Code Checklist

Every coding agent must complete this checklist before creating or editing a UI screen/component:

- [ ] Inspect the target screen/component file.
- [ ] Inspect relevant Figma reference image(s) in `src/figma-screen-references`.
- [ ] Inspect design-system components before creating custom UI.
- [ ] Check whether `Screen`, `AppText`, `Button`, `Card`, `Badge`, or existing icons can be reused.
- [ ] Check `src/design-system/icons/index.ts` before using any icon.
- [ ] Avoid external icon libraries unless explicitly approved.
- [ ] Avoid hardcoded colors, spacing, radius, typography, shadows.
- [ ] Use `useTheme()` and design tokens for custom style needs.
- [ ] Preserve existing business behavior and navigation.
- [ ] Keep changes small and buildable.

## 4. Design System Usage Rules

All UI should reuse the design system as much as possible. Do not rebuild design-system primitives inside feature screens.

| UI need | Use this first |
|---|---|
| Screen wrapper | `Screen` |
| Text | `AppText` |
| Button/action | `Button` |
| Card/surface/container | `Card` |
| Status/chip/tag | `Badge` |
| Icon | `src/design-system/icons` |
| Color/spacing/radius/typography | `useTheme()` / tokens |

### 4.1 Screen Rules

- Every full screen should preferably use `Screen`.
- Do not manually duplicate SafeArea/background/padding logic if `Screen` supports it.
- Use scrollable mode if the screen content is long.

### 4.2 Text Rules

- Use `AppText` instead of raw `Text` for visible app text.
- Use available text variants instead of raw font sizes.
- Raw `Text` is only allowed for temporary emoji placeholders or very small internal cases.

### 4.3 Button Rules

- Use `Button` for semantic actions:
  - Login
  - Register
  - Create Challenge
  - Submit
  - Cancel
  - Accept
  - Decline
  - Check in
  - Slap/Nudge
  - Leave
  - Add Friend
- Do not use `Pressable`/`TouchableOpacity` to recreate normal buttons.
- `Pressable` may be used only for clickable containers such as:
  - cards
  - list rows
  - tab bar items
  - avatar/profile click areas
- If `Pressable` is kept, it must still use `AppText`, theme colors, and reusable styles.

### 4.4 Card Rules

- Use `Card` for grouped content blocks.
- Do not manually duplicate card backgrounds, borders, shadows, and radius in feature screens.
- Feature-specific cards such as `ChallengeCard`, `FriendRequestCard`, or `ProfileStatsCard` should be built on top of `Card`.

### 4.5 Badge Rules

- Use `Badge` for statuses such as:
  - ACTIVE
  - FORMATION
  - FINISHED
  - GAME_OVER
  - CANCELLED
  - DONE
  - PENDING
  - INVITED
  - JOINED
  - SUCCESS
  - ERROR
- Do not create ad-hoc status pills with raw `View` and `Text`.

## 5. Icon Usage Rules

Only icons defined in `src/design-system/icons` may be used.

- Before using any icon, inspect `src/design-system/icons/index.ts`.
- Do not import random icons from external libraries.
- Do not add 3D icons, emojis, sticker-like illustrations, or icons with a style that does not exist in the project.
- If there is no exact icon match, choose the closest available design-system icon as a placeholder.
- The human developer will replace the placeholder later if necessary.
- Do not introduce a new icon style without explicit approval.

Preferred:

```tsx
import { CameraIcon, HeartIcon, UserAddIcon } from "@/design-system";
```

Avoid:

```tsx
import { Ionicons } from "@expo/vector-icons";
import SomeRandom3DIcon from "...";
```

Additional icon rules:

- Icons should receive color from `theme.colors`.
- Icons should use consistent sizes, usually 16, 18, 20, 24, 32, or design-system-supported sizes.
- Use icon variants only if supported by the icon component.

## 6. Figma Reference Rules

All reference images are stored in `src/figma-screen-references`.

- Before implementing a screen, inspect the closest matching PNG reference.
- Match the reference screen layout, hierarchy, spacing, and visual intention as closely as possible.
- Do not invent a totally different layout if a reference exists.
- If the current feature is not represented exactly, use the closest reference screen as visual direction.
- Do not copy reference blindly if it conflicts with real app behavior or available design-system components.
- Prefer design-system components even if the Figma screenshot uses a shape that could be recreated manually.
- If reference images and current code conflict, preserve working behavior and adapt the visual style carefully.

### 6.1 Reference Image Index

| File | Path | Likely usage |
|---|---|---|
| Error.png | `src/figma-screen-references/A-03 App Empty Root/Error.png` | App empty root error state |
| Loading.png | `src/figma-screen-references/A-03 App Empty Root/Loading.png` | App empty root loading state |
| Welcome.png | `src/figma-screen-references/B-Onboarding/B-01 Onboarding/Welcome.png` | Onboarding welcome slide |
| Photo Proof.png | `src/figma-screen-references/B-Onboarding/B-02 Onboarding/Photo Proof.png` | Onboarding photo proof slide |
| Group Accountability.png | `src/figma-screen-references/B-Onboarding/B-03 Onboarding/Group Accountability.png` | Onboarding accountability slide |
| Hearts - Slap - Pressure.png | `src/figma-screen-references/B-Onboarding/B-04 Onboarding/Hearts - Slap - Pressure.png` | Onboarding social pressure slide |
| Final CTA (Authentication Gateway).png | `src/figma-screen-references/B-Onboarding/B-05 Onboarding/Final CTA (Authentication Gateway).png` | Final onboarding/auth gateway |
| B-07 — Complete Profile.png | `src/figma-screen-references/B-Onboarding/B-07 — Complete Profile.png` | Complete profile onboarding step |
| B-08 — Permission Hub.png | `src/figma-screen-references/B-Onboarding/B-08 — Permission Hub.png` | Permission setup onboarding step |
| List.png | `src/figma-screen-references/C-01 Friends Hub/List.png` | Friends hub list state |
| Search Active.png | `src/figma-screen-references/C-01 Friends Hub/Search Active.png` | Friends hub active search state |
| Search Active (Not found).png | `src/figma-screen-references/C-01 Friends Hub/Search Active (Not found).png` | Friends hub no-results search state |
| Incoming.png | `src/figma-screen-references/C-03 Friend Requests/Incoming.png` | Incoming friend requests |
| Incoming (Not found state).png | `src/figma-screen-references/C-03 Friend Requests/Incoming (Not found state).png` | Empty incoming friend requests |
| Outcoming.png | `src/figma-screen-references/C-03 Friend Requests/Outcoming.png` | Outgoing friend requests |
| Search Friends.png | `src/figma-screen-references/C-05 Add-friend/Search Friends.png` | Add friend search |
| Search Friends-detail.png | `src/figma-screen-references/C-05 Add-friend/Search Friends-detail.png` | Add friend search detail |
| Non-Friend.png | `src/figma-screen-references/C-06 User Profile Preview/Non-Friend.png` | Non-friend profile preview |
| Squadmate.png | `src/figma-screen-references/C-06 User Profile Preview/Squadmate.png` | Squadmate profile preview |
| Active.png | `src/figma-screen-references/D_Challenges Hub/Active.png` | Active challenges hub |
| Formation.png | `src/figma-screen-references/D_Challenges Hub/Formation.png` | Formation challenges hub |
| History.png | `src/figma-screen-references/D_Challenges Hub/History.png` | Challenge history hub |
| Skeleton-1.png | `src/figma-screen-references/D_Challenges Hub/Skelenton/Skeleton-1.png` | Challenges loading skeleton |
| Skeleton-2.png | `src/figma-screen-references/D_Challenges Hub/Skelenton/Skeleton-2.png` | Challenges loading skeleton |
| Skeleton-3.png | `src/figma-screen-references/D_Challenges Hub/Skelenton/Skeleton-3.png` | Challenges loading skeleton |
| Alert Box-template.png | `src/figma-screen-references/Alert Box-template.png` | Alert/modal template |
| Authentication.png | `src/figma-screen-references/Authentication.png` | Authentication screen reference |

## 7. Styling Rules

- Do not hardcode colors if the theme has an equivalent.
- Do not hardcode arbitrary spacing/radius/font sizes.
- Use `useTheme()` for screen-specific styles.
- Use design tokens when available.
- Avoid repeated inline styles for reusable patterns.
- Extract repeated UI into feature components.
- Keep business-specific components inside feature folders, not inside design-system.

Bad:

```tsx
<View style={{ backgroundColor: "#fff", padding: 17, borderRadius: 13 }}>
  <Text style={{ fontSize: 23, color: "#111" }}>Challenge</Text>
</View>
```

Good:

```tsx
<Card>
  <AppText variant="title">Challenge</AppText>
</Card>
```

For custom layout:

```tsx
const theme = useTheme();

<View style={{ gap: theme.spacing.md }}>
  ...
</View>
```

## 8. Feature Component Rules

Recommended structure:

```text
src/features/challenges/components
src/features/friends/components
src/features/profile/components
src/features/auth/components
src/shared/components
```

Rules:

- Generic UI belongs in `src/design-system`.
- Reusable app-wide non-design-system utilities/components belong in `src/shared`.
- Business-specific UI belongs in the corresponding feature folder.
- Do not put `ChallengeCard` inside design-system.
- Do not put `FriendRequestCard` inside design-system.
- Design-system must remain business-agnostic.

## 9. Import Rules

Prefer barrel exports.

Preferred:

```tsx
import {
  AppText,
  Badge,
  Button,
  Card,
  Screen,
  useTheme,
  HeartIcon,
} from "@/design-system";
```

Avoid deep imports:

```tsx
import { Button } from "@/design-system/components/Button/Button";
```

Additional import rules:

- If root export is missing, update the appropriate `index.ts` barrel export.
- Do not import from temporary/reference folders.
- Do not import from `src-reference`.
- Do not import from `src/figma-screen-references` in runtime code unless explicitly needed for static assets.

## 10. Allowed and Forbidden Patterns

Allowed:

- Building feature components using design-system primitives.
- Keeping `Pressable` for clickable cards/rows/tabs.
- Adding small reusable props to design-system components if generally useful.
- Using closest existing icon as a placeholder.
- Using Figma references as visual guidance.

Forbidden:

- Creating custom buttons with raw `Pressable` for normal actions.
- Creating raw status pills instead of `Badge`.
- Hardcoding random hex colors.
- Adding external icon packs without approval.
- Adding random 3D icons or decorative assets not present in the repo.
- Rebuilding the design system inside feature screens.
- Rewriting navigation during UI polish tasks.
- Changing backend service contracts during UI refactor tasks.
- Blindly copying old/reference code into current source.

## 11. Screen Implementation Workflow

1. Identify target screen.
2. Find matching Figma reference image.
3. Inspect current screen implementation.
4. Inspect relevant design-system components.
5. Choose reusable components.
6. Create feature-specific components only when repeated.
7. Implement small changes.
8. Run typecheck/lint.
9. Verify screen still opens.
10. Summarize changes and remaining UI gaps.

## 12. Refactor Priority

1. Auth screens
2. Onboarding screens
3. Home shell / tabs
4. Challenges list
5. Create Challenge
6. Challenge Detail
7. Friends
8. Profile

## 13. Agent Instruction Block

```text
Before editing UI, read `docs/FRONTEND_IMPLEMENTATION_GUIDE.md`.
Inspect `src/design-system` and `src/figma-screen-references`.
Reuse design-system components before writing custom UI.
Only use icons from `src/design-system/icons`.
Do not introduce external icon packs or random decorative assets.
Follow the closest Figma reference image.
Preserve current behavior and navigation.
Keep changes small and buildable.
```
