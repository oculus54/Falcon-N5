import React from 'react';
import { ArrowRight } from 'lucide-react';
import GradientText from './GradientText';
import DecryptedText from './DecryptedText';
import TextType from './TextType';

const STATS = [
  { value: '95%+', label: 'Detection Accuracy' },
  { value: '50K+', label: 'Images Analyzed' },
  { value: 'Instant', label: 'Real-Time Processing' },
  { value: 'Multi-Model', label: 'AI & Deepfake Support' }
];

export default function HomePage() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px', position: 'relative', zIndex: 1 }}>
      
      {/* Hero Header Section */}
      <div style={{ textAlign: 'center', marginBottom: '80px', marginTop: '40px' }}>
        {/* Falcon-N5 Brand Subheading Above Hero */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle' }}>
            <path d="M12 2L3 18H21L12 2Z" fill="url(#falcon-hero-gradient)" />
            <path d="M12 7L6 17H18L12 7Z" fill="var(--bg-primary)" style={{ transition: 'fill var(--transition-normal)' }} />
            <path d="M12 10L9 15H15L12 10Z" fill="url(#falcon-hero-gradient-inner)" />
            <defs>
              <linearGradient id="falcon-hero-gradient" x1="3" y1="2" x2="21" y2="18" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#7C3AED" />
                <stop offset="100%" stopColor="#5227FF" />
              </linearGradient>
              <linearGradient id="falcon-hero-gradient-inner" x1="9" y1="10" x2="15" y2="15" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#A78BFA" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>
            </defs>
          </svg>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.35rem',
            fontWeight: 500,
            color: 'var(--text-primary)',
            letterSpacing: '-0.3px'
          }}>
            <DecryptedText
              text="Falcon-N5"
              animateOn="hover"
              speed={80}
              maxIterations={15}
            />
          </span>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '4.2rem',
          fontWeight: 300,
          letterSpacing: '-2.2px',
          lineHeight: '1.15',
          maxWidth: '900px',
          margin: '0 auto 28px auto',
          textAlign: 'center'
        }}>
          <GradientText
            colors={["#5227FF", "#FF9FFC", "#B497CF"]}
            animationSpeed={8}
            showBorder={false}
          >
            Detect image manipulation with AI precision
          </GradientText>
        </h1>

        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '1.2rem',
          fontWeight: 300,
          lineHeight: '1.7',
          maxWidth: '800px',
          margin: '0 auto 36px auto'
        }}>
          Advanced deep learning technology that instantly analyzes images and identifies AI-generated, edited, deepfake, or manipulated content in seconds.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', alignItems: 'center' }}>
          <a href="#/tool" className="cyber-btn" style={{ padding: '14px 28px', fontSize: '0.95rem' }}>
            Analyze Image <ArrowRight size={18} />
          </a>
          <a href="#/features" className="cyber-btn cyber-btn-secondary" style={{ padding: '14px 28px', fontSize: '0.95rem' }}>
            Learn More
          </a>
        </div>

        {/* Dynamic capability typing indicator */}
        <div style={{
          marginTop: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.5px'
        }}>
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


      {/* About Section */}
      <div className="cyber-card" style={{
        padding: '40px',
        marginBottom: '80px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.03)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px', alignItems: 'center' }}>
          <div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              color: 'var(--text-primary)',
              fontWeight: 500,
              letterSpacing: '-0.5px',
              lineHeight: '1.3'
            }}>
              Combating digital <br />
              <span style={{ color: '#5227FF' }}>misinformation</span>
            </h2>
            <div style={{ width: '40px', height: '3px', background: '#5227FF', marginTop: '16px' }} />
          </div>
          <p style={{
            fontSize: '1.05rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.8',
            fontWeight: 300
          }}>
            Falcon-N5 is an intelligent image authentication platform designed to combat misinformation and digital image manipulation. By leveraging cutting-edge artificial intelligence and computer vision techniques, Falcon-N5 helps users determine whether an image is authentic or has been altered, supporting trust and transparency in the digital world.
          </p>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="cyber-card" style={{ padding: '30px 20px', marginBottom: '40px' }}>
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
              }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
