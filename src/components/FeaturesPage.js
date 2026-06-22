import React from 'react';
import { Shield, BrainCircuit, Binary, FileSearch } from 'lucide-react';
import { motion } from 'motion/react';

const SECTIONS = [
  {
    icon: Binary,
    title: 'Error Level Analysis (ELA)',
    description: 'Error Level Analysis works by intentionally resaving the image at a known error rate (e.g. 95%), and then determining the difference between the original and the resaved image.',
    science: 'A digital image is composed of square compression grid blocks (usually 8x8 pixels). When you resave an image, the entire image should degrade at a uniform rate. If a section of the image has been spliced or modified, that specific region will degrade faster or slower than the rest of the image, showing a higher error level deviation which glows in the ELA analyzer.',
    accent: '#ff007f',
    badge: 'Quantization Matrix'
  },
  {
    icon: BrainCircuit,
    title: 'Generative GAN Signatures',
    description: 'Generative models like GANs, Diffusion Models, and VAEs create images that look real, but leave telltale high-frequency artifacts in the structural frequency domain.',
    science: 'AI image generators construct pixels layer by layer using mathematical kernels. This creates tiny periodic grids, blurred color transitions, and inconsistent optical details (like differing iris refractions, asymmetric earrings, or floating background artifacts). Neural parsers can detect these high-frequency mathematical signatures with high precision.',
    accent: '#00f2fe',
    badge: 'Neural Wavelet Analysis'
  },
  {
    icon: Shield,
    title: 'PRNU Noise Inconsistency',
    description: 'Photo-Response Non-Uniformity (PRNU) is a physical noise pattern unique to every single digital camera sensor, acting as a camera fingerprint.',
    science: 'Due to microscopic manufacturing variations in silicon, each pixel sensor on a digital camera has slightly different light sensitivity. This leaves a unique noise grid on every photo taken. When an image is spliced (combining two photos), the sensor noise signature becomes fragmented and inhomogeneous. The Noise Analyzer highlights these grain boundaries.',
    accent: '#10b981',
    badge: 'Sensor Fingerprinting'
  },
  {
    icon: FileSearch,
    title: 'EXIF Metadata Analysis',
    description: 'EXIF tags store configuration parameters, camera models, GPS coordinates, editing timestamps, and software signatures inside the file header.',
    science: 'Authentic captures from digital cameras contain pristine serial keys, shutter speed coefficients, and lens parameters. Spliced or exported images from editing tools (like Adobe Photoshop or GIMP) overwrite these blocks, leaving Adobe headers and altering structural thumbnail offsets. Any discrepancy in metadata suggests the image has gone through a post-processing loop.',
    accent: '#f59e0b',
    badge: 'Header Verification'
  }
];

export default function FeaturesPage() {
  return (
    <div style={{ position: 'relative', zIndex: 1, paddingBottom: '100px' }}>
      {/* Title */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px 0', textAlign: 'center', marginBottom: '40px' }}>
        <span className="cyber-badge cyber-badge-magenta" style={{ marginBottom: '16px' }}>
          Science Protocol
        </span>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2.5rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          letterSpacing: '-1px',
          marginBottom: '16px'
        }}>
          Forensics Science Lab
        </h1>
        <p style={{
          color: 'var(--text-secondary)',
          maxWidth: '600px',
          margin: '0 auto',
          fontSize: '1.05rem',
          lineHeight: '1.7',
          fontWeight: 300
        }}>
          Learn how digital forensics algorithms analyze pixels to discover evidence of forgery, generative AI modifications, and metadata tamper trails.
        </p>
      </div>

      {/* Cards list with view animations */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        pointerEvents: 'auto'
      }}>
        {SECTIONS.map((section, index) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={index}
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              whileInView={{ scale: 1, opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
              style={{
                background: 'var(--bg-card)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid var(--border-color)',
                borderLeft: `4px solid ${section.accent}`,
                borderRadius: '16px',
                padding: '36px 40px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '40px',
                alignItems: 'start'
              }}
            >
              {/* Left column */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '10px',
                    background: `${section.accent}15`,
                    border: `1px solid ${section.accent}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: section.accent,
                    flexShrink: 0
                  }}>
                    <Icon size={22} />
                  </div>
                  <span className="cyber-badge" style={{
                    borderColor: `${section.accent}50`,
                    color: section.accent,
                    background: `${section.accent}10`
                  }}>
                    {section.badge}
                  </span>
                </div>

                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '12px',
                  letterSpacing: '-0.3px'
                }}>
                  {section.title}
                </h2>
                <p style={{
                  fontSize: '0.9rem',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.7',
                  fontWeight: 300
                }}>
                  {section.description}
                </p>
              </div>

              {/* Right column — tech specs */}
              <div style={{
                background: 'rgba(82, 39, 255, 0.03)',
                padding: '20px',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                height: '100%'
              }}>
                <strong style={{
                  color: section.accent,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '12px',
                  fontSize: '0.7rem',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-display)'
                }}>
                  Technical Specifications
                </strong>
                <p style={{
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.7',
                  fontWeight: 300
                }}>
                  {section.science}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
