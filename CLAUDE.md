# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a modern Hearthstone deck discovery platform built with Next.js 15, TypeScript, and Supabase. The application provides card analysis, deck building, meta insights, and social features for the Hearthstone community.

## Development Commands

### Core Development
```bash
npm run dev              # Start development server on localhost:3003
npm run build            # Build for production
npm run build:vercel     # Custom build script with memory optimization for Vercel deployment
npm run start            # Start production server
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript checks without emitting files
```

### Testing
```bash
npm test                 # Run Jest unit tests
npm run test:watch       # Run tests in watch mode
npm run test:integration # Run integration tests
npm run test:coverage    # Run tests with coverage report
npm run test:mock-data   # Test mock data generation
```

### Data Generation & Management
```bash
npm run data:generate                 # Generate all sample data
npm run data:generate:decks           # Generate deck data only
npm run data:generate:meta            # Generate meta analysis data
npm run data:generate:performance     # Generate card performance data
npm run sync:cards                    # Full card data sync
npm run sync:cards:incremental        # Incremental card sync
```

### Database Operations
```bash
npx supabase db push     # Push database schema changes
npx supabase db status   # Check database connection status
npx supabase status      # Check Supabase project status
```

## Architecture Overview

### Technology Stack
- **Frontend**: Next.js 15 with App Router, React 18, TypeScript
- **Backend**: Next.js API Routes with Supabase
- **Database**: PostgreSQL via Supabase with Row Level Security
- **UI**: Tailwind CSS with Radix UI components and shadcn/ui
- **State Management**: React hooks, SWR for data fetching, Zustand for complex state
- **Authentication**: Supabase Auth with Google OAuth
- **Testing**: Jest for unit tests, Playwright for E2E testing
- **Deployment**: Vercel (no Docker deployment)

### Key Directories
- `src/app/` - Next.js App Router pages and API routes
- `src/components/hearthstone/` - Hearthstone-specific components (cards, decks, meta)
- `src/components/ui/` - Reusable UI components built with Radix UI and shadcn/ui
- `src/components/server/` - Server-side components
- `src/lib/` - Utility functions and business logic
- `src/supabase/` - Supabase client configuration and middleware
- `src/tests/` - Test files organized by type (unit, integration, components)

### Database Schema
The application uses multiple key tables:
- `hearthstone_cards` - Complete card database with multilingual support
- `hearthstone_decks` - Deck information and statistics
- `card_performance` - Individual card performance metrics
- `deck_matchups` - Detailed matchup analysis
- `meta_snapshots` - Meta analysis data
- `user_profiles` - User information and preferences

## Development Guidelines

### Build Requirements
- **CRITICAL**: All changes must pass `npm run build:vercel` to verify they can be deployed to Vercel
- The custom build script handles memory optimization and prevents micromatch stack overflow issues
- TypeScript errors will block builds - ensure `npm run type-check` passes

### Branching & Deployment
- All feature work must be done on separate branches
- Never push to remote without explicit approval
- Required review process: 1) Local code review, 2) Remote PR review
- Clean up test scripts and build artifacts after development
- Project is deployed on Vercel, no Docker builds required

### Code Quality Standards
- TypeScript is strictly enforced - no implicit any types
- ESLint rules are configured but ignored during builds to prevent blocking
- Use SWR for server state management and caching
- Component organization: UI components in `/ui`, domain-specific in `/hearthstone`
- Use shadcn/ui components for consistent UI patterns
- Use Supabase MCP for database operations and context7 for documentation lookup

### Testing Strategy
- Unit tests for utility functions and business logic
- Integration tests for API endpoints and component interactions
- Mock data generation is comprehensive and should be used for development
- Tests cover card performance analysis, deck matchups, and user workflows

### Performance Considerations
- Build optimization includes memory limits and chunk splitting for Vercel deployment
- Images are optimized with lazy loading
- Component memoization is used where appropriate
- API responses are cached through SWR

### Supabase Integration
- Client-side and server-side Supabase instances are configured separately
- Row Level Security (RLS) policies protect user data
- Authentication middleware handles user sessions
- Real-time subscriptions are available for live data updates
- Use Supabase MCP tools for database migrations and queries

## Common Development Patterns

### Card Data Operations
Cards are fetched from HearthstoneJSON API and synchronized with local database. The sync process includes incremental updates and comprehensive logging.

### Performance Metrics Generation
Card performance data is generated with multiple timeframes and format considerations. This includes win rates, play rates, and matchup analysis.

### Deck Analysis Workflows
Decks include comprehensive statistics: mana curves, card counts, matchup analysis, and performance metrics against various classes.

### Authentication Flow
Uses Supabase Auth with Google OAuth integration. Authentication state is managed through React context and SWR.

## MCP Tools Usage
When implementing features, use these MCP tools for best practices:
- **context7**: Look up latest documentation for libraries and frameworks
- **shadcn-ui**: Access shadcn/ui components and implementation patterns
- **supabase**: Handle database operations, migrations, and queries

## Environment Variables
Required for development:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_KEY` - Server-side Supabase service key
- `CRON_SECRET` - Secret for cron job authentication

## 开发要求
- 要求每次修改完后,都需要通过vercel build验证构建通过情况，必须保证所有修改都是可以正常构建发布的.
- 测试过程中产生的脚本和build中间文件,如果没有必要,则删除.
- 所有的feature变更,都需要使用分支进行开发.
- 在我未同意之前, 你不能推送到远程.
- 我需要: 1.本地 review; 2.远程 PR review.
- 实现对应功能时使用context7、shadcn-ui、next-devtools和supabase mcp进行，保证开发功能的规范性和最佳实践。
