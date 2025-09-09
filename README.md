# 🎬 Movies Catalog Webapp

A React web application that lets users search movies using the OMDb API, save movies to personal favorites lists or custom lists, and persist user data using Firebase (Auth + Firestore).

## ✨ Features

- **Movie Search**: Search movies, TV shows, and episodes using the OMDb API
- **Advanced Filtering**: Filter by type (movie/series/episode) and year
- **User Authentication**: Sign up/sign in with email and password using Firebase Auth
- **Personal Lists**: Create, rename, and delete custom movie lists
- **Favorites System**: Default favorites list for each user
- **Movie Details**: View detailed information including plot, cast, ratings
- **Responsive Design**: Works on desktop and mobile devices
- **Caching**: Reduces API calls with intelligent caching system

## 🚀 Live Demo

[View Live Demo](https://your-demo-url.netlify.app) *(Deploy to see live version)*

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v14 or higher)
- npm or yarn
- OMDb API key (free at [omdbapi.com](http://www.omdbapi.com/apikey.aspx))
- Firebase project with Authentication and Firestore enabled

## 🛠️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/r91781585-tech/movies-catalog-webapp.git
cd movies-catalog-webapp
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory and add your API keys:

```env
# OMDb API Configuration
REACT_APP_OMDB_API_KEY=your_omdb_api_key_here

# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### 4. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable Authentication with Email/Password provider
4. Create a Firestore database
5. Copy your Firebase config to the `.env.local` file

### 5. OMDb API Setup

1. Get your free API key from [OMDb API](http://www.omdbapi.com/apikey.aspx)
2. Add it to your `.env.local` file

### 6. Run the application

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── Header.js        # App header with auth status
│   ├── Navigation.js    # Navigation menu
│   ├── MovieSearch.js   # Movie search interface
│   ├── MovieCard.js     # Individual movie card
│   ├── MovieDetails.js  # Movie details modal
│   ├── MyLists.js       # User's movie lists
│   ├── AddToListModal.js # List management modal
│   └── Auth.js          # Login/signup forms
├── contexts/
│   └── AuthContext.js   # Authentication context
├── services/
│   ├── omdbApi.js       # OMDb API integration
│   └── firebaseService.js # Firebase/Firestore operations
├── firebase.js          # Firebase configuration
├── App.js              # Main app component
└── index.js            # App entry point
```

## 🔥 Firebase Firestore Structure

```
users/{uid}
├── displayName: string
├── email: string
├── createdAt: timestamp
└── lists/{listId}
    ├── name: string
    ├── isDefault: boolean
    ├── isPublic: boolean
    ├── createdAt: timestamp
    └── listItems/{itemId}
        ├── movieId: string (imdbID)
        ├── title: string
        ├── year: string
        ├── poster: string
        ├── type: string
        ├── addedAt: timestamp
        └── metadata: object
            ├── plot: string
            ├── director: string
            ├── actors: string
            ├── genre: string
            └── imdbRating: string
```

## 🎯 User Flows

### For Visitors (Not Signed In)
1. Search for movies using the search interface
2. View movie details in modal
3. See prompt to sign in to save movies
4. Sign up or sign in to access list features

### For Authenticated Users
1. Search and view movie details
2. Add movies to existing lists or create new lists
3. Manage personal movie lists
4. View saved movies in "My Lists" section
5. Create, rename, and delete custom lists

## 🚀 Deployment

### Deploy to Netlify

1. Build the project:
```bash
npm run build
```

2. Deploy the `build` folder to Netlify
3. Set environment variables in Netlify dashboard
4. Your app will be live!

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel --prod
```

3. Set environment variables in Vercel dashboard

## 🔧 Available Scripts

- `npm start` - Run development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 🌟 Key Features Explained

### Caching System
- Reduces OMDb API calls by caching search results and movie details
- 5-minute cache duration for optimal performance
- Automatic cache cleanup

### Authentication Flow
- Firebase Authentication with email/password
- Protected routes for authenticated users
- Automatic user profile creation with default favorites list

### List Management
- Default "Favorites" list created for each user
- Custom list creation, editing, and deletion
- Prevent duplicate movies in lists
- Bulk list operations

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interface
- Optimized for all screen sizes

## 🐛 Troubleshooting

### Common Issues

1. **API Key Errors**
   - Ensure your OMDb API key is valid and added to `.env.local`
   - Check if you've exceeded your API quota

2. **Firebase Errors**
   - Verify Firebase configuration in `.env.local`
   - Ensure Authentication and Firestore are enabled
   - Check Firebase security rules

3. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check for missing dependencies

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📞 Support

If you have any questions or issues, please:
1. Check the troubleshooting section
2. Search existing GitHub issues
3. Create a new issue with detailed information

## 🙏 Acknowledgments

- [OMDb API](http://www.omdbapi.com/) for movie data
- [Firebase](https://firebase.google.com/) for authentication and database
- [React](https://reactjs.org/) for the frontend framework
- [Create React App](https://create-react-app.dev/) for project setup

---

**Built with ❤️ using React, Firebase, and OMDb API**