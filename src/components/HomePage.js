import React from 'react';
import { ArrowRight } from 'lucide-react';
import GradientText from './GradientText';
import TextType from './TextType';
import CardSwap, { Card } from './CardSwap';
import FadeContent from './FadeContent';
import SplitText from './SplitText';
import LogoLoop from './LogoLoop';
import './HomePage.css';

const STATS = [
  { value: '95%+', label: 'Detection Accuracy' },
  { value: 'Instant', label: 'Real-Time Processing' },
  { value: 'Multi-Model', label: 'AI & Deepfake Support' }
];

const TECH_LOGOS = [
  { id: 'keras',      src: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Keras_logo.svg',         alt: 'Keras',      title: 'Keras',      href: 'https://keras.io' },
  { id: 'pytorch',    src: 'https://upload.wikimedia.org/wikipedia/commons/1/10/PyTorch_logo_icon.svg',   alt: 'PyTorch',    title: 'PyTorch',    href: 'https://pytorch.org' },
  { id: 'fastapi',    src: 'https://cdn.worldvectorlogo.com/logos/fastapi.svg',                           alt: 'FastAPI',    title: 'FastAPI',    href: 'https://fastapi.tiangolo.com' },
  { id: 'matplotlib', src: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Matplotlib_icon.svg',     alt: 'Matplotlib', title: 'Matplotlib', href: 'https://matplotlib.org' },
  { id: 'numpy',      src: 'https://upload.wikimedia.org/wikipedia/commons/3/31/NumPy_logo_2020.svg',     alt: 'NumPy',      title: 'NumPy',      href: 'https://numpy.org' },
];

export default function HomePage() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px', position: 'relative', zIndex: 1 }}>

      {/* Hero Header Section */}
      <div className="hero-container">

        {/* Left Side: Text and CTA Content */}
        <div className="hero-left">

          <h1 className="hero-title">
            <GradientText
              colors={["#5227FF", "#FF9FFC", "#B497CF"]}
              animationSpeed={8}
              showBorder={false}
            >
              <SplitText
                text="Detect image manipulation with AI"
                delay={30}
                duration={1.2}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 30 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="inherit"
                tag="span"
              />
            </GradientText>
          </h1>

          <SplitText
            text="Advanced deep learning technology that instantly analyzes images and identifies AI-generated, edited, deepfake, or manipulated content in seconds."
            className="hero-description"
            delay={15}
            duration={1.0}
            ease="power2.out"
            splitType="words"
            from={{ opacity: 0, y: 20 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="inherit"
            tag="p"
          />

          {/* CTA Buttons */}
          <div className="hero-ctas">
            <FadeContent blur={true} duration={1000} ease="power2.out" initialOpacity={0}>
              <button
                className="cyber-btn"
                style={{ padding: '14px 28px', fontSize: '0.95rem', cursor: 'pointer' }}
                onClick={() => {
                  document.dispatchEvent(
                    new CustomEvent('openMenuAndExpand', { detail: { label: 'Analyze' } })
                  );
                }}
              >
                Analyze Image <ArrowRight size={18} />
              </button>
            </FadeContent>
            <FadeContent blur={true} duration={1000} ease="power2.out" initialOpacity={0}>
              <a href="#/features" className="cyber-btn cyber-btn-secondary" style={{ padding: '14px 28px', fontSize: '0.95rem' }}>
                Learn More
              </a>
            </FadeContent>
          </div>

          {/* Dynamic capability typing indicator */}
          <div className="hero-typing">
            <span style={{ color: 'var(--accent-cyan)', opacity: 0.7 }}>›</span>
            <TextType
              text={[
                'Detecting GAN artifacts in portraits',
                'Analyzing EXIF metadata signatures',
                'Scanning for ELA compression mismatches',
                'Verifying PRNU sensor fingerprints',
                'Identifying deepfake neural patterns'
              ]}
              typingSpeed={55}
              deletingSpeed={35}
              pauseDuration={2200}
              loop
              showCursor
              cursorCharacter="_"
            />
          </div>
        </div>

        {/* Right Side: GSAP Stacking Cards Carousel */}
        <div className="hero-right">
          <CardSwap
            width={380}
            height={280}
            cardDistance={40}
            verticalDistance={30}
            delay={4000}
            pauseOnHover={true}
          >
            <Card style={{ overflow: 'hidden', border: '1px solid var(--border-cyan)', background: '#0a0b10' }}>
              <img src="/1.jpg" alt="AI Face Analysis" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Card>
            <Card style={{ overflow: 'hidden', border: '1px solid var(--border-cyan)', background: '#0a0b10' }}>
              <img src="/2.jpg" alt="Forensic ELA Scan" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Card>
            <Card style={{ overflow: 'hidden', border: '1px solid var(--border-cyan)', background: '#0a0b10' }}>
              <img src="/3.jpg" alt="Split Authentication Scan" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Card>
          </CardSwap>
        </div>

      </div>


      {/* About Section */}
      <FadeContent
        blur={true}
        duration={800}
        ease="power2.out"
        initialOpacity={0}
        threshold={0.1}
      >
        <div
          className="cyber-card"
          style={{ padding: '40px', marginBottom: '40px', pointerEvents: 'auto' }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px', alignItems: 'center' }}>
            <div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.5rem',
                color: 'var(--text-primary)',
                fontWeight: 500,
                letterSpacing: '-0.5px',
                lineHeight: '1.3'
              }}>
                Combating digital<br />
                <span style={{ color: '#5227FF' }}>misinformation</span>
              </h2>
              <div style={{ width: '40px', height: '3px', background: '#5227FF', marginTop: '16px' }} />
            </div>
            <div style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: '1.8', fontWeight: 300 }}>
              <p>Falcon-N5 is an intelligent image authentication platform designed to combat misinformation and digital image manipulation. By leveraging cutting-edge artificial intelligence and computer vision techniques, Falcon-N5 helps users determine whether an image is authentic or has been altered, supporting trust and transparency in the digital world.</p>
            </div>
          </div>
        </div>
      </FadeContent>

      {/* Statistics Section */}
      <FadeContent
        blur={true}
        duration={800}
        ease="power2.out"
        initialOpacity={0}
        threshold={0.1}
      >
        <div
          className="cyber-card"
          style={{ padding: '30px 20px', marginBottom: '32px', pointerEvents: 'auto' }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', textAlign: 'center' }}>
            {STATS.map((stat, idx) => (
              <div key={idx}>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '2.2rem',
                  fontWeight: 'bold',
                  color: 'var(--accent-cyan)',
                  textShadow: '0 0 10px var(--accent-cyan-glow)',
                  marginBottom: '6px'
                }}>{stat.value}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeContent>

      {/* Tech Logo Loop */}
      <div style={{ marginBottom: '40px' }}>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          color: 'rgba(255,255,255,0.28)',
          letterSpacing: '2.5px',
          textTransform: 'uppercase',
          textAlign: 'center',
          marginBottom: '14px'
        }}>Powered by</p>
        <div style={{ height: '46px', position: 'relative', overflow: 'hidden' }}>
          <LogoLoop
            logos={TECH_LOGOS}
            speed={55}
            direction="left"
            logoHeight={22}
            gap={16}
            pauseOnHover
            scaleOnHover
            ariaLabel="Technologies used"
            renderItem={(item) => (
              <a
                className="logoloop__pill"
                href={item.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={item.title}
                title={item.title}
                style={{ '--logoloop-logoHeight': '22px' }}
              >
                <img src={item.src} alt={item.alt} draggable={false} />
                <span className="logoloop__pill-label">{item.title}</span>
              </a>
            )}
          />
        </div>
      </div>

    </div>
  );
}
