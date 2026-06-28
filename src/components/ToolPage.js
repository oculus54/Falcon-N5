import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ShieldAlert, Cpu, CheckCircle, FileText, Activity, Upload } from 'lucide-react';
import { Progress } from './animate-ui/components/radix/progress';

const BACKEND_URL = 'http://127.0.0.1:8000'; // Paste your backend URL here (e.g. 'http://127.0.0.1:8000')
const BACKEND_URL_DEEPFAKE = 'http://127.0.0.1:8001';
const BACKEND_URL_VIDEO = 'http://localhost:8002';

// Helper canvas filtering functions
const isDummyVisualization = (src) => {
  return !src || src.length < 500;
};

const drawProceduralHistogram = (ctx, width, height, histogramData) => {
  ctx.fillStyle = '#060814';
  ctx.fillRect(0, 0, width, height);
  
  // Draw grid
  ctx.strokeStyle = 'rgba(0, 242, 254, 0.05)';
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
  }
  for (let y = 0; y < height; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
  }

  const rData = histogramData?.r || [31596, 120, 45, 0, 0];
  const gData = histogramData?.g || [0, 10, 400, 312, 12];
  const bData = histogramData?.b || [800, 245, 90, 12, 0];

  const drawChannel = (data, color) => {
    ctx.strokeStyle = color;
    ctx.fillStyle = color.replace('1)', '0.15)');
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    
    const step = width / (data.length - 1);
    const maxVal = Math.max(...rData, ...gData, ...bData, 1);
    
    ctx.moveTo(0, height);
    for (let i = 0; i < data.length; i++) {
      const x = i * step;
      const y = height - (data[i] / maxVal) * (height * 0.7) - 40;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  drawChannel(rData, 'rgba(239, 68, 68, 1)');
  drawChannel(gData, 'rgba(16, 185, 129, 1)');
  drawChannel(bData, 'rgba(59, 130, 246, 1)');

  // Label
  ctx.fillStyle = '#ffffff';
  ctx.font = '10px JetBrains Mono';
  ctx.fillText('COLOR HISTOGRAM SPECTRUM (R, G, B)', 20, 30);
};

const drawProceduralFFT = (ctx, width, height, fftData) => {
  ctx.fillStyle = '#060814';
  ctx.fillRect(0, 0, width, height);

  // Draw grid
  ctx.strokeStyle = 'rgba(0, 242, 254, 0.05)';
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
  }
  for (let y = 0; y < height; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
  }

  const energies = fftData?.angular_energy || [177.2413, 149.2343, 143.0583];

  // Draw frequency spectrum spikes
  ctx.strokeStyle = '#00f2fe';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  const points = 40;
  const step = width / points;
  ctx.moveTo(0, height - 50);
  
  for (let i = 0; i <= points; i++) {
    const x = i * step;
    let noise = Math.sin(i * 0.5) * 40 + Math.cos(i * 1.2) * 20;
    if (i % 5 === 0) noise += (energies[i % energies.length] || 100) * 0.4;
    const y = Math.max(50, height - 100 - Math.abs(noise));
    ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Center frequency dome
  const centerGrad = ctx.createRadialGradient(width/2, height/2, 5, width/2, height/2, 120);
  centerGrad.addColorStop(0, 'rgba(0, 242, 254, 0.4)');
  centerGrad.addColorStop(0.5, 'rgba(82, 39, 255, 0.15)');
  centerGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = centerGrad;
  ctx.beginPath();
  ctx.arc(width/2, height/2, 120, 0, Math.PI * 2);
  ctx.fill();

  // Pulse rings
  ctx.strokeStyle = 'rgba(0, 242, 254, 0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(width/2, height/2, 60, 0, Math.PI * 2);
  ctx.stroke();

  // Text
  ctx.fillStyle = '#ffffff';
  ctx.font = '10px JetBrains Mono';
  ctx.fillText('FFT SPATIAL FREQUENCY MAGNITUDE', 20, 30);
  ctx.fillText(`ANGULAR ENERGIES: ${energies.map(e => typeof e === 'number' ? e.toFixed(2) : e).join(', ')}`, 20, 50);
};

const drawProceduralPolar = (ctx, width, height, fftData) => {
  ctx.fillStyle = '#060814';
  ctx.fillRect(0, 0, width, height);

  const cX = width / 2;
  const cY = height / 2;
  const maxRadius = 150;

  // Radial grid
  ctx.strokeStyle = 'rgba(0, 242, 254, 0.1)';
  ctx.lineWidth = 1;
  for (let r = 30; r <= maxRadius; r += 30) {
    ctx.beginPath();
    ctx.arc(cX, cY, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Angular grid lines
  for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 6) {
    ctx.beginPath();
    ctx.moveTo(cX, cY);
    ctx.lineTo(cX + Math.cos(angle) * maxRadius, cY + Math.sin(angle) * maxRadius);
    ctx.stroke();
  }

  // Draw polar energy map
  const energies = fftData?.angular_energy || [177.2413, 149.2343, 143.0583];
  ctx.strokeStyle = '#ff007f';
  ctx.fillStyle = 'rgba(255, 0, 127, 0.15)';
  ctx.lineWidth = 2;
  ctx.beginPath();

  const numSectors = 24;
  for (let i = 0; i <= numSectors; i++) {
    const angle = (i / numSectors) * Math.PI * 2;
    const energyBase = energies[i % energies.length] || 150;
    const radius = Math.min(maxRadius, (energyBase / 200) * 110 + Math.sin(angle * 6) * 12);
    const x = cX + Math.cos(angle) * radius;
    const y = cY + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Nodes
  ctx.fillStyle = '#ff007f';
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const energyBase = energies[i % energies.length] || 150;
    const radius = (energyBase / 200) * 110 + Math.sin(angle * 6) * 12;
    ctx.beginPath();
    ctx.arc(cX + Math.cos(angle) * radius, cY + Math.sin(angle) * radius, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Text
  ctx.fillStyle = '#ffffff';
  ctx.font = '10px JetBrains Mono';
  ctx.fillText('POLAR ANGULAR DENSITY PROJECTION', 20, 30);
};

const drawProceduralCombined = (ctx, width, height, imageSrc) => {
  ctx.fillStyle = '#060814';
  ctx.fillRect(0, 0, width, height);

  const drawGrid = () => {
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }
  };

  if (imageSrc) {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const scale = Math.max(width / img.width, height / img.height);
      const x = (width / 2) - (img.width / 2) * scale;
      const y = (height / 2) - (img.height / 2) * scale;
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

      // Overlay combined forensic details
      ctx.strokeStyle = 'rgba(255, 0, 127, 0.4)';
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 40, width - 80, height - 80);

      // Target brackets
      ctx.strokeStyle = '#00f2fe';
      ctx.lineWidth = 3;
      const offset = 40;
      const size = 15;
      
      // Top-left
      ctx.beginPath(); ctx.moveTo(offset, offset + size); ctx.lineTo(offset, offset); ctx.lineTo(offset + size, offset); ctx.stroke();
      // Top-right
      ctx.beginPath(); ctx.moveTo(width - offset, offset + size); ctx.lineTo(width - offset, offset); ctx.lineTo(width - offset - size, offset); ctx.stroke();
      // Bottom-left
      ctx.beginPath(); ctx.moveTo(offset, height - offset - size); ctx.lineTo(offset, height - offset); ctx.lineTo(offset + size, height - offset); ctx.stroke();
      // Bottom-right
      ctx.beginPath(); ctx.moveTo(width - offset, height - offset - size); ctx.lineTo(width - offset, height - offset); ctx.lineTo(width - offset - size, height - offset); ctx.stroke();

      // Fake signature warning scanner line
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(40, height/2);
      ctx.lineTo(width - 40, height/2);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '10px JetBrains Mono';
      ctx.fillText('COMBINED FORENSIC SCAN OVERLAY', 20, 30);
    };
  } else {
    drawGrid();
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px JetBrains Mono';
    ctx.fillText('COMBINED SCAN (AWAITING IMAGE)', 20, 30);
  }
};

const getTabsForChannel = (channel) => {
  if (channel === 'ela') {
    return ['original', 'histogram', 'fft_magnitude', 'polar_energy'];
  } else if (channel === 'metadata') {
    return ['original', 'gradcam'];
  } else if (channel === 'deepfake') {
    return ['original', 'gradcam'];
  } else {
    return ['original', 'ela', 'noise'];
  }
};

// Helper canvas filtering functions
const applyGradCamFilter = (ctx, width, height) => {
  const cX = width * 0.4 + Math.random() * width * 0.2;
  const cY = height * 0.4 + Math.random() * height * 0.2;
  const radius = Math.min(width, height) * 0.35;
  
  const grad = ctx.createRadialGradient(cX, cY, radius * 0.05, cX, cY, radius);
  grad.addColorStop(0, 'rgba(255, 0, 127, 0.55)');
  grad.addColorStop(0.25, 'rgba(245, 158, 11, 0.45)');
  grad.addColorStop(0.55, 'rgba(255, 255, 0, 0.2)');
  grad.addColorStop(0.8, 'rgba(82, 39, 255, 0.1)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);
};

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
  const [dragOverChannel, setDragOverChannel] = useState(null);
  const [reportGenerating, setReportGenerating] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [pendingSimData, setPendingSimData] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [currentChannel, setCurrentChannel] = useState('metadata');
  const canvasRef = useRef(null);
  
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (selectedImage?.status !== 'analyzing') {
      setProgress(0);
      return;
    }
    
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 25;
      });
    }, 2000);
    return () => clearInterval(timer);
  }, [selectedImage?.status]);

  useEffect(() => {
    if (progress >= 100) {
      const resetTimer = setTimeout(() => setProgress(0), 4000);
      return () => clearTimeout(resetTimer);
    }
  }, [progress]);

  useEffect(() => {
    if (!selectedImage || selectedImage.isVideo) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = 600;
    const height = 400;
    canvas.width = width;
    canvas.height = height;

    if (selectedImage.imageSrc) {
      if (selectedImage.channel === 'ela' && activeTab !== 'original') {
        const visSrc = selectedImage.apiResponse?.visualizations?.[activeTab];
        if (visSrc && !isDummyVisualization(visSrc)) {
          const visImg = new Image();
          visImg.src = visSrc;
          visImg.onload = () => {
            ctx.clearRect(0, 0, width, height);
            const scale = Math.min(width / visImg.width, height / visImg.height);
            const x = (width / 2) - (visImg.width / 2) * scale;
            const y = (height / 2) - (visImg.height / 2) * scale;
            ctx.drawImage(visImg, x, y, visImg.width * scale, visImg.height * scale);
          };
        } else {
          // Draw procedural visualizations for dummy data / simulation
          if (activeTab === 'combined') {
            drawProceduralCombined(ctx, width, height, selectedImage.imageSrc);
          } else if (activeTab === 'histogram') {
            drawProceduralHistogram(ctx, width, height, selectedImage.apiResponse?.histogram);
          } else if (activeTab === 'fft_magnitude') {
            drawProceduralFFT(ctx, width, height, selectedImage.apiResponse?.fft);
          } else if (activeTab === 'polar_energy') {
            drawProceduralPolar(ctx, width, height, selectedImage.apiResponse?.fft);
          }
        }
      } else {
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
          } else if (activeTab === 'gradcam') {
            if (selectedImage.gradcamSrc && !selectedImage.gradcamSrc.endsWith('...')) {
              const gradcamImg = new Image();
              gradcamImg.src = selectedImage.gradcamSrc;
              gradcamImg.onload = () => {
                ctx.clearRect(0, 0, width, height);
                ctx.drawImage(gradcamImg, x, y, img.width * scale, img.height * scale);
              };
            } else {
              applyGradCamFilter(ctx, width, height);
            }
          }
        };
      }
    } else {
      drawProceduralGraphic(ctx, width, height, selectedImage.id, activeTab, theme);
    }
  }, [selectedImage, activeTab, theme]);


  const processFile = async (file, channel = 'metadata') => {
    setCurrentFile(file);
    setCurrentChannel(channel);
    const isVideo = file.type.startsWith('video/');
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      alert('Please upload an image or video file.');
      return;
    }

    // Show temporary analyzing workbench
    setSelectedImage({
      id: 'uploading',
      title: file.name,
      status: 'analyzing',
      color: '#5227FF',
      isVideo: isVideo,
      findings: ['Initializing network connection...', 'Awaiting API response...'],
      metrics: {},
      metadata: {}
    });
    setApiError(null);

    // Prepare FormData payload for the backend API
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Determine the API endpoint based on channel
      let endpoint = '';
      if (channel === 'deepfake') {
        endpoint = `${BACKEND_URL_VIDEO}/detect`;
      } else if (channel === 'ela') {
        if (!BACKEND_URL_DEEPFAKE) {
          const error = new Error('Deepfake image backend URL is not configured.');
          error.status = 503;
          error.statusText = 'Service Unavailable';
          throw error;
        }
        endpoint = `${BACKEND_URL_DEEPFAKE}/analyze`;
      } else {
        if (!BACKEND_URL) {
          const error = new Error('Backend URL is not configured in the frontend.');
          error.status = 503;
          error.statusText = 'Service Unavailable';
          throw error;
        }
        endpoint = `${BACKEND_URL}/analyze`;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData, // Send file as multipart/form-data
      });
      
      // If the backend returns a non-200 status code
      if (!response.ok) {
        let errorMsg = `HTTP Error ${response.status}: ${response.statusText}`;
        try {
          const errData = await response.json();
          if (errData && errData.error) {
            errorMsg = errData.error; // Extract standard backend error message
          }
        } catch (_) {}
        
        const error = new Error(errorMsg);
        error.status = response.status;
        error.statusText = response.statusText;
        throw error;
      }
      
      const data = await response.json();

      if (data && (data.success === false || data.success === 'false')) {
        const error = new Error(data.error || 'The forensic model returned a failure response.');
        error.status = response.status || 500;
        error.statusText = response.statusText || 'Internal Server Error';
        throw error;
      }
      
      // Read file to get original imageSrc/videoSrc, then map API payload
      const reader = new FileReader();
      reader.onload = (e) => {
        let status = 'success';
        let color = '#10b981';
        const predLower = (data.prediction || '').toLowerCase();
        if (predLower.includes('generated') || predLower.includes('tampered') || predLower.includes('fake') || predLower.includes('ai')) {
          status = 'alert';
          color = '#ff007f';
        } else if (predLower.includes('warning') || predLower.includes('spliced') || predLower.includes('no face')) {
          status = 'warning';
          color = '#f59e0b';
        }

        const adaptedImage = {
          id: 'uploaded',
          title: file.name,
          description: `Uploaded size: ${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          imageSrc: isVideo ? null : e.target.result,
          videoSrc: isVideo ? e.target.result : null,
          gradcamSrc: channel === 'ela' ? null : (channel === 'deepfake' ? (data.gradcam_img || null) : (data.gradcam_base64 || null)),
          isVideo: isVideo,
          category: data.prediction || 'Unknown Result',
          confidence: channel === 'deepfake' ? (parseFloat(data.avg_confidence) * 100 || 0) : (parseFloat(data.confidence) || 0),
          status: status,
          color: color,
          channel: channel,
          metadata: channel === 'ela' ? {
            'File Name': data.image_metadata?.filename || file.name,
            'Dimensions': data.image_metadata ? `${data.image_metadata.width} x ${data.image_metadata.height}` : 'Unknown',
            'Model Loaded': data.model_loaded ? 'True' : 'False',
            'Prediction': data.prediction || 'N/A',
            'Confidence': `${(parseFloat(data.confidence) || 0).toFixed(2)}%`,
            'FFT Angular Energy': data.fft?.angular_energy ? data.fft.angular_energy.map(v => typeof v === 'number' ? v.toFixed(4) : v).join(', ') : 'N/A',
            'Timestamp': new Date().toISOString().replace('T', ' ').substring(0, 19)
          } : (channel === 'deepfake' ? {
            'File Name': file.name,
            'File Size': `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
            'Format': file.type.replace('video/', '').toUpperCase(),
            'Prediction': data.prediction || 'N/A',
            'Average Confidence': `${(parseFloat(data.avg_confidence) * 100 || 0).toFixed(2)}%`,
            'Top Confidence': `${(parseFloat(data.top_confidence) * 100 || 0).toFixed(2)}%`,
            'Consistency Diff': `${(parseFloat(data.consistency_diff) * 100 || 0).toFixed(2)}%`,
            'Timestamp': new Date().toISOString().replace('T', ' ').substring(0, 19)
          } : {
            'File Name': file.name,
            'File Size': `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
            'Format': isVideo ? file.type.replace('video/', '').toUpperCase() : file.type.replace('image/', '').toUpperCase(),
            'Model Engine': 'Swin-Transformer (swin_base_patch4)',
            'Timestamp': new Date().toISOString().replace('T', ' ').substring(0, 19)
          }),
          metrics: channel === 'ela' ? (data.probabilities || {
            'AI-generated': parseFloat(data.confidence) || 0,
            'Real': 100 - (parseFloat(data.confidence) || 0)
          }) : (channel === 'deepfake' ? {
            'Average Confidence': parseFloat(data.avg_confidence) * 100 || 0,
            'Top Confidence': parseFloat(data.top_confidence) * 100 || 0,
            'Consistency Difference': parseFloat(data.consistency_diff) * 100 || 0
          } : (data.probabilities || {
            'Prediction Confidence': parseFloat(data.confidence) || 0
          })),
          findings: channel === 'ela' ? [
            `Model prediction: "${data.prediction || 'N/A'}".`,
            `Confidence level evaluated at ${(parseFloat(data.confidence) || 0).toFixed(2)}%.`,
            `Multi-spectral analysis visualizations generated.`
          ] : (channel === 'deepfake' ? [
            `Model prediction: "${data.prediction || 'N/A'}".`,
            `Average confidence level: ${(parseFloat(data.avg_confidence) * 100 || 0).toFixed(2)}%.`,
            `Top frame confidence: ${(parseFloat(data.top_confidence) * 100 || 0).toFixed(2)}%.`,
            `Consistency difference: ${(parseFloat(data.consistency_diff) * 100 || 0).toFixed(2)}%.`
          ] : [
            `Model prediction: "${data.prediction || 'N/A'}".`,
            `Confidence level evaluated at ${(parseFloat(data.confidence) || 0).toFixed(2)}%.`,
            `Grad-CAM visualization overlay retrieved successfully.`
          ]),
          apiResponse: data
        };

        setSelectedImage(adaptedImage);
      };

      if (isVideo) {
        const url = URL.createObjectURL(file);
        reader.onload({ target: { result: url } });
      } else {
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.warn('API connection failed, returning HTTP error:', err);
      
      const endpoint = channel === 'ela' ? `${BACKEND_URL_DEEPFAKE}/analyze` : `${BACKEND_URL}/analyze`;

      // Construct user-friendly HTTP error screen data
      setApiError({
        status: err.status || 503,
        statusText: err.statusText || 'Service Unavailable',
        message: err.message || 'Failed to establish connection to the remote forensic model. The backend server is currently offline or unreachable.',
        endpoint: BACKEND_URL ? endpoint : 'unconfigured',
        timestamp: new Date().toISOString()
      });

      // Prepare simulation data as fallback in case the user clicks 'Bypass & Run Simulation'
      const reader = new FileReader();
      reader.onload = (e) => {
        const simImage = generateSimulationData(file, channel, e.target.result, isVideo);
        setPendingSimData(simImage);
      };
      if (isVideo) {
        const url = URL.createObjectURL(file);
        reader.onload({ target: { result: url } });
      } else {
        reader.readAsDataURL(file);
      }
    }
  };

  const generateSimulationData = (file, channel, result, isVideo) => {
    let userImage = {
      id: 'uploaded',
      title: file.name,
      description: `Uploaded size: ${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      imageSrc: isVideo ? null : result,
      videoSrc: isVideo ? result : null,
      isVideo: isVideo,
      category: 'Analyzing...',
      confidence: 0,
      status: 'analyzing',
      color: '#5227FF',
      metadata: {
        Software: 'Unknown / Stripped',
        Dimensions: 'Detecting...',
        Format: isVideo ? file.type.replace('video/', '').toUpperCase() : file.type.replace('image/', '').toUpperCase(),
        Camera: 'Generic Web Capture',
        GPS: 'Not Available',
        Timestamp: new Date(file.lastModified).toISOString().replace('T', ' ').substring(0, 19)
      },
      metrics: {
        elaMaxDeviation: Math.floor(Math.random() * 20) + 10,
        noiseInconsistency: Math.floor(Math.random() * 20) + 10,
        ganSignature: Math.floor(Math.random() * 20) + 10,
        doubleCompression: Math.floor(Math.random() * 20) + 10
      },
      findings: [
        'API handshake validated...',
        'Forensic analysis log stream active.'
      ]
    };

    if (channel === 'metadata') {
      const authProb = Math.round((Math.random() * 10 + 89) * 10000) / 10000;
      const tampProb = Math.round((100 - authProb) * 10000) / 10000;
      const prediction = authProb > 50 ? "Authentic Image" : "Tampered Image";

      userImage.color = authProb > 50 ? '#10b981' : '#ff007f';
      userImage.category = prediction;
      userImage.status = authProb > 50 ? 'success' : 'alert';
      userImage.confidence = authProb > 50 ? authProb : tampProb;
      userImage.channel = 'metadata';
      
      userImage.apiResponse = {
        success: true,
        prediction: prediction,
        confidence: userImage.confidence,
        gradcam_base64: "data:image/png;base64,iVBORw0KGgoAAAANS...",
        probabilities: {
          "Authentic Image": authProb,
          "Tampered Image": tampProb
        }
      };

      userImage.metrics = {
        'Authentic Image': authProb,
        'Tampered Image': tampProb
      };

      userImage.findings = [
        `Model output prediction: "${prediction}".`,
        `Confidence rating is verified at ${userImage.confidence}%.`,
        `Grad-CAM visualization highlights key focus regions.`
      ];
    } else if (channel === 'ela') {
      const aiProb = Math.round((Math.random() * 10 + 89) * 100) / 100;
      const realProb = Math.round((100 - aiProb) * 100) / 100;
      const confidence = aiProb;

      userImage.color = '#ff007f';
      userImage.category = 'AI-generated';
      userImage.status = 'alert';
      userImage.confidence = confidence;
      userImage.channel = 'ela';
      
      userImage.apiResponse = {
        status: "success",
        image_metadata: {
          width: 1920,
          height: 1080,
          filename: file.name
        },
        model_loaded: true,
        prediction: "AI-generated",
        confidence: confidence,
        probabilities: {
          "AI-generated": aiProb,
          "Real": realProb
        },
        histogram: {
          r: [31596, 120, 45, 0, 0], 
          g: [0, 10, 400, 312, 12], 
          b: [800, 245, 90, 12, 0] 
        },
        fft: {
          angular_energy: [
            177.2413 + Math.random() * 5 - 2.5,
            149.2343 + Math.random() * 5 - 2.5,
            143.0583 + Math.random() * 5 - 2.5
          ]
        },
        visualizations: {
          combined: "data:image/png;base64,iVBORw0KGgoAAAANS...",
          histogram: "data:image/png;base64,iVBORw0KGgoAAAANS...",
          fft_magnitude: "data:image/png;base64,iVBORw0KGgoAAAANS...",
          polar_energy: "data:image/png;base64,iVBORw0KGgoAAAANS..."
        }
      };

      userImage.metadata = {
        'File Name': file.name,
        'Dimensions': '1920 x 1080',
        'Model Loaded': 'True',
        'Prediction': 'AI-generated',
        'FFT Angular Energy': userImage.apiResponse.fft.angular_energy.map(v => v.toFixed(4)).join(', '),
        'Timestamp': new Date().toISOString().replace('T', ' ').substring(0, 19)
      };

      userImage.metrics = {
        'AI-generated': aiProb,
        'Real': realProb
      };

      userImage.findings = [
        `Model prediction: "AI-generated".`,
        `Confidence level evaluated at ${confidence.toFixed(2)}%.`,
        `Multi-spectral analysis visualizations generated.`
      ];
    } else if (channel === 'deepfake') {
      const avg = Math.random() * 0.2 + 0.7; // average confidence around 70-90%
      const top = avg + Math.random() * 0.1;
      const diff = top - avg;
      const prediction = avg > 0.5 ? "FAKE" : "REAL";

      userImage.color = prediction === "FAKE" ? '#ff007f' : '#10b981';
      userImage.category = prediction;
      userImage.status = prediction === "FAKE" ? 'alert' : 'success';
      userImage.confidence = avg * 100;
      userImage.channel = 'deepfake';
      userImage.gradcamSrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="; // small 1x1 base64 png dot
      
      userImage.apiResponse = {
        prediction: prediction,
        avg_confidence: avg,
        top_confidence: top,
        consistency_diff: diff,
        gradcam_img: userImage.gradcamSrc
      };

      userImage.metrics = {
        'Average Confidence': avg * 100,
        'Top Confidence': top * 100,
        'Consistency Difference': diff * 100
      };

      userImage.metadata = {
        'File Name': file.name,
        'File Size': `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        'Format': file.type.replace('video/', '').toUpperCase(),
        'Prediction': prediction,
        'Average Confidence': `${(avg * 100).toFixed(2)}%`,
        'Top Confidence': `${(top * 100).toFixed(2)}%`,
        'Consistency Diff': `${(diff * 100).toFixed(2)}%`,
        'Timestamp': new Date().toISOString().replace('T', ' ').substring(0, 19)
      };

      userImage.findings = [
        `Model prediction: "${prediction}".`,
        `Average confidence level: ${(avg * 100).toFixed(2)}%.`,
        `Top frame confidence: ${(top * 100).toFixed(2)}%.`,
        `Consistency difference: ${(diff * 100).toFixed(2)}%.`
      ];
    }

    return userImage;
  };

  const handleGenerateReport = () => {
    setReportGenerating(true);
    setTimeout(() => {
      setReportGenerating(false);
      alert(`Report generated for ${selectedImage.title}.`);
    }, 1500);
  };

  const runSimulation = () => {
    if (!pendingSimData) return;
    setApiError(null);
    setSelectedImage({
      ...pendingSimData,
      status: 'analyzing', // Keep it analyzing to show loading
    });
    setProgress(0);

    // Transition to completed status after 2.5 seconds
    setTimeout(() => {
      setSelectedImage(pendingSimData);
    }, 2500);
  };

  const IconHeader = selectedImage?.status === 'alert' ? ShieldAlert : selectedImage?.status === 'warning' ? Cpu : CheckCircle;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', position: 'relative', zIndex: 1 }}>
      
      {!selectedImage ? (
        /* Upload Area */
        <div>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.8px', marginBottom: '12px' }}>
              Falcon-N5 analysis scanner
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.7', fontWeight: 300 }}>
              Select a demo preset or upload your own file to inspect EXIF metadata, JPEG Error levels, and generative AI noise signatures.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            width: '100%',
            pointerEvents: 'auto'
          }}>
            {/* Forge Image Detection */}
            <div className="cyber-card" style={{ display: 'flex', flexDirection: 'column', minHeight: '260px', borderTop: '4px solid #5227FF' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', marginTop: '8px' }}>
                Forge Image Detection
              </h3>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOverChannel('metadata'); }}
                onDragLeave={() => setDragOverChannel(null)}
                onDrop={(e) => { e.preventDefault(); setDragOverChannel(null); if (e.dataTransfer.files.length) processFile(e.dataTransfer.files[0], 'metadata'); }}
                style={{
                  flex: 1,
                  border: `2px dashed ${dragOverChannel === 'metadata' ? '#5227FF' : 'var(--border-color)'}`,
                  background: dragOverChannel === 'metadata' ? 'rgba(82, 39, 255, 0.05)' : 'transparent',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: '24px 16px',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => document.getElementById('metadata-uploader').click()}
              >
                <input id="metadata-uploader" type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => { if (e.target.files.length) processFile(e.target.files[0], 'metadata'); }} />
                <Upload size={28} style={{ color: dragOverChannel === 'metadata' ? '#5227FF' : 'var(--text-secondary)', marginBottom: '8px' }} />
                <p style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '2px' }}>Drag & Drop Image</p>
                <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>or click to upload</p>
              </div>
            </div>

            {/* Deepfake Image Detection */}
            <div className="cyber-card" style={{ display: 'flex', flexDirection: 'column', minHeight: '260px', borderTop: '4px solid #f59e0b' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', marginTop: '8px' }}>
                Deepfake Image Detection
              </h3>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOverChannel('ela'); }}
                onDragLeave={() => setDragOverChannel(null)}
                onDrop={(e) => { e.preventDefault(); setDragOverChannel(null); if (e.dataTransfer.files.length) processFile(e.dataTransfer.files[0], 'ela'); }}
                style={{
                  flex: 1,
                  border: `2px dashed ${dragOverChannel === 'ela' ? '#f59e0b' : 'var(--border-color)'}`,
                  background: dragOverChannel === 'ela' ? 'rgba(245, 158, 11, 0.05)' : 'transparent',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: '24px 16px',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => document.getElementById('ela-uploader').click()}
              >
                <input id="ela-uploader" type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => { if (e.target.files.length) processFile(e.target.files[0], 'ela'); }} />
                <Upload size={28} style={{ color: dragOverChannel === 'ela' ? '#f59e0b' : 'var(--text-secondary)', marginBottom: '8px' }} />
                <p style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '2px' }}>Drag & Drop Image</p>
                <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>or click to upload</p>
              </div>
            </div>

            {/* Deepfake Video Detection */}
            <div className="cyber-card" style={{ display: 'flex', flexDirection: 'column', minHeight: '260px', borderTop: '4px solid #ff007f' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', marginTop: '8px' }}>
                Deepfake Video Detection
              </h3>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOverChannel('deepfake'); }}
                onDragLeave={() => setDragOverChannel(null)}
                onDrop={(e) => { e.preventDefault(); setDragOverChannel(null); if (e.dataTransfer.files.length) processFile(e.dataTransfer.files[0], 'deepfake'); }}
                style={{
                  flex: 1,
                  border: `2px dashed ${dragOverChannel === 'deepfake' ? '#ff007f' : 'var(--border-color)'}`,
                  background: dragOverChannel === 'deepfake' ? 'rgba(255, 0, 127, 0.05)' : 'transparent',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: '24px 16px',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => document.getElementById('deepfake-uploader').click()}
              >
                <input id="deepfake-uploader" type="file" accept="video/*" style={{ display: 'none' }} onChange={(e) => { if (e.target.files.length) processFile(e.target.files[0], 'deepfake'); }} />
                <Upload size={28} style={{ color: dragOverChannel === 'deepfake' ? '#ff007f' : 'var(--text-secondary)', marginBottom: '8px' }} />
                <p style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '2px' }}>Drag & Drop Video</p>
                <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>or click to upload</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Analysis Workbench or HTTP Error */
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <button className="cyber-btn cyber-btn-secondary" onClick={() => { setSelectedImage(null); setApiError(null); setActiveTab('original'); }}>
              <ArrowLeft size={16} /> Back to Scanner
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={16} style={{ color: selectedImage.color }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                SESSION: FALCON-N5-{Math.floor(Math.random() * 89999 + 10000)}
              </span>
            </div>
          </div>

          {apiError ? (
            /* HTTP Error Screen */
            <div className="cyber-card" style={{ borderLeft: '4px solid #ff007f', padding: '40px', maxWidth: '800px', margin: '0 auto', pointerEvents: 'auto', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  background: 'rgba(255, 0, 127, 0.1)',
                  border: '1px solid rgba(255, 0, 127, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ff007f'
                }}>
                  <ShieldAlert size={28} />
                </div>
                <div>
                  <span className="cyber-badge" style={{ color: '#ff007f', borderColor: '#ff007f', background: 'rgba(255, 0, 127, 0.05)' }}>
                    HTTP {apiError.status} : {apiError.statusText}
                  </span>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--text-primary)', marginTop: '6px' }}>
                    Forensic Model Connection Failed
                  </h2>
                </div>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '24px' }}>
                {apiError.message} Make sure that the backend API server is online and running.
              </p>

              <div style={{ background: 'rgba(15, 23, 42, 0.03)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '16px', marginBottom: '28px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Target Endpoint:</span>
                  <span style={{ color: 'var(--text-primary)' }}>{apiError.endpoint}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Connection Status:</span>
                  <span style={{ color: '#ff007f' }}>ERR_CONNECTION_REFUSED</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Timestamp:</span>
                  <span style={{ color: 'var(--text-primary)' }}>{apiError.timestamp}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="cyber-btn" onClick={() => processFile(currentFile, currentChannel)}>
                  Retry Connection
                </button>
                <button className="cyber-btn cyber-btn-secondary" onClick={runSimulation}>
                  Bypass & Run Simulation
                </button>
              </div>
            </div>
          ) : (
            /* Regular Workbench (Canvas, findings, etc.) */
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
                  {selectedImage.status === 'analyzing' ? (
                    <div style={{ 
                      width: '100%', 
                      height: '320px', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      padding: '24px'
                    }}>
                      <Progress value={progress} style={{ width: '300px' }} className="w-[300px]" />
                    </div>
                  ) : selectedImage.isVideo ? (
                    activeTab === 'gradcam' && selectedImage.gradcamSrc ? (
                      <img 
                        src={selectedImage.gradcamSrc} 
                        style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '400px', objectFit: 'contain' }} 
                        alt="Grad-CAM Activation Map"
                      />
                    ) : (
                      <video 
                        src={selectedImage.videoSrc} 
                        controls 
                        autoPlay 
                        loop 
                        style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '400px', outline: 'none' }} 
                      />
                    )
                  ) : (
                    <canvas ref={canvasRef} style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '400px' }} />
                  )}
                </div>
                {(!selectedImage.isVideo || selectedImage.channel === 'deepfake') && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: selectedImage.channel === 'ela' 
                      ? 'repeat(auto-fit, minmax(110px, 1fr))' 
                      : ((selectedImage.channel === 'metadata' || selectedImage.channel === 'deepfake') ? '1fr 1fr' : '1fr 1fr 1fr'),
                    gap: '10px',
                    marginTop: '16px'
                  }}>
                    {getTabsForChannel(selectedImage.channel).map(tab => {
                      let label = tab + ' View';
                      if (tab === 'ela') label = 'Error Level (ELA)';
                      else if (tab === 'gradcam') label = 'Grad-CAM View';
                      else if (tab === 'combined') label = 'Combined';
                      else if (tab === 'histogram') label = 'Color Histogram';
                      else if (tab === 'fft_magnitude') label = 'FFT Magnitude';
                      else if (tab === 'polar_energy') label = 'Polar Energy';

                      return (
                        <button 
                          key={tab} 
                          className={`cyber-btn ${activeTab === tab ? '' : 'cyber-btn-secondary'}`} 
                          style={{ fontSize: '0.7rem', padding: '8px 4px', textTransform: 'uppercase', textAlign: 'center', justifyContent: 'center' }} 
                          onClick={() => setActiveTab(tab)}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="cyber-card">
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.2px' }}>
                  <FileText size={16} /> Forgery forensic findings
                </h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {(selectedImage.findings || []).map((finding, idx) => (
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
                    {typeof selectedImage.confidence === 'number' ? selectedImage.confidence.toFixed(1) : selectedImage.confidence}%
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
                  {Object.entries(selectedImage.metrics || {}).map(([key, val]) => (
                    <div key={key}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        <span style={{ textTransform: 'capitalize' }}>{key.includes(' ') || key.includes('(') ? key : key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span style={{ color: 'var(--text-primary)' }}>{typeof val === 'number' ? val.toFixed(2) : val}%</span>
                      </div>
                      <div style={{ height: '3px', background: 'rgba(15, 23, 42, 0.05)' }}>
                        <div style={{ height: '100%', width: `${val}%`, background: selectedImage.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="cyber-card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '10px', letterSpacing: '-0.2px' }}>
                  EXIF Metadata Block
                </h3>
                <div style={{ flex: 1, overflowY: 'auto', background: 'rgba(15, 23, 42, 0.02)', border: '1px solid var(--border-color)', borderRadius: '4px', maxHeight: '160px', pointerEvents: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                    <tbody>
                      {Object.entries(selectedImage.metadata || {}).map(([key, val]) => (
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
          )}
        </div>
      )}

    </div>
  );
}
