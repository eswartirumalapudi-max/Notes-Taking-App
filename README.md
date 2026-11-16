
# Notes Taking App

A simple and user-friendly mobile application to create, organize, search, edit, and delete personal notes.

## Features

- User registration and login
- Secure authentication using Supabase
- Create, edit, and delete notes
- Create and manage categories
- Search notes
- Save notes locally on the device
- Separate notes and categories for each user
- Persistent login sessions

## Technologies Used

- React Native
- Expo
- TypeScript
- Expo Router
- NativeBase
- Supabase Authentication
- AsyncStorage

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/eswartirumalapudi-max/Notes-Taking-App.git
```

### 2. Open the project folder

```bash
cd Notes-Taking-App
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure Supabase

Create a `.env` file in the project root.

Add your Supabase project URL and publishable key:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_publishable_key
```

You can find these values in your Supabase project settings.

### 5. Start the application

```bash
npx expo start
```

Scan the QR code using Expo Go to run the application on your phone.

## Storage and Authentication

- Supabase is used for user authentication.
- AsyncStorage stores notes and categories locally on the device.
- Each user's notes and categories are stored separately using their authenticated user ID.
- The application restores the user's authentication session when reopened.

## Project Structure

```text
Notes-Taking-App/
├── src/
│   ├── app/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── login.tsx
│   │   └── explore.tsx
│   └── components/
├── lib/
│   └── supabase.ts
├── patches/
├── .env.example
├── package.json
└── README.md
```

## Project Repository

GitHub: https://github.com/eswartirumalapudi-max/Notes-Taking-App

## Developer

Developed as part of an internship project.
