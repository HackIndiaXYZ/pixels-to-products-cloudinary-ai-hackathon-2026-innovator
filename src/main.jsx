import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowUpRight, Check, Cloud, Image as ImageIcon, LoaderCircle, Play, Sparkles, UploadCloud, Zap } from 'lucide-react'
import './styles.css'

const steps = [
  ['Upload API', 'Direct media ingestion to Cloudinary'],
  ['AI delivery', 'Automatic format and quality optimization'],
  ['Smart crop', 'Gravity-aware responsive framing'],
  ['Production asset', 'Ready-to-use optimized delivery URL']
]

function App() {
  const [file, setFile] = useState(null)
  const [asset, setAsset] = useState(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [cloudName, setCloudName] = useState(() => localStorage.getItem('mediaforge_cloud') || '')
  const [uploadPreset, setUploadPreset] = useState(() => localStorage.getItem('mediaforge_preset') || '')

  const optimizedUrl = useMemo(() => asset?.public_id && cloudName
    ? `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,c_fill,g_auto,w_1200,h_800/${asset.public_id}`
    : '', [asset, cloudName])
  const thumbUrl = useMemo(() => asset?.public_id && cloudName
    ? `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,c_fill,g_auto,w_520,h_360/${asset.public_id}`
    : '', [asset, cloudName])

  const selectFile = (selected) => {
    if (!selected) return
    setFile(selected); setAsset(null); setStatus('idle'); setError('')
  }

  const upload = async () => {
    setError('')
    if (!file) return
    if (!cloudName || !uploadPreset) {
      setError('Enter your Cloudinary Cloud Name and unsigned Upload Preset below.')
      return
    }
    setStatus('uploading')
    try {
      const body = new FormData()
      body.append('file', file)
      body.append('upload_preset', uploadPreset)
      body.append('tags', 'mediaforge,ai-pipeline')
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, { method: 'POST', body })
      const data = await response.json()
      if (!response.ok) throw new Error(data?.error?.message || 'Cloudinary upload failed.')
      setAsset(data); setStatus('ready')
    } catch (err) {
      setError(err.message || 'Upload failed.'); setStatus('idle')
    }
  }

  const saveConfig = () => {
    localStorage.setItem('mediaforge_cloud', cloudName.trim())
    localStorage.setItem('mediaforge_preset', uploadPreset.trim())
    setError('')
  }

  return <main className="app-shell">
    <header className="nav">
      <div className="brand"><span className="brand-mark"><Sparkles size={18}/></span><span>MediaForge <b>AI</b></span></div>
      <div className="pill"><Cloud size={15}/> Cloudinary-first pipeline</div>
    </header>

    <section className="hero">
      <div className="eyebrow"><Zap size={14}/> PIXELS → PRODUCTION</div>
      <h1>Turn one raw upload into a <span>production-ready asset.</span></h1>
      <p className="hero-copy">MediaForge AI combines direct Cloudinary ingestion with automatic format, quality, smart-crop and responsive transformations — without storing media on your app server.</p>

      <div className="workspace">
        <div className="upload-card" onDrop={e => { e.preventDefault(); selectFile(e.dataTransfer.files?.[0]) }} onDragOver={e => e.preventDefault()}>
          <div className="upload-icon"><UploadCloud size={28}/></div>
          <h2>Drop your media here</h2>
          <p>Images or video · sent directly to Cloudinary</p>
          <label className="choose">Choose file<input type="file" accept="image/*,video/*" onChange={e => selectFile(e.target.files?.[0])}/></label>
          {file && <div className="file-name"><ImageIcon size={15}/> {file.name}</div>}
          <div className="config">
            <input value={cloudName} onChange={e => setCloudName(e.target.value)} placeholder="Cloud Name" aria-label="Cloud Name" />
            <input value={uploadPreset} onChange={e => setUploadPreset(e.target.value)} placeholder="Unsigned Upload Preset" aria-label="Unsigned Upload Preset" />
            <button className="save-config" onClick={saveConfig}>Save Cloudinary config</button>
          </div>
          <button className="primary" onClick={upload} disabled={!file || status === 'uploading'}>
            {status === 'uploading' ? <><LoaderCircle className="spin" size={17}/> Uploading…</> : <><Play size={16}/> Run Cloudinary Pipeline</>}
          </button>
          {error && <div className="error">{error}</div>}
        </div>

        <div className="pipeline-card">
          <div className="card-heading"><div><span className="mini-label">LIVE PIPELINE</span><h2>Media processing</h2></div><span className={status === 'ready' ? 'status ready' : 'status'}>{status === 'ready' ? 'READY' : 'IDLE'}</span></div>
          <div className="steps">{steps.map(([title, detail], i) => <div className="step" key={title}>
            <div className={status === 'ready' ? 'step-dot active' : 'step-dot'}>{status === 'ready' ? <Check size={13}/> : i + 1}</div>
            <div><strong>{title}</strong><span>{detail}</span></div>
          </div>)}</div>
        </div>
      </div>
    </section>

    {asset && <section className="result">
      <div className="result-copy"><span className="mini-label">OPTIMIZED OUTPUT</span><h2>Your asset is ready.</h2><p>Cloudinary generated the delivery transformation using <code>f_auto</code>, <code>q_auto</code>, <code>c_fill</code> and <code>g_auto</code>.</p><a className="secondary" href={optimizedUrl} target="_blank" rel="noreferrer">Open optimized asset <ArrowUpRight size={16}/></a></div>
      <div className="preview"><img src={thumbUrl} alt="Optimized Cloudinary asset preview"/></div>
    </section>}

    <section className="feature-grid">
      <article><Cloud size={21}/><h3>Direct-to-Cloud</h3><p>Media bypasses your application server and goes straight to Cloudinary.</p></article>
      <article><Sparkles size={21}/><h3>AI delivery</h3><p>Automatic format, quality and smart focal-point transformations.</p></article>
      <article><Zap size={21}/><h3>Fast outputs</h3><p>Responsive delivery URLs make assets ready for real product surfaces.</p></article>
    </section>
    <footer>MediaForge AI · Built for the Cloudinary AI Hackathon 2026</footer>
  </main>
}

createRoot(document.getElementById('root')).render(<App />)
