'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import HCaptcha from '@hcaptcha/react-hcaptcha';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [skillsExpanded, setSkillsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [showCaptchaModal, setShowCaptchaModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const [isThemeTransitioning, setIsThemeTransitioning] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const captchaRef = useRef<HCaptcha>(null);

  useEffect(() => {
    setIsClient(true);
    
    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const increment = prev > 80 ? 5 : prev > 50 ? 4 : 3;
        return Math.min(prev + increment, 100);
      });
    }, 25);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    setMounted(true);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (loading) return;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
      document.documentElement.classList.toggle('light-theme', savedTheme === 'light');
    }

    const handleMouseMove = (e: MouseEvent) => {
      requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      });
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (mobileMenuOpen && !target.closest('nav')) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('click', handleClickOutside);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' }
    );

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
      observer.disconnect();
    };
  }, [mobileMenuOpen, loading]);

  const toggleTheme = () => {
    setIsThemeTransitioning(true);
    
    setTimeout(() => {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
      document.documentElement.classList.toggle('light-theme', !newTheme);
    }, 320);
    
    setTimeout(() => setIsThemeTransitioning(false), 800);
  };

  const smoothScrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      setActiveSection(sectionId);
      setMobileMenuOpen(false);
      
      const loadingOverlay = document.createElement('div');
      loadingOverlay.className = 'loading-transition-overlay';
      loadingOverlay.innerHTML = `
        <div class="loading-dots">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      `;
      document.body.appendChild(loadingOverlay);
      
      const mainContent = document.querySelector('.main-content') as HTMLElement;
      if (mainContent) {
        mainContent.style.filter = 'blur(8px)';
        mainContent.style.opacity = '0.7';
      }
      
      setTimeout(() => {
        const navbarHeight = 100;
        const targetPosition = section.offsetTop - navbarHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'auto'
        });
        
        setTimeout(() => {
          if (mainContent) {
            mainContent.style.transition = 'filter 0.4s ease-out, opacity 0.4s ease-out';
            mainContent.style.filter = '';
            mainContent.style.opacity = '';
          }
          
          loadingOverlay.classList.add('fade-out');
          setTimeout(() => {
            loadingOverlay.remove();
            if (mainContent) {
              mainContent.style.transition = '';
            }
          }, 300);
        }, 50);
      }, 400);
    }
  };

  const [stars] = useState(() => 
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 3,
      colorDelay: Math.random() * 8,
    }))
  );

  // Form handlers
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!captchaToken) {
      setShowCaptchaModal(true);
      return;
    }
    
    // Submit form with captcha token
    await submitForm();
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    setShowCaptchaModal(false);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: 'd74f3814-67c4-4c15-8edd-47ee98de71cc',
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          'h-captcha-response': captchaToken,
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ firstName: '', lastName: '', email: '', subject: '', message: '' });
        setCaptchaToken(null);
        captchaRef.current?.resetCaptcha();
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token);
    // Auto-submit form after captcha verification
    setTimeout(() => {
      submitForm();
    }, 500);
  };

  // Music player controls
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <>
      {/* Theme Transition Overlay - Liquid Morph Effect */}
      {isThemeTransitioning && (
        <div className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden">
          <div className="theme-morph-blob theme-morph-blob-1"></div>
          <div className="theme-morph-blob theme-morph-blob-2"></div>
          <div className="theme-morph-blob theme-morph-blob-3"></div>
          <div className="theme-morph-overlay"></div>
        </div>
      )}

      {/* Modern Loading Screen */}
      {loading && (
        <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center overflow-hidden">
          {/* Animated background grid */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
              animation: 'grid-move 20s linear infinite'
            }}></div>
          </div>

          {/* Gradient orb effects */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

          <div className="relative z-10 flex flex-col items-center justify-center gap-8">
            {/* Logo with reveal animation */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-50 animate-pulse"></div>
              <div className="relative px-8 py-6 bg-black/80 backdrop-blur-sm border border-cyan-500/30 rounded-3xl">
                <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-gradient-flow tracking-tight">
                  UB
                </h1>
              </div>
            </div>

            {/* Name reveal */}
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 animate-fade-in-up">
                Upjeet Baswan
              </h2>
              <p className="text-sm text-gray-400 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                Full-Stack Developer
              </p>
            </div>

            {/* Modern progress bar */}
            <div className="w-80 max-w-[90vw]">
              <div className="relative h-1 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
              </div>
              <div className="mt-3 flex justify-between items-center text-xs">
                <span className="text-gray-500">Loading...</span>
                <span className="text-cyan-400 font-mono font-bold">{loadingProgress}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Music Player Icon Button - Always Fixed Bottom Right */}
      {!showMusicPlayer && !loading && (
          <button
            onClick={() => setShowMusicPlayer(true)}
            className={`fixed bottom-4 sm:bottom-8 right-4 sm:right-8 z-[150] w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-2xl hover:scale-110 transition-all ${
              isPlaying ? 'music-playing-pulse' : ''
            }`}
          aria-label="Open music player"
        >
          <span className={`text-2xl ${isPlaying ? 'animate-bounce' : ''}`}>🎵</span>
          {isPlaying && (
            <>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-black"></div>
              <div className="absolute inset-0 rounded-full border-4 border-cyan-400 animate-ping"></div>
            </>
          )}
        </button>
      )}

        {/* Floating Music Player - Always Fixed Bottom Right */}
        {showMusicPlayer && !loading && (
        <div className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 z-[150] max-w-[calc(100vw-2rem)] sm:max-w-none">
          <div className="glass-strong rounded-2xl p-3 sm:p-4 border-2 border-cyan-400/30 shadow-2xl shadow-cyan-500/20 backdrop-blur-xl w-[280px] sm:w-[320px]">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
                <span className="text-xs font-semibold text-cyan-400">My Anthem</span>
              </div>
              <button
                onClick={() => setShowMusicPlayer(false)}
                className="w-6 h-6 rounded-full hover:bg-red-500/20 flex items-center justify-center transition-all"
                aria-label="Close player"
              >
                <span className="text-xs">✕</span>
              </button>
            </div>

            {/* Album Cover Animation */}
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <div className={`w-16 h-16 rounded-full overflow-hidden border-2 border-cyan-400/50 shadow-lg ${isPlaying ? 'animate-spin-vinyl' : ''}`}>
                  <Image
                    src="/music-cover.png"
                    alt="Remontada Cover"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                </div>
              </div>

              <div className="flex-1">
                <p className="text-sm font-bold text-white truncate">Remontada</p>
                <p className="text-xs text-gray-400">feat.Blanco, Kidwild</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 mb-3">
              {/* Play/Pause Button */}
              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center hover:scale-110 transition-transform shadow-lg group relative overflow-hidden"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {isPlaying ? (
                  <div className="flex gap-1 relative z-10">
                    <div className="w-1 h-4 bg-white rounded-full"></div>
                    <div className="w-1 h-4 bg-white rounded-full"></div>
                  </div>
                ) : (
                  <div className="relative z-10 ml-1">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 2L13 8L3 14V2Z" fill="white"/>
                    </svg>
                  </div>
                )}
              </button>

              {/* Volume Control */}
              <div className="flex-1 flex items-center gap-2">
                <div className="text-sm text-gray-300">
                  {volume === 0 ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 3L4 6H1v4h3l4 3V3z"/>
                      <line x1="11" y1="5" x2="15" y2="11" stroke="currentColor" strokeWidth="2"/>
                      <line x1="15" y1="5" x2="11" y2="11" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  ) : volume < 0.5 ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 3L4 6H1v4h3l4 3V3z"/>
                      <path d="M11 7c0 1.5-0.5 2-1 2.5" stroke="currentColor" strokeWidth="1" fill="none"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 3L4 6H1v4h3l4 3V3z"/>
                      <path d="M11 5c1 1 1.5 2 1.5 3s-0.5 2-1.5 3M12.5 3.5c2 1.5 2.5 3 2.5 4.5s-0.5 3-2.5 4.5" stroke="currentColor" strokeWidth="1" fill="none"/>
                    </svg>
                  )}
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="flex-1 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer slider"
                />
              </div>
            </div>

            {isPlaying && (
              <div className="flex items-end justify-center gap-1 h-8">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-gradient-to-t from-cyan-500 to-purple-500 rounded-full animate-equalizer"
                    style={{
                      animationDelay: `${i * 0.15}s`,
                      animationDuration: `${0.6 + (i % 3) * 0.2}s`
                    }}
                  ></div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dynamic Island Navigation - Always Visible */}
      {!loading && (
      <nav className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] w-full max-w-7xl px-1 sm:px-4 pt-2 sm:pt-4">
        <div
          className={`dynamic-island glass-navbar relative overflow-visible w-full sm:w-auto sm:mx-auto ${mounted ? 'island-animate' : 'opacity-0'}`}
          style={{
            borderRadius: '30px',
            boxShadow: scrolled
              ? '0 10px 40px rgba(0, 245, 255, 0.2), 0 0 80px rgba(123, 47, 247, 0.15)'
              : '0 8px 32px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
            {/* Logo & Brand - Always Visible */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative group cursor-pointer">
                {/* Outer glow ring */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                {/* Logo container */}
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center border border-cyan-400/30 group-hover:scale-110 transition-transform">
                  <span className="text-base sm:text-xl font-black text-white">
                    UB
                  </span>
                </div>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-xs sm:text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                  Upjeet Baswan
                </span>
                <span className="text-[10px] sm:text-xs text-gray-400 font-medium">
                  Full-Stack Developer
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-6">
              {['home', 'about', 'experience', 'skills', 'projects', 'contact'].map((section, index) => (
                <button
                  key={section}
                  onClick={(e) => {
                    e.preventDefault();
                    smoothScrollToSection(section);
                  }}
                  className={`text-xs uppercase tracking-wider transition-all hover:text-cyan-400 relative nav-item-animate whitespace-nowrap ${
                    activeSection === section ? 'text-cyan-400' : 'text-gray-400'
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {section}
                  {activeSection === section && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full nav-indicator-line"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Right Side: Desktop CTA + Theme + Mobile Menu */}
            <div className="flex items-center gap-2">
              {/* Desktop CTA Button */}
              <button 
                onClick={() => smoothScrollToSection('contact')}
                className="hidden lg:block px-4 md:px-6 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 active:scale-95 hover:scale-105 transition-all text-xs font-semibold whitespace-nowrap hover:shadow-lg hover:shadow-cyan-500/50"
                style={{ color: 'white' }}
              >
                Hire Me
              </button>

              {/* Theme Toggle Button */}
              <button 
                onClick={toggleTheme}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full glass-strong flex items-center justify-center hover:scale-110 transition-all border border-cyan-400/30 group"
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <span className="text-lg sm:text-xl group-hover:rotate-180 transition-transform duration-500 inline-block">🌙</span>
                ) : (
                  <span className="text-lg sm:text-xl group-hover:rotate-180 transition-transform duration-500 inline-block">☀️</span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden w-8 h-8 sm:w-10 sm:h-10 rounded-full glass flex items-center justify-center hover:scale-105 transition-transform"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <div className="flex flex-col gap-1">
                  <span className={`w-5 h-0.5 bg-cyan-400 transition-transform ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                  <span className={`w-5 h-0.5 bg-purple-500 transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`w-5 h-0.5 bg-pink-500 transition-transform ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-16 sm:top-20 left-0 right-0 mx-2 sm:mx-4 z-50">
            <div className="glass-navbar rounded-3xl p-4 sm:p-6 island-animate">
              <div className="flex flex-col gap-4">
                {['home', 'about', 'experience', 'skills', 'projects', 'contact'].map((section, index) => (
                  <button
                    key={section}
                    onClick={(e) => {
                      e.preventDefault();
                      smoothScrollToSection(section);
                    }}
                    className={`text-base uppercase tracking-wider transition-all hover:text-cyan-400 py-3 px-4 rounded-xl text-left ${
                      activeSection === section 
                        ? 'text-cyan-400 glass' 
                        : 'text-gray-400'
                    }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-center justify-between">
                      <span>{section}</span>
                      {activeSection === section && (
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 animate-pulse"></div>
                      )}
                    </div>
                  </button>
                ))}
                <button 
                  onClick={() => {
                    smoothScrollToSection('contact');
                    setMobileMenuOpen(false);
                  }}
                  className="mt-4 w-full py-3 px-6 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 active:scale-95 hover:scale-105 transition-all text-sm font-semibold hover:shadow-lg hover:shadow-cyan-500/50"
                  style={{ color: 'white' }}
                >
                  Hire Me
                </button>
              </div>
            </div>
          </div>
        )}

      </nav>
      )}

      {/* Main Content Container */}
      {!loading && (
      <div className="main-content min-h-screen text-white relative overflow-hidden bg-black transition-colors duration-300 animate-fade-in">
        
        {/* Animated star field background */}
      {mounted && (
        <div className="fixed inset-0 pointer-events-none z-0">
          {stars.map((star) => (
            <div
              key={star.id}
              className="star"
              style={{
                left: star.left,
                top: star.top,
                width: `${star.size}px`,
                height: `${star.size}px`,
                animationDelay: `${star.delay}s, ${star.colorDelay}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Gradient orbs with mouse parallax */}
      <div 
        className="fixed w-[600px] h-[600px] rounded-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(0,245,255,0.15) 0%, transparent 70%)',
          top: `${20 + mousePosition.y * 0.02}px`,
          left: `${10 + mousePosition.x * 0.02}px`,
          filter: 'blur(80px)',
        }}
      />
      <div 
        className="fixed w-[500px] h-[500px] rounded-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(123,47,247,0.15) 0%, transparent 70%)',
          top: `${mousePosition.y * 0.015}px`,
          right: `${10 + mousePosition.x * 0.015}px`,
          filter: 'blur(80px)',
        }}
      />
      <div 
        className="fixed w-[550px] h-[550px] rounded-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(245,22,126,0.12) 0%, transparent 70%)',
          bottom: `${20 - mousePosition.y * 0.01}px`,
          left: '50%',
          transform: 'translateX(-50%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center px-4 sm:px-6 pt-25 sm:pt-33 pb-8 relative">
        <div className="max-w-7xl w-full grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div className={`${mounted ? 'slide-in-left' : 'opacity-0'}`}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
              Hi, I&apos;m
              <br />
              <span className="text-shine typing-animation">Upjeet Baswan</span>
            </h1>
            <p className="text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                Full-Stack Developer
              </span>
            </p>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-6 sm:mb-8 leading-relaxed max-w-xl">
              I build small production web apps and reliable APIs, deploy them, and document how they work. I focus on maintainable code, reproducible deployments (Docker / CI), and clear demos.
            </p>
            <div className="flex gap-3 sm:gap-4 flex-wrap mb-6 sm:mb-8">
              <button 
                onClick={() => smoothScrollToSection('projects')}
                className="group relative px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:scale-105 transition-all font-semibold overflow-hidden text-sm sm:text-base"
              >
                <span className="relative z-10">View My Work</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
              <button 
                onClick={() => smoothScrollToSection('contact')}
                className="px-6 sm:px-8 py-3 sm:py-4 rounded-full glass-strong hover:scale-105 transition-transform font-semibold border border-cyan-400/30 text-sm sm:text-base"
              >
                Let&apos;s Talk
              </button>
            </div>
            <div className="flex gap-4 sm:gap-6">
              {[
                { name: 'GitHub', icon: '⚡', url: 'https://github.com/UB-666' },
                { name: 'LinkedIn', icon: '💼', url: 'https://linkedin.com' },
                { name: 'Email', icon: '📧', url: 'mailto:upjeet1609@gmail.com' },
                { name: 'Phone', icon: '📱', url: 'tel:+12896230071' },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.url}
            target="_blank"
            rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full glass-strong flex items-center justify-center hover:scale-110 hover:border-cyan-400 transition-all border border-transparent"
                  title={social.name}
                >
                  <span className="text-lg sm:text-xl">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>
          
          {/* 3D-like Card */}
          <div className={`relative ${mounted ? 'slide-in-right' : 'opacity-0'} mt-8 md:mt-0`}>
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-3xl rotate-6 blur-xl"></div>
              <div className="relative glass-strong rounded-3xl p-4 sm:p-6 md:p-8 float">
                <div className="aspect-square rounded-3xl bg-gradient-to-br from-cyan-500/10 to-purple-600/10 flex items-center justify-center overflow-hidden relative border-2 border-cyan-400/20">
                  {/* Profile Image */}
                  <div className="relative w-full h-full">
                    <Image 
                      src="/Profile.png"
                      alt="Upjeet Baswan"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  {/* Gradient overlay for better text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                  {/* Available for work badge */}
                  <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 right-4 sm:right-6 md:right-8">
                    <div className="glass-strong p-3 sm:p-4 rounded-xl backdrop-blur-md border border-cyan-400/30">
                      <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50"></div>
                        <span className="text-xs sm:text-sm text-gray-300 font-semibold">Available for work</span>
                      </div>
                      <p className="text-[10px] sm:text-xs text-gray-400">Let&apos;s build something amazing together</p>
                    </div>
                  </div>
                </div>
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
                  {[
                    { label: 'Projects', value: '10+' },
                    { label: 'Commits', value: '500+' },
                    { label: 'Skills', value: '15+' },
                  ].map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                        {stat.value}
                      </div>
                      <div className="text-[10px] sm:text-xs text-gray-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator - Down Arrow */}
        <div className="hidden sm:flex absolute bottom-10 left-1/2 -translate-x-1/2 flex-col items-center gap-3 cursor-pointer group animate-bounce-smooth">
          <span className="text-xs text-gray-400 group-hover:text-cyan-400 transition-colors font-medium tracking-wider">SCROLL DOWN</span>
          <div className="relative">
            {/* Glowing background */}
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500 to-purple-500 blur-lg opacity-50 group-hover:opacity-70 transition-opacity"></div>
            {/* Arrow icon */}
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="relative">
              <path d="M12 5V19M12 19L19 12M12 19L5 12" stroke="url(#arrowGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="arrowGradient" x1="12" y1="5" x2="12" y2="19" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#06b6d4"/>
                  <stop offset="100%" stopColor="#a855f7"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                About Me
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg px-4">
              Passionate about turning complex problems into simple, beautiful, and intuitive designs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {/* Main About Card */}
            <div className="glass-strong p-6 sm:p-8 md:p-10 rounded-3xl">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-cyan-400">Who I Am</h3>
              <p className="text-gray-300 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
                I&apos;m a full-stack developer with a Computer Programming diploma from Niagara College. 
                I build small production web apps and reliable APIs with React, Node.js, and PostgreSQL.
              </p>
              <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                I focus on maintainable code, reproducible deployments using Docker and CI, and clear documentation 
                so teams can validate my work quickly. Currently authorized to work in Canada and available immediately.
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {['Problem Solver', 'Quick Learner', 'Team Player', 'Detail-Oriented'].map((trait, index) => (
                  <span key={index} className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 text-xs sm:text-sm">
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience Highlights */}
            <div className="space-y-6">
              {[
                { icon: '🎓', title: 'Education', subtitle: 'Computer Programming', description: 'Niagara College, Toronto, 2022-2024', color: 'from-cyan-500 to-blue-500' },
                { icon: '💼', title: 'Status', subtitle: 'Available Immediately', description: 'Authorized to work in Canada', color: 'from-purple-500 to-pink-500' },
                { icon: '🏆', title: 'Experience', subtitle: 'Freelance & Open Source', description: 'Web apps, APIs & automation', color: 'from-pink-500 to-red-500' },
              ].map((item, index) => (
                <div key={index} className="glass-strong p-6 rounded-2xl hover:scale-105 transition-transform group">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold mb-1">{item.title}</h4>
                      <p className="text-cyan-400 text-sm mb-1">{item.subtitle}</p>
                      <p className="text-gray-400 text-sm">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '⚡', label: 'Fast Loading', desc: 'Optimized Performance' },
              { icon: '📱', label: 'Responsive', desc: 'Mobile First Design' },
              { icon: '🎨', label: 'Modern UI', desc: 'Beautiful Interfaces' },
              { icon: '🔒', label: 'Secure', desc: 'Best Practices' },
            ].map((feature, index) => (
              <div key={index} className="glass p-6 rounded-2xl text-center hover:scale-105 transition-transform">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h4 className="font-bold mb-1">{feature.label}</h4>
                <p className="text-xs text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience & Education Timeline */}
      <section id="experience" className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                Experience & Education
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg px-4">
              My professional journey and academic background
            </p>
          </div>

          {/* Creative Timeline - Thread Style */}
          <div className="relative md:mr-8 isolate">
            {/* Vertical timeline line on the right */}
            <div className="absolute right-0 md:right-6 top-0 bottom-0 w-1 overflow-visible -z-20">
              {/* Start Point - Top */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20">
                <div className="relative">
                  <div className="absolute inset-0 w-6 h-6 rounded-full bg-cyan-400/30 animate-ping"></div>
                  <div className="relative w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 border-2 border-black flex items-center justify-center shadow-lg shadow-cyan-400/50">
                    <span className="text-xs">🚀</span>
                  </div>
                </div>
              </div>
              
              {/* Timeline line - simple gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-500 via-purple-500 to-pink-500 rounded-full -z-20"></div>
              
              {/* Animated particle moving down the line */}
              <div className="absolute w-3 h-3 bg-cyan-400 rounded-full left-1/2 -translate-x-1/2 animate-timeline-particle shadow-lg shadow-cyan-400/50 -z-10"></div>
              
              {/* End Point - Bottom */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-20">
                <div className="relative">
                  <div className="absolute inset-0 w-6 h-6 rounded-full bg-pink-400/30 animate-ping"></div>
                  <div className="relative w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-red-600 border-2 border-black flex items-center justify-center shadow-lg shadow-pink-500/50">
                    <span className="text-xs">⭐</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-12 md:pr-20 pr-8">
              {[
                {
                  year: '2022 - 2024',
                  type: 'education',
                  title: 'Computer Programming Diploma',
                  company: 'Niagara College, Toronto',
                  description: 'Completed diploma program focused on full-stack development, databases, and software engineering. Built multiple web applications using React, Node.js, and PostgreSQL.',
                  color: 'purple'
                },
                {
                  year: '2019 - 2021',
                  type: 'education',
                  title: 'Non-Medical Education',
                  company: 'Doaba Arya School, India',
                  description: 'Completed secondary education with focus on science and mathematics, building foundation for technical studies.',
                  color: 'pink'
                },
                {
                  year: '2024 - Present',
                  type: 'work',
                  title: 'Freelance Web Developer',
                  company: 'Self-Employed',
                  description: 'Building client landing pages and small websites using React, Next.js, and Tailwind CSS. Creating automation scripts with Python (pandas) for CSV cleaning and data formatting. Managing simple server deployments on DigitalOcean.',
                  color: 'cyan'
                },
                {
                  year: '2023 - Present',
                  type: 'work',
                  title: 'Open Source Contributor',
                  company: 'GitHub Community',
                  description: 'Contributing to public repositories with documentation improvements, bug fixes, test additions, and feature PRs. Active on github.com/UB-666 with focus on web development projects.',
                  color: 'blue'
                },
              ].map((item, index) => (
                <div key={index} className="relative group isolate">
                  {/* Thread line connecting to timeline */}
                  <div className="absolute right-0 md:-right-20 top-12 w-12 md:w-20 h-0.5 thread-line-right z-0">
                    <div className={`absolute inset-0 bg-gradient-to-l from-${item.color}-400 to-${item.color}-500 opacity-50 group-hover:opacity-100 transition-all duration-500`}></div>
                    <div className={`absolute inset-0 bg-gradient-to-l from-${item.color}-400 to-${item.color}-500 blur-sm opacity-0 group-hover:opacity-70 transition-all duration-500`}></div>
                  </div>
                  
                  {/* Timeline node on the main line */}
                  <div className="absolute -right-8 md:-right-[4.5rem] top-8 z-20">
                    <div className="relative">
                      {/* Outer pulse ring */}
                      <div className={`absolute -inset-2 rounded-full bg-${item.color}-400/20 group-hover:bg-${item.color}-400/40 animate-ping group-hover:animate-none transition-all`}></div>
                      {/* Glow effect */}
                      <div className={`absolute -inset-1 rounded-full bg-gradient-to-br from-${item.color}-400 to-${item.color}-600 opacity-30 blur-md group-hover:opacity-60 transition-all duration-500`}></div>
                      {/* Main node with icon */}
                      <div className={`relative w-14 h-14 rounded-full bg-gradient-to-br ${item.type === 'work' ? 'from-cyan-400 via-blue-500 to-blue-600' : 'from-purple-400 via-pink-500 to-pink-600'} border-4 border-black flex items-center justify-center text-2xl shadow-xl group-hover:scale-110 transition-transform duration-500 cursor-pointer`}>
                        {item.type === 'work' ? '💼' : '🎓'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Content Card */}
                  <div className="glass-strong p-6 md:p-8 rounded-3xl hover:scale-[1.02] transition-all duration-500 group-hover:shadow-2xl relative overflow-hidden border-r-4 border-r-transparent group-hover:border-r-cyan-400 z-10"
                    style={{
                      backgroundColor: 'rgba(10, 10, 10, 0.6)'
                    }}
                  >
                    {/* Animated background gradient on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br from-${item.color}-500/10 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-5 flex-wrap">
                        <div className={`inline-flex items-center flex-shrink-0 px-5 py-2.5 rounded-full backdrop-blur-xl group-hover:scale-105 transition-transform duration-300 border relative ${
                          item.color === 'cyan' ? 'bg-gradient-to-r from-cyan-500/25 to-teal-500/25 border-cyan-400/50 light-theme:from-cyan-400/50 light-theme:to-teal-400/50 light-theme:border-cyan-500' :
                          item.color === 'purple' ? 'bg-gradient-to-r from-purple-500/25 to-violet-600/25 border-purple-400/50 light-theme:from-purple-400/50 light-theme:to-violet-400/50 light-theme:border-purple-500' :
                          item.color === 'blue' ? 'bg-gradient-to-r from-blue-500/25 to-indigo-600/25 border-blue-400/50 light-theme:from-blue-400/50 light-theme:to-indigo-400/50 light-theme:border-blue-500' :
                          'bg-gradient-to-r from-pink-500/25 to-rose-600/25 border-pink-400/50 light-theme:from-pink-400/50 light-theme:to-rose-400/50 light-theme:border-pink-500'
                        }`}
                          style={{
                            zIndex: 30
                          }}
                        >
                          <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 whitespace-nowrap light-theme:from-cyan-600 light-theme:to-purple-600">
                            {item.year}
                          </span>
                        </div>
                        <div className={`inline-flex items-center flex-shrink-0 px-4 py-2 rounded-full border text-xs font-semibold uppercase tracking-wider whitespace-nowrap relative backdrop-blur-xl ${
                          item.type === 'work' 
                            ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-400 border-cyan-400/50 light-theme:from-cyan-400/40 light-theme:to-teal-400/40 light-theme:text-cyan-700 light-theme:border-cyan-600' 
                            : 'bg-gradient-to-r from-purple-500/20 to-violet-500/20 text-purple-400 border-purple-400/50 light-theme:from-purple-400/40 light-theme:to-violet-400/40 light-theme:text-purple-700 light-theme:border-purple-600'
                        }`}
                          style={{ 
                            zIndex: 30
                          }}
                        >
                          {item.type === 'work' ? 'Work' : 'Education'}
                        </div>
                      </div>
                      
                      <h3 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-500 transition-all duration-300">
                        {item.title}
                      </h3>
                      
                      <p className={`text-${item.color}-400 mb-4 font-semibold text-lg flex items-center gap-2`}>
                        <span className="text-2xl">{item.type === 'work' ? '🏢' : '🎓'}</span>
                        {item.company}
                      </p>
                      
                      <p className="text-gray-300 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    
                    {/* Decorative floating particles */}
                    <div className={`absolute top-6 right-6 w-20 h-20 bg-gradient-to-br from-${item.color}-500/10 to-transparent rounded-full blur-2xl group-hover:scale-150 group-hover:rotate-90 transition-all duration-700`}></div>
                    <div className={`absolute bottom-6 left-6 w-16 h-16 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-xl group-hover:scale-125 transition-all duration-700`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="mt-16">
            <h3 className="text-3xl font-bold mb-8 text-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                Certifications & Courses
              </span>
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: '🌐', title: 'Responsive Web Design', issuer: 'freeCodeCamp' },
                { icon: '💻', title: 'JavaScript Algorithms', issuer: 'freeCodeCamp' },
                { icon: '🎓', title: 'Computer Programming', issuer: 'Niagara College' },
              ].map((cert, index) => (
                <div key={index} className="glass p-6 rounded-xl hover:scale-105 transition-transform text-center">
                  <div className="text-4xl mb-3">{cert.icon}</div>
                  <h4 className="font-bold mb-1">{cert.title}</h4>
                  <p className="text-sm text-gray-400">{cert.issuer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                Skills & Technologies
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg px-4">
              Technologies and tools I use to bring ideas to life
            </p>
          </div>

          {/* Skill Categories */}
          <div className="space-y-12">
            {/* Frontend */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-cyan-400">Frontend Development</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {[
                  { name: 'React', icon: '⚛️', level: 85, priority: true },
                  { name: 'Next.js', icon: '▲', level: 85, priority: true },
                  { name: 'JavaScript', icon: '📘', level: 90, priority: true },
                  { name: 'TypeScript', icon: '🔷', level: 75, priority: true },
                  { name: 'Tailwind CSS', icon: '🎨', level: 85, priority: true },
                  { name: 'HTML5', icon: '🌐', level: 90, priority: false },
                  { name: 'CSS3', icon: '🎭', level: 90, priority: false },
                ].filter(skill => skillsExpanded || skill.priority).map((skill, index) => (
                  <div key={index} className="glass-strong p-6 rounded-2xl hover:scale-110 transition-all group min-h-[200px] flex flex-col">
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform flex-shrink-0">{skill.icon}</div>
                    <h4 className="font-bold text-lg mb-2 flex-shrink-0">{skill.name}</h4>
                    <div className="relative pt-1 mt-auto">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400">Proficiency</span>
                        <span className="text-xs font-bold text-cyan-400">{skill.level}%</span>
                      </div>
                      <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-700">
                        <div 
                          style={{ width: mounted ? `${skill.level}%` : '0%' }} 
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-cyan-500 to-purple-600 transition-all duration-1000"
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Backend */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-purple-400">Backend Development</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[
                  { name: 'Node.js', icon: '🟢', level: 85, priority: true },
                  { name: 'Python', icon: '🐍', level: 85, priority: true },
                  { name: 'MongoDB', icon: '🍃', level: 85, priority: true },
                  { name: 'PostgreSQL', icon: '🐘', level: 85, priority: true },
                  { name: 'Express.js', icon: '⚡', level: 85, priority: false },
                  { name: 'SQL', icon: '💾', level: 85, priority: false },
                ].filter(skill => skillsExpanded || skill.priority).map((skill, index) => (
                  <div key={index} className="glass-strong p-6 rounded-2xl hover:scale-110 transition-all group min-h-[200px] flex flex-col">
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform flex-shrink-0">{skill.icon}</div>
                    <h4 className="font-bold text-lg mb-2 flex-shrink-0">{skill.name}</h4>
                    <div className="relative pt-1 mt-auto">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400">Proficiency</span>
                        <span className="text-xs font-bold text-purple-400">{skill.level}%</span>
                      </div>
                      <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-700">
                        <div 
                          style={{ width: mounted ? `${skill.level}%` : '0%' }} 
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-purple-500 to-pink-600 transition-all duration-1000"
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tools & Others */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-pink-400">Tools & Others</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[
                  { name: 'Git', icon: '📦', level: 85, priority: true },
                  { name: 'Docker', icon: '🐳', level: 70, priority: true },
                  { name: 'Linux', icon: '🐧', level: 85, priority: true },
                  { name: 'Figma', icon: '🎭', level: 85, priority: true },
                  { name: 'GitHub Actions', icon: '🔄', level: 70, priority: false },
                  { name: 'Postman', icon: '📮', level: 80, priority: false },
                  { name: 'Jest', icon: '🃏', level: 75, priority: false },
                  { name: 'DigitalOcean', icon: '🌊', level: 80, priority: false },
                ].filter(skill => skillsExpanded || skill.priority).map((skill, index) => (
                  <div key={index} className="glass-strong p-6 rounded-2xl hover:scale-110 transition-all group min-h-[200px] flex flex-col">
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform flex-shrink-0">{skill.icon}</div>
                    <h4 className="font-bold text-lg mb-2 flex-shrink-0">{skill.name}</h4>
                    <div className="relative pt-1 mt-auto">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400">Proficiency</span>
                        <span className="text-xs font-bold text-pink-400">{skill.level}%</span>
                      </div>
                      <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-700">
                        <div 
                          style={{ width: mounted ? `${skill.level}%` : '0%' }} 
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-pink-500 to-red-600 transition-all duration-1000"
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* See More Button */}
          <div className="text-center mt-12">
            <button 
              onClick={() => setSkillsExpanded(!skillsExpanded)}
              className="group relative px-8 py-4 rounded-full glass-strong hover:scale-105 transition-all font-semibold border-2 border-cyan-400/30 hover:border-cyan-400/60 flex items-center gap-3 mx-auto"
            >
              <span>{skillsExpanded ? 'Show Less' : 'See More Skills'}</span>
              <svg 
                className={`w-5 h-5 transition-transform duration-300 ${skillsExpanded ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-7xl w-full">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                Featured Projects
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg px-4">
              Some of my recent work and personal projects
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Tasker — Task Manager',
                description: 'Full-stack task manager with JWT authentication, role-based access control, and responsive UI. Containerized with Docker and includes integration tests and CI pipeline.',
                tags: ['React', 'Node.js', 'PostgreSQL'],
                gradient: 'from-cyan-500 to-blue-600',
                icon: '✅',
                github: 'https://github.com/UB-666/tasker'
              },
              {
                title: 'Inventory API',
                description: 'Robust REST API for product inventory with full CRUD, pagination, input validation, and comprehensive test coverage using Jest and Supertest.',
                tags: ['Express', 'PostgreSQL', 'Jest'],
                gradient: 'from-purple-500 to-pink-600',
                icon: '📦',
                github: 'https://github.com/UB-666/inventory-api'
              },
              {
                title: 'CSV Cleaner',
                description: 'CLI automation tool to normalize and deduplicate CSV data. Includes email normalization, whitespace trimming, and unit tests for edge cases.',
                tags: ['Python', 'pandas', 'pytest'],
                gradient: 'from-pink-500 to-red-600',
                icon: '🧹',
                github: 'https://github.com/UB-666/csv-cleaner'
              },
              {
                title: 'Landing Pages',
                description: 'Responsive client landing pages built with modern design principles. Features contact forms, animations, and mobile-first approach.',
                tags: ['HTML', 'CSS', 'JavaScript'],
                gradient: 'from-green-500 to-teal-600',
                icon: '🌐',
                github: 'https://github.com/UB-666'
              },
              {
                title: 'Automation Scripts',
                description: 'Python automation scripts for data processing tasks including CSV cleaning, data formatting, and report generation using pandas.',
                tags: ['Python', 'pandas', 'CLI'],
                gradient: 'from-yellow-500 to-orange-600',
                icon: '⚙️',
                github: 'https://github.com/UB-666'
              },
              {
                title: 'Open Source Contributions',
                description: 'Active contributor to public repositories with documentation improvements, bug fixes, test additions, and minor feature PRs.',
                tags: ['Various', 'Testing', 'Docs'],
                gradient: 'from-blue-500 to-indigo-600',
                icon: '🤝',
                github: 'https://github.com/UB-666'
              },
            ].map((project, index) => (
              <div 
                key={index}
                className="glass-strong rounded-3xl overflow-hidden hover:scale-105 transition-all group relative"
              >
                {/* Project Header with Icon */}
                <div className={`h-48 bg-gradient-to-br ${project.gradient} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="text-8xl relative z-10 group-hover:scale-110 transition-transform">
                    {project.icon}
                  </div>
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full glass text-xs font-bold">
                    Featured
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
                  <p className="text-gray-400 mb-4 leading-relaxed text-sm">
                    {project.description}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex gap-2 flex-wrap mb-4">
                    {project.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-400/30 text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <a 
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 px-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:scale-105 transition-transform text-sm font-semibold text-center"
                    >
                      View Project
                    </a>
                    <a 
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-4 rounded-full glass hover:scale-105 transition-transform text-sm font-semibold border border-cyan-400/30"
                    >
                      GitHub
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View More Button */}
          <div className="text-center mt-12">
            <button className="px-8 py-4 rounded-full glass-strong hover:scale-105 transition-transform font-semibold border-2 border-cyan-400/30">
              View All Projects →
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                Let&apos;s Work Together
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg px-4">
              Have a project in mind? Let&apos;s create something amazing together
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="glass-strong p-8 rounded-3xl">
                <h3 className="text-2xl font-bold mb-6 text-cyan-400">Contact Information</h3>
                
                {[
                  { icon: '📧', label: 'Email', value: 'upjeet1609@gmail.com', link: 'mailto:upjeet1609@gmail.com' },
                  { icon: '📱', label: 'Phone', value: '+1 (289) 623-0071', link: 'tel:+12896230071' },
                  { icon: '📍', label: 'Location', value: 'Ontario, Canada', link: null },
                ].map((item, index) => (
                  <div key={index} className="mb-6 last:mb-0">
                    {item.link ? (
                      <a href={item.link} className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-all group">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-400 mb-1">{item.label}</p>
                          <p className="font-semibold group-hover:text-cyan-400 transition-colors">{item.value}</p>
                        </div>
                      </a>
                    ) : (
                      <div className="flex items-start gap-4 p-4 rounded-xl">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-2xl flex-shrink-0">
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-400 mb-1">{item.label}</p>
                          <p className="font-semibold">{item.value}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="glass-strong p-8 rounded-3xl">
                <h3 className="text-xl font-bold mb-6">Follow Me</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: 'GitHub', icon: '⚡', url: 'https://github.com/UB-666', color: 'from-gray-500 to-gray-700' },
                    { name: 'LinkedIn', icon: '💼', url: 'https://linkedin.com', color: 'from-blue-500 to-blue-700' },
                    { name: 'Email', icon: '📧', url: 'mailto:upjeet1609@gmail.com', color: 'from-cyan-500 to-blue-500' },
                    { name: 'Resume', icon: '📄', url: '#contact', color: 'from-pink-500 to-purple-500' },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
            target="_blank"
            rel="noopener noreferrer"
                      className="glass p-4 rounded-xl hover:scale-105 transition-all text-center group"
                    >
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{social.icon}</div>
                      <p className="text-sm font-semibold">{social.name}</p>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="glass-strong p-8 rounded-3xl">
              <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-400">First Name</label>
                    <input 
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleFormChange}
                      required
                      className="w-full glass px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-white placeholder-gray-500"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-400">Last Name</label>
                    <input 
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleFormChange}
                      required
                      className="w-full glass px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-white placeholder-gray-500"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-400">Email</label>
                  <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                    className="w-full glass px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-white placeholder-gray-500"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-400">Subject</label>
                  <input 
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleFormChange}
                    required
                    className="w-full glass px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-white placeholder-gray-500"
                    placeholder="Project Discussion"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-400">Message</label>
                  <textarea 
                    rows={5}
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    required
                    className="w-full glass px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all resize-none text-white placeholder-gray-500"
                    placeholder="Tell me about your project..."
                  ></textarea>
                </div>
                
                {submitStatus === 'success' && (
                  <div className="p-4 rounded-xl bg-green-500/20 border border-green-500/50 text-green-400">
                    ✅ Message sent successfully! I&apos;ll get back to you soon.
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-400">
                    ❌ Failed to send message. Please try again or email me directly at upjeet1609@gmail.com
                  </div>
                )}
                
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending... 📤' : 'Send Message 🚀'}
                </button>
              </form>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {[
              { icon: '🚀', label: 'Projects Built', value: '10+' },
              { icon: '💻', label: 'Technologies', value: '15+' },
              { icon: '☕', label: 'Cups of Coffee', value: '500+' },
              { icon: '⭐', label: 'GitHub Repos', value: '20+' },
            ].map((stat, index) => (
              <div key={index} className="glass p-6 rounded-2xl text-center hover:scale-105 transition-transform">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-1">
                  {stat.value}
                </div>
                <p className="text-xs text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

        {/* hCaptcha Modal Popup */}
        {showCaptchaModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setShowCaptchaModal(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative z-10 glass-strong p-8 rounded-3xl max-w-md w-full border-2 border-cyan-400/30 animate-scale-in">
            {/* Close Button */}
            <button
              onClick={() => setShowCaptchaModal(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full glass hover:bg-red-500/20 flex items-center justify-center transition-all hover:scale-110"
              aria-label="Close"
            >
              <span className="text-2xl">✕</span>
            </button>
            
            {/* Modal Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-3xl">
                🛡️
              </div>
              <h3 className="text-2xl font-bold mb-2">Security Verification</h3>
              <p className="text-gray-400 text-sm">Please verify you&apos;re human to send your message</p>
            </div>
            
            {/* hCaptcha Widget */}
            <div className="flex justify-center mb-4">
              <HCaptcha
                ref={captchaRef}
                sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || ""}
                onVerify={handleCaptchaVerify}
                onExpire={() => setCaptchaToken(null)}
                theme="dark"
                reCaptchaCompat={false}
              />
            </div>
            
            <p className="text-xs text-gray-500 text-center">
              Protected by hCaptcha
            </p>
          </div>
        </div>
      )}

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src="/Remontada.mp3"
        loop
        onEnded={() => setIsPlaying(false)}
      />

      {/* Footer */}
      <footer className="relative mt-20 overflow-hidden">
        {/* Gradient line separator */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent mb-8"></div>
        
        {/* Background gradient orbs */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>
        
        <div className="glass-strong py-12 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              
              {/* Left - Brand with glow effect */}
              <div className="flex items-center gap-4 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center border border-cyan-400/30 group-hover:scale-110 transition-transform cursor-pointer">
                    <span className="text-xl font-black text-white">UB</span>
                  </div>
                </div>
                <div>
                  <p className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                    Upjeet Baswan
                  </p>
                  <p className="text-xs text-gray-400">Full-Stack Developer</p>
                </div>
              </div>

              {/* Center - Social Links with individual gradients */}
              <div className="flex gap-4">
                {[
                  { icon: '⚡', url: 'https://github.com/UB-666', name: 'GitHub', gradient: 'from-gray-500 to-gray-700' },
                  { icon: '💼', url: 'https://linkedin.com', name: 'LinkedIn', gradient: 'from-blue-500 to-blue-600' },
                  { icon: '📧', url: 'mailto:upjeet1609@gmail.com', name: 'Email', gradient: 'from-red-500 to-pink-500' },
                  { icon: '📱', url: 'tel:+12896230071', name: 'Phone', gradient: 'from-green-500 to-emerald-600' },
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative w-12 h-12 rounded-xl glass flex items-center justify-center hover:scale-110 transition-all duration-300"
                    title={social.name}
                  >
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${social.gradient} opacity-0 group-hover:opacity-30 transition-opacity blur-sm`}></div>
                    <div className={`absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-cyan-400 transition-colors`}></div>
                    <span className="text-xl relative z-10 group-hover:scale-110 transition-transform">{social.icon}</span>
                  </a>
                ))}
              </div>

              {/* Right - Copyright with heart animation */}
              <div className="text-center md:text-right">
                <p className="text-sm text-gray-300 mb-1 flex items-center gap-2 justify-center md:justify-end">
                  <span>© 2024 Upjeet Baswan</span>
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1 justify-center md:justify-end">
                  <span>All Rights Reserved</span>
                  <span className="text-red-500 inline-block hover:scale-125 transition-transform cursor-pointer">✌️</span>
                </p>
              </div>
            </div>
            
            {/* Bottom tech stack tags */}
            <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap items-center justify-center gap-2">
              {['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js'].map((tech, i) => (
                <span 
                  key={i} 
                  className="px-3 py-1 text-xs rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-400/20 text-gray-400 hover:text-cyan-400 hover:border-cyan-400/50 transition-all cursor-default"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
      </div>
      )}
    </>
  );
}
