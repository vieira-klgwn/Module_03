# Dictionary Mobile Application

A React Native dictionary app built with Expo. Search English words, view definitions and pronunciations, and keep a persistent search history.

## Project Overview

This app connects to the [Free Dictionary API](https://dictionaryapi.dev/) to look up English words. Users can search from the main screen, hear pronunciations when available, browse past searches from a drawer, and recover gracefully from network or API errors.

The project was built as a practical exam deliverable with emphasis on validation, error handling, edge cases, stability, and user feedback.

## Features

- **Word search** with input validation and normalized API requests
- **Word details** including phonetics, parts of speech, definitions, and examples
- **Audio pronunciation** using Expo Audio APIs
- **Drawer navigation** with searchable history
- **Persistent history** via AsyncStorage (case-insensitive deduplication)
- **Comprehensive error handling** with retry support
- **Loading state management** preventing duplicate requests
- **Accessible UI** with labels and responsive layout

## Technologies Used

| Technology | Purpose |
|---|---|
| React Native | Mobile UI framework |
| Expo SDK 56 | Development platform |
| TypeScript | Type safety |
| Axios | HTTP requests |
| React Navigation Drawer | Side navigation |
| AsyncStorage | Search history persistence |
| expo-audio | Pronunciation playback |
| React Hooks | State and lifecycle management |

## Installation Steps

### Prerequisites

- Node.js 18+ and npm
- Android Studio with Android SDK (for emulator testing)
- Expo Go app (optional, for physical device testing)

### Clone and enter the project

```bash
cd /path/to/finance
```

## Dependency Installation

```bash
npm install
```

This installs all required packages including:

- `@react-navigation/drawer`
- `@react-native-async-storage/async-storage`
- `axios`
- `expo-audio`
- `react-native-reanimated`
- `react-native-gesture-handler`

## Running the App

Start the Metro bundler:

```bash
npm start
```

Then:

- Press `a` to open on Android emulator/device
- Press `w` to open in web browser
- Scan the QR code with Expo Go on a physical device

Or run directly on Android:

```bash
npm run android
```

## Running on Android Emulator

### Primary emulator

```bash
~/Android/Sdk/emulator/emulator -avd pixel_8_api35
```

### Verify device connection

```bash
adb devices
```

Expected output:

```
List of devices attached
emulator-5554   device
```

### Start the app

With the emulator running:

```bash
npm start
```

Press `a`, or run:

```bash
adb reverse tcp:8081 tcp:8081
adb shell am start -a android.intent.action.VIEW -d "exp://127.0.0.1:8081"
```

## Troubleshooting Emulator Issues

### Emulator not detected

```bash
adb start-server
adb devices
```

### Emulator fails to start

List available AVDs:

```bash
~/Android/Sdk/emulator/emulator -list-avds
```

or:

```bash
~/Android/Sdk/cmdline-tools/latest/bin/avdmanager list avd
```

Try another AVD if `pixel_8_api35` fails:

```bash
~/Android/Sdk/emulator/emulator -avd <other_avd_name>
```

### Expo cannot connect to Metro

```bash
adb reverse tcp:8081 tcp:8081
```

### Emulator quit before opening

Start the emulator manually first, wait for boot to complete, then run `npm start` and press `a`.

## Testing Checklist

### Automated tests

```bash
npm run type-check
npm run test:validators
```

### Search tests

| Test | Input | Expected |
|---|---|---|
| Valid word | `hello` | Shows definitions |
| Invalid word | `xyznotaword123` | "Word not found" |
| Empty input | `` | "Please enter a word" |
| Spaces only | `      ` | "Please enter a valid word" |
| Special characters | `@#$%^&*` | "Please enter a valid English word" |
| Numbers only | `12345` | "Only alphabetic characters are allowed" |
| Uppercase | `APPLE` | Searches `apple` |
| Multiple words | `hello world` | "Please enter a single word" |
| Long word | 46+ characters | "Word is too long" |
| Valid edge cases | `a`, `I`, `can't`, `mother-in-law` | Success |

### API tests

| Scenario | How to test | Expected |
|---|---|---|
| Success | Search `hello` | Definitions displayed |
| 404 | Search nonsense word | "Word not found" + Retry |
| Timeout | Slow/unreachable network | "Request timed out" + Retry |
| Offline | Disable network | "No internet connection" + Retry |
| Malformed | Handled in API layer | "Unexpected response received" |

### Audio tests

| Scenario | Expected |
|---|---|
| Audio available (e.g. `hello`) | Speaker icon visible, plays audio |
| No audio URL | Icon hidden |
| Invalid URL | "Audio unavailable" |
| Repeated taps | No crash; previous audio stops |
| Leave screen | Audio stops and unloads |

### History tests

| Scenario | Expected |
|---|---|
| Add history | Word appears in drawer |
| Duplicates | `apple`, `Apple`, `APPLE` → one entry |
| Persistence | History survives app restart |
| Empty history | "No search history" shown |
| Rapid drawer taps | No duplicate requests |

### Drawer tests

| Scenario | Expected |
|---|---|
| Open drawer | History list visible |
| Select item | Loads word in search screen |
| Rapid selection | Ignored while loading |

### UI tests

| Scenario | Expected |
|---|---|
| Small screen | Scrollable content, no overflow |
| Large screen | Proper spacing and layout |
| Orientation change | Layout remains usable |

## Validation Rules

1. **Empty input** → "Please enter a word"
2. **Only spaces** → "Please enter a valid word"
3. **Too long (>45 chars)** → "Word is too long"
4. **Numbers only** → "Only alphabetic characters are allowed"
5. **Special characters only** → "Please enter a valid English word"
6. **Mixed invalid input** → "Please enter a valid English word"
7. **Surrounding spaces** → Trimmed automatically
8. **Uppercase** → Normalized to lowercase for API
9. **Multiple words** → "Please enter a single word"
10. **Loading** → Search button disabled, duplicate requests ignored

Valid words include: `a`, `I`, `can't`, `mother-in-law`

## Error Handling Strategy

| Condition | User Message | Retry |
|---|---|---|
| 404 | Word not found | Yes |
| 500+ | Dictionary service unavailable | Yes |
| Timeout | Request timed out | Yes |
| No network | No internet connection | Yes |
| Connection lost | Connection lost | Yes |
| Malformed JSON | Unexpected response received | Yes |
| Empty response | No results found | Yes |

Implementation details:

- All API responses are validated before rendering
- Optional fields (`phonetics`, `meanings`, `definitions`, `examples`, `audio`) are checked
- `undefined` and `null` are never displayed
- Loading indicator always hides on completion or error
- Axios requests use timeouts and cancellation on unmount
- Audio players are cleaned up on screen exit

## Project Structure

```
.
├── App.tsx                      # Root component with providers
├── index.ts                     # Expo entry point
├── app.json                     # Expo configuration
├── babel.config.js              # Babel + Reanimated plugin
├── package.json
├── src/
│   ├── api/
│   │   └── dictionaryApi.ts     # Axios API calls
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── ErrorMessage.tsx
│   │   ├── HistoryDrawerContent.tsx
│   │   ├── LoadingIndicator.tsx
│   │   ├── PronunciationButton.tsx
│   │   ├── SearchBar.tsx
│   │   ├── ValidationMessage.tsx
│   │   └── WordDetails.tsx
│   ├── context/
│   │   ├── HistoryContext.tsx   # AsyncStorage history
│   │   └── SearchContext.tsx    # Cross-screen search coordination
│   ├── hooks/
│   │   ├── useAudioPronunciation.ts
│   │   ├── useDictionarySearch.ts
│   │   └── useIsMounted.ts
│   ├── navigation/
│   │   └── DrawerNavigator.tsx
│   ├── screens/
│   │   └── SearchScreen.tsx
│   ├── types/
│   │   └── dictionary.ts
│   └── utils/
│       ├── errorHandler.ts
│       ├── helpers.ts
│       └── validators.ts
└── scripts/
    ├── run-validator-tests.js
    └── test-validators.ts
```

## API

**Endpoint:** `https://api.dictionaryapi.dev/api/v2/entries/en/{word}`

Example:

```bash
curl https://api.dictionaryapi.dev/api/v2/entries/en/hello
```

## Development Commands

| Command | Description |
|---|---|
| `npm start` | Start Expo dev server |
| `npm run android` | Start on Android |
| `npm run ios` | Start on iOS |
| `npm run web` | Start in browser |
| `npm run type-check` | TypeScript validation |
| `npm run test:validators` | Run input validation tests |

## License

See [LICENSE](LICENSE).
