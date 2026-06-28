import React from 'react';
import FadeContent from './FadeContent';

/* ── Short feature cards (top grid) ─────────────────────────────── */
const QUICK_FEATURES = [
  { icon: '🔍', label: 'Image Forgery Detection' },
  { icon: '🎭', label: 'Deepfake Detection' },
  { icon: '🖼️', label: 'AI vs Real Classification' },
  { icon: '🧠', label: 'Hybrid CNN + Transformer' },
  { icon: '📊', label: 'Explainable AI Heatmaps' },
  { icon: '📈', label: 'FFT Frequency Analysis' },
  { icon: '📍', label: 'Tampered Region Localization' },
  { icon: '⚡', label: 'Fast GPU Inference' },
  { icon: '🎯', label: 'Up to 98% Accuracy' },
  { icon: '🛡️', label: 'Digital Forensics Ready' },
  { icon: '📂', label: 'Multi-Format Support' },
  { icon: '☁️', label: 'Scalable Architecture' },
];

/* ── Main detailed feature sections ─────────────────────────────── */
const FEATURES = [
  {
    icon: '🔍',
    badge: 'CNN + Transformer',
    accent: '#5227FF',
    title: 'AI Image Forgery Detection',
    description:
      'Detect manipulated and tampered images using a hybrid CNN + Transformer architecture trained on forensic datasets.',
    detail:
      'Combines local artifact detection from CNNs with global context understanding from Vision Transformers, enabling robust detection of copy-move, splicing, object removal, and insertion forgeries across diverse image domains.',
    tags: ['Copy-Move', 'Splicing', 'Object Removal', 'Object Insertion'],
  },
  {
    icon: '🎭',
    badge: 'Deep Learning',
    accent: '#d90429',
    title: 'Deepfake Detection',
    description:
      'Identify AI-generated and manipulated faces in images and videos with high accuracy using advanced deep learning models.',
    detail:
      'Achieves 97.5% deepfake detection accuracy on benchmark datasets by analyzing facial geometry inconsistencies, unnatural blending boundaries, and high-frequency neural artifacts left by GAN and diffusion-based generators.',
    tags: ['GAN Faces', 'Diffusion Faces', 'Video Frames', '97.5% Accuracy'],
  },
  {
    icon: '🖼️',
    badge: 'Multi-Generator',
    accent: '#0f9f6e',
    title: 'AI vs Real Image Detection',
    description:
      'Distinguish between authentic photographs and AI-generated images from models like Stable Diffusion, DALL·E, and Midjourney.',
    detail:
      'Trained on images from leading generative models and real-world photographs, the classifier identifies subtle periodic grid artifacts, unnatural texture distributions, and statistical anomalies unique to AI image synthesis.',
    tags: ['Stable Diffusion', 'DALL·E', 'Midjourney', '98% Accuracy'],
  },
  {
    icon: '🧠',
    badge: 'Architecture',
    accent: '#B497CF',
    title: 'Hybrid Deep Learning Models',
    description:
      'Leverages CNNs, Vision Transformers, Swin Transformers, ConvNeXt, EfficientNet, and ResNet to capture both local artifacts and global inconsistencies.',
    detail:
      'Multi-model ensemble architecture fuses predictions from specialized networks, each trained to detect different types of manipulation signatures — from pixel-level JPEG artifacts to global semantic anomalies.',
    tags: ['ViT', 'Swin Transformer', 'EfficientNet', 'ResNet', 'ConvNeXt'],
  },
  {
    icon: '🌐',
    badge: 'Feature Fusion',
    accent: '#00b4d8',
    title: 'Multi-Domain Feature Fusion',
    description:
      'Combines spatial, semantic, and frequency-domain information for more robust and reliable forgery detection.',
    detail:
      'By fusing RGB spatial features, semantic embeddings, and FFT frequency spectra, the pipeline captures manipulation cues that are invisible in any single domain, significantly reducing false negatives on adversarially crafted forgeries.',
    tags: ['Spatial', 'Semantic', 'Frequency', 'Ensemble'],
  },
  {
    icon: '📊',
    badge: 'XAI',
    accent: '#f59e0b',
    title: 'Explainable AI (XAI)',
    description:
      'Uses Grad-CAM heatmaps to highlight suspicious regions, making every prediction transparent and interpretable.',
    detail:
      'Gradient-weighted Class Activation Mapping overlays colored heatmaps on the original image, pinpointing exact regions the model flagged as manipulated — critical for forensic investigators and legal evidence chains.',
    tags: ['Grad-CAM', 'Heatmaps', 'Interpretable', 'Legal Evidence'],
  },
  {
    icon: '📈',
    badge: 'Signal Processing',
    accent: '#5227FF',
    title: 'Frequency Analysis (FFT)',
    description:
      'Applies Fast Fourier Transform (FFT) to uncover hidden manipulation artifacts invisible in standard RGB images.',
    detail:
      'FFT converts images from the spatial domain to the frequency domain, revealing periodic grid noise patterns, compression discontinuities, and band-limited artifacts that are telltale signatures of AI generation and post-processing.',
    tags: ['FFT', 'Frequency Domain', 'Compression Artifacts', 'Periodic Noise'],
  },
  {
    icon: '📍',
    badge: 'Localization',
    accent: '#d90429',
    title: 'Tampered Region Localization',
    description:
      'Precisely identifies manipulated regions instead of only classifying an image as fake or real.',
    detail:
      'Pixel-level segmentation maps mark exactly which regions have been tampered with, enabling forensic examiners to validate authenticity at the sub-image level and produce spatially precise evidence reports.',
    tags: ['Pixel Segmentation', 'Region Maps', 'Spatial Precision'],
  },
  {
    icon: '🛡️',
    badge: 'Use Cases',
    accent: '#0f9f6e',
    title: 'Digital Forensics Ready',
    description:
      'Designed for journalism, legal evidence verification, cybersecurity, social media moderation, and forensic investigations.',
    detail:
      'Production-hardened pipeline with audit-ready outputs, confidence scores, and explainability artifacts suitable for courtroom evidence, newsroom verification workflows, and platform trust-and-safety teams.',
    tags: ['Journalism', 'Legal', 'Cybersecurity', 'Social Media', 'Forensics'],
  },
];

const STATS = [
  { value: '98%', label: 'AI Image Detection Accuracy' },
  { value: '97.5%', label: 'Deepfake Detection Accuracy' },
  { value: '6+', label: 'Forgery Types Detected' },
  { value: '<1s', label: 'Inference Time' },
];

export default function FeaturesPage() {
  return (
    <div style={{ position: 'relative', zIndex: 1, paddingBottom: '100px' }}>

      {/* ── Hero Header ─────────────────────────────────────── */}
      <FadeContent blur={true} duration={900} ease="power2.out" initialOpacity={0}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '50px 24px 0', textAlign: 'center', marginBottom: '20px' }}>
          <span className="cyber-badge cyber-badge-magenta" style={{ marginBottom: '18px' }}>
            Falcon-N5 Capabilities
          </span>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-1px',
            marginBottom: '18px',
            lineHeight: 1.2
          }}>
            Research-Grade AI<br />
            <span style={{ color: '#5227FF' }}>Forensics Platform</span>
          </h1>
          <p style={{
            color: 'var(--text-secondary)',
            maxWidth: '620px',
            margin: '0 auto',
            fontSize: '1.05rem',
            lineHeight: '1.75',
            fontWeight: 300
          }}>
            State-of-the-art deep learning for detecting image forgery, deepfakes, and AI-generated content — with explainable, forensic-grade outputs.
          </p>
        </div>
      </FadeContent>

      {/* ── Stats Bar ───────────────────────────────────────── */}
      <FadeContent blur={true} duration={800} ease="power2.out" initialOpacity={0}>
        <div style={{ maxWidth: '1100px', margin: '32px auto', padding: '0 24px' }}>
          <div className="cyber-card" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '0',
            padding: 0,
            overflow: 'hidden'
          }}>
            {STATS.map((s, i) => (
              <div key={i} style={{
                textAlign: 'center',
                padding: '28px 20px',
                borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none'
              }}>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: 'var(--accent-cyan)',
                  textShadow: '0 0 14px var(--accent-cyan-glow)',
                  marginBottom: '6px'
                }}>{s.value}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.2px' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeContent>

      {/* ── Quick Feature Pills Grid ─────────────────────────── */}
      <FadeContent blur={true} duration={800} ease="power2.out" initialOpacity={0}>
        <div style={{ maxWidth: '1100px', margin: '0 auto 48px', padding: '0 24px' }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '2.5px',
            textTransform: 'uppercase',
            marginBottom: '18px'
          }}>All Features</p>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            {QUICK_FEATURES.map((f, i) => (
              <div key={i} style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '100px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderTopColor: 'rgba(255,255,255,0.14)',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-display)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                transition: 'background 0.2s ease, border-color 0.2s ease',
                cursor: 'default'
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(82,39,255,0.12)';
                  e.currentTarget.style.borderColor = 'rgba(82,39,255,0.4)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <span>{f.icon}</span>
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </FadeContent>

      {/* ── Detailed Feature Cards ───────────────────────────── */}
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px',
        pointerEvents: 'auto'
      }}>
        {FEATURES.map((f, i) => (
          <FadeContent
            key={i}
            blur={true}
            duration={800}
            ease="power2.out"
            initialOpacity={0}
          >
            <div className="cyber-card" style={{
              borderLeft: `3px solid ${f.accent}`,
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              height: '100%',
              padding: '28px'
            }}>
              {/* Badge + Icon */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="cyber-badge" style={{
                  borderColor: `${f.accent}50`,
                  color: f.accent,
                  background: `${f.accent}14`,
                }}>
                  {f.badge}
                </span>
                <span style={{ fontSize: '1.6rem', opacity: 0.85 }}>{f.icon}</span>
              </div>

              {/* Title */}
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                letterSpacing: '-0.3px',
                lineHeight: 1.35,
                margin: 0
              }}>
                {f.title}
              </h2>

              {/* Short description */}
              <p style={{
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
                lineHeight: '1.65',
                fontWeight: 300,
                margin: 0
              }}>
                {f.description}
              </p>

              {/* Technical detail */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '14px', marginTop: 'auto' }}>
                <strong style={{
                  color: f.accent,
                  display: 'block',
                  marginBottom: '7px',
                  fontSize: '0.62rem',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-mono)'
                }}>How It Works</strong>
                <p style={{
                  fontSize: '0.82rem',
                  color: 'var(--text-muted)',
                  lineHeight: '1.65',
                  fontWeight: 300,
                  margin: '0 0 12px'
                }}>
                  {f.detail}
                </p>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {f.tags.map((tag, ti) => (
                    <span key={ti} style={{
                      fontSize: '0.7rem',
                      padding: '3px 10px',
                      borderRadius: '100px',
                      background: `${f.accent}14`,
                      border: `1px solid ${f.accent}30`,
                      color: f.accent,
                      fontFamily: 'var(--font-mono)',
                      letterSpacing: '0.3px'
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </FadeContent>
        ))}
      </div>

      {/* ── Bottom CTA ──────────────────────────────────────── */}
      <FadeContent blur={true} duration={800} ease="power2.out" initialOpacity={0}>
        <div style={{ maxWidth: '1100px', margin: '48px auto 0', padding: '0 24px' }}>
          <div className="cyber-card" style={{ textAlign: 'center', padding: '48px 32px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🔬</div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.8rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: '12px',
              letterSpacing: '-0.5px'
            }}>
              Research-Grade Architecture
            </h2>
            <p style={{
              color: 'var(--text-secondary)',
              maxWidth: '520px',
              margin: '0 auto 28px',
              fontSize: '0.95rem',
              lineHeight: '1.7',
              fontWeight: 300
            }}>
              Built on state-of-the-art deep learning and benchmark forensic datasets. Suitable for academic research and production deployment in legal, journalistic, and cybersecurity contexts.
            </p>
            <a href="#/tool" className="cyber-btn" style={{ padding: '14px 32px', fontSize: '0.95rem', display: 'inline-flex' }}>
              Try the Analyzer
            </a>
          </div>
        </div>
      </FadeContent>

    </div>
  );
}
