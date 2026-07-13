# SafeSafr

Premium, travel-inspired safety app. **Phase 1 — Design System only** (no business logic).

## Stack
React Native · Expo (SDK 51) · TypeScript · Expo Router · React Navigation · NativeWind

## Getting started
```bash
npm install
npm start        # then press i / a / w
```

## Structure
```
app/            Expo Router routes (tab group: Home, Map, Community, Profile)
components/
  ui/           Button, Card, Input, SearchBar, Avatar, Badge, FAB, Icon, Typography, ScreenContainer
  feedback/     LoadingIndicator, Skeleton, ProgressBar, CircularProgress
  navigation/   Header, BottomNavigation
screens/        DesignSystemScreen (style guide), PlaceholderScreen
navigation/     Tab definitions
hooks/          useTheme
services/        (empty — feature logic lands here)
utils/          cn()
constants/      colors, typography, spacing, theme tokens
assets/         fonts, images
```

## Design tokens
- Background navy `#0F172A` · Primary teal `#14B8A6` · Accent cyan `#22D3EE`
- White typography, 20px+ rounded cards, glassmorphism, gradients, soft/glow shadows, large spacing

Import everything from a single surface:
```ts
import { Button, Card, ThemedText } from '@components/ui';
import { colors, spacing, theme } from '@constants';
```

## Next
Feature logic (SOS, location, contacts, community, auth) plugs into `services/` and screens — the UI layer stays reusable.
