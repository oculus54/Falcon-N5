import React from 'react';
import { Shield, BrainCircuit, Binary, FileSearch } from 'lucide-react';

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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', position: 'relative', zIndex: 1 }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
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
          lineHeight: '1.6'
        }}>
          Learn how digital forensics algorithms analyze pixels to discover evidence of forgery, generative AI modifications, and metadata tamper trails.
        </p>
      </div>

      {/* Grid of Forensics Info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {SECTIONS.map((section, index) => {
          const Icon = section.icon;
          return (
            <div
              key={index}
              className="cyber-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                borderLeft: `2px solid ${section.accent}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: section.accent
                }}>
                  <Icon size={24} />
                </div>
                <span className="cyber-badge" style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.03)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-secondary)'
                }}>
                  {section.badge}
                </span>
              </div>

              <div>
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.20rem',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  marginBottom: '10px',
                  letterSpacing: '-0.2px'
                }}>
                  {section.title}
                </h2>
                <p style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.6',
                  marginBottom: '15px'
                }}>
                  {section.description}
                </p>
              </div>

              <div style={{
                background: 'rgba(82, 39, 255, 0.03)',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                lineHeight: '1.5',
                flex: 1
              }}>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '6px', fontSize: '0.75rem', fontFamily: 'var(--font-display)' }}>
                  TECHNICAL SPECIFICATIONS:
                </strong>
                {section.science}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
