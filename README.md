# Halo Journal

A modern journaling application built with Next.js that helps users capture thoughts, track moods, and reflect on their personal journey in a beautiful, secure digital space.

![Organized Journal](public/images/logo.png)

## Features

- **Rich Text Editor**: Express yourself with a powerful editor supporting formatting and markdown
- **Mood Analytics**: Track your emotional journey with visual mood trends and pattern recognition
- **Daily Inspiration**: Get inspired with daily prompts to spark your creativity
- **Collections**: Organize your entries into custom collections
- **Private & Secure**: Your thoughts are protected with enterprise-grade security

## Tech Stack

- [Next.js 15](https://nextjs.org/) - React framework
- [React 19](https://react.dev/) - UI library
- [Prisma](https://www.prisma.io/) - Database ORM
- [Clerk](https://clerk.com/) - Authentication and user management
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Radix UI](https://www.radix-ui.com/) - Accessible UI components
- [LangChain](https://js.langchain.com/) - AI integration for insights
- [Google Generative AI](https://ai.google.dev/) - AI services
- [Recharts](https://recharts.org/) - Data visualization

## Getting Started

### Prerequisites

- Node.js 20+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/organized-journal.git
   cd organized-journal
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   # or
   pnpm install
   # or
   bun install
   ```

3. Set up your environment variables:
   Create a `.env` file in the root directory and add the necessary environment variables (refer to `.env.example`).

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `src/app` - Next.js application routes and pages
- `src/components` - UI components organized by atomic design principles
- `src/actions` - Server actions for data operations
- `src/lib` - Utility functions and libraries
- `src/hooks` - Custom React hooks
- `prisma` - Database schema and migrations

## Database

This project uses Prisma ORM with a database. After making changes to the Prisma schema:

```bash
npx prisma generate
npx prisma db push
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
