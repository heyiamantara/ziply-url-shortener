# Ziply - AI-Powered URL Shortener

Ziply is a modern, high-performance URL shortener built with Next.js 15, Drizzle ORM, and Google's Gemini AI. It goes beyond simple URL shortening by providing real-time safety checks and detailed risk analysis for every link you create.

## 🚀 Features

- **Instant URL Shortening**: Quick and easy link shortening from the homepage.
- **Custom URL Codes**: Create branded or memorable links with custom short codes (e.g., `ziply.link/r/my-link`).
- **AI Safety Engine**: Every URL is analyzed by Google Gemini AI and pattern-based heuristics to detect phishing, malware, and scams.
- **Detailed Flagging Info**: If a link is flagged, users receive a clear, left-aligned explanation of the specific security risks.
- **QR Code Generation**: Instantly generate and download sleek QR codes for any shortened link.
- **Analytics Dashboard**: Track click counts and monitor link performance in real-time.
- **Admin Management**: Dedicated dashboard for admins to manage all URLs, users, and safety flags.
- **Modern Auth**: Secure authentication powered by NextAuth.js (v5 beta) with Role-Based Access Control (RBAC).

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (with Turbopack and React 19)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Neon](https://neon.tech/))
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [NextAuth.js v5](https://authjs.dev/)
- **AI Integration**: [Google Gemini AI](https://ai.google.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📦 Getting Started

### Prerequisites

- Node.js 20+
- A PostgreSQL database (Neon recommended)
- A Google AI Studio API Key (for Gemini)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/heyiamantara/ziply-url-shortener.git
   cd ziply
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```env
   DATABASE_URL="your-postgresql-url"
   AUTH_SECRET="your-auth-secret"
   GOOGLE_GEMINI_API_KEY="your-gemini-api-key"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to see your app in action.

## 🛡️ Safety Check System

Ziply uses a dual-layer approach to ensure link safety:

1.  **AI Analysis**: Gemini analyzes the URL structure, domain age, and potential deceptive patterns to provide a detailed safety score.
2.  **Heuristic Flags**: A fast, pattern-based system checks for risky TLDs (like `.zip`, `.click`), Punycode (IDN) deception, and direct IP addresses.

Flagged links are kept in a "pending review" state and show a detailed reason to the user, helping prevent phishing and malware spread.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
