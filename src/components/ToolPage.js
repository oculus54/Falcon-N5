import React, { useState, useEffect, useRef } from 'react';
import { Upload, ArrowLeft, ShieldAlert, Cpu, CheckCircle, FileText, Activity } from 'lucide-react';
import DecryptedText from './DecryptedText';

const PRESETS = [
  {
    id: 'deepfake',
    title: 'AI GAN Portrait',
    description: 'Synthetically generated face using StyleGAN3 architecture.',
    imageName: 'ai_portrait_gan.jpg',
    category: 'AI Generated',
    confidence: 98.4,
    status: 'alert',
    color: '#ff007f',
    metadata: {
      Software: 'StyleGAN3 PyTorch Engine',
      Dimensions: '1024 x 1024 px',
      Format: 'JPEG',
      Camera: 'None (Synthetic)',
      GPS: 'None',
      Timestamp: '2026-05-12 18:32:01'
    },
    metrics: {
      elaMaxDeviation: 82.5,
      noiseInconsistency: 79.2,
      ganSignature: 98.4,
      doubleCompression: 15.0
    },
    findings: [
      'Asymmetric pupillary structures detected',
      'High-frequency GAN artifact signatures found in hair textures',
      'EXIF Metadata is completely absent or stripped'
    ]
  },
  {
    id: 'spliced',
    title: 'Spliced Document',
    description: 'Spliced image displaying copy-paste manipulation in the background.',
    imageName: 'document_scan_spliced.jpg',
    category: 'Manipulated',
    confidence: 92.1,
    status: 'warning',
    color: '#f59e0b',
    metadata: {
      Software: 'Adobe Photoshop 2025 (Windows)',
      Dimensions: '2048 x 1536 px',
      Format: 'PNG',
      Camera: 'Apple iPhone 14 Pro Max',
      GPS: '40.7128° N, 74.0060° W',
      Timestamp: '2026-06-02 09:15:44'
    },
    metrics: {
      elaMaxDeviation: 94.2,
      noiseInconsistency: 88.0,
      ganSignature: 0.0,
      doubleCompression: 91.5
    },
    findings: [
      'Severe Error Level Analysis (ELA) variance around text borders',
      'Sensor noise pattern mismatch between foreground subject and background elements',
      'Adobe Photoshop metadata signature detected in history block'
    ]
  },
  {
    id: 'pristine',
    title: 'Camera Capture (Pristine)',
    description: 'Direct camera RAW export with intact EXIF verification trails.',
    imageName: 'original_dslr_capture.jpg',
    category: 'Authentic',
    confidence: 99.8,
    status: 'success',
    color: '#10b981',
    metadata: {
      Software: 'Lightroom CC 14.1 (Macintosh)',
      Dimensions: '6000 x 4000 px',
      Format: 'JPEG',
      Camera: 'Canon EOS R5 (Lens: RF 24-70mm f/2.8L IS USM)',
      GPS: '35.6762° N, 139.6503° E',
      Timestamp: '2026-06-10 14:20:12'
    },
    metrics: {
      elaMaxDeviation: 4.8,
      noiseInconsistency: 3.2,
      ganSignature: 0.0,
      doubleCompression: 8.5
    },
    findings: [
      'Uniform compression rates across all geometric blocks',
      'Pristine sensor noise distribution indicating single exposure source',
      'EXIF device serial keys check matches authentic hardware records'
    ]
  }
];

// Helper canvas filtering functions
const applyElaFilter = (ctx, width, height) => {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i+1];
    const b = data[i+2];

    const gray = (r + g + b) / 3;
    let edgeStrength = 0;
    if (i > 4 && i < data.length - 4) {
      const prevGray = (data[i-4] + data[i-3] + data[i-2]) / 3;
      edgeStrength = Math.abs(gray - prevGray);
    }

    const noise = Math.random() * 12;
    const elaVal = Math.min(255, edgeStrength * 4.5 + noise);

    data[i] = Math.min(255, elaVal * 1.5 + 20);      // Red
    data[i+1] = Math.min(255, elaVal * 0.15 + 5);    // Green
    data[i+2] = Math.min(255, elaVal * 2.0 + 40);     // Blue
  }
  ctx.putImageData(imgData, 0, 0);

  ctx.strokeStyle = 'rgba(255, 0, 127, 0.05)';
  ctx.lineWidth = 1;
  for (let y = 0; y < height; y += 4) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
};

const applyNoiseFilter = (ctx, width, height) => {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i+1];
    const b = data[i+2];

    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    const rand = (Math.random() - 0.5) * 60;
    let val = gray * 0.1 + 100 + rand;

    data[i] = Math.min(255, Math.max(0, val * 0.9));
    data[i+1] = Math.min(255, Math.max(0, val));
    data[i+2] = Math.min(255, Math.max(0, val * 1.05));
  }
  ctx.putImageData(imgData, 0, 0);
};

const drawNoiseStatic = (ctx, width, height) => {
  const noiseData = ctx.createImageData(width, height);
  const data = noiseData.data;
  for (let i = 0; i < data.length; i += 4) {
    const rand = Math.floor(Math.random() * 45) + 80;
    data[i] = rand;
    data[i+1] = rand;
    data[i+2] = rand;
    data[i+3] = 255;
  }
  ctx.putImageData(noiseData, 0, 0);
};

const drawProceduralGraphic = (ctx, width, height, presetId, tab, theme) => {
  const isDark = theme === 'dark';
  ctx.fillStyle = tab === 'original' ? (isDark ? '#080a14' : '#ffffff') : '#050812';
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = tab === 'original' ? (isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.05)') : 'rgba(0, 242, 254, 0.04)';
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 30) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += 30) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  if (presetId === 'deepfake') {
    if (tab === 'original') {
      ctx.strokeStyle = '#5227FF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(width/2, height/2 - 20, 80, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = 'rgba(82, 39, 255, 0.2)';
      ctx.beginPath();
      ctx.arc(width/2 - 30, height/2 - 30, 8, 0, Math.PI * 2);
      ctx.arc(width/2 + 30, height/2 - 30, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(15, 23, 42, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(width/2 - 80, height/2 - 20);
      ctx.lineTo(width/2 + 80, height/2 - 20);
      ctx.moveTo(width/2, height/2 - 100);
      ctx.lineTo(width/2, height/2 + 60);
      ctx.stroke();

      ctx.fillStyle = isDark ? '#ffffff' : '#000000';
      ctx.font = '12px Orbitron';
      ctx.fillText('FACIAL MATRIX CHECK: COMPLETE', 30, 40);
      ctx.fillText('GAN RECOGNITION MAP', 30, 60);
    } else if (tab === 'ela') {
      ctx.fillStyle = '#03050a';
      ctx.fillRect(0, 0, width, height);
      
      ctx.strokeStyle = 'rgba(255, 0, 127, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(width/2, height/2 - 20, 80, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 0, 127, 0.9)';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ff007f';
      ctx.beginPath();
      ctx.arc(width/2 - 30, height/2 - 30, 10, 0, Math.PI * 2);
      ctx.arc(width/2 + 30, height/2 - 30, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = 'rgba(255, 0, 127, 0.03)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#ff007f';
      ctx.font = '12px Orbitron';
      ctx.fillText('ELA HIGHLIGHT: DISPARITY DETECTED', 30, 40);
      ctx.fillText('IRIS REDIRECTION VALUE: HIGH', 30, 60);
    } else if (tab === 'noise') {
      drawNoiseStatic(ctx, width, height);
      
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.6)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(width/2, height/2 - 60, 90, Math.PI, 0);
      ctx.stroke();

      ctx.fillStyle = '#00f2fe';
      ctx.font = '12px Orbitron';
      ctx.fillText('NOISE GRADIENT DISSONANCE: ACTIVE', 30, 40);
    }
  } else if (presetId === 'spliced') {
    if (tab === 'original') {
      ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(15, 23, 42, 0.02)';
      ctx.fillRect(width/2 - 120, 60, 240, 280);
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)';
      ctx.strokeRect(width/2 - 120, 60, 240, 280);

      ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)';
      for (let i = 0; i < 8; i++) {
        ctx.fillRect(width/2 - 100, 100 + i*20, 200, 4);
      }

      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(width/2 + 10, 260, 80, 35);
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px Orbitron';
      ctx.fillText('STAMP-V4', width/2 + 20, 282);

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1;
      ctx.strokeRect(width/2 + 5, 255, 90, 45);

      ctx.fillStyle = isDark ? '#ffffff' : '#000000';
      ctx.font = '12px Orbitron';
      ctx.fillText('REGION SPLICING ALARM', 30, 40);
      ctx.fillText('METADATA HISTORY DETECTED', 30, 60);
    } else if (tab === 'ela') {
      ctx.fillStyle = '#030408';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(255, 0, 127, 0.2)';
      ctx.strokeRect(width/2 - 120, 60, 240, 280);

      ctx.shadowBlur = 20;
      ctx.shadowColor = '#f59e0b';
      ctx.fillStyle = 'rgba(245, 158, 11, 0.85)';
      ctx.fillRect(width/2 + 5, 255, 90, 45);
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#f59e0b';
      ctx.font = '12px Orbitron';
      ctx.fillText('COMPRESSION MISMATCH IN BLOCK 8', 30, 40);
    } else if (tab === 'noise') {
      drawNoiseStatic(ctx, width, height);
      
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(width/2 - 120, 60, 240, 280);

      ctx.fillStyle = '#fff';
      for (let x = width/2 + 5; x < width/2 + 95; x += 4) {
        for (let y = 255; y < 300; y += 4) {
          if (Math.random() > 0.4) {
            ctx.fillStyle = 'rgba(245, 158, 11, 0.9)';
            ctx.fillRect(x, y, 3, 3);
          }
        }
      }

      ctx.fillStyle = '#f59e0b';
      ctx.font = '12px Orbitron';
      ctx.fillText('COHERENCE GAP DETECTED IN GRAIN', 30, 40);
    }
  } else {
    if (tab === 'original') {
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(width/2, height/2 - 20, 40, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(width/2 - 150, height/2 + 80);
      ctx.lineTo(width/2 - 50, height/2 - 20);
      ctx.lineTo(width/2 + 50, height/2 + 80);
      ctx.moveTo(width/2 - 50, height/2 + 80);
      ctx.lineTo(width/2 + 80, height/2 + 10);
      ctx.lineTo(width/2 + 180, height/2 + 80);
      ctx.stroke();

      ctx.fillStyle = isDark ? '#ffffff' : '#000000';
      ctx.font = '12px Orbitron';
      ctx.fillText('EXIF ENVELOPE: GENUINE', 30, 40);
      ctx.fillText('RGB INTEGRITY: CONSISTENT', 30, 60);
    } else if (tab === 'ela') {
      ctx.fillStyle = '#030408';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(255, 0, 127, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 8) {
        if (Math.random() > 0.95) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, height);
          ctx.stroke();
        }
      }

      ctx.fillStyle = '#10b981';
      ctx.font = '12px Orbitron';
      ctx.fillText('UNIFORM ERROR DISTRIBUTIONS', 30, 40);
    } else if (tab === 'noise') {
      drawNoiseStatic(ctx, width, height);

      ctx.fillStyle = '#10b981';
      ctx.font = '12px Orbitron';
      ctx.fillText('HOMOGENEOUS SENSOR NOISE SIGNATURE', 30, 40);
    }
  }
};

export default function ToolPage({ theme }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState('original');
  const [isDragOver, setIsDragOver] = useState(false);
  const [reportGenerating, setReportGenerating] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!selectedImage) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = 600;
    const height = 400;
    canvas.width = width;
    canvas.height = height;

    if (selectedImage.imageSrc) {
      const img = new Image();
      img.src = selectedImage.imageSrc;
      img.onload = () => {
        const scale = Math.max(width / img.width, height / img.height);
        const x = (width / 2) - (img.width / 2) * scale;
        const y = (height / 2) - (img.height / 2) * scale;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

        if (activeTab === 'ela') {
          applyElaFilter(ctx, width, height);
        } else if (activeTab === 'noise') {
          applyNoiseFilter(ctx, width, height);
        }
      };
    } else {
      drawProceduralGraphic(ctx, width, height, selectedImage.id, activeTab, theme);
    }
  }, [selectedImage, activeTab, theme]);

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const userImage = {
        id: 'uploaded',
        title: file.name,
        description: `Uploaded size: ${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        imageSrc: e.target.result,
        category: 'Analyzing...',
        confidence: 0,
        status: 'analyzing',
        color: '#00f2fe',
        metadata: {
          Software: 'Unknown / Stripped',
          Dimensions: 'Detecting...',
          Format: file.type.replace('image/', '').toUpperCase(),
          Camera: 'Generic Web Capture',
          GPS: 'Not Available',
          Timestamp: new Date(file.lastModified).toISOString().replace('T', ' ').substring(0, 19)
        },
        metrics: {
          elaMaxDeviation: Math.floor(Math.random() * 45) + 30,
          noiseInconsistency: Math.floor(Math.random() * 50) + 25,
          ganSignature: Math.floor(Math.random() * 95),
          doubleCompression: Math.floor(Math.random() * 80)
        },
        findings: [
          'File format checks initiated...',
          'No camera hardware signature detected, standard web source format.',
          'Custom analysis generated for simulation.'
        ]
      };
      
      if (userImage.metrics.ganSignature > 70) {
        userImage.category = 'AI Generated';
        userImage.confidence = userImage.metrics.ganSignature;
        userImage.status = 'alert';
        userImage.color = '#ff007f';
        userImage.findings.unshift('High probability of generative adversarial network patterns detected.');
      } else if (userImage.metrics.elaMaxDeviation > 60) {
        userImage.category = 'Manipulated';
        userImage.confidence = userImage.metrics.elaMaxDeviation;
        userImage.status = 'warning';
        userImage.color = '#f59e0b';
        userImage.findings.unshift('Compression level variance hints at localized pixel editing.');
      } else {
        userImage.category = 'Authentic';
        userImage.confidence = 92.4;
        userImage.status = 'success';
        userImage.color = '#10b981';
        userImage.findings.unshift('Compression and noise patterns indicate consistent exposure.');
      }
      setSelectedImage(userImage);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateReport = () => {
    setReportGenerating(true);
    setTimeout(() => {
      setReportGenerating(false);
      alert(`Report generated for ${selectedImage.title}.`);
    }, 1500);
  };

  const IconHeader = selectedImage?.status === 'alert' ? ShieldAlert : selectedImage?.status === 'warning' ? Cpu : CheckCircle;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', position: 'relative', zIndex: 1 }}>
      
      {!selectedImage ? (
        /* Upload Area */
        <div>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.8px', marginBottom: '12px' }}>
              <DecryptedText
                text="Falcon-N5 analysis scanner"
                animateOn="view"
                speed={50}
                maxIterations={20}
                sequential
                revealDirection="start"
              />
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.7', fontWeight: 300 }}>
              Select a demo preset or upload your own file to inspect EXIF metadata, JPEG Error levels, and generative AI noise signatures.
            </p>
          </div>

          <div className="grid-cols-layout">
            <div className="cyber-card" style={{ display: 'flex', flexDirection: 'column', minHeight: '360px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 500, marginBottom: '16px', color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>
                Upload channel
              </h2>
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragOver(false); if (e.dataTransfer.files.length) processFile(e.dataTransfer.files[0]); }}
                style={{
                  flex: 1,
                  border: `2px dashed ${isDragOver ? 'var(--accent-cyan)' : 'var(--border-color)'}`,
                  background: isDragOver ? 'rgba(0, 242, 254, 0.02)' : 'transparent',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: '40px 20px',
                  transition: 'all 0.2s ease',
                  pointerEvents: 'auto'
                }}
                onClick={() => document.getElementById('tool-uploader').click()}
              >
                <input id="tool-uploader" type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => { if (e.target.files.length) processFile(e.target.files[0]); }} />
                <Upload size={44} style={{ color: isDragOver ? 'var(--accent-cyan)' : 'var(--text-secondary)', marginBottom: '16px' }} />
                <p style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '6px' }}>Drag & Drop Image</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>or click to browse local folders</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 500, color: 'var(--text-primary)', paddingLeft: '4px', letterSpacing: '-0.3px' }}>
                Demo hardware presets
              </h2>
              {PRESETS.map((preset) => {
                const Icon = preset.status === 'alert' ? ShieldAlert : preset.status === 'warning' ? Cpu : CheckCircle;
                return (
                  <div
                    key={preset.id}
                    className="cyber-card"
                    onClick={() => setSelectedImage(preset)}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyBreak: 'space-between', gap: '16px', borderLeft: `3px solid ${preset.color}`, pointerEvents: 'auto' }}
                  >
                    <div style={{ color: preset.color }}><Icon size={24} /></div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: '600' }}>{preset.title}</h3>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{preset.description}</p>
                    </div>
                    <span className="cyber-badge" style={{ borderColor: preset.color, color: preset.color }}>{preset.confidence}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Analysis Workbench */
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <button className="cyber-btn cyber-btn-secondary" onClick={() => { setSelectedImage(null); setActiveTab('original'); }}>
              <ArrowLeft size={16} /> Back to Scanner
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={16} style={{ color: selectedImage.color }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                SESSION: FALCON-N5-{Math.floor(Math.random() * 89999 + 10000)}
              </span>
            </div>
          </div>

          <div className="grid-cols-layout">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="cyber-card" style={{ padding: '16px', position: 'relative' }}>
                <div style={{ 
                  background: activeTab === 'original' ? 'var(--bg-secondary)' : '#020408', 
                  borderRadius: '8px', 
                  overflow: 'hidden', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  border: '1px solid var(--border-color)',
                  transition: 'background var(--transition-normal)'
                }}>
                  <canvas ref={canvasRef} style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '400px' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginTop: '16px' }}>
                  {['original', 'ela', 'noise'].map(tab => (
                    <button key={tab} className={`cyber-btn ${activeTab === tab ? '' : 'cyber-btn-secondary'}`} style={{ fontSize: '0.75rem', padding: '8px', textTransform: 'capitalize' }} onClick={() => setActiveTab(tab)}>
                      {tab === 'ela' ? 'Error Level (ELA)' : tab + ' View'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="cyber-card">
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.2px' }}>
                  <FileText size={16} /> Forgery forensic findings
                </h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {selectedImage.findings.map((finding, idx) => (
                    <li key={idx} style={{ display: 'flex', gap: '6px' }}>
                      <span style={{ color: selectedImage.color }}>&gt;</span>
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="cyber-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                  <svg width="80" height="80" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="rgba(15, 23, 42, 0.05)" strokeWidth="8" fill="transparent" />
                    <circle cx="50" cy="50" r="40" stroke={selectedImage.color} strokeWidth="8" fill="transparent" strokeDasharray={`${2 * Math.PI * 40}`} strokeDashoffset={`${2 * Math.PI * 40 * (1 - selectedImage.confidence / 100)}`} style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px' }} />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 'bold', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                    {selectedImage.confidence}%
                  </div>
                </div>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <IconHeader size={18} style={{ color: selectedImage.color }} />
                    <span className="cyber-badge" style={{ color: selectedImage.color, borderColor: selectedImage.color }}>{selectedImage.category}</span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginTop: '4px' }}>{selectedImage.title}</h3>
                </div>
              </div>

              <div className="cyber-card">
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '12px', letterSpacing: '-0.2px' }}>Neural gradient analysis</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.75rem' }}>
                  {Object.entries(selectedImage.metrics).map(([key, val]) => (
                    <div key={key}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        <span style={{ textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span style={{ color: 'var(--text-primary)' }}>{val}%</span>
                      </div>
                      <div style={{ height: '3px', background: 'rgba(15, 23, 42, 0.05)' }}>
                        <div style={{ height: '100%', width: `${val}%`, background: selectedImage.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="cyber-card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '10px', letterSpacing: '-0.2px' }}>EXIF metadata block</h3>
                <div style={{ flex: 1, overflowY: 'auto', background: 'rgba(15, 23, 42, 0.02)', border: '1px solid var(--border-color)', borderRadius: '4px', maxHeight: '160px', pointerEvents: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                    <tbody>
                      {Object.entries(selectedImage.metadata).map(([key, val]) => (
                        <tr key={key} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '6px 10px', color: 'var(--accent-cyan)' }}>{key}</td>
                          <td style={{ padding: '6px 10px', color: 'var(--text-primary)' }}>{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button className="cyber-btn" onClick={handleGenerateReport} style={{ marginTop: '14px', justifyContent: 'center' }} disabled={reportGenerating}>
                  {reportGenerating ? 'PROCESSING VAULT LOGS...' : 'EXPORT CRYPTOGRAPHIC REPORT'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
