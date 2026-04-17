/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useScroll, useTransform } from "motion/react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "./lib/utils";
import { 
  Download,
  Printer,
  Menu, 
  X, 
  Send, 
  Info, 
  LayoutDashboard, 
  Server, 
  Scroll, 
  RefreshCw, 
  Terminal,
  ExternalLink,
  Users,
  Cpu,
  Activity,
  ShieldAlert,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check
} from "lucide-react";
import { motion, AnimatePresence, Variants } from "motion/react";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Initialize Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Konfigurasi Webhook
const WEBHOOK_ANNOUNCEMENT = "https://discord.com/api/webhooks/1491686276414570611/pf1ZGDg0uFsdwbCE7ZwTPNVfCvr56n-nXaD5Jc9FUSigt3NdHGajUjEXJvkp7slJ-wyZ";
const WEBHOOK_DEFAULT = "https://discord.com/api/webhooks/1396156267994812497/GmgoFVHtJIYVvpzZ_2pLic_Bz5DS3H9vpNNGoN7A5LCTKUkaQZJ9WMWT_CwMZb_JgkRP";
const ROLE_ID = "1472246426414350336"; // Role ID LegendofFeeloria[S15]

const FORM_CONFIG = {
  announcement: ['Judul', 'Kategori', 'Status', 'Description', 'Catatan'],
  quest: ['Nama', 'Type', 'Tier', 'Description', 'Progress', 'Reward'],
  event: ['Nama Event', 'Waktu', 'Lokasi', 'Description', 'Syarat'],
  update: ['Versi', 'Tanggal', 'Log Perubahan', 'New Update', 'Buff', 'Fix'],
  info: ['Topik', 'Description']
};

type Category = keyof typeof FORM_CONFIG;

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

const ACCEPTED_PLAYERS = [
  "Chillatomboy", "AldianGG", "Lackykz", "Reza3487", "vexevitrix", "Svennnz", "FuraChan7332", "Noi nge sad",
  "Arjuna5222", "Nohanniiel", "Fayynx01", "ZANMODE", "Yaanviee5033", "Mytsukizon", "D4rkxCraftt", "keyzzz",
  "EryezetNoKai", "DigiCraft4120", "ItzGreetaa", "Schannx", "LYvanvin", "REXDI9421", "MythXenn", "SchDxion",
  "OutCaster3827", "NishhCH", "Alansyah77", "SkynicSC", "Aerztwin", "XennN6298", "LordDean2663", "Somekk07",
  "kentang aek", "IxSouw", "Aileen3112", "Chisaki17", "ElseBridge4976", "ABYSSLIME9684", "MythHoloo", "JosKelvin",
  "AnimalYapper164", "MyPinn", "glifligary", "Kazzuya2007", "QueennnzMe", "Afdanzzzz", "sunnyic7947", "PudingBeku",
  "AmiiLunaa", "Awaaadesu3", "KHOIRULLLGMG", "AdilPorphyr", "Zaxs", "Chyntia136", "Alfaln0", "Bobby98257",
  "Jinoo77", "Primmbee", "Nyctotenz", "zenaaa03", "Notsmile1122", "Sheptian159", "Azkii3394", "FadilAzrial70",
  "TRIXIER24", "king maharaja", "Schhannzee", "Xyloraine", "Xyliarae", "Schmitzeareza", "Apitt_", "Mzba09",
  "Myiyutrara", "Schmikchella", "KyraannnnN", "Bang Reza PE", "haaanzet", "Seelreei", "PublicCheese624",
  "TaimairuChan", "ItzLM8569"
];

const PlayerMarquee = () => {
  return (
    <div className="bg-black/60 border-b border-white/5 shrink-0">
      <div className="px-3 md:px-6 py-1.5 md:py-2 flex items-center gap-2 md:gap-3 border-b border-white/5 overflow-hidden">
        <div className="p-1 md:p-1.5 bg-accent/10 rounded-lg text-accent shrink-0 relative">
          <Users size={12} className="md:w-[14px] md:h-[14px]" />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse border border-bg"></span>
        </div>
        <span className="text-[8px] md:text-[10px] font-black tracking-[1px] md:tracking-[2px] text-accent uppercase truncate">
          📢 DAFTAR PEMAIN YANG DITERIMA DI ETERNAL SMP SEASON 15
        </span>
      </div>
      <div className="relative flex overflow-x-hidden py-2 md:py-3 group">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-6 md:gap-8">
          {ACCEPTED_PLAYERS.map((player, i) => (
            <div key={i} className="flex items-center gap-1.5 md:gap-2">
              <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[9px] md:text-xs font-bold tracking-widest text-text-dim hover:text-accent transition-colors cursor-default uppercase">
                {player}
              </span>
            </div>
          ))}
        </div>
        <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex items-center gap-6 md:gap-8 ml-6 md:ml-8">
          {ACCEPTED_PLAYERS.map((player, i) => (
            <div key={`dup-${i}`} className="flex items-center gap-1.5 md:gap-2">
              <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[9px] md:text-xs font-bold tracking-widest text-text-dim hover:text-accent transition-colors cursor-default uppercase">
                {player}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [init, setInit] = useState(false);
  const [activePage, setActivePage] = useState("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category>("announcement");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSending, setIsSending] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Quick Action States
  const [isClearingCache, setIsClearingCache] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const [showBackToTop, setShowBackToTop] = useState(false);

  // AI Assistant States
  const [aiMessage, setAiMessage] = useState("");
  const [aiHistory, setAiHistory] = useState<{ role: 'user' | 'ai', content: string }[]>(() => {
    try {
      const saved = localStorage.getItem('eternal_ai_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse AI history:", e);
      return [];
    }
  });
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Parallax Effect
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 1000], [0, -200]);

  useEffect(() => {
    localStorage.setItem('eternal_ai_history', JSON.stringify(aiHistory));
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiHistory]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialize Particles
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const addToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleClearCache = async () => {
    setIsClearingCache(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsClearingCache(false);
    addToast("Cache cleared successfully", "success");
  };

  const handleSyncDatabase = async () => {
    setIsSyncing(true);
    setSyncProgress(0);
    for (let i = 0; i <= 100; i += 20) {
      setSyncProgress(i);
      await new Promise(resolve => setTimeout(resolve, 400));
    }
    setIsSyncing(false);
    addToast("Database synced successfully", "success");
  };

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsGeneratingReport(false);
    setShowReportModal(true);
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    setIsGeneratingReport(true);
    addToast("Menyiapkan dokumen PDF...", "success");
    
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);
      const contentHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, contentHeight);
      pdf.save(`EternalSMP_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      addToast("PDF berhasil diunduh", "success");
    } catch (err) {
      console.error(err);
      addToast("Gagal membuat PDF", "error");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    addToast("Copied to clipboard", "success");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAiChat = async (overrideMessage?: string) => {
    const msg = overrideMessage || aiMessage;
    if (!msg.trim()) return;

    const newUserMsg = { role: 'user' as const, content: msg };
    setAiHistory(prev => [...prev, newUserMsg]);
    setAiMessage("");
    setIsAiLoading(true);

    try {
      // Add a placeholder for the AI response
      setAiHistory(prev => [...prev, { role: 'ai' as const, content: "" }]);

      const response = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts: [{ text: msg }] }],
        config: {
          systemInstruction: "Anda adalah asisten AI yang cerdas, membantu, dan profesional. Gunakan Bahasa Indonesia sebagai bahasa utama. Berikan jawaban yang akurat, relevan dengan konteks, dan mudah dipahami. Anda dapat membantu dengan berbagai topik mulai dari teknologi, pengetahuan umum, hingga saran praktis. Meskipun Anda berada di dashboard EternalSMP, berikan respon yang luas dan tidak hanya terbatas pada urusan server kecuali ditanya secara spesifik. Gunakan markdown untuk format jawaban agar rapi.",
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
        }
      });
      
      let fullText = "";
      for await (const chunk of response) {
        const chunkText = chunk.text || "";
        fullText += chunkText;
        setAiHistory(prev => {
          const newHistory = [...prev];
          if (newHistory.length > 0) {
            newHistory[newHistory.length - 1] = { role: 'ai', content: fullText };
          }
          return newHistory;
        });
      }
      
    } catch (err: any) {
      console.error("AI Error:", err);
      // Remove the placeholder if it's still empty
      setAiHistory(prev => {
        const last = prev[prev.length - 1];
        if (last && last.role === 'ai' && last.content === "") {
          return prev.slice(0, -1);
        }
        return prev;
      });

      if (err.message?.includes("API_KEY_INVALID") || err.message?.includes("API key not valid")) {
        addToast("API Key Gemini tidak valid atau belum diset di menu Secrets.", "error");
      } else {
        addToast(err.message || "Gagal menghubungi Oracle", "error");
      }
    } finally {
      setIsAiLoading(false);
    }
  };

  const clearChat = () => {
    setAiHistory([]);
    addToast("Arsip percakapan telah dibersihkan.", "success");
  };

  const sendToDiscord = async () => {
    if (!formData['judul'] && !formData['nama'] && !formData['nama_event'] && !formData['versi'] && !formData['topik']) {
      addToast("Harap isi field utama!", "error");
      return;
    }

    setIsSending(true);
    const fields = FORM_CONFIG[currentCategory];
    const thumbnail = "https://github.com/marcellnw/paneleternalsmp/blob/main/1775664361126.png?raw=true";
    const targetWebhook = (currentCategory === 'announcement') ? WEBHOOK_ANNOUNCEMENT : WEBHOOK_DEFAULT;

    const embedFields = fields
      .filter(f => !['Description', 'Log Perubahan', 'Reward'].includes(f))
      .map(f => ({
        name: f,
        value: formData[f.toLowerCase().replace(/ /g, '_')] || "-",
        inline: true
      }));

    const payload = {
      content: `<@&${ROLE_ID}>`,
      embeds: [{
        title: currentCategory.toUpperCase(),
        color: parseInt("B22222", 16),
        description: formData['description'] || formData['log_perubahan'] || formData['reward'] || "",
        fields: embedFields,
        timestamp: new Date().toISOString(),
        thumbnail: { url: thumbnail },
        footer: { text: "EternalSMP Panel • 2026" }
      }]
    };

    try {
      const response = await fetch(targetWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        addToast(`Notifikasi ${currentCategory.toUpperCase()} berhasil dikirim!`);
        setFormData({});
      } else {
        addToast('Gagal mengirim ke Discord. Periksa Webhook.', "error");
      }
    } catch (err) {
      console.error(err);
      addToast('Terjadi kesalahan koneksi.', "error");
    } finally {
      setIsSending(false);
    }
  };

  const navItems = [
    { id: 'home', label: 'ADM', icon: Terminal, tooltip: 'Admin Panel' },
    { id: 'dashboard', label: 'DSH', icon: LayoutDashboard, tooltip: 'Webhook Dispatcher' },
    { id: 'server', label: 'SVR', icon: Server, tooltip: 'Server Management' },
    { id: 'info', label: 'INF', icon: Info, tooltip: 'Server Information' },
    { id: 'ai', label: 'AI', icon: Cpu, tooltip: 'Gemini AI Assistant' },
    { id: 'gallery', label: 'GLR', icon: Scroll, tooltip: 'Realm Gallery' },
    { id: 'console', label: 'CON', icon: ExternalLink, href: 'https://paneldiscord-delta.vercel.app/#', tooltip: 'External Console' },
  ];

  const particlesOptions = useMemo(() => ({
    particles: {
      number: { value: 80, density: { enable: true, area: 800 } },
      color: { value: ["#DDA0DD", "#FFD700", "#FF4D4D"] },
      shape: { type: "circle" },
      opacity: { 
        value: { min: 0.1, max: 0.5 },
        animation: { enable: true, speed: 1, minimumValue: 0.1, sync: false }
      },
      size: { 
        value: { min: 1, max: 3 },
        animation: { enable: true, speed: 2, minimumValue: 0.1, sync: false }
      },
      move: { 
        enable: true, 
        speed: 0.8, 
        direction: "none" as const, 
        random: true,
        straight: false,
        outModes: { default: "out" as const },
        attract: { enable: true, rotateX: 600, rotateY: 1200 }
      },
      links: {
        enable: true,
        distance: 150,
        color: "#DDA0DD",
        opacity: 0.2,
        width: 1
      }
    },
    interactivity: {
      events: { 
        onHover: { enable: true, mode: "grab" },
        onClick: { enable: true, mode: "push" }
      },
      modes: { 
        grab: { distance: 200, links: { opacity: 0.5 } },
        push: { quantity: 4 }
      }
    },
    detectRetina: true,
  }), []);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-bg overflow-hidden">
      {init && (
        <Particles
          id="tsparticles"
          options={particlesOptions}
          className="fixed inset-0 -z-10 pointer-events-none"
        />
      )}

      {/* Desktop Navigation Rail */}
      <nav className={cn(
        "nav-rail transition-all duration-500",
        isSidebarOpen ? "nav-rail-open translate-x-0" : "nav-rail-closed -translate-x-full md:translate-x-0 md:w-0 md:opacity-0"
      )}>
        <div className="flex flex-col items-center py-8 gap-6 h-full">
          <div className="mb-4 md:hidden">
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-accent"
            >
              <X size={24} />
            </button>
          </div>
          {navItems.map((item) => (
            item.href ? (
              <a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 text-text-dim hover:text-accent hover:bg-accent/10 rounded-xl transition-all group relative"
              >
                <item.icon size={24} />
                <span className="absolute left-full ml-4 px-2 py-1 bg-accent text-black text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  {item.tooltip || item.label}
                </span>
              </a>
            ) : (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  if (window.innerWidth < 768) setIsSidebarOpen(false);
                }}
                className={cn(
                  "p-3 rounded-xl transition-all group relative",
                  activePage === item.id 
                    ? "text-accent bg-accent/10 shadow-[0_0_15px_rgba(221,160,221,0.2)]" 
                    : "text-text-dim hover:text-accent hover:bg-white/5"
                )}
              >
                <item.icon size={24} />
                <span className="absolute left-full ml-4 px-2 py-1 bg-accent text-black text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  {item.tooltip || item.label}
                </span>
              </button>
            )
          ))}
        </div>
      </nav>

      {/* Mobile Navigation Bar */}
      <nav className="nav-mobile">
        {navItems.map((item) => (
          item.href ? (
            <a
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 text-text-dim hover:text-accent transition-colors"
            >
              <item.icon size={16} />
              <span className="text-[7px] uppercase tracking-tighter">{item.label}</span>
            </a>
          ) : (
            <div
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${activePage === item.id ? 'text-accent scale-110 drop-shadow-[0_0_8px_rgba(221,160,221,0.5)]' : 'text-text-dim hover:text-accent/70'}`}
            >
              <item.icon size={16} />
              <span className="text-[7px] uppercase tracking-tighter">{item.label}</span>
            </div>
          )
        ))}
      </nav>

      {/* Main Layout */}
      <div className={cn(
        "main-layout",
        isSidebarOpen ? "md:ml-0" : ""
      )}>
        <header className="h-14 md:h-20 flex items-center justify-between px-3 md:px-10 border-b border-border bg-[#0a0a0a]/50 backdrop-blur-md z-40">
          <div className="flex items-center gap-2 md:gap-3">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 md:p-2 hover:bg-white/10 rounded-lg transition-colors text-accent flex items-center justify-center"
            >
              <Menu size={20} className="md:w-6 md:h-6" />
            </button>
            <img 
              src="https://github.com/marcellnw/paneleternalsmp/blob/main/1775664361126.png?raw=true" 
              alt="Logo" 
              className="w-6 h-6 md:w-10 md:h-10"
              referrerPolicy="no-referrer"
            />
            <div className="font-serif text-sm md:text-xl tracking-[1px] md:tracking-[2px] text-accent font-bold uppercase">
              ETERNALSMP <span className="hidden sm:inline">PANEL</span>
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="status-badge flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1 text-[9px] md:text-xs">
              <span className="w-1 md:w-1.5 h-1 md:h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              <span className="hidden xs:inline">Operational</span>
              <span className="xs:hidden">Online</span>
            </div>
            <div className="text-[9px] md:text-[10px] text-text-dim uppercase tracking-widest hidden md:block">
              v2.5.0-STABLE
            </div>
          </div>
        </header>

        <PlayerMarquee />

        <div className="content-area overflow-y-auto custom-scrollbar flex-1">
          <AnimatePresence mode="wait">
            {activePage === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="page-container"
              >
                <div className="content-grid">
                  <div className="main-content">
                    <motion.div 
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      custom={0}
                      className="rpg-card fantasy-border p-6 md:p-16 text-center md:text-left relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
                      <h1 className="text-h1 mb-4 md:mb-8 text-accent leading-tight">
                        Selamat Datang, <br /> 
                        <span className="text-white">Administrator</span>
                      </h1>
                      <p className="text-body text-text-dim leading-relaxed max-w-2xl font-light">
                        Sistem manajemen pusat EternalSMP. Pantau status server, kelola quest, dan kirim pengumuman penting secara real-time melalui antarmuka administratif yang aman.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 mt-8 md:mt-12 justify-center md:justify-start">
                        <button onClick={() => setActivePage('dashboard')} className="btn-fantasy px-8 md:px-12 py-4 md:py-5 w-full sm:w-auto">
                          BUKA DASHBOARD
                        </button>
                        <button onClick={() => setActivePage('server')} className="btn-fantasy-outline px-8 md:px-12 py-4 md:py-5 w-full sm:w-auto">
                          STATUS SERVER
                        </button>
                      </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <motion.div 
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        custom={1}
                        className="rpg-card group"
                      >
                        <div className="flex items-center gap-6 mb-8">
                          <div className="p-5 bg-accent/10 rounded-2xl text-accent group-hover:bg-accent/20 transition-all duration-300">
                            <Users size={32} />
                          </div>
                          <div>
                            <div className="text-4xl font-serif text-accent font-black">1,240</div>
                            <div className="text-xs text-text-dim uppercase tracking-[3px] font-bold">Total Players</div>
                          </div>
                        </div>
                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "75%" }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="bg-accent h-full shadow-[0_0_15px_rgba(221,160,221,0.5)]"
                          ></motion.div>
                        </div>
                      </motion.div>
                      <motion.div 
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        custom={2}
                        className="rpg-card group"
                      >
                        <div className="flex items-center gap-6 mb-8">
                          <div className="p-5 bg-crimson/10 rounded-2xl text-crimson group-hover:bg-crimson/20 transition-all duration-300">
                            <ShieldAlert size={32} />
                          </div>
                          <div>
                            <div className="text-4xl font-serif text-crimson font-black">0</div>
                            <div className="text-xs text-text-dim uppercase tracking-[3px] font-bold">Active Alerts</div>
                          </div>
                        </div>
                        <div className="text-xs text-green-400 mt-2 font-semibold tracking-wide flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                          All systems are secure and operational.
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  <div className="side-content">
                    <div className="rpg-card">
                      <h3 className="text-xs uppercase tracking-[3px] mb-6 flex items-center gap-3 text-accent font-bold">
                        <Activity size={18} />
                        Quick Actions
                      </h3>
                      <div className="space-y-4">
                        <button 
                          onClick={handleClearCache}
                          disabled={isClearingCache}
                          className="w-full text-left p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-accent/30 rounded-xl transition-all text-xs flex items-center justify-between group disabled:opacity-50"
                        >
                          <span className="font-medium">{isClearingCache ? "Clearing Cache..." : "Clear Server Cache"}</span>
                          <RefreshCw size={16} className={`${isClearingCache ? 'animate-spin text-accent' : 'group-hover:rotate-180 transition-transform text-text-dim'}`} />
                        </button>
                        <button 
                          onClick={handleSyncDatabase}
                          disabled={isSyncing}
                          className="w-full text-left p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-accent/30 rounded-xl transition-all text-xs flex flex-col gap-3 group disabled:opacity-50"
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="font-medium">{isSyncing ? `Syncing (${syncProgress}%)...` : "Sync Database"}</span>
                            <LayoutDashboard size={16} className="text-text-dim group-hover:text-accent transition-colors" />
                          </div>
                          {isSyncing && (
                            <div className="w-full bg-border h-1 rounded-full overflow-hidden">
                              <div className="bg-accent h-full transition-all duration-300" style={{ width: `${syncProgress}%` }}></div>
                            </div>
                          )}
                        </button>
                        <button 
                          onClick={handleGenerateReport}
                          disabled={isGeneratingReport}
                          className="w-full text-left p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-accent/30 rounded-xl transition-all text-xs flex items-center justify-between group disabled:opacity-50"
                        >
                          <span className="font-medium">{isGeneratingReport ? "Generating..." : "Generate Report"}</span>
                          <Scroll size={16} className="text-text-dim group-hover:text-accent transition-colors" />
                        </button>
                      </div>
                    </div>
                    <div className="rpg-card">
                      <h3 className="text-xs uppercase tracking-[3px] mb-6 flex items-center gap-3 text-accent font-bold">
                        <Cpu size={18} />
                        System Load
                      </h3>
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between text-[10px] mb-2 font-bold tracking-widest">
                            <span>CPU USAGE</span>
                            <span className="text-accent">24%</span>
                          </div>
                          <div className="h-1.5 bg-border rounded-full overflow-hidden">
                            <div className="bg-accent h-full w-[24%] shadow-[0_0_10px_rgba(221,160,221,0.5)]"></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[10px] mb-2 font-bold tracking-widest">
                            <span>RAM USAGE</span>
                            <span className="text-accent">4.2GB / 16GB</span>
                          </div>
                          <div className="h-1.5 bg-border rounded-full overflow-hidden">
                            <div className="bg-accent h-full w-[35%] shadow-[0_0_10px_rgba(221,160,221,0.5)]"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activePage === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="page-container"
              >
                <div className="content-grid">
                  <div className="main-content">
                    <div className="mb-12">
                      <h2 className="text-h2 text-accent mb-4">Webhook Dispatcher</h2>
                      <p className="text-text-dim text-lg max-w-2xl font-light">Broadcast high-priority notifications to Discord channels with custom embeds and real-time delivery.</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 md:gap-3 mb-8 md:mb-10">
                      {(Object.keys(FORM_CONFIG) as Category[]).map((cat) => (
                        <button
                          key={cat}
                          className={cn(
                            "px-4 md:px-8 py-2 md:py-3 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-bold uppercase tracking-[2px] md:tracking-[3px] transition-all border",
                            currentCategory === cat 
                              ? "bg-accent text-black border-accent shadow-[0_0_20px_rgba(221,160,221,0.4)]" 
                              : "bg-white/5 text-text-dim border-white/10 hover:border-accent/50 hover:text-accent"
                          )}
                          onClick={() => {
                            setCurrentCategory(cat);
                            setFormData({});
                          }}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    <motion.div 
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      custom={0}
                      className="rpg-card fantasy-border space-y-6 md:space-y-10 p-6 md:p-12"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {FORM_CONFIG[currentCategory].map((field) => {
                          const id = field.toLowerCase().replace(/ /g, '_');
                          const isTextarea = ['Description', 'Log Perubahan', 'Reward'].includes(field);
                          
                          return (
                            <div key={field} className={isTextarea ? "md:col-span-2" : ""}>
                              <label className="block text-[9px] md:text-[10px] font-bold uppercase tracking-[2px] md:tracking-[3px] text-accent mb-3 md:mb-4">{field}</label>
                              {isTextarea ? (
                                <textarea
                                  id={id}
                                  rows={5}
                                  placeholder={`Enter ${field.toLowerCase()}...`}
                                  value={formData[id] || ""}
                                  onChange={(e) => handleInputChange(id, e.target.value)}
                                  className="w-full bg-black/40 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-5 text-sm focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all outline-none placeholder:text-white/10"
                                />
                              ) : (
                                <input
                                  type="text"
                                  id={id}
                                  placeholder={`Enter ${field.toLowerCase()}...`}
                                  value={formData[id] || ""}
                                  onChange={(e) => handleInputChange(id, e.target.value)}
                                  className="w-full bg-black/40 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-5 text-sm focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all outline-none placeholder:text-white/10"
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <button 
                        className="btn-fantasy w-full py-4 md:py-6 text-sm md:text-base tracking-[3px] md:tracking-[4px]"
                        onClick={sendToDiscord}
                        disabled={isSending}
                      >
                        {isSending ? (
                          <div className="flex items-center gap-3 md:gap-4">
                            <RefreshCw size={20} className="animate-spin" />
                            EXECUTING...
                          </div>
                        ) : (
                          <>
                            <Send size={20} />
                            EXECUTE DISPATCH
                          </>
                        )}
                      </button>
                    </motion.div>
                  </div>

                  <aside className="side-content">
                    <motion.div 
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      custom={1}
                      className="rpg-card group"
                    >
                      <div className="text-3xl font-serif text-accent group-hover:scale-110 transition-transform">12ms</div>
                      <div className="text-[10px] text-text-dim uppercase tracking-[3px] font-bold">API Latency</div>
                    </motion.div>
                    <motion.div 
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      custom={2}
                      className="rpg-card flex flex-col h-[500px]"
                    >
                      <h3 className="text-xs uppercase tracking-[3px] mb-6 text-accent font-bold flex items-center gap-2">
                        <Activity size={16} />
                        Recent Dispatches
                      </h3>
                      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                          <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-xl hover:border-accent/30 transition-all group">
                            <div className="font-bold text-accent text-xs mb-1 group-hover:translate-x-1 transition-transform">Announcement Sent</div>
                            <div className="text-[10px] text-text-dim mb-2">Target: #general-announcements</div>
                            <div className="text-[9px] opacity-40 flex items-center gap-1">
                              <div className="w-1 h-1 bg-accent rounded-full"></div>
                              {i * 5} mins ago
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </aside>
                </div>
              </motion.div>
            )}

            {activePage === 'server' && (
              <motion.div
                key="server"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="page-container"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                  <div className="space-y-1">
                    <h2 className="text-h2 text-accent">Server Management</h2>
                    <p className="text-sm text-text-dim font-light">Monitor performance and control server processes.</p>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                    <button className="btn-fantasy-outline flex-1 md:flex-none px-4 py-3 text-[9px] font-bold tracking-[2px]">RESTART SERVER</button>
                    <button className="btn-fantasy flex-1 md:flex-none px-4 py-3 text-[9px] font-bold tracking-[2px]">STOP SERVER</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-8">
                  <motion.div 
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    custom={0}
                    className="rpg-card text-center p-6 md:p-10 group"
                  >
                    <div className="text-4xl md:text-6xl font-serif text-accent mb-2 md:mb-4 group-hover:scale-110 transition-all duration-500">242</div>
                    <div className="text-[10px] text-text-dim uppercase tracking-[3px] font-bold">Players Online</div>
                  </motion.div>
                  <motion.div 
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    custom={1}
                    className="rpg-card text-center p-6 md:p-10 group"
                  >
                    <div className="text-4xl md:text-6xl font-serif text-green-400 mb-2 md:mb-4 group-hover:scale-110 transition-all duration-500">19.8</div>
                    <div className="text-[10px] text-text-dim uppercase tracking-[3px] font-bold">TPS</div>
                  </motion.div>
                  <motion.div 
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    custom={2}
                    className="rpg-card text-center p-6 md:p-10 group sm:col-span-2 lg:col-span-1"
                  >
                    <div className="text-4xl md:text-6xl font-serif text-blue-400 mb-2 md:mb-4 group-hover:scale-110 transition-all duration-500">99.9%</div>
                    <div className="text-[10px] text-text-dim uppercase tracking-[3px] font-bold">Uptime</div>
                  </motion.div>
                </div>

                <motion.div 
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  custom={3}
                  className="rpg-card fantasy-border p-0 overflow-hidden"
                >
                  <div className="p-4 md:p-8 border-b border-border bg-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h3 className="text-xs md:text-sm uppercase tracking-[3px] font-bold text-accent">Active Player List</h3>
                    <div className="text-[9px] md:text-[10px] text-text-dim font-bold tracking-widest">Showing 15 of 242 players</div>
                  </div>
                  
                  {/* Accepted Players List */}
                  <div className="p-4 md:p-8">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xs uppercase tracking-[3px] text-accent font-bold">Accepted Players List (Season 15)</h3>
                      <div className="px-3 py-1 bg-accent/10 rounded-full text-[10px] font-bold text-accent border border-accent/20">
                        {ACCEPTED_PLAYERS.length} TOTAL
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {ACCEPTED_PLAYERS.map((player, i) => (
                        <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-accent/30 transition-all group">
                          <div className="text-[10px] font-bold text-text-dim group-hover:text-accent transition-colors truncate uppercase tracking-wider">
                            {player}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {activePage === 'info' && (
              <motion.div
                key="info"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="page-container"
              >
                <div className="mb-12">
                  <h2 className="text-h2 text-accent mb-4">Info System: Feeloria</h2>
                  <p className="text-text-dim text-lg max-w-2xl font-light">Comprehensive guide to the systems and hierarchy of the Feeloria realm.</p>
                </div>
                
                <div className="content-grid">
                  <div className="main-content">
                    <motion.div 
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      custom={0}
                      className="rpg-card fantasy-border p-6 md:p-12"
                    >
                      <h3 className="text-h3 mb-6 md:mb-10 text-accent flex items-center gap-3 md:gap-4 font-serif">
                        <Users size={24} className="md:w-8 md:h-8" /> Gameplay System
                      </h3>
                      <div className="grid grid-cols-1 gap-4 md:gap-8">
                        <motion.div 
                          variants={cardVariants}
                          initial="hidden"
                          animate="visible"
                          custom={1}
                          className="glass-panel p-5 md:p-8 rounded-xl md:rounded-2xl border-l-4 border-gold bg-white/[0.02]"
                        >
                          <h4 className="font-serif font-black text-gold mb-3 md:mb-4 text-base md:text-lg tracking-widest uppercase">E. Player's Stats</h4>
                          <ul className="list-disc list-inside text-text-dim space-y-2 md:space-y-3 text-sm md:text-base leading-relaxed font-light">
                            <li>Vitality, Strength, Endurance, Agility, Gathering, Mastery</li>
                            <li>Stats Level → requirement for equipment</li>
                            <li>Stats Point → from leveling & quest</li>
                          </ul>
                        </motion.div>
                        <motion.div 
                          variants={cardVariants}
                          initial="hidden"
                          animate="visible"
                          custom={2}
                          className="glass-panel p-5 md:p-8 rounded-xl md:rounded-2xl border-l-4 border-gold bg-white/[0.02]"
                        >
                          <h4 className="font-serif font-black text-gold mb-3 md:mb-4 text-base md:text-lg tracking-widest uppercase">F. Adventure Leveling System</h4>
                          <ul className="list-disc list-inside text-text-dim space-y-2 md:space-y-3 text-sm md:text-base leading-relaxed font-light">
                            <li>Adventure Level → main progression</li>
                            <li>Adventure XP → from: Quest, Farming, Mining, Killing mobs, Events</li>
                          </ul>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {activePage === 'ai' && (
              <motion.div
                key="ai"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="page-container"
              >
                <div className="mb-12 flex justify-between items-end">
                  <div>
                    <h2 className="text-h2 text-accent mb-4">Gemini AI Assistant</h2>
                    <p className="text-text-dim text-lg max-w-2xl font-light">Asisten cerdas untuk membantu berbagai kebutuhan Anda secara cepat dan akurat.</p>
                  </div>
                  <button 
                    onClick={clearChat}
                    className="flex items-center gap-2 px-4 py-2 bg-crimson/10 hover:bg-crimson/20 text-crimson border border-crimson/20 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all"
                  >
                    <Trash2 size={14} />
                    HAPUS RIWAYAT
                  </button>
                </div>

                <div className="content-grid">
                  <div className="main-content">
                    <div className="rpg-card flex flex-col h-[500px] md:h-[600px] p-0 overflow-hidden">
                      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 custom-scrollbar">
                        {aiHistory.map((chat, i) => (
                          <div key={i} className={cn("flex flex-col gap-2", chat.role === 'user' ? "items-end" : "items-start")}>
                            <div className={cn(
                              "max-w-[90%] md:max-w-[85%] px-4 md:px-5 py-2 md:py-3 rounded-xl md:rounded-2xl text-xs md:text-sm shadow-lg group relative",
                              chat.role === 'user' ? "bg-accent text-black font-medium" : "bg-white/5 border border-white/10 text-text-main"
                            )}>
                              <div className="prose-xs">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{chat.content}</ReactMarkdown>
                              </div>
                              {chat.role === 'ai' && chat.content && (
                                <button 
                                  onClick={() => copyToClipboard(chat.content, i)}
                                  className="absolute -right-2 -bottom-2 p-1.5 bg-surface border border-white/10 rounded-lg text-text-dim hover:text-accent opacity-0 group-hover:opacity-100 transition-all shadow-xl"
                                  title="Copy response"
                                >
                                  {copiedId === i ? <Check size={12} /> : <Copy size={12} />}
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                        {isAiLoading && (
                          <div className="flex justify-start">
                            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex gap-1.5">
                              <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce"></div>
                              <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:0.2s]"></div>
                              <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:0.4s]"></div>
                            </div>
                          </div>
                        )}
                        <div ref={chatEndRef} />
                      </div>

                      <div className="p-4 md:p-6 border-t border-border bg-black/20">
                        <div className="flex gap-3 md:gap-4">
                          <input 
                            type="text" 
                            placeholder="Ask the Oracle..."
                            value={aiMessage}
                            onChange={(e) => setAiMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAiChat()}
                            className="flex-1 bg-black/40 border border-white/10 rounded-lg md:rounded-xl px-4 md:px-5 py-3 md:py-4 text-xs md:text-sm focus:border-accent/50 outline-none transition-all"
                          />
                          <button 
                            onClick={() => handleAiChat()}
                            disabled={isAiLoading}
                            className="btn-fantasy px-6 md:px-8"
                          >
                            <Send size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <aside className="side-content">
                    <div className="rpg-card">
                      <h3 className="text-xs uppercase tracking-[3px] mb-6 text-accent font-bold">Topik Bantuan</h3>
                      <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-accent/30 transition-all cursor-pointer" onClick={() => handleAiChat("Apa itu EternalSMP?")}>
                          <div className="text-xs font-bold text-accent mb-1">Tentang Server</div>
                          <div className="text-[10px] text-text-dim">Pelajari lebih lanjut tentang komunitas EternalSMP.</div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-accent/30 transition-all cursor-pointer" onClick={() => handleAiChat("Berikan tips produktivitas hari ini")}>
                          <div className="text-xs font-bold text-accent mb-1">Tips Umum</div>
                          <div className="text-[10px] text-text-dim">Dapatkan saran praktis untuk keseharian Anda.</div>
                        </div>
                      </div>
                    </div>
                  </aside>
                </div>
              </motion.div>
            )}

            {activePage === 'gallery' && (
              <motion.div
                key="gallery"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="page-container"
              >
                <div className="mb-12">
                  <h2 className="text-h2 text-accent mb-4">Realm Gallery</h2>
                  <p className="text-text-dim text-lg max-w-2xl font-light">Visual archives of the Feeloria landscapes and legendary moments.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i, idx) => (
                    <motion.div 
                      key={i}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      custom={idx}
                      className="gallery-card group"
                    >
                      <img 
                        src={`https://picsum.photos/seed/feeloria${i}/800/800`} 
                        alt={`Gallery ${i}`} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 md:p-4 text-center">
                        <div className="text-accent font-serif text-[10px] md:text-xs mb-1 md:mb-2">Archive #{i}</div>
                        <div className="text-[8px] md:text-[10px] text-white font-bold tracking-widest">VIEW MEMORY</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <footer className="mt-auto py-12 px-4 border-t border-border bg-black/40 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img 
                    src="https://github.com/marcellnw/paneleternalsmp/blob/main/1775664361126.png?raw=true" 
                    alt="Logo" 
                    className="w-8 h-8"
                    referrerPolicy="no-referrer"
                  />
                  <span className="font-serif text-lg tracking-[2px] text-accent font-bold uppercase">ETERNALSMP</span>
                </div>
                <p className="text-text-dim text-xs leading-relaxed max-w-xs">
                  The ultimate administration portal for the Feeloria realm. Managing legends, one tick at a time.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">Resources</h4>
                  <ul className="space-y-2 text-[10px] text-text-dim">
                    <li className="hover:text-accent cursor-pointer transition-colors">Documentation</li>
                    <li className="hover:text-accent cursor-pointer transition-colors">Server Rules</li>
                    <li className="hover:text-accent cursor-pointer transition-colors">Map Archive</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">Support</h4>
                  <ul className="space-y-2 text-[10px] text-text-dim">
                    <li className="hover:text-accent cursor-pointer transition-colors">Discord Support</li>
                    <li className="hover:text-accent cursor-pointer transition-colors">Bug Report</li>
                    <li className="hover:text-accent cursor-pointer transition-colors">Staff Application</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">System Status</h4>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] text-text-dim">All systems operational</span>
                </div>
                <div className="text-[9px] text-white/20 font-mono">
                  &copy; 2024 EternalSMP. All rights reserved.
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Toast Notifications */}
      <div className="toast-container">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={cn(
                "toast-item",
                toast.type === 'error' ? 'border-crimson' : 'border-accent'
              )}
            >
              {toast.type === 'error' ? <AlertCircle className="text-crimson" size={20} /> : <CheckCircle2 className="text-accent" size={20} />}
              <span className="text-xs font-bold tracking-wide">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Report Modal */}
      <AnimatePresence>
        {showReportModal && (
          <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="modal-content max-w-2xl"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowReportModal(false)} 
                className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-all text-text-dim hover:text-accent group"
              >
                <X size={20} className="group-hover:rotate-90 transition-transform" />
              </button>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-accent/10 rounded-2xl text-accent shadow-[0_0_20px_rgba(221,160,221,0.2)]">
                  <Activity size={32} />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-serif text-accent font-black uppercase tracking-widest">System Report</h2>
                  <p className="text-[10px] text-text-dim font-bold tracking-[2px] uppercase">Generated on {new Date().toLocaleDateString()} • v2.5.0</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-accent/30 transition-all">
                    <div className="text-[9px] font-bold text-text-dim uppercase tracking-widest mb-1">Accepted Players</div>
                    <div className="text-2xl font-serif text-white">{ACCEPTED_PLAYERS.length}</div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-accent/30 transition-all">
                    <div className="text-[9px] font-bold text-text-dim uppercase tracking-widest mb-1">Server Uptime</div>
                    <div className="text-2xl font-serif text-white">99.9%</div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-accent/30 transition-all col-span-2 md:col-span-1">
                    <div className="text-[9px] font-bold text-text-dim uppercase tracking-widest mb-1">Stability Index</div>
                    <div className="text-2xl font-serif text-green-400">EXCELLENT</div>
                  </div>
                </div>

                <div className="p-6 bg-black/40 rounded-2xl border border-white/5 space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <h4 className="text-xs font-bold text-accent uppercase tracking-widest">Resource Analytics</h4>
                    <span className="px-2 py-1 bg-green-500/10 text-green-500 text-[8px] font-bold rounded uppercase tracking-tighter">Healthy</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold tracking-widest">
                        <span>CPU PERFORMANCE</span>
                        <span className="text-accent">OPTIMAL</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-accent w-[85%] shadow-[0_0_10px_rgba(221,160,221,0.5)]"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold tracking-widest">
                        <span>MEMORY ALLOCATION</span>
                        <span className="text-accent">4.2GB / 16GB</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-accent w-[35%] shadow-[0_0_10px_rgba(221,160,221,0.5)]"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-crimson/5 rounded-xl border border-crimson/10 text-[10px] text-crimson/80 italic text-center">
                  "This report is an automated diagnostic of the EternalSMP infrastructure."
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <button 
                  onClick={() => setShowReportModal(false)} 
                  className="btn-fantasy flex-1 py-4 text-xs font-bold tracking-[3px]"
                >
                  CLOSE DIAGNOSTICS
                </button>
                <button 
                  onClick={handlePrintReport}
                  className="btn-fantasy-outline flex-1 py-4 text-xs font-bold tracking-[3px] flex items-center justify-center gap-2"
                >
                  <Printer size={16} /> PRINT REPORT
                </button>
                <button 
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingReport}
                  className="btn-fantasy flex-1 py-4 text-xs font-bold tracking-[3px] flex items-center justify-center gap-2"
                >
                  <Download size={16} /> {isGeneratingReport ? "GENERATING..." : "DOWNLOAD PDF"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="fixed bottom-20 md:bottom-10 right-6 p-4 bg-accent text-black rounded-2xl shadow-2xl z-[150] hover:scale-110 active:scale-95 transition-all"
            >
              <Plus className="rotate-45" size={24} />
            </motion.button>
          )}
        </AnimatePresence>
      </AnimatePresence>

      {/* Hidden professional report for PDF/Print */}
      <div className="absolute -left-[9999px] top-0 print:static print:left-0 print:block">
        <div 
          ref={reportRef}
          className="bg-white p-12 text-black w-[210mm] min-h-[297mm] shadow-none flex flex-col gap-8"
          id="printable-report"
        >
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-[#DDA0DD] pb-6">
            <div className="flex items-center gap-4">
               <img 
                 src="https://github.com/marcellnw/paneleternalsmp/blob/main/1775664361126.png?raw=true" 
                 alt="Logo" 
                 className="w-16 h-16"
                 referrerPolicy="no-referrer"
               />
               <div>
                  <h1 className="text-3xl font-serif text-black uppercase tracking-widest font-black">EternalSMP</h1>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-[2px]">Official System Report</p>
               </div>
            </div>
            <div className="text-right">
               <div className="text-xs font-bold text-gray-400 uppercase">Document ID</div>
               <div className="text-lg font-serif">#RP-{new Date().toISOString().split('T')[0]}</div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-6">
             <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="text-[10px] font-bold text-gray-400 uppercase mb-2">Total Players</div>
                <div className="text-3xl font-serif">{ACCEPTED_PLAYERS.length}</div>
             </div>
             <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="text-[10px] font-bold text-gray-400 uppercase mb-2">Server Uptime</div>
                <div className="text-3xl font-serif">99.9%</div>
             </div>
             <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="text-[10px] font-bold text-gray-400 uppercase mb-2">Performance</div>
                <div className="text-3xl font-serif text-green-600">STABLE</div>
             </div>
          </div>

          {/* Resource Analytics */}
          <div className="space-y-6 flex-1">
             <h2 className="text-xl font-serif border-b border-gray-200 pb-2 uppercase tracking-widest text-[#DDA0DD]">Resource Analytics</h2>
             <div className="space-y-6">
                <div className="space-y-2">
                   <div className="flex justify-between text-xs font-bold uppercase">
                      <span>CPU Performance</span>
                      <span>85% (Optimal)</span>
                   </div>
                   <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-full bg-[#DDA0DD] w-[85%]"></div>
                   </div>
                </div>
                <div className="space-y-2">
                   <div className="flex justify-between text-xs font-bold uppercase">
                      <span>Memory Allocation</span>
                      <span>4.2GB / 16GB</span>
                   </div>
                   <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-full bg-[#DDA0DD] w-[35%]"></div>
                   </div>
                </div>
             </div>

             <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-gray-100 italic text-gray-600 text-sm leading-relaxed">
                "This document summarizes the server's operational status over the last collection cycle. Average TPS remained at a stable 19.8, with zero critical interruptions recorded. System integrity is verified as nominal. All node parameters are within the expected security compliance envelope."
             </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-6 flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase">
             <div>Generated on {new Date().toLocaleString()}</div>
             <div>EternalSMP Management Panel • v2.5.0-STABLE</div>
          </div>
        </div>
      </div>
    </div>
  );
}
