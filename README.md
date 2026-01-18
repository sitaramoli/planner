# 📋 Planner

> A modern task management application built with Next.js, TypeScript, and PostgreSQL. Organize your tasks, boost productivity, and achieve your goals with an intuitive planning platform.

---

## ✨ Features

### 🔐 Authentication
- Secure email/password authentication with NextAuth.js
- Bcrypt password hashing
- JWT-based sessions (30-day expiration)
- Modern, responsive auth pages

### 📝 Task Management
- **Create** tasks with rich content editing
- **View** detailed task information
- **Edit** task details and content
- **Delete** tasks with confirmation dialog
- Track task **status** (New, In Progress, Completed, Cancelled)
- **WYSIWYG editor** powered by TipTap

### 🎨 User Experience
- Fully responsive design (mobile, tablet, desktop)
- Modern UI with shadcn/ui components
- Real-time updates with Next.js server actions
- Toast notifications for user feedback
- Smooth loading states and error handling

---

## 🛠️ Tech Stack

**Frontend:** Next.js 16 • React 19 • TypeScript • Tailwind CSS • shadcn/ui • TipTap

**Backend:** Next.js Server Actions • NextAuth.js • Drizzle ORM • PostgreSQL • Bcrypt

**Tools:** Drizzle Kit • ESLint • Prettier

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (or Neon/Supabase)

### Installation

```bash
# Clone repository
git clone <repository-url>
cd planner

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database URL and AUTH_SECRET

# Set up database
npx drizzle-kit push

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Configuration

### Environment Variables

Create `.env.local`:

```env
DATABASE_URL=postgresql://user:password@host:port/database
AUTH_SECRET=your-secret-key-here
```

Generate `AUTH_SECRET`:
```bash
npx auth secret
```

### Database Setup

```bash
# Generate migration
npx drizzle-kit generate

# Push schema (development)
npx drizzle-kit push

# Run migrations (production)
npx drizzle-kit migrate
```

**Schema:**
- `users` - User accounts and authentication
- `tasks` - Task data with status tracking

---

## 📁 Project Structure

```
planner/
├── app/
│   ├── (auth)/          # Sign in/up pages
│   ├── (root)/          # Protected routes
│   │   └── tasks/       # Task management
│   └── api/             # API routes
├── actions/              # Server actions
├── components/           # React components
│   └── ui/              # shadcn/ui components
├── db/                   # Database schema & config
├── lib/                  # Utilities & validations
└── migrations/           # Database migrations
```

---

## 🎯 Usage

### Authentication

1. **Sign Up** - Create account with email and password
2. **Sign In** - Access your dashboard
3. **Session** - Automatically managed (30 days)

### Task Management

1. **Create** - Click "New Task" → Fill form → Save
2. **View** - Click task card to see details
3. **Edit** - Click edit button → Modify → Save
4. **Delete** - Click delete → Confirm in dialog

### Rich Text Editor

Format your task content with:
- **Bold**, *Italic*, ~~Strikethrough~~
- Headings (H1, H2, H3)
- Bullet and numbered lists
- Blockquotes and horizontal rules
- Undo/Redo

---

## 🧪 Development

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Lint code
```

### Database Commands

```bash
npx drizzle-kit generate    # Generate migration
npx drizzle-kit push        # Push schema changes
npx drizzle-kit migrate     # Run migrations
```

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `DATABASE_URL`
   - `AUTH_SECRET`
4. Deploy!
---

## 🔒 Security

- Password hashing with Bcrypt
- SQL injection protection (Drizzle ORM)
- XSS protection (React escaping)
- CSRF protection (NextAuth.js)
- Secure session cookies
- Input validation (Zod)

---

## 📱 Responsive Design

- **Mobile** - Single column, full-width buttons
- **Tablet** - Two-column grid
- **Desktop** - Three-column grid, side-by-side layouts

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) - React Framework
- [shadcn/ui](https://ui.shadcn.com) - Component Library
- [TipTap](https://tiptap.dev) - Rich Text Editor
- [Drizzle ORM](https://orm.drizzle.team) - Type-safe ORM
- [Auth.js](https://authjs.dev) - Authentication

---

**Built with ❤️ using Next.js and TypeScript**
