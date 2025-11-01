# 炉石传说卡组发现平台 | Hearthstone Deck Discovery Platform

A modern, feature-rich web application for discovering, building, and analyzing Hearthstone decks with real-time meta analysis and social features.

## 🌟 Features

### Core Features
- **🎴 Card Discovery**: Browse and search the complete Hearthstone card database
- **📈 Card Analysis**: Advanced performance metrics with win rates, play rates, and matchup analysis
- **🏗️ Deck Builder**: Interactive deck building with validation and statistics
- **📊 Meta Analysis**: Real-time tier rankings and meta insights
- **🎯 Deck Display**: Comprehensive deck statistics, mana curves, and matchup analysis
- **🔍 Advanced Search**: Filter cards by class, cost, rarity, and mechanics
- **📱 Mobile Responsive**: Fully optimized for mobile and desktop

### Social Features
- **👤 User Profiles**: Custom profiles with stats and achievements
- **❤️ Favorites**: Save and organize your favorite decks
- **⭐ Rating System**: Rate and review decks
- **👥 Following**: Follow other players and deck creators

### Data & Analytics
- **📈 Trending Cards**: Track rising and falling card popularity
- **🏆 Tier Rankings**: Updated meta tier lists
- **📊 Win Rate Analysis**: Detailed deck performance metrics
- **🎯 Card Performance Metrics**: In-depth analysis of individual card statistics across formats and timeframes
- **🔄 Deck Matchup Analysis**: Comprehensive matchup data against all classes with win rates and sample sizes
- **🔄 Real-time Updates**: Live data synchronization with automated cron jobs
- **📊 Mock Data Generation**: Comprehensive testing data generation for development and QA

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/hs-deck-fe.git
   cd hs-deck-fe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Add your Supabase credentials:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   CRON_SECRET=hs-cron-secret-d3112415
   ```

4. **Set up the database**
   ```bash
   npx supabase db push
   ```

5. **Generate sample data** (optional)
   ```bash
   npm run data:generate                 # Generate all sample data
   npm run data:generate:decks           # Generate deck data only
   npm run data:generate:meta            # Generate meta analysis data
   npm run data:generate:performance     # Generate card performance data
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3003](http://localhost:3003)

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Next.js 15 with App Router
- **Backend**: Next.js API Routes with Supabase
- **Database**: PostgreSQL via Supabase
- **UI**: Tailwind CSS with custom components
- **State Management**: React hooks and SWR
- **Authentication**: Supabase Auth
- **API Integration**: Hearthstone JSON API

### Project Structure
```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── decks/             # Deck pages
│   │   ├── meta/              # Meta analysis pages
│   │   └── user/              # User pages
│   ├── components/            # React components
│   │   ├── hearthstone/       # Hearthstone-specific components
│   │   ├── ui/                # Reusable UI components
│   │   └── server/            # Server components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility libraries
│   ├── types/                 # TypeScript definitions
│   └── supabase/              # Supabase configuration
├── supabase/
│   └── migrations/            # Database migrations
├── docs/                      # Documentation
└── public/                    # Static assets
```

## 🎯 Core Components

### Card System
- **CardDisplay**: Interactive card component with hover effects
- **CardList**: Advanced card browsing with filtering
- **CardSearch**: Real-time search with autocomplete

### Deck Management
- **DeckBuilder**: Drag-and-drop deck building interface
- **DeckViewer**: Detailed deck analysis and statistics
- **DeckShare**: Social sharing and collaboration

### Meta Analysis
- **MetaDashboard**: Real-time meta insights
- **TierRankings**: Visual tier lists and rankings
- **TrendingAnalysis**: Card and archetype trends

### User Interface
- **UserProfile**: Comprehensive user profiles
- **Authentication**: Secure login and registration
- **Responsive Design**: Mobile-first design approach

## 📊 Database Schema

### Core Tables
- `hearthstone_cards`: Complete card database with multilingual support
- `hearthstone_decks`: Deck information and statistics
- `card_performance`: Individual card performance metrics across formats and timeframes
- `deck_matchups`: Detailed matchup analysis between decks and classes
- `meta_snapshots`: Meta analysis data
- `archetype_performance`: Archetype rankings
- `user_profiles`: User information and preferences
- `card_sync_logs`: Card data synchronization and monitoring

### Security Features
- Row Level Security (RLS) policies
- Authentication with Supabase Auth
- API rate limiting and validation
- CORS protection

## 🎨 UI/UX Features

### Interactive Elements
- Hover animations and micro-interactions
- Drag-and-drop functionality
- Real-time search and filtering
- Keyboard navigation support

### Accessibility
- WCAG AA compliance
- Screen reader support
- High contrast mode support
- Reduced motion preferences

### Performance
- Image optimization and lazy loading
- Component memoization
- API response caching
- Code splitting and dynamic imports

## 📱 Mobile Features

### Touch Interactions
- Swipe gestures for card browsing
- Touch-friendly buttons and controls
- Pull-to-refresh functionality
- Mobile-optimized deck builder

### Progressive Web App
- Service worker for offline support
- App-like experience on mobile
- Push notifications for meta updates
- Background data synchronization

## 🔧 Development

### Available Scripts
```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript checks

# Data Management
npm run data:generate                 # Generate all sample data
npm run data:generate:decks           # Generate deck data only
npm run data:generate:meta            # Generate meta analysis data
npm run data:generate:performance     # Generate card performance data

# Database Operations
npx supabase db push     # Push database changes
npx supabase db reset    # Reset local database
```

### Code Quality
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Pre-commit hooks for consistency

### Testing
- Unit tests with Jest
- Integration tests for API and components
- E2E tests with Playwright
- Accessibility testing
- Mock data generation for comprehensive testing

## 🚀 Deployment

### Production Deployment
1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set up environment variables**
   - Configure Supabase settings
   - Set up monitoring and analytics
   - Configure security headers

3. **Deploy to platform**
   - Vercel (recommended)
   - Custom server setup

### Environment Configuration
```bash
# Production variables
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
CRON_SECRET=your_cron_secret

# Optional monitoring
NEXT_PUBLIC_GA_ID=your_google_analytics_id
SENTRY_DSN=your_sentry_dsn
```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 📖 Documentation

- [API Documentation](./API_DOCUMENTATION.md) - Complete API reference
- [Deployment Guide](./DEPLOYMENT.md) - Production deployment
- [Development Guide](./docs/development.md) - Development setup
- [Feature Documentation](./docs/features/) - Detailed feature guides
  - [Card Analysis](./docs/features/card-analysis.md) - Card performance metrics
  - [Deck Display](./docs/features/deck-display.md) - Deck statistics and analysis
- [Contributing Guide](./docs/contributing.md) - How to contribute

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Run tests and checks**
   ```bash
   npm run type-check
   npm run lint
   npm test
   ```
5. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature"
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a pull request**

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation when needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Hearthstone** - Blizzard Entertainment for the amazing game
- **HearthstoneJSON** - Community maintained card database
- **Supabase** - Backend-as-a-service platform
- **Next.js** - React framework for production
- **Tailwind CSS** - Utility-first CSS framework

## 📞 Support

### Getting Help
- **Documentation**: Check the [docs](./docs/) folder
- **Issues**: Open an issue on GitHub
- **Discussions**: Join our GitHub discussions
- **Community**: Connect with other developers

### Reporting Issues
1. Check existing issues first
2. Use the issue templates provided
3. Include steps to reproduce
4. Add relevant screenshots
5. Specify environment details

### Feature Requests
- Open an issue with the "enhancement" label
- Describe the feature in detail
- Explain the use case
- Consider implementation difficulty

## 🎯 Roadmap

### Current Version (v1.0.0)
- ✅ Core card database integration with multilingual support
- ✅ Advanced card performance analysis with multiple formats and timeframes
- ✅ Comprehensive deck display with matchup analysis and statistics
- ✅ Deck building and management
- ✅ Meta analysis dashboard
- ✅ User profiles and authentication
- ✅ Mobile responsive design
- ✅ Mock data generation for testing and development
- ✅ Integration testing suite with comprehensive coverage

### Upcoming Features (v1.1.0)
- 🔄 Tournament integration
- 🔄 Advanced deck analytics
- 🔄 Social features and communities
- 🔄 Mobile app development

### Future Plans (v2.0.0)
- 📋 Machine learning recommendations
- 📋 Real-time gameplay integration
- 📋 Competitive scene features
- 📋 Expansion pack support

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=your-username/hs-deck-fe&type=Date)](https://star-history.com/#your-username/hs-deck-fe&Date)

---

**Built with ❤️ by the Hearthstone community**

*Disclaimer: This project is not affiliated with or endorsed by Blizzard Entertainment. Hearthstone is a trademark of Blizzard Entertainment.*
