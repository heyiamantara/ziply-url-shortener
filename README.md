#  🔗 Ziply (AI-Powered URL Shortener)

**Ziply** is a modern, high-performance URL shortener built with **Next.js 15**, **Drizzle ORM**, and **Google Gemini AI**.  
It goes beyond traditional link shorteners by offering **real-time safety analysis** and **detailed risk insights** for every URL you create.

---

## ✨ Key Features

### 🔗 Core Functionality
- **Instant URL Shortening**: Quickly generate short links directly from the homepage.
- **Custom Short Codes**: Create branded, memorable URLs like: `ziply.link/r/my-link`

### 🛡️ Security & Intelligence
- **AI-Powered Safety Engine**: Every URL is analyzed using **Google Gemini AI** combined with heuristic checks to detect phishing, malware, and scam links.
- **Detailed Risk Reports**: Flagged links include clear, structured explanations of detected threats directly in the UI.

### 📊 Productivity & Insights
- **Analytics Dashboard**: Monitor clicks and track link performance in real-time.
- **QR Code Generation**: Instantly generate and download sleek, shareable QR codes.

### 👨‍💻 Admin & Access Control
- **Admin Dashboard**: Manage users, links, and flagged content from a centralized interface.
- **Modern Authentication**: Secure auth powered by **NextAuth.js v5 (beta)** with **Role-Based Access Control (RBAC)**.

---

## 🧱 Tech Stack

| Category        | Technology |
|----------------|-----------|
| **Framework**  | Next.js 15 (Turbopack + React 19) |
| **Database**   | PostgreSQL (Neon) |
| **ORM**        | Drizzle ORM |
| **Auth**       | NextAuth.js v5 |
| **AI Engine**  | Google Gemini AI |
| **Styling**    | Tailwind CSS + Shadcn UI |
| **Icons**      | Lucide React |

---

## 📦 Getting Started

### ✅ Prerequisites
Make sure you have:
- Node.js **v20+**
- A **PostgreSQL database** (Neon recommended)
- A **Google AI Studio API key**

### ⚙️ Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/heyiamantara/ziply-url-shortener.git
   cd ziply
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="your-postgresql-url"
   AUTH_SECRET="your-auth-secret"
   GOOGLE_GEMINI_API_KEY="your-gemini-api-key"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Run the App**
   Open your browser and visit: 👉 [http://localhost:3000](http://localhost:3000)

---

## 🛡️ Safety Check System

Ziply uses a dual-layer security approach to ensure link safety:

### 1️⃣ AI-Based Analysis
Powered by **Google Gemini AI**, it evaluates:
- URL structure & potential deceptive patterns.
- Domain reputation and registration age.
- Contextual intent to provide a detailed risk explanation.

### 2️⃣ Heuristic Detection
A fast rule-based system that flags:
- **Suspicious TLDs**: `.zip`, `.click`, `.top`, etc.
- **Punycode (IDN)**: Spoofing attempts using international characters.
- **Direct IP-based URLs**: Attempts to bypass domain-based security filters.

### 🚨 Flag Handling
Risky links are marked as **“Pending Review”**. Users receive a clear, detailed explanation of why the link was flagged, helping prevent the spread of phishing and malicious content.

---

## 💡 Why Ziply?
Unlike traditional URL shorteners, Ziply prioritizes **security + transparency**, ensuring users not only shorten links—but also understand the risks behind them.

## 🤝 Contributing
Contributions are welcome! Feel free to fork the repo, open issues, and submit pull requests.

## ⭐ Support
If you find this project useful, consider giving it a ⭐ on GitHub!
