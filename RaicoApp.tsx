
import React, { useState, useEffect, useRef } from "react";
import {
  Search, MessageCircle, Bell, User, Globe, CheckCircle2, MapPin,
  Building2, ShieldCheck, Send, ChevronLeft, ChevronRight, Plus,
  Filter, Heart, Star, Phone, Mail, ExternalLink, Languages, Package,
  TrendingUp, Users, Eye, ArrowRight, BadgeCheck, X, Settings,
  LogOut, Camera, Lock, Sparkles, ChevronDown, Wifi, Battery,
  ShieldAlert, MoreVertical, ThumbsUp, Briefcase, FileCheck2
} from "lucide-react";

/* ---------------------------------- data ---------------------------------- */

const LANGUAGES = [
  { code: "en", name: "English", native: "English" },
  { code: "zh", name: "Chinese", native: "中文" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "es", name: "Spanish", native: "Español" },
  { code: "ar", name: "Arabic", native: "العربية" },
  { code: "fr", name: "French", native: "Français" },
  { code: "de", name: "German", native: "Deutsch" },
  { code: "ru", name: "Russian", native: "Русский" },
  { code: "pt", name: "Portuguese", native: "Português" },
];

const CURRENT_USER = {
  name: "RAICO TFS STUDENT",
  business: "TFS Institute India",
  country: "India",
  flag: "🇮🇳",
  industry: "Education & Technology",
  lang: "en",
  verified: false,
  initials: "RT",
  color: "bg-blue-700",
};

const BUSINESSES = [
  { id: 1, name: "Shenzhen Electronics Co.", owner: "Li Wei", country: "China", flag: "🇨🇳", industry: "Electronics Manufacturing", type: "Manufacturer", verified: true, lang: "zh", color: "bg-blue-600", initials: "SE", tagline: "Consumer electronics & smart devices, OEM/ODM partner since 2011.", products: [
      { name: "Wireless Earbuds X200", price: "$8.50 / unit", moq: "MOQ 500 units", avail: "In stock" },
      { name: "Smart Home Hub", price: "$22.00 / unit", moq: "MOQ 100 units", avail: "In stock" },
      { name: "Power Bank 20,000mAh", price: "$6.20 / unit", moq: "MOQ 1,000 units", avail: "2 week lead time" },
    ]},
  { id: 2, name: "Sharma Agro Exports", owner: "Anjali Sharma", country: "India", flag: "🇮🇳", industry: "Agriculture & Food", type: "Exporter", verified: false, lang: "hi", color: "bg-amber-600", initials: "SA", tagline: "Spices, rice, and pulses sourced direct from partner farms.", products: [
      { name: "Basmati Rice, 25kg bag", price: "$28.00 / bag", moq: "MOQ 200 bags", avail: "In stock" },
      { name: "Turmeric Powder", price: "$3.40 / kg", moq: "MOQ 500 kg", avail: "In stock" },
    ]},
  { id: 3, name: "Andes Coffee Traders", owner: "Camila Rojas", country: "Colombia", flag: "🇨🇴", industry: "Food & Beverage", type: "Supplier", verified: true, lang: "es", color: "bg-emerald-700", initials: "AC", tagline: "Single-origin green coffee beans, direct trade with growers.", products: [
      { name: "Green Coffee Beans, Supremo", price: "$4.90 / kg", moq: "MOQ 300 kg", avail: "In stock" },
    ]},
  { id: 4, name: "Dubai Gold Souk Trading", owner: "Khalid Al Maktoum", country: "UAE", flag: "🇦🇪", industry: "Jewelry & Precious Metals", type: "Retailer", verified: true, lang: "ar", color: "bg-yellow-600", initials: "DG", tagline: "Wholesale gold, silver, and custom jewelry design.", products: [
      { name: "22K Gold Bangles", price: "Market rate + 4%", moq: "MOQ 1 kg", avail: "In stock" },
    ]},
  { id: 5, name: "Lyon Leather Goods", owner: "Marie Dubois", country: "France", flag: "🇫🇷", industry: "Fashion & Leather", type: "Manufacturer", verified: false, lang: "fr", color: "bg-rose-700", initials: "LL", tagline: "Handcrafted leather bags and accessories, small-batch runs.", products: [
      { name: "Leather Tote Bag", price: "$34.00 / pc", moq: "MOQ 100 pcs", avail: "In stock" },
    ]},
  { id: 6, name: "Hamburg Maritime Parts", owner: "Stefan Bauer", country: "Germany", flag: "🇩🇪", industry: "Industrial & Marine Equipment", type: "Supplier", verified: true, lang: "de", color: "bg-slate-700", initials: "HM", tagline: "Marine engine parts and industrial fittings, EU certified.", products: [
      { name: "Diesel Engine Filter Set", price: "$45.00 / set", moq: "MOQ 50 sets", avail: "In stock" },
    ]},
  { id: 7, name: "Ural Steel Exports", owner: "Dmitri Volkov", country: "Russia", flag: "🇷🇺", industry: "Metals & Mining", type: "Exporter", verified: false, lang: "ru", color: "bg-zinc-700", initials: "US", tagline: "Hot-rolled steel coils and billets for industrial buyers.", products: [
      { name: "Steel Coil, HRC", price: "$620 / ton", moq: "MOQ 25 tons", avail: "4 week lead time" },
    ]},
  { id: 8, name: "São Paulo Auto Parts", owner: "Bruno Costa", country: "Brazil", flag: "🇧🇷", industry: "Automotive", type: "Manufacturer", verified: true, lang: "pt", color: "bg-green-700", initials: "SP", tagline: "OEM-grade brake systems and suspension parts.", products: [
      { name: "Brake Pad Set", price: "$9.80 / set", moq: "MOQ 300 sets", avail: "In stock" },
    ]},
];

const FILTERS = ["All", "Manufacturer", "Supplier", "Retailer", "Exporter", "Service Provider"];

const NOTIFICATIONS = [
  { id: 1, type: "message", title: "Li Wei sent you a message", body: "Shenzhen Electronics Co. · \"Can confirm the order by Friday.\"", time: "2m ago", unread: true },
  { id: 2, type: "request", title: "New connection request", body: "Stefan Bauer · Hamburg Maritime Parts wants to connect", time: "1h ago", unread: true },
  { id: 3, type: "inquiry", title: "Product inquiry received", body: "Camila Rojas asked about Hand-Embroidered Cushion Covers", time: "3h ago", unread: true },
  { id: 4, type: "request", title: "Connection accepted", body: "Anjali Sharma accepted your connection request", time: "Yesterday", unread: false },
  { id: 5, type: "message", title: "Bruno Costa sent you a message", body: "São Paulo Auto Parts · \"Sounds good, sending the quote now.\"", time: "2 days ago", unread: false },
];

const SEED_MESSAGES = [
  { id: 1, sender: "them", original: "你好！我们收到了你们的样品请求。", originalLangName: "中文 (Chinese)", translated: "Hello! We received your sample request.", translatedLangName: "English", time: "9:02 AM" },
  { id: 2, sender: "me", original: "Great, thank you. Can you share pricing for 1,000 units of the Wireless Earbuds X200?", originalLangName: "English", translated: "太好了，谢谢。能分享一下 1000 个 X200 无线耳机的价格吗？", translatedLangName: "中文 (Chinese)", time: "9:05 AM" },
  { id: 3, sender: "them", original: "当然，1000个单位的价格是每个8.50美元，含运费另算。", originalLangName: "中文 (Chinese)", translated: "Of course, for 1,000 units the price is $8.50 each, shipping calculated separately.", translatedLangName: "English", time: "9:07 AM" },
];

const CANNED_REPLIES = [
  { original: "好的，我让团队准备正式报价单。", translated: "Okay, I'll have my team prepare a formal quotation." },
  { original: "我们可以安排一次视频通话讨论细节吗？", translated: "Could we schedule a video call to discuss the details?" },
  { original: "样品将在本周通过快递寄出。", translated: "The samples will be shipped by courier this week." },
];

/* --------------------------------- helpers --------------------------------- */

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

async function translateText(text, sourceLangName, targetLangName) {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: `Translate the following text from ${sourceLangName} to ${targetLangName}. Reply with ONLY the translated text, no explanation or preamble:\n\n${text}`
        }]
      }),
    });
    const data = await response.json();
    return data.content?.[0]?.text || "(translation unavailable)";
  } catch (e) {
    return "(translation unavailable — showing original only)";
  }
}

/* --------------------------------- atoms --------------------------------- */

function Avatar({ initials, color, size = "w-11 h-11", text = "text-sm" }) {
  return (
    <div className={`${size} ${color} rounded-full flex items-center justify-center text-white font-semibold ${text} shrink-0`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      {initials}
    </div>
  );
}

function VerifiedBadge({ size = 14 }) {
  return (
    <span className="inline-flex items-center justify-center bg-amber-100 text-amber-600 rounded-full p-0.5">
      <BadgeCheck size={size} strokeWidth={2.5} />
    </span>
  );
}

function TranslateStamp() {
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 border border-dashed border-blue-300 rounded-full px-1.5 py-0.5 -rotate-3 bg-blue-50"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      <Languages size={10} /> TRANSLATED
    </span>
  );
}

function TopBar({ title, onBack, dark = true, right }) {
  return (
    <div className={`flex items-center justify-between px-4 py-3.5 ${dark ? "bg-blue-900 text-white" : "bg-white text-slate-900 border-b border-slate-200"} shrink-0`}>
      <div className="flex items-center gap-2 min-w-0">
        {onBack && (
          <button onClick={onBack} className="-ml-1 p-1 rounded-full hover:bg-blue-800 active:scale-95 transition">
            <ChevronLeft size={20} />
          </button>
        )}
        <span className="font-semibold text-base truncate" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{title}</span>
      </div>
      {right}
    </div>
  );
}

function StatusBar({ dark }) {
  return (
    <div className={`flex items-center justify-between px-5 pt-2 pb-1 text-xs font-medium shrink-0 ${dark ? "bg-blue-900 text-white" : "bg-white text-slate-900"}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        <Wifi size={13} />
        <Battery size={15} />
      </div>
    </div>
  );
}

function BottomNav({ screen, setScreen, unreadCount }) {
  const items = [
    { key: "home", icon: Building2, label: "Home" },
    { key: "search", icon: Search, label: "Search" },
    { key: "chatList", icon: MessageCircle, label: "Chat" },
    { key: "notifications", icon: Bell, label: "Alerts" },
    { key: "profile", icon: User, label: "Profile" },
  ];
  return (
    <div className="flex items-stretch border-t border-slate-200 bg-white shrink-0">
      {items.map((it) => {
        const active = screen === it.key || (screen === "chat" && it.key === "chatList") || (screen === "bizDetail" && it.key === "search");
        const Icon = it.icon;
        return (
          <button
            key={it.key}
            onClick={() => setScreen(it.key)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 relative active:bg-slate-50"
          >
            <Icon size={20} strokeWidth={active ? 2.4 : 1.8} className={active ? "text-blue-700" : "text-slate-400"} />
            <span className={`text-xs ${active ? "text-blue-700 font-semibold" : "text-slate-400"}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{it.label}</span>
            {it.key === "notifications" && unreadCount > 0 && (
              <span className="absolute top-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white" style={{ right: "28%" }} />
            )}
          </button>
        );
      })}
    </div>
  );
}

function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-medium px-4 py-2.5 rounded-full shadow-lg z-50 flex items-center gap-2 whitespace-nowrap">
      <CheckCircle2 size={14} className="text-emerald-400" />
      {message}
    </div>
  );
}

/* --------------------------------- screens --------------------------------- */

function SplashScreen({ setScreen }) {
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-blue-900 via-blue-800 to-slate-900 text-white px-8">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-3xl bg-blue-800 border border-blue-700 flex items-center justify-center mb-6">
          <Globe size={38} strokeWidth={1.6} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Raico</h1>
        <p className="text-sm text-blue-200 mb-1 tracking-wide" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>GLOBAL BUSINESS CONNECT</p>
        <p className="text-blue-100 text-sm mt-5 leading-relaxed" style={{ maxWidth: 260 }}>Connect. Trade. Communicate without language barriers.</p>
      </div>
      <div className="pb-10 flex flex-col gap-3">
        <button onClick={() => setScreen("auth")} className="bg-white text-blue-900 font-semibold rounded-xl py-3.5 text-sm active:scale-95 transition shadow-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Get Started
        </button>
        <button onClick={() => setScreen("home")} className="text-blue-200 text-xs py-1">Continue as guest</button>
      </div>
    </div>
  );
}

function AuthScreen({ setScreen }) {
  const [mode, setMode] = useState("signup");
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="px-6 pt-10 pb-4">
        <button onClick={() => setScreen("splash")} className="p-1 -ml-1 mb-6 text-slate-500"><ChevronLeft size={20} /></button>
        <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{mode === "signup" ? "Create your account" : "Welcome back"}</h2>
        <p className="text-slate-500 text-sm mt-1">{mode === "signup" ? "Join businesses trading across 10+ languages." : "Sign in to keep your conversations going."}</p>
      </div>

      <div className="px-6 flex-1 overflow-y-auto">
        <div className="flex bg-slate-100 rounded-xl p-1 mb-6 text-sm font-medium">
          <button onClick={() => setMode("signup")} className={`flex-1 py-2 rounded-lg transition ${mode === "signup" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500"}`}>Sign up</button>
          <button onClick={() => setMode("login")} className={`flex-1 py-2 rounded-lg transition ${mode === "login" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500"}`}>Log in</button>
        </div>

        <div className="space-y-3">
          <input placeholder="Email address" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
          <input placeholder="Phone number (optional)" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
          <input type="password" placeholder="Password" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
        </div>

        <button onClick={() => setScreen(mode === "signup" ? "onboarding" : "home")} className="w-full bg-blue-700 text-white font-semibold rounded-xl py-3.5 text-sm mt-5 active:scale-95 transition" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {mode === "signup" ? "Create account" : "Log in"}
        </button>

        <div className="flex items-center gap-3 my-5">
          <div className="h-px bg-slate-200 flex-1" /><span className="text-xs text-slate-400">or continue with</span><div className="h-px bg-slate-200 flex-1" />
        </div>

        <button onClick={() => setScreen(mode === "signup" ? "onboarding" : "home")} className="w-full border border-slate-200 rounded-xl py-3 text-sm font-medium flex items-center justify-center gap-2 active:bg-slate-50">
          <span className="w-4 h-4 rounded-full bg-gradient-to-br from-red-500 via-yellow-400 to-blue-500" /> Continue with Google
        </button>

        <p className="text-xs text-slate-400 text-center mt-6 leading-relaxed">By continuing you agree to Raico's Terms of Service and Privacy Policy. Your messages are end‑to‑end encrypted.</p>
      </div>
    </div>
  );
}

function OnboardingScreen({ setScreen, showToast }) {
  return (
    <div className="h-full flex flex-col bg-white">
      <TopBar title="Build your business profile" dark={false} onBack={() => setScreen("auth")} />
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
        <div className="flex flex-col items-center py-2">
          <button onClick={() => showToast("Logo upload simulated")} className="w-20 h-20 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 active:scale-95 transition">
            <Camera size={22} />
          </button>
          <span className="text-xs text-slate-400 mt-2">Upload company logo</span>
        </div>

        <div className="space-y-3">
          <Field label="Business name" defaultValue="TFS Institute India" />
          <Field label="Owner name" defaultValue="RAICO TFS STUDENT" />
          <Field label="Country" defaultValue="India 🇮🇳" />
          <Field label="Industry" defaultValue="Education & Technology" />
          <Field label="Products & services" defaultValue="EdTech solutions, training programs, digital courses" textarea />
          <Field label="Website" defaultValue="www.tfsinstituteindia.com" />
          <Field label="Contact email" defaultValue="student@tfsinstitute.in" />
        </div>

        <button onClick={() => showToast("Business photos upload simulated")} className="w-full border border-dashed border-slate-300 rounded-xl py-3.5 text-sm text-slate-500 flex items-center justify-center gap-2 active:bg-slate-50">
          <Plus size={16} /> Add business photos
        </button>
      </div>
      <div className="p-4 border-t border-slate-100">
        <button onClick={() => setScreen("home")} className="w-full bg-blue-700 text-white font-semibold rounded-xl py-3.5 text-sm active:scale-95 transition" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Finish setup
        </button>
      </div>
    </div>
  );
}

function Field({ label, defaultValue, textarea }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-slate-500 mb-1 block">{label}</span>
      {textarea ? (
        <textarea defaultValue={defaultValue} rows={2} className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none" />
      ) : (
        <input defaultValue={defaultValue} className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" />
      )}
    </label>
  );
}

function HomeScreen({ setScreen, openBusiness, showToast }) {
  const featured = BUSINESSES.slice(0, 5);
  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="bg-blue-900 text-white px-5 pt-4 pb-7 rounded-b-3xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-blue-200 text-xs">Welcome back,</p>
            <p className="font-semibold text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{CURRENT_USER.name}</p>
          </div>
          <Avatar initials={CURRENT_USER.initials} color="bg-blue-600" />
        </div>
        <button onClick={() => setScreen("search")} className="w-full bg-blue-800 border border-blue-700 rounded-xl px-4 py-3 flex items-center gap-2.5 text-blue-100 text-sm active:bg-blue-700">
          <Search size={16} /> Search businesses, products, countries…
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-3 gap-2.5 px-5 -mt-4 mb-5">
          <StatCard icon={Eye} value="248" label="Profile views" />
          <StatCard icon={Users} value="36" label="Connections" />
          <StatCard icon={Package} value="9" label="Inquiries" />
        </div>

        <Section title="Browse by trade type" />
        <div className="flex gap-2 px-5 mb-6 overflow-x-auto no-scrollbar">
          {FILTERS.filter((f) => f !== "All").map((f) => (
            <button key={f} onClick={() => setScreen("search")} className="shrink-0 bg-white border border-slate-200 rounded-full px-3.5 py-1.5 text-xs font-medium text-slate-600 active:bg-slate-50">{f}</button>
          ))}
        </div>

        <div className="flex items-center justify-between px-5 mb-3">
          <h3 className="font-semibold text-slate-900 text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Featured businesses</h3>
          <button onClick={() => setScreen("search")} className="text-blue-700 text-xs font-medium flex items-center gap-0.5">See all <ChevronRight size={13} /></button>
        </div>
        <div className="flex gap-3 px-5 overflow-x-auto pb-1 no-scrollbar">
          {featured.map((b) => (
            <button key={b.id} onClick={() => openBusiness(b)} className="shrink-0 w-44 bg-white rounded-2xl border border-slate-200 p-3.5 text-left active:scale-95 transition">
              <div className="flex items-center justify-between mb-2.5">
                <Avatar initials={b.initials} color={b.color} size="w-10 h-10" />
                {b.verified && <VerifiedBadge />}
              </div>
              <p className="font-semibold text-sm text-slate-900 leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{b.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">{b.flag} {b.country}</p>
              <span className="inline-block mt-2 text-xs font-medium text-blue-700 bg-blue-50 rounded-full px-2 py-0.5">{b.type}</span>
            </button>
          ))}
        </div>

        <div className="px-5 mt-7 mb-3">
          <h3 className="font-semibold text-slate-900 text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Recent activity</h3>
        </div>
        <div className="px-5 space-y-2.5 mb-4">
          <ActivityRow icon={MessageCircle} color="text-blue-700 bg-blue-50" text={<><b>Li Wei</b> replied about Wireless Earbuds X200</>} time="2m ago" />
          <ActivityRow icon={Users} color="text-emerald-700 bg-emerald-50" text={<><b>Anjali Sharma</b> accepted your connection</>} time="1h ago" />
          <ActivityRow icon={Package} color="text-amber-700 bg-amber-50" text={<>New inquiry on <b>Embroidered Cushion Covers</b></>} time="3h ago" />
        </div>

        <div className="mx-5 mb-6 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-900 text-white p-4">
          <div className="flex items-center gap-2 mb-2"><Sparkles size={15} className="text-amber-400" /><span className="text-xs font-semibold tracking-wide" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>COMING SOON</span></div>
          <div className="flex gap-2 flex-wrap">
            {["Voice translation", "Video calls with live captions", "AI business assistant", "Global B2B marketplace"].map((f) => (
              <span key={f} className="text-xs bg-blue-800 border border-blue-700 rounded-full px-2.5 py-1">{f}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 px-3 py-3 flex flex-col items-center text-center shadow-sm">
      <Icon size={16} className="text-blue-700 mb-1" />
      <span className="font-bold text-slate-900 text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{value}</span>
      <span className="text-xs text-slate-400">{label}</span>
    </div>
  );
}

function Section({ title }) {
  return <h3 className="px-5 mb-2 font-semibold text-slate-900 text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h3>;
}

function ActivityRow({ icon: Icon, color, text, time }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 px-3.5 py-3 flex items-center gap-3">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${color}`}><Icon size={14} /></div>
      <p className="text-xs text-slate-600 flex-1 leading-snug">{text}</p>
      <span className="text-xs text-slate-400 shrink-0">{time}</span>
    </div>
  );
}

function SearchScreen({ openBusiness, setScreen }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const results = BUSINESSES.filter((b) => {
    const matchesFilter = filter === "All" || b.type === filter;
    const q = query.toLowerCase();
    const matchesQuery = !q || b.name.toLowerCase().includes(q) || b.country.toLowerCase().includes(q) || b.industry.toLowerCase().includes(q);
    return matchesFilter && matchesQuery;
  });

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <TopBar title="Search businesses" dark={false} />
      <div className="px-4 pt-3 pb-2 bg-white border-b border-slate-100">
        <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2.5 mb-3">
          <Search size={16} className="text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Country, category, or product…" className="bg-transparent text-sm flex-1 focus:outline-none" />
          {query && <button onClick={() => setQuery("")}><X size={14} className="text-slate-400" /></button>}
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium border transition ${filter === f ? "bg-blue-700 border-blue-700 text-white" : "bg-white border-slate-200 text-slate-600"}`}>{f}</button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
        <p className="text-xs text-slate-400 px-1">{results.length} businesses found</p>
        {results.map((b) => (
          <button key={b.id} onClick={() => openBusiness(b)} className="w-full bg-white rounded-2xl border border-slate-200 p-3.5 flex gap-3 text-left active:scale-95 transition">
            <Avatar initials={b.initials} color={b.color} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="font-semibold text-sm text-slate-900 truncate" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{b.name}</p>
                {b.verified && <VerifiedBadge size={13} />}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{b.flag} {b.country} · {b.industry}</p>
              <span className="inline-block mt-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-full px-2 py-0.5">{b.type}</span>
            </div>
            <ChevronRight size={16} className="text-slate-300 self-center shrink-0" />
          </button>
        ))}
        {results.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <Search size={28} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">No businesses match that search.</p>
            <p className="text-xs mt-1">Try a different country, category, or product.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function BusinessDetailScreen({ business, setScreen, showToast, followed, setFollowed, connected, setConnected }) {
  const [tab, setTab] = useState("about");
  if (!business) return null;
  const isFollowed = !!followed[business.id];
  const isConnected = !!connected[business.id];

  return (
    <div className="h-full flex flex-col bg-white">
      <TopBar title={business.name} onBack={() => setScreen("search")} right={<button onClick={() => showToast("Reported to Raico Trust & Safety")}><MoreVertical size={18} /></button>} />
      <div className="flex-1 overflow-y-auto">
        <div className={`${business.color} h-20`} />
        <div className="px-5 -mt-9 mb-4">
          <div className="flex items-end justify-between">
            <Avatar initials={business.initials} color={business.color} size="w-16 h-16" text="text-lg" />
            <div className="flex gap-2 mb-1">
              <button onClick={() => setFollowed((p) => ({ ...p, [business.id]: !p[business.id] }))} className={`px-3.5 py-2 rounded-full text-xs font-semibold border flex items-center gap-1.5 active:scale-95 transition ${isFollowed ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-200 text-slate-700"}`}>
                <Heart size={13} fill={isFollowed ? "currentColor" : "none"} /> {isFollowed ? "Following" : "Follow"}
              </button>
              <button onClick={() => { setConnected((p) => ({ ...p, [business.id]: true })); showToast(`Connection request sent to ${business.owner}`); }} disabled={isConnected} className={`px-3.5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition ${isConnected ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-blue-700 text-white"}`}>
                {isConnected ? <><CheckCircle2 size={13} /> Sent</> : <><Plus size={13} /> Connect</>}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3">
            <p className="font-bold text-lg text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{business.name}</p>
            {business.verified && <VerifiedBadge size={16} />}
          </div>
          <p className="text-sm text-slate-500 mt-0.5">{business.owner} · {business.flag} {business.country}</p>
          <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">{business.tagline}</p>

          <div className="flex gap-2 mt-3 flex-wrap">
            <Tag>{business.industry}</Tag>
            <Tag>{business.type}</Tag>
          </div>
        </div>

        <div className="flex border-b border-slate-200 px-5">
          {["about", "products"].map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-1 py-2.5 mr-6 text-sm font-medium capitalize border-b-2 transition ${tab === t ? "border-blue-700 text-blue-700" : "border-transparent text-slate-400"}`}>{t}</button>
          ))}
        </div>

        {tab === "about" ? (
          <div className="px-5 py-4 space-y-3">
            <InfoRow icon={Mail} label="Contact" value={`hello@${business.name.toLowerCase().replace(/[^a-z]+/g, "")}.com`} />
            <InfoRow icon={Phone} label="Phone" value="+1 (555) 010-2231" />
            <InfoRow icon={ExternalLink} label="Website" value={`www.${business.name.toLowerCase().replace(/[^a-z]+/g, "")}.com`} />
            <InfoRow icon={MapPin} label="Location" value={`${business.country} ${business.flag}`} />
            <InfoRow icon={Languages} label="Preferred language" value={LANGUAGES.find((l) => l.code === business.lang)?.native} />
          </div>
        ) : (
          <div className="px-5 py-4 space-y-3">
            {business.products.map((p, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-3.5 flex gap-3">
                <div className={`w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center shrink-0`}>
                  <Package size={22} className="text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-slate-900">{p.name}</p>
                  <p className="text-sm text-blue-700 font-semibold mt-0.5">{p.price}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{p.moq} · {p.avail}</p>
                </div>
                <button onClick={() => showToast(`Inquiry sent for "${p.name}"`)} className="self-center shrink-0 bg-slate-900 text-white text-xs font-semibold rounded-full px-3 py-2 active:scale-95 transition">Inquire</button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="p-4 border-t border-slate-100">
        <button onClick={() => setScreen("chat")} className="w-full bg-blue-700 text-white font-semibold rounded-xl py-3.5 text-sm flex items-center justify-center gap-2 active:scale-95 transition" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          <MessageCircle size={16} /> Message {business.owner.split(" ")[0]}
        </button>
      </div>
    </div>
  );
}

function Tag({ children }) {
  return <span className="text-xs font-medium text-slate-600 bg-slate-100 rounded-full px-2.5 py-1">{children}</span>;
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-3.5 py-3">
      <Icon size={15} className="text-blue-700 shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-xs text-slate-700 font-medium truncate">{value}</p>
      </div>
    </div>
  );
}

function ChatListScreen({ openBusiness, setScreen }) {
  const convos = [
    { b: BUSINESSES[0], last: "样品将在本周通过快递寄出。", lastEn: "The samples will be shipped this week.", time: "9:07 AM", unread: 2 },
    { b: BUSINESSES[2], last: "Can we get a quote for 300kg?", time: "Yesterday", unread: 0 },
    { b: BUSINESSES[5], last: "Vielen Dank für die schnelle Antwort.", lastEn: "Thank you for the quick reply.", time: "Mon", unread: 0 },
    { b: BUSINESSES[7], last: "Sounds good, sending the quote now.", time: "Sun", unread: 0 },
  ];
  return (
    <div className="h-full flex flex-col bg-white">
      <TopBar title="Messages" dark={false} right={<Languages size={18} className="text-slate-400" />} />
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {convos.map((c, i) => (
          <button key={i} onClick={() => openBusiness(c.b, "chat")} className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-slate-50">
            <Avatar initials={c.b.initials} color={c.b.color} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm text-slate-900 truncate">{c.b.name}</p>
                <span className="text-xs text-slate-400 shrink-0">{c.time}</span>
              </div>
              <p className="text-xs text-slate-400 truncate mt-0.5">{c.lastEn || c.last}</p>
            </div>
            {c.unread > 0 && <span className="w-5 h-5 rounded-full bg-blue-700 text-white text-xs font-semibold flex items-center justify-center shrink-0">{c.unread}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

function ChatScreen({ business, setScreen, messages, setMessages, showToast }) {
  const b = business || BUSINESSES[0];
  const targetLangName = LANGUAGES.find((l) => l.code === b.lang)?.name + " (" + LANGUAGES.find((l) => l.code === b.lang)?.native + ")";
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    const id = Date.now();
    setMessages((prev) => [...prev, { id, sender: "me", original: text, originalLangName: "English", translated: null, translatedLangName: LANGUAGES.find((l) => l.code === b.lang)?.native, time: nowTime(), pending: true }]);
    setSending(true);
    const translated = await translateText(text, "English", LANGUAGES.find((l) => l.code === b.lang)?.name || "Chinese");
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, translated, pending: false } : m)));
    setSending(false);

    setTimeout(() => {
      const reply = CANNED_REPLIES[Math.floor(Math.random() * CANNED_REPLIES.length)];
      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: "them", original: reply.original, originalLangName: LANGUAGES.find((l) => l.code === b.lang)?.native, translated: reply.translated, translatedLangName: "English", time: nowTime() }]);
    }, 1700);
  }

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <TopBar
        title={b.name}
        onBack={() => setScreen("chatList")}
        right={<button onClick={() => showToast(`${b.owner} blocked`)}><ShieldAlert size={18} /></button>}
      />
      <div className="bg-blue-800 text-blue-100 text-xs px-4 py-2 flex items-center gap-1.5 shrink-0">
        <Languages size={12} /> Auto-translating to {targetLangName}
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === "me" ? "justify-end" : "justify-start"}`}>
            <div className={`rounded-2xl px-3.5 py-2.5 ${m.sender === "me" ? "bg-blue-700 text-white rounded-br-md" : "bg-white border border-slate-200 text-slate-900 rounded-bl-md"}`} style={{ maxWidth: "78%" }}>
              <p className={`text-xs italic ${m.sender === "me" ? "text-blue-200" : "text-slate-400"}`}>{m.original}</p>
              <div className="h-px bg-current opacity-10 my-1.5" />
              {m.pending ? (
                <p className={`text-sm flex items-center gap-1.5 ${m.sender === "me" ? "text-blue-100" : "text-slate-500"}`}>
                  <span className="flex gap-0.5">
                    <span className="w-1 h-1 rounded-full bg-current animate-bounce" />
                    <span className="w-1 h-1 rounded-full bg-current animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <span className="w-1 h-1 rounded-full bg-current animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </span>
                  Translating…
                </p>
              ) : (
                <p className="text-sm font-medium leading-snug">{m.translated}</p>
              )}
              <div className="flex items-center justify-between mt-1.5">
                {!m.pending && <TranslateStamp />}
                <span className={`text-xs ml-auto ${m.sender === "me" ? "text-blue-200" : "text-slate-400"}`}>{m.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-slate-200 bg-white flex items-center gap-2 shrink-0">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type in English…"
          className="flex-1 bg-slate-100 rounded-full px-4 py-2.5 text-sm focus:outline-none"
        />
        <button onClick={handleSend} disabled={sending} className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center shrink-0 active:scale-95 transition disabled:opacity-50">
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

function NotificationsScreen() {
  const iconFor = { message: MessageCircle, request: Users, inquiry: Package };
  const colorFor = { message: "text-blue-700 bg-blue-50", request: "text-emerald-700 bg-emerald-50", inquiry: "text-amber-700 bg-amber-50" };
  return (
    <div className="h-full flex flex-col bg-white">
      <TopBar title="Notifications" dark={false} />
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {NOTIFICATIONS.map((n) => {
          const Icon = iconFor[n.type];
          return (
            <div key={n.id} className="flex gap-3 px-4 py-3.5 active:bg-slate-50">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${colorFor[n.type]}`}><Icon size={15} /></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-900 font-medium leading-snug">{n.title}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-snug">{n.body}</p>
                <p className="text-xs text-slate-400 mt-1">{n.time}</p>
              </div>
              {n.unread && <span className="w-2 h-2 rounded-full bg-blue-700 mt-1.5 shrink-0" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProfileScreen({ setScreen, showToast }) {
  const rows = [
    { icon: Building2, label: "Business profile", sub: "Edit name, products, and details" },
    { icon: ShieldCheck, label: "Verification", sub: "Get a verified badge on your profile" },
    { icon: Languages, label: "Language preference", sub: "English" },
    { icon: Lock, label: "Privacy & security", sub: "Blocked users, encryption settings" },
    { icon: Settings, label: "App settings", sub: "Notifications, account" },
  ];
  return (
    <div className="h-full flex flex-col bg-slate-50">
      <TopBar title="Profile" dark={false} />
      <div className="flex-1 overflow-y-auto">
        <div className="bg-white px-5 py-5 flex items-center gap-3.5 border-b border-slate-100">
          <Avatar initials={CURRENT_USER.initials} color={CURRENT_USER.color} size="w-14 h-14" text="text-base" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="font-bold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{CURRENT_USER.business}</p>
            </div>
            <p className="text-xs text-slate-500">{CURRENT_USER.name} · {CURRENT_USER.flag} {CURRENT_USER.country}</p>
            <span className="inline-flex items-center gap-1 mt-1.5 text-xs font-semibold text-slate-500 bg-slate-100 rounded-full px-2 py-0.5">
              <ShieldAlert size={10} /> Not yet verified
            </span>
          </div>
        </div>

        <div className="px-5 py-4">
          <button onClick={() => showToast("Verification request submitted for review")} className="w-full bg-blue-700 text-white rounded-2xl px-4 py-3.5 flex items-center gap-3 mb-4">
            <FileCheck2 size={20} />
            <div className="text-left flex-1">
              <p className="text-sm font-semibold">Get verified</p>
              <p className="text-xs text-blue-100">Build trust with a verified business badge</p>
            </div>
            <ChevronRight size={16} />
          </button>

          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
            {rows.map((r) => (
              <button key={r.label} onClick={() => showToast(`${r.label} (demo)`)} className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-slate-50">
                <r.icon size={17} className="text-slate-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-900 font-medium">{r.label}</p>
                  <p className="text-xs text-slate-400">{r.sub}</p>
                </div>
                <ChevronRight size={15} className="text-slate-300" />
              </button>
            ))}
          </div>

          <button onClick={() => setScreen("splash")} className="w-full flex items-center justify-center gap-2 text-rose-600 text-sm font-medium py-3.5 mt-4">
            <LogOut size={15} /> Log out
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- app ---------------------------------- */

export default function RaicoApp() {
  const [screen, setScreen] = useState("splash");
  const [selectedBiz, setSelectedBiz] = useState(BUSINESSES[0]);
  const [messages, setMessages] = useState(SEED_MESSAGES);
  const [toast, setToast] = useState(null);
  const [followed, setFollowed] = useState({});
  const [connected, setConnected] = useState({});

  useEffect(() => {
    if (document.getElementById("raico-fonts")) return;
    const link = document.createElement("link");
    link.id = "raico-fonts";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }

  function openBusiness(b, target = "bizDetail") {
    setSelectedBiz(b);
    setScreen(target);
  }

  const navScreens = ["home", "search", "chatList", "notifications", "profile"];
  const showNav = navScreens.includes(screen);
  const showStatusBarDark = screen === "splash" || screen === "home";

  return (
    <div className="min-h-screen w-full bg-slate-100 flex flex-col items-center justify-center py-8 px-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="text-center mb-5">
        <p className="text-slate-400 text-xs tracking-widest font-medium" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>RAICO GLOBAL BUSINESS CONNECT — INTERACTIVE PROTOTYPE</p>
      </div>
      <div className="relative bg-white shadow-2xl border-slate-900 overflow-hidden flex flex-col" style={{ width: 390, height: 820, borderRadius: "2.75rem", borderWidth: 8, borderStyle: "solid" }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-20" />
        <StatusBar dark={showStatusBarDark} />
        <div className="flex-1 min-h-0 flex flex-col relative">
          {screen === "splash" && <SplashScreen setScreen={setScreen} />}
          {screen === "auth" && <AuthScreen setScreen={setScreen} />}
          {screen === "onboarding" && <OnboardingScreen setScreen={setScreen} showToast={showToast} />}
          {screen === "home" && <HomeScreen setScreen={setScreen} openBusiness={openBusiness} showToast={showToast} />}
          {screen === "search" && <SearchScreen setScreen={setScreen} openBusiness={openBusiness} />}
          {screen === "bizDetail" && <BusinessDetailScreen business={selectedBiz} setScreen={setScreen} showToast={showToast} followed={followed} setFollowed={setFollowed} connected={connected} setConnected={setConnected} />}
          {screen === "chatList" && <ChatListScreen setScreen={setScreen} openBusiness={openBusiness} />}
          {screen === "chat" && <ChatScreen business={selectedBiz} setScreen={setScreen} messages={messages} setMessages={setMessages} showToast={showToast} />}
          {screen === "notifications" && <NotificationsScreen />}
          {screen === "profile" && <ProfileScreen setScreen={setScreen} showToast={showToast} />}
          <Toast message={toast} />
        </div>
        {showNav && <BottomNav screen={screen} setScreen={setScreen} unreadCount={3} />}
      </div>
      <p className="text-slate-400 text-xs mt-5 text-center leading-relaxed" style={{ maxWidth: 390 }}>Tap "Get Started" to walk through sign-up, search, business profiles, and the live-translated chat — sending a message in the chat actually calls Claude to translate it into Chinese in real time.</p>
    </div>
  );
}
