# Upjeet Baswan - Full-Stack Developer Portfolio

[![Portfolio Screenshot](https://img.shields.io/badge/Portfolio-Live-00f5ff?style=for-the-badge&logo=next.js&logoColor=white)](https://ub-portfolio-one.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-UB--666-black?style=for-the-badge&logo=github&logoColor=white)](https://github.com/UB-666)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)

A modern, responsive portfolio website built with Next.js 16, React 19, and Tailwind CSS 4. Features glassmorphism design, dark/light themes, interactive animations, and a fully functional contact form with hCaptcha protection.

🔗 **Live Demo**: [https://ub-portfolio-one.vercel.app/](https://ub-portfolio-one.vercel.app/)

## ✨ Features

### 🎨 **Design & UX**
- **Glassmorphism Design** - Modern frosted glass effects with beautiful gradients
- **Dark/Light Theme Toggle** - Smooth theme switching with liquid morph animations
- **Dynamic Island Navigation** - Apple-inspired navigation bar
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Smooth Animations** - Typing effects, floating elements, and parallax scrolling

### 🚀 **Technical Features**
- **Music Player** - Interactive vinyl record player with equalizer animation
- **hCaptcha Integration** - Secure contact form with bot protection
- **Interactive Timeline** - Creative experience and education timeline
- **Skills Showcase** - Animated skill proficiency bars
- **Project Cards** - Hover effects and detailed project information
- **Contact Form** - Functional form with validation and security

### ⚡ **Performance**
- **Next.js 16** - Latest React framework with App Router
- **React 19** - Latest React version with optimizations
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **Optimized Images** - AVIF/WebP formats for fast loading

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: Custom components with glassmorphism
- **Icons**: SVG icons
- **Animations**: CSS animations & transitions
- **Font**: Inter (Google Fonts)

### Backend & Services
- **Contact Form**: Web3Forms API
- **Security**: hCaptcha bot protection
- **Deployment**: Vercel (optimized)
- **Image Optimization**: Next.js Image component

### Development Tools
- **Package Manager**: pnpm
- **Linting**: ESLint 9 with Next.js config
- **Code Quality**: TypeScript strict mode
- **Config**: PostCSS, Tailwind CSS 4

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ 
- pnpm (recommended) or npm/yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/UB-666/UB-portfolio.git
   cd UB-portfolio
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Add your environment variables to `.env.local`:
   ```env
   # Contact Form (Web3Forms)
   NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=your_access_key_here
   
   # hCaptcha Keys
   NEXT_PUBLIC_HCAPTCHA_SITE_KEY=your_hcaptcha_site_key_here
   HCAPTCHA_SECRET_KEY=your_hcaptcha_secret_key_here
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
UB-portfolio/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles & animations
│   ├── icon.svg           # App icon
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page (main portfolio)
├── public/                # Static assets
│   ├── Profile.png        # Profile photo
│   ├── music-cover.png    # Music player cover
│   ├── Remontada.mp3      # Background music
│   ├── file.svg           # File icon
│   ├── globe.svg          # Globe icon
│   ├── next.svg           # Next.js logo
│   └── window.svg         # Window icon
├── .env.local.example     # Environment variables template
├── .gitignore            # Git ignore file
├── README.md             # This file
├── README-example.md     # Example README template
├── acli.exe              # CLI tool
├── eslint.config.mjs     # ESLint configuration
├── next.config.ts        # Next.js configuration
├── package.json          # Dependencies & scripts
├── pnpm-lock.yaml       # pnpm lock file
├── postcss.config.mjs    # PostCSS configuration
└── tsconfig.json         # TypeScript configuration
```

## 🎨 Customization

### Personal Information
Edit `app/page.tsx` to update:
- Name and title
- Contact information
- Social media links
- Project details
- Skills and experience
- Work history and education

### Styling
- **Colors**: Modify CSS variables in `app/globals.css`
- **Animations**: Update keyframes and animation classes
- **Theme**: Adjust dark/light theme styles in globals.css

### Content Sections
The portfolio includes these main sections:
1. **Hero** - Introduction with typing animation and CTA buttons
2. **About** - Personal background and key traits
3. **Experience** - Timeline of work experience and education
4. **Skills** - Technical skills with proficiency levels
5. **Projects** - Featured project showcase with details
6. **Contact** - Contact form with hCaptcha and contact information

### Metadata & SEO
Edit `app/layout.tsx` to update:
- Page title and description
- Keywords for SEO
- Open Graph metadata
- Author information

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/portfolio.git
   git push -u origin main
   ```
2. Go to [Vercel](https://vercel.com) and sign in with GitHub
3. Click "New Project" and import your repository
4. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`
   - `NEXT_PUBLIC_HCAPTCHA_SITE_KEY`
   - `HCAPTCHA_SECRET_KEY`
5. Click "Deploy" and wait for deployment to complete

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/UB-666/UB-portfolio)

### Other Platforms
```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

### Environment Variables for Production
Required environment variables:
- `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` - Your Web3Forms access key
- `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` - Your hCaptcha site key (public)
- `HCAPTCHA_SECRET_KEY` - Your hCaptcha secret key (private, server-side only)

## 🔧 Configuration

### Web3Forms Setup
1. Sign up at [Web3Forms](https://web3forms.com)
2. Create a new form or use your existing access key
3. Get your access key from the dashboard
4. Add it to `.env.local` file:
   ```env
   NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=your_access_key
   ```

### hCaptcha Setup
1. Create account at [hCaptcha](https://www.hcaptcha.com/)
2. Register your site:
   - Add your domain (or localhost for development)
   - Get your Site Key and Secret Key
3. Add keys to `.env.local` file:
   ```env
   NEXT_PUBLIC_HCAPTCHA_SITE_KEY=your_site_key
   HCAPTCHA_SECRET_KEY=your_secret_key
   ```

### Next.js Configuration
The `next.config.ts` includes:
- **React Strict Mode**: Enabled for development best practices
- **Image Optimization**: AVIF and WebP formats
- **Compression**: Gzip compression enabled
- **Security**: Powered-by header removed

## 📱 Features Breakdown

### Theme System
- **Dark Theme**: Default dark mode with glassmorphism effects
- **Light Theme**: Clean light mode with adjusted colors
- **Smooth Transitions**: Liquid morph effect between themes
- **Persistent Choice**: Theme preference saved in localStorage
- **System Integration**: Respects user's system preferences

### Navigation
- **Dynamic Island**: Modern navigation bar design inspired by Apple
- **Smooth Scrolling**: Animated section transitions
- **Mobile Responsive**: Optimized hamburger menu for mobile devices
- **Active Section**: Visual indicator showing current section
- **Sticky Header**: Navigation stays accessible while scrolling

### Animations
- **Loading Screen**: Professional loading animation on page load
- **Typing Effect**: Animated name typing on hero section
- **Floating Elements**: Parallax and floating animations throughout
- **Hover Effects**: Interactive hover states on cards and buttons
- **Music Player**: Spinning vinyl record with animated equalizer bars
- **Timeline**: Animated experience and education timeline

### Contact Form
- **Validation**: Client-side form validation
- **Security**: hCaptcha bot protection
- **Feedback**: Success/error messages
- **Responsive**: Mobile-optimized form layout

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - feel free to use this project for your own portfolio!

## 📞 Contact

**Upjeet Baswan**
- **Email**: upjeet1609@gmail.com
- **Phone**: +1 (289) 623-0071
- **Location**: Ontario, Canada
- **GitHub**: [@UB-666](https://github.com/UB-666)
- **Portfolio**: [https://ub-portfolio-one.vercel.app/](https://ub-portfolio-one.vercel.app/)

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Vercel** - For the excellent hosting platform
- **Tailwind CSS** - For the utility-first CSS framework
- **Web3Forms** - For the contact form service
- **hCaptcha** - For the security service
- **React Team** - For React 19 and continuous improvements

---

⭐ **Star this repository if it helped you build your portfolio!**

🚀 **Built with passion by Upjeet Baswan**
