# NEWSROOM Mobile App

NEWSROOM is a React Native app built with Expo for the HNG Stage 3 mobile task. It is a news browsing app with a dark UI, tab navigation, auth screens, article views, saved content, and real-time search.

This repository currently implements the News option from [`task_3.md`](task_3.md): article feeds, category browsing, search, article details, offline caching, error handling, loading states, and animations.

## What The App Does

- Welcome screen with get started and sign in entry points
- Auth flow with sign in, sign up, and forgot password screens
- Responsive tab navigation for Feeds, Events, Search, and Saved
- Explore modal for interest selection when no saved interests exist
- Feeds screen with featured story and article lists
- Events screen with filters and event cards
- Saved screen with saved article layout and filtering UI
- Search screen powered by Guardian API consumption
- Article detail and category detail screens
- Bookmarking and local persistence for saved articles and interests

## APIs Used

- [The Guardian API](https://open-platform.theguardian.com/) for top stories, category feeds, article details, and keyword search
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) for offline caching, saved articles, and saved interests

The app uses environment variables for the Guardian API base URL and API key.

## Features That Match The Task

- Article Feed with headlines, images, descriptions, publication dates, and source information
- Category Browsing through tabs and explore category cards
- Article Search with debounced keyword search and live results
- Article Details screen with save/bookmark support
- Offline Caching for feed/search/article responses through AsyncStorage-backed cache entries
- Error Handling for network failures, API failures, empty results, and invalid search queries
- Loading States with activity indicators and empty-state feedback

## Animations

The app includes animation work in multiple places:

- Screen and modal motion using Expo Router navigation plus the explore modal slide-up presentation
- Animated list items in search and feed screens using React Native Reanimated entrance animations
- Bookmark and modal interactions that provide responsive visual feedback

## Tech Stack

- Expo SDK 54
- React Native
- TypeScript
- Expo Router
- NativeWind / Tailwind CSS
- React Native Reanimated
- AsyncStorage
- React Native Safe Area Context
- Expo Vector Icons

## Project Structure

```text
app/
	_layout.tsx
	index.tsx
	auth/
		_layout.tsx
		signin.tsx
		signup.tsx
		forgot-password.tsx
	(tabs)/
		_layout.tsx
		feeds.tsx
		events.tsx
		saved.tsx
		search.tsx
		explore.tsx
		explore/[category].tsx
		article/[id].tsx

components/
	ExploreModal.tsx
	Footer.tsx
	shared/
	ui/

utils/
	api.ts
	constants.ts
	storage.ts

types/
	index.ts
```

## Setup

### Install dependencies

```bash
npm install
```

### Configure environment

Create a `.env` file in the mobile project root with:

```bash
EXPO_PUBLIC_The_Guardian_API_BASE_URL=https://content.guardianapis.com
EXPO_PUBLIC_GUARDIAN_API_KEY=your_news_api_key
```

### Run the app

```bash
npm run start
```

Then open it with Expo Go, Android emulator, iOS simulator, or web.

## Available Scripts

- `npm run start` - Start the Expo dev server
- `npm run dev` - Start Expo with dev client mode
- `npm run android` - Launch Android
- `npm run ios` - Launch iOS
- `npm run lint` - Run lint checks

## Screenshots / Media

Add your screenshots or screen recordings here before submission.

- Home / Feeds
- Search results
- Article details
- Explore modal

## Documentation Post

Add your LinkedIn or X post link here before submission.

## Notes

- Auth is UI-first for this task and routes into the main news experience.
- Saved interests are stored locally on device.
- Search and feed data are cached locally to reduce repeated network calls.
- The app shows user-friendly messages for no internet, API failures, and empty search results.

## Author

- Fortune Ife Aladetan
- GitHub: [ALADETAN-IFE](https://github.com/ALADETAN-IFE)
