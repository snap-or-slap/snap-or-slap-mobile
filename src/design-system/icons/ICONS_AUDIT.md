# Icon System Audit

## Directories
- Raw SVG source folder: `assets/icons/raw/`
- Generated icon folder: `src/design-system/icons/`

## Dependency Status
- `react-native-svg` is installed.

## Summary
- Total raw SVG files parsed: 176
- Number of icon groups detected: 29
- Number of icon components generated: 29

## Default Variant Rule
outline > linear > bold > solid > filled > broken > bulk > twoTone > duotone > first available

## Generated Components
- **ArrowCircleDownIcon**: bold, broken, bulk, linear, outline, twoTone
- **ArrowCircleLeftIcon**: bold, broken, bulk, linear, outline, twoTone
- **ArrowCircleRightIcon**: bold, broken, bulk, linear, outline, twoTone
- **ArrowCircleUpIcon**: bold, broken, bulk, linear, outline, twoTone
- **CameraIcon**: bold, broken, bulk, linear, outline, twoTone
- **ClockIcon**: bold, broken, bulk, outline, twoTone
- **CloseIcon**: bold, broken, bulk, linear, outline, twoTone
- **CupIcon**: bold, broken, bulk, linear, outline, twoTone
- **EditIcon**: bold, broken, bulk, linear, outline, twoTone
- **EmojiHappyIcon**: bold, broken, bulk, linear, outline, twoTone
- **EyeIcon**: bold, broken, bulk, linear, outline, twoTone
- **EyeSlashIcon**: bold, broken, bulk, linear, outline, twoTone
- **FingerScanIcon**: bold, broken, bulk, linear, outline, twoTone
- **FlashIcon**: bold, broken, bulk, linear, outline, twoTone
- **HeartIcon**: bold, broken, bulk, linear, outline, twoTone
- **HomeTrendUpIcon**: bold, broken, bulk, linear, outline, twoTone
- **InfoCircleIcon**: bold, broken, bulk, linear, outline, twoTone
- **LockIcon**: bold, broken, bulk, linear, outline, twoTone
- **MedalStarIcon**: bold, broken, bulk, linear, outline, twoTone
- **NotificationBingIcon**: bold, broken, bulk, linear, outline, twoTone
- **ProfileCircleIcon**: bold, broken, bulk, linear, outline, twoTone
- **SearchNormalIcon**: bold, broken, bulk, linear, outline, twoTone
- **Setting2Icon**: bold, broken, bulk, linear, outline, twoTone
- **SmileysIcon**: bold, broken, bulk, linear, outline, twoTone
- **SortIcon**: bold, broken, bulk, linear, outline, twoTone
- **TickCircleIcon**: bold, broken, bulk, linear, outline, twoTone
- **TickSquareIcon**: bold, broken, bulk, linear, outline, twoTone
- **UserAddIcon**: bold, broken, bulk, linear, outline, twoTone
- **VerifyIcon**: bold, broken, bulk, linear, outline, twoTone

## Skipped Files (Manual Review Required)
- `Fire icon.svg`: Does not match naming pattern
- `Google Icon.svg`: Does not match naming pattern
- `Property 1=linier.svg`: Does not match naming pattern

## Usage Examples
```tsx
import { CameraIcon, HeartIcon } from '@ds/icons';
import { Button } from '@ds/components';

<Button
  intent="primary"
  variant="solid"
  leftIcon={<CameraIcon variant="outline" size={20} />}
  title="Check in"
/>

<HeartIcon variant="bold" size={24} color="#F45D1E" />
```
