# Upjeet Baswan - Portfolio Website

A modern, full-stack developer portfolio featuring smooth animations, theme switching, and interactive components. Built with Next.js 16 and React 19.

🔗 **Live Demo**:[Click Me](https://ub-portfolio-one.vercel.app/)

## 🚀 Features

- ⚡ Built with Next.js 16 (Turbopack) and React 19
- 🎨 Modern glassmorphism design
- 🌓 Dark/Light theme with smooth liquid morph transitions
- 🎭 Beautiful animations and interactive elements
- 📱 Fully responsive design
- 🔒 Secure with environment variables
- 🤖 hCaptcha bot protection on contact form
- 🎵 Music player integration
- ♿ Accessible and SEO optimized

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI**: Custom glassmorphism components
- **Security**: hCaptcha integration
- **Deployment**: Optimized for Vercel

## 📦 Installation

1. **Clone the repository**:
```bash
git clone https://github.com/UB-666/UB-portfolio.git
cd UB-portfolio
```

2. **Install dependencies**:
```bash
pnpm install
# or
npm install
# or
yarn install
```

3. **Set up environment variables**:
```bash
cp .env.local.example .env.local
```

4. **Edit `.env.local` and add your keys**:
```env
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=your_site_key_here
HCAPTCHA_SECRET_KEY=your_secret_key_here
```

5. **Run development server**:
```bash
pnpm dev
# or
npm run dev
```

6. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## 🔐 Environment Variables

Get your hCaptcha keys:
1. Sign up at [hCaptcha](https://www.hcaptcha.com/)
2. Create a new site
3. Copy your Site Key and Secret Key
4. Add them to `.env.local`

Required variables:
- `NEXT_PUBLIC_HCAPTCHA_SITE_KEY`: Your hCaptcha site key (public)
- `HCAPTCHA_SECRET_KEY`: Your hCaptcha secret key (private)

## 🏗️ Build for Production

```bash
pnpm build
# or
npm run build
```

Start production server:
```bash
pnpm start
# or
npm start
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_HCAPTCHA_SITE_KEY`
   - `HCAPTCHA_SECRET_KEY`
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/UB-666/UB-portfolio)

### Other Platforms

Set the same environment variables in your platform's dashboard (Netlify, Railway, etc.)

## 📁 Project Structure

```
UB-portfolio/
├── app/
│   ├── globals.css          # Global styles and animations
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Main portfolio page
├── public/
│   ├── music-cover.png      # Music player cover
│   ├── Profile.png          # Profile image
│   ├── Remontada.mp3        # Background music
│   └── ...                  # Other assets
├── .env.local.example       # Environment variables template
├── .gitignore              # Git ignore rules
├── next.config.ts          # Next.js configuration
├── package.json            # Dependencies
├── SECURITY.md             # Security policy
└── README.md               # This file
```

## ✨ Key Features

### Theme Switching
- Smooth liquid morph transition effect
- Persistent theme preference (localStorage)
- Optimized for both dark and light modes

### Interactive Components
- Animated navigation with smooth scrolling
- Timeline for experience and education
- Skills showcase with hover effects
- Project cards with glassmorphism design
- Contact form with validation

### Performance
- Optimized images (AVIF/WebP)
- Gzip compression enabled
- Fast page loads with Next.js
- SEO optimized

## 🔒 Security

See [SECURITY.md](SECURITY.md) for security policy and vulnerability reporting.

## 📄 License

MIT License - feel free to use this project for your own portfolio!

## 👨‍💻 Author

**Upjeet Baswan**
- Full-Stack Developer
- Available for work in Canada
- GitHub: [@UB-666](https://github.com/UB-666)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⭐ Show Your Support

Give a ⭐️ if you like this project!

---

Built with ❤️ by Upjeet Baswan
