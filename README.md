# 🚀 Modern Portfolio Website - Jacob Kuriakose

A cutting-edge, cinematic portfolio website built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion. Features Apple Vision Pro-style animations, recruiter mode, neural UI effects, and a stunning cyberpunk aesthetic with dark/light mode support.

![Portfolio Preview](https://via.placeholder.com/1200x600/8b5cf6/ffffff?text=Portfolio+Website)

## ✨ Features

### 🎨 Core Features
- **Modern Design** - Clean, minimalist interface with glassmorphism effects and cyberpunk aesthetics
- **Dark/Light Mode** - Seamless theme switching with system preference detection and localStorage persistence
- **Scroll Progress Indicator** - Thin neon gradient bar (#8A2BE2 → #00CFFF) at top with subtle glow, smooth updates
- **Skills Visualization** - Animated horizontal progress bars for each skill category with neon colors
- **Smooth Animations** - Lightweight IntersectionObserver-based animations with GPU acceleration
- **Fully Responsive** - Works perfectly on all devices and screen sizes
- **Active Section Highlighting** - Smart navbar that highlights current section in viewport
- **Interactive Project Cards** - Click to view detailed project information in modals with loader animations
- **Lazy Loading** - All project images load lazily for optimal performance
- **Timeline Layout** - Beautiful timeline design for experience and education
- **Contact Form** - Cinematic transmission uplink experience with EmailJS integration
- **Blog Section** - Markdown-ready blog section structure
- **Accessible** - Built with accessibility best practices and `prefers-reduced-motion` support
- **Performance Optimized** - Fast loading times, smooth interactions, reduced GPU usage, and optimized animations
- **SEO Friendly** - Proper meta tags, Open Graph tags, and semantic HTML

### 🎯 Advanced Features

#### 🍎 Apple Vision Pro-Style Scroll Transitions
- **Spatial Lift Animations** - Sections glide upward with depth and scale
- **Blur-to-Focus Effect** - Gaussian blur fade-out to crisp focus
- **Ambient Glow** - Subtle purple/cyan glow envelopes on scroll
- **Light Sweep** - Horizontal gradient bar sweeps across sections
- **Parallax Depth** - Multi-layer parallax effects for immersive feel

#### ✨ Volumetric Light Beams & Bokeh Particles
- **Volumetric Light Beams** - VisionOS-style glass-light beams behind section cards
- **Bokeh Particle Field** - Soft floating bokeh circles with smooth drift and parallax
- **Dynamic Depth** - Light beams and particles respond to scroll and mouse movement
- **GPU-Optimized** - Canvas-based rendering with smooth 60fps animations

#### 🎮 Interactive Effects
- **Magnetic Cursor** - Buttons and cards gently pull toward cursor
- **Parallax Tilt** - 3D tilt effect on hover for cards and buttons
- **Click Ripple** - Soft glow ripple on click interactions
- **Neural UI Elements** - Cyberpunk-style interface components

#### 📄 Resume Download System
- **Three Access Points** - Navbar icon, Hero button, and Footer link
- **Cinematic Micro-interactions** - Toast notifications and pulse animations
- **Success Badge** - "Secure PDF delivered" confirmation
- **Mobile Optimized** - Works seamlessly on all devices

#### 🎯 Recruiter Mode
- **Auto-Activation** - Detects visitors from LinkedIn, Indeed, Wellfound, ZipRecruiter, Glassdoor
- **URL Parameter** - Activate via `?recruiter=true`
- **Keyboard Shortcut** - Press `Shift+R` to toggle
- **Easter Egg** - Click name 5 times fast
- **Quick Facts Bar** - Location, work eligibility, graduation date
- **Enhanced Experience Cards** - Brighter glow and highlight for recruiters
- **Footer Toggle** - Manual toggle button in footer

#### 📧 Contact Transmission Experience
- **Uplink Boot Sequence** - Cinematic neural uplink animation
- **Secure Channel** - Typewriter-style boot text with scan line
- **Form Reveal** - Smooth slide-up and fade-in animation
- **Transmission Shock** - Haptic-style shock pulse on successful send
- **Neon Scan Line** - Vertical sweep effect during transmission

#### 🎬 Cinematic Animations
- **Shockwave Effects** - Smooth camera shake and glow pulse on interactions
- **Neon Pulse** - Subtle glow animations throughout the interface
- **Scroll Progress Indicator** - Enhanced neon gradient progress bar (#8A2BE2 → #00CFFF) with glow effect
- **Skills Progress Bars** - Animated horizontal bars showing skill proficiency with neon gradient fills
- **Section Transitions** - Immersive spatial transitions between sections

#### 🚀 Performance Enhancements
- **Lazy Loading** - All project images use native `loading="lazy"` attribute
- **Optimized Animations** - Replaced heavy Framer Motion scroll triggers with lightweight IntersectionObserver
- **Reduced GPU Usage** - Replaced blur filters with CSS gradients where possible
- **Event-Based Effects** - Volumetric light beams and particles only render when needed
- **Throttled Updates** - Scroll progress and animations use requestAnimationFrame throttling
- **Smart will-change** - Only applied to actively animating elements

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) with App Router
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Theme:** [next-themes](https://github.com/pacocoursey/next-themes)
- **Email Service:** [EmailJS](https://www.emailjs.com/) (ready to integrate)
- **Markdown:** [react-markdown](https://github.com/remarkjs/react-markdown) with [remark-gfm](https://github.com/remarkjs/remark-gfm)

## 📦 Installation

### Prerequisites

- **Node.js** 18+ installed
- **npm**, **yarn**, or **pnpm** package manager

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/portfolio.git
   cd portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Configuration

### Update Your Information

Edit `src/config/resume-data.ts` with your personal information:

```typescript
export const resumeData: ResumeData = {
  personal: {
    name: "Your Name",
    title: "Your Title",
    tagline: "Your Tagline",
    email: "your.email@example.com",
    phone: "+1 (555) 123-4567",
    location: "Your Location",
    bio: "Your bio...",
    avatar: "/assets/avatar/avatar.png"
  },
  // ... update other sections
}
```

**Sections to update:**
- ✅ Personal information
- ✅ Social media links
- ✅ Skills (grouped by categories)
- ✅ Work experience
- ✅ Education
- ✅ Projects
- ✅ Certifications (optional)
- ✅ Blog posts (optional)

### Add Your Assets

1. **Profile Picture:** Add to `public/assets/avatar/avatar.png`
2. **Project Images:** Add to `public/assets/projects/`
3. **Certification Logos:** Add to `public/assets/certs/`
4. **Resume PDF:** Add to `public/Jacob-Kuriakose-Resume.pdf` (or update path in components)
5. **Favicon:** Replace `public/favicon.ico` with your own

### EmailJS Setup (Optional)

1. **Sign up at [EmailJS](https://www.emailjs.com/)**

2. **Create an email service and template**

3. **Update `src/components/Contact.tsx`:**
   ```typescript
   // Add your EmailJS credentials
   const SERVICE_ID = 'YOUR_SERVICE_ID';
   const TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
   const PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
   ```

## 🎨 Customization

### Colors

Customize the color scheme in `src/app/globals.css`:

```css
:root {
  --primary: 262 83% 58%;        /* Purple */
  --secondary: 210 40% 96.1%;    /* Light gray */
  /* ... other colors */
}

.dark {
  --primary: 263 70% 65%;        /* Lighter purple for dark mode */
  /* ... other colors */
}
```

### Animations

Adjust animation speeds and effects in `src/app/globals.css`:

```css
@keyframes visionLiftIn {
  /* Customize animation timing */
}

@keyframes recruiterBadgePulse {
  /* Adjust pulse speed */
}
```

### Recruiter Mode

Configure recruiter detection in `src/hooks/useRecruiterMode.ts`:

```typescript
const RECRUITER_REFERRERS = [
  "linkedin",
  "indeed",
  "wellfound",
  // Add more referrers
];
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push your code to GitHub**

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your repository
   - Click "Deploy"

3. **Configure environment variables** (if using EmailJS):
   - Add `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
   - Add `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`
   - Add `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`

4. **Configure domain (optional):**
   - Add your custom domain in Vercel settings

### Deploy to Netlify

1. **Push your code to GitHub**

2. **Deploy on Netlify:**
   - Go to [netlify.com](https://www.netlify.com)
   - Click "New site from Git"
   - Select your repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`

### Build for Production

```bash
npm run build
npm run start
```

## 📁 Project Structure

```
Portfolio/
├── public/
│   ├── assets/
│   │   ├── avatar/
│   │   │   └── avatar.png
│   │   ├── projects/          # Project images
│   │   └── certs/            # Certification logos
│   ├── favicon.ico
│   └── Jacob-Kuriakose-Resume.pdf
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout with metadata
│   │   ├── page.tsx             # Main page with sections
│   │   └── globals.css          # Global styles & animations
│   ├── components/
│   │   ├── Navbar.tsx           # Navigation with section highlighting
│   │   ├── Hero.tsx             # Hero section with recruiter mode
│   │   ├── About.tsx            # About section
│   │   ├── Skills.tsx           # Skills section
│   │   ├── Experience.tsx        # Experience & education timeline
│   │   ├── Projects.tsx         # Projects with modals
│   │   ├── Certifications.tsx   # Certifications section
│   │   ├── Blog.tsx             # Blog section (optional)
│   │   ├── Contact.tsx          # Contact form with uplink experience
│   │   ├── Footer.tsx           # Footer with recruiter toggle
│   │   ├── VisionSection.tsx    # Vision Pro-style wrapper
│   │   ├── VolumetricLight.tsx  # Light beam effects
│   │   ├── BokehField.tsx       # Bokeh particle field
│   │   ├── MagneticEffects.tsx  # Magnetic cursor effects
│   │   ├── DownloadToast.tsx    # Toast notifications
│   │   └── RecruiterToast.tsx   # Recruiter mode toast
│   ├── hooks/
│   │   ├── useRecruiterMode.ts  # Recruiter mode logic
│   │   ├── useResumeDownload.ts # Resume download logic
│   │   ├── useVisionScroll.ts   # Vision Pro scroll animations
│   │   ├── useMagneticTilt.ts   # Magnetic tilt effects
│   │   └── useScrollReveal.ts   # Scroll reveal animations
│   ├── config/
│   │   └── resume-data.ts       # Your data configuration
│   └── utils/
│       └── ripple.ts            # Click ripple utility
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

## 🎯 Key Features Explained

### Recruiter Mode

Recruiter Mode automatically activates when:
- Visitor arrives from LinkedIn, Indeed, Wellfound, ZipRecruiter, or Glassdoor
- URL contains `?recruiter=true`
- User presses `Shift+R`
- User clicks name 5 times fast (Easter egg)

When active:
- Shows "Recruiter Mode Active" badge
- Displays quick facts (location, work eligibility, graduation)
- Highlights experience cards with brighter glow
- Shows resume download CTA prominently
- Persists state in localStorage

### Contact Transmission Experience

The contact form features a cinematic "Neural Transmission Uplink" experience:
1. **Boot Sequence** - Typewriter text with scan line animation
2. **Form Reveal** - Smooth slide-up and fade-in
3. **Transmission** - On send, triggers haptic shockwave effect
4. **Success** - Cinematic confirmation with animations

### Vision Pro-Style Animations

Sections use Apple Vision Pro-inspired transitions:
- Spatial lift with depth
- Blur-to-focus transition
- Ambient glow effects
- Light sweep animations
- Parallax depth layers

## 🎯 SEO Optimization

The site includes:
- ✅ Meta tags
- ✅ Open Graph tags for social sharing
- ✅ Twitter Card tags
- ✅ Semantic HTML
- ✅ Alt tags for images (add to your images)
- ✅ Proper heading hierarchy
- ✅ Structured data ready

Update SEO in `src/app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: "Jacob Kuriakose - Data Scientist & ML Engineer",
  description: "Portfolio of Jacob Kuriakose...",
  // ... other metadata
}
```

## 🐛 Troubleshooting

### Issue: Animations not working
- Ensure Framer Motion is properly installed: `npm install framer-motion`
- Check browser console for errors
- Verify `prefers-reduced-motion` is not enabled

### Issue: Theme not switching
- Clear browser cache and cookies
- Check if JavaScript is enabled
- Verify `next-themes` is installed

### Issue: Build errors
- Delete `node_modules` and `.next` folders
- Run `npm install` again
- Try `npm run build` to see specific errors
- Check TypeScript errors: `npm run lint`

### Issue: Resume download not working
- Verify `public/Jacob-Kuriakose-Resume.pdf` exists
- Check file name matches exactly (case-sensitive)
- Ensure file is not corrupted

### Issue: Recruiter Mode not activating
- Check browser console for errors
- Verify localStorage is enabled
- Test with `?recruiter=true` in URL

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [EmailJS Documentation](https://www.emailjs.com/docs/)

## 🎓 Performance Tips

1. **Optimize Images** - Use Next.js Image component for all images
2. **Lazy Load** - Components load only when in viewport
3. **Code Splitting** - Automatic with Next.js App Router
4. **GPU Acceleration** - All animations use `transform3d` and `will-change`
5. **Reduced Motion** - Respects `prefers-reduced-motion` for accessibility

## 🤝 Contributing

This is a personal portfolio template. Feel free to:
- Fork the project
- Customize for your own use
- Submit issues for bugs
- Suggest improvements

## 📄 License

MIT License - feel free to use this for your own portfolio!

## 🙏 Acknowledgments

Built with modern web technologies and best practices:
- Next.js 14 App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Framer Motion for animations
- Inspired by Apple Vision Pro UI design

---

**Need help?** Open an issue or reach out!

Made with ❤️ by [Jacob Kuriakose](https://github.com/jacobjk03)

---

## 🔥 Quick Start Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

## 📞 Contact

- **Email:** jkuriak3@asu.edu
- **LinkedIn:** [linkedin.com/in/jacob-kuriakose](https://linkedin.com/in/jacob-kuriakose)
- **GitHub:** [github.com/jacobjk03](https://github.com/jacobjk03)
- **Website:** [jacobkuriakose.com](https://jacobkuriakose.com)
