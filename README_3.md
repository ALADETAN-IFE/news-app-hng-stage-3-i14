# Smart Utility Toolkit Mobile App

Smart Utility Toolkit is a React Native plus Expo app built for the HNG Mobile track.

It focuses on practical conversion tools and a local-first task manager, with clean UI patterns, file-based routing, and persistent storage.

## Live Demo

- Appetize preview link: [Smart Utility Toolkit on Appetize](https://appetize.io/app/b_6yklmmpzvcw2ympswks2urbkfa)

## Why I Built This

This project was built as a hands-on mobile development workflow:

- Designing a modern utility-focused mobile UI
- Managing state across multiple tabs and feature modules
- Persisting user data with AsyncStorage
- Implementing complete create, read, update, and delete task operations
- Building converter tools with reusable configuration-driven logic
- Navigating screens and tabs with Expo Router

## Features

- Length converter with metric and imperial units
- Temperature converter for Celsius, Fahrenheit, and Kelvin
- Weight converter with common unit options
- Task manager with add, edit, delete, and complete actions
- Optional due date picker for tasks
- Inline form validation for title and description
- Progress tracker for completed versus total tasks
- Smooth local state updates for task actions 
- Offline-first behavior for both converters and tasks
- Local persistence with AsyncStorage

## Tech Stack

- Framework: Expo (React Native)
- Language: TypeScript
- Routing: Expo Router (file-based routing)
- Storage: @react-native-async-storage/async-storage
- Date Input: @react-native-community/datetimepicker
- Styling: NativeWind (Tailwind CSS for React Native)
- Icons: @expo/vector-icons (Ionicons)
- Build/Release: EAS Build

## Project Structure

```text
app/
	_layout.tsx                # Root layout and splash overlay
	global.css                 # Global NativeWind styles
	(tabs)/
		_layout.tsx             # Bottom tab navigation
		index.tsx               # Redirect entry for tabs
		length.tsx              # Length converter screen
		temperature.tsx         # Temperature converter screen
		weight.tsx              # Weight converter screen
		tasks.tsx               # Task manager screen

components/
	ConverterTabScreen.tsx     # Shared converter tab shell
	ToolkitCard.tsx            # Converter interaction card
	TaskComponents.tsx         # Task item and task form UI

utils/
	toolkits.ts                # Converter configs and conversion logic
	taskStorage.ts             # AsyncStorage task CRUD helpers

assets/
	images/                    # App icon and splash assets
```

## Getting Started (Local Development)

### Prerequisites

- Node.js LTS (Node 20 recommended for Expo SDK 54)
- npm
- Expo tooling via npx
- Android Studio emulator and/or iOS simulator (Mac for iOS simulator)

### Install Dependencies

```bash
npm install
```

### Run the App

```bash
npm run start
```

Then choose one of:

- a for Android emulator
- i for iOS simulator
- w for web
- or scan the QR code with Expo Go

## Available Scripts

- npm run start - Start Expo development server
- npm run dev - Start with Expo dev client
- npm run android - Open Android flow
- npm run ios - Open iOS flow
- npm run web - Open web preview
- npm run lint - Run lint checks
- npm run build - Build Android plus iOS with EAS
- npm run buildAndroid - Build Android with EAS
- npm run buildiOS - Build iOS with EAS

## Data Model

Each task is stored with this shape:

```ts
type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: number;
  updatedAt: number;
  dueDate?: number;
};
```

Tasks are saved in local device storage under the @smart_toolkit_tasks key.

## Learning Outcomes from This Project

- Building a multi-feature mobile app under one coherent design system
- Structuring logic into tab screens, reusable components, and utility modules
- Managing async operations and fallback UI states for data loading
- Implementing form validation and inline error display in React Native
- Building and iterating UI for both utility and task management flows

## App Configuration

- App Name: Smart Utility Toolkit
- Package / Bundle ID: com.ifecodes.smartutilitytoolkit
- Expo project owner: ifecodes
- Scheme: smartutilitytoolkit

## Roadmap / Possible Improvements

- Add task filtering and search
- Add task sort options (newest, oldest, completed first)
- Add overdue highlighting and reminder notifications
- Add cloud sync support
- Add unit and integration tests
- Add subtle tab transition animation polish

## Author

- Name: Fortune Ife Aladetan
- Email: [contact@ifecodes.xyz](mailto:fortuneifealadetan01@gmail.com)
- GitHub: [ALADETAN-IFE](https://github.com/ALADETAN-IFE)
- Portfolio: [ifecodes.xyz](https://www.ifecodes.xyz)

## License

This project is currently for learning and portfolio purposes.
