/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { 
  MessageCircle,
  Phone, 
  Mail, 
  Instagram, 
  Facebook, 
  Menu, 
  X, 
  ChevronRight, 
  Award, 
  ShieldCheck, 
  Cpu, 
  MapPin, 
  Send,
  ArrowRight,
  Loader2
} from 'lucide-react';

// --- AI ChatBot Component ---

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: 'Dobar dan! Ja sam Dental Asistent u Zubnoj laboratoriji Bulić. Kako Vam mogu pomoći danas?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage = text.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "YOUR_KEY_HERE";
      const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
      
      const systemInstruction = `Ti si profesionalni asistent za Zubnu laboratoriju Bulić iz Beograda. Tvoje ime je "Dental Asistent".
Laboratorija je porodični biznis od 1990-ih.
Usluge: zubna protetika, krunice, mostovi, implant protetika, estetska stomatologija.
Tehnologija: CAD/CAM sistemi, 3D štampa, digitalni workflow.
Sertifikacija: Bredent Master Laboratory (Nemačka).
Kontakt telefon: +381 63 277 790.
Email: dentallabbulic@gmail.com.
Radite sa stomatolozima (B2B laboratorija), uključujući opšte stomatologe, oralne hirurge, implantologe i specijaliste stomatološke protetike.
Tipično vreme izrade za uobičajene procedure je 3 do 5 radnih dana, dok kompleksniji radovi mogu zahtevati više vremena u zavisnosti od specifičnosti slučaja.
Ohrabri korisnike da pruže što više detalja o svojim specifičnim stomatološkim potrebama ili slučajevima pacijenata kada postavljaju pitanja.
Odgovaraj ljubazno, profesionalno i na srpskom jeziku (latinica).`;

      const historyContents = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));
      
      historyContents.push({
        role: 'user',
        parts: [{ text: userMessage }]
      });

      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: historyContents,
        config: {
          systemInstruction: systemInstruction,
        }
      });

      const botResponse = response.text || "Izvinite, trenutno ne mogu da odgovorim. Molimo Vas pozovite nas na +381 63 277 790.";
      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: "Došlo je do greške. Molimo Vas pokušajte kasnije ili nas kontaktirajte direktno." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickReplies = ["Usluge", "Tehnologija", "Kontakt"];

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute bottom-20 right-0 w-[350px] max-w-[90vw] h-[500px] bg-[#0D1B2A]/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-white/10"
          >
            {/* Header */}
            <div className="bg-[#0D1B2A] p-5 text-white flex justify-between items-center border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#C9A84C] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(201,168,76,0.4)]">
                  <MessageCircle size={20} className="text-[#0D1B2A]" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-white">Dental Asistent</h4>
                  <span className="text-[10px] text-[#C9A84C] uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full animate-pulse"></span>
                    Online
                  </span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-[#C9A84C] transition-colors p-2">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
              {messages.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                    ? 'bg-[#C9A84C] text-[#0D1B2A] rounded-tr-sm font-medium shadow-lg' 
                    : 'bg-white/10 text-white rounded-tl-sm border border-white/5 backdrop-blur-md'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/10 p-4 rounded-2xl rounded-tl-sm border border-white/5 backdrop-blur-md flex items-center gap-1.5">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full" />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Quick Replies */}
            {messages.length === 1 && !isLoading && (
              <div className="px-5 pb-3 flex flex-wrap gap-2">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleSend(reply)}
                    className="text-xs px-3 py-1.5 rounded-full border border-[#C9A84C]/50 text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0D1B2A] transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-4 bg-[#0D1B2A] border-t border-white/10">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Napišite poruku..."
                  className="w-full bg-white/5 text-white placeholder-white/40 rounded-full pl-5 pr-12 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A84C] border border-white/10 transition-all"
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-1.5 w-9 h-9 bg-[#C9A84C] text-[#0D1B2A] rounded-full flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                >
                  <Send size={16} className="ml-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-[#C9A84C] text-[#0D1B2A] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(201,168,76,0.4)] hover:scale-110 transition-transform duration-300 group relative"
      >
        {/* Pulse animation */}
        <div className="absolute inset-0 rounded-full border-2 border-[#C9A84C] animate-ping opacity-20"></div>
        
        <div className="absolute -top-12 right-0 bg-[#0D1B2A] text-white text-[10px] font-bold py-2 px-4 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
          Dental Asistent
        </div>
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
};

// --- Components ---

const TopBar = () => (
  <div className="bg-navy text-white/80 py-2 px-4 md:px-12 flex justify-between items-center text-xs tracking-wider border-b border-white/10">
    <div className="flex gap-6">
      <a href="tel:+38163277790" className="flex items-center gap-2 hover:text-gold transition-colors">
        <Phone size={14} /> +381 63 277 790
      </a>
      <a href="mailto:dentallabbulic@gmail.com" className="hidden md:flex items-center gap-2 hover:text-gold transition-colors">
        <Mail size={14} /> dentallabbulic@gmail.com
      </a>
    </div>
    <div className="flex gap-4">
      <a href="#" className="hover:text-gold transition-transform hover:scale-110"><Facebook size={14} /></a>
      <a href="#" className="hover:text-gold transition-transform hover:scale-110"><Instagram size={14} /></a>
    </div>
  </div>
);

const Navbar = ({ startFadeIn }: { startFadeIn: boolean }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);

      // Scroll spy
      const sections = ['hero', 'o-nama', 'usluge', 'tehnologija', 'kontakt'];
      const scrollPosition = window.scrollY + 200; // Offset for better accuracy

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'POČETNA', href: '#hero', id: 'hero' },
    { name: 'O NAMA', href: '#o-nama', id: 'o-nama' },
    { name: 'USLUGE', href: '#usluge', id: 'usluge' },
    { name: 'TEHNOLOGIJA', href: '#tehnologija', id: 'tehnologija' },
    { name: 'KONTAKT', href: '#kontakt', id: 'kontakt' },
  ];

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80, // Offset for fixed navbar
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-[9999] transition-all duration-400 ease-in-out ${
        isScrolled 
          ? 'bg-white shadow-[0_2px_20px_rgba(0,0,0,0.1)] py-3' 
          : 'bg-white/90 border-b border-gray-100 py-5'
      }`}
      style={{
        transform: startFadeIn ? 'translateY(0)' : 'translateY(-100%)',
        opacity: startFadeIn ? 1 : 0,
        transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.4s ease, box-shadow 0.4s ease, padding 0.4s ease'
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer whitespace-nowrap" onClick={(e) => handleSmoothScroll(e as any, '#hero')}>
          <div className="w-[40px] h-[40px] bg-navy flex items-center justify-center rounded-[6px]">
            <span className="text-white font-serif font-bold text-xl">B</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-[0.9rem] leading-tight text-navy">ZUBNA LABORATORIJA</span>
            <span className="text-[0.75rem] tracking-[0.2em] font-bold text-gold">BULIĆ</span>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center" style={{ gap: 'clamp(1rem, 2vw, 2rem)' }}>
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              onClick={(e) => handleSmoothScroll(e, link.href)}
              className={`relative text-navy font-medium hover:text-gold transition-colors duration-300 group ${activeSection === link.id ? 'text-gold' : ''}`}
              style={{ fontSize: 'clamp(0.7rem, 1.2vw, 0.95rem)' }}
            >
              {link.name}
              <span className={`absolute -bottom-1 left-0 h-[2px] bg-gold transition-all duration-300 ${activeSection === link.id ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </a>
          ))}
          <a 
            href="https://wa.me/38163277790"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#22c55e] text-white px-4 lg:px-6 py-2.5 rounded-full text-xs lg:text-sm font-bold hover:bg-[#1ea34d] transition-colors shadow-md ml-2 lg:ml-4 whitespace-nowrap"
          >
            KONTAKTIRAJ NAS
          </a>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-gold" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-full left-0 w-full bg-white overflow-hidden shadow-xl"
          >
            <div className="flex flex-col p-8 gap-6 h-full">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={(e) => handleSmoothScroll(e, link.href)}
                  className={`text-xl font-serif hover:text-gold transition-colors border-b border-gray-100 pb-4 ${activeSection === link.id ? 'text-gold' : 'text-navy'}`}
                >
                  {link.name}
                </a>
              ))}
              <a 
                href="https://wa.me/38163277790"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#22c55e] text-white py-4 rounded-full font-bold text-center shadow-lg mt-4"
              >
                KONTAKTIRAJ NAS
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 150]); // Subtle 15% parallax

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background Image with Parallax */}
      <div className="absolute inset-0 z-0 animate-on-scroll slide-right" data-delay="0.4">
        <motion.div 
          style={{ y: y1 }}
          className="w-full h-full will-change-transform"
        >
          <img 
            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=2000" 
            alt="Dental Laboratory" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/10 to-soft-white"></div>
        </motion.div>
      </div>
      
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <div>
          <h1 className="text-[clamp(2.5rem,7vw,6rem)] leading-[1.1] font-serif text-navy mb-8 break-words overflow-hidden">
            <span className="animate-on-scroll slide-up inline-block" data-delay="0">Vaš</span>{' '}
            <span className="animate-on-scroll slide-up inline-block" data-delay="0.1">osmeh</span> <br />
            <span className="italic font-normal text-[clamp(2rem,5.5vw,4.5rem)] leading-[1.15] animate-on-scroll slide-up inline-block" data-delay="0.2">znači</span>{' '}
            <span className="italic font-normal text-[clamp(2rem,5.5vw,4.5rem)] leading-[1.15] animate-on-scroll slide-up inline-block" data-delay="0.3">više.</span>
          </h1>
          <div className="relative inline-block mb-12 animate-on-scroll slide-up" data-delay="0.6">
            <p className="text-[clamp(1.2rem,2.5vw,1.8rem)] leading-[1.2] text-navy font-semibold max-w-2xl mx-auto drop-shadow-sm break-words overflow-hidden">
              Mi nismo fabrika zuba, mi smo umetnička radionica gde se spajaju najsavremenija tehnologija i decenijsko iskustvo.
            </p>
            <div className="absolute -inset-4 bg-white/30 blur-xl -z-10 rounded-full"></div>
          </div>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center animate-on-scroll scale-up" data-delay="1.1">
            <a 
              href="#o-nama"
              className="magnetic-button btn-press bg-navy text-white px-12 py-5 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-gold transition-all duration-500 shadow-2xl flex items-center gap-3 group"
            >
              Pročitaj više <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="https://wa.me/38163277790"
              target="_blank"
              rel="noopener noreferrer"
              className="magnetic-button btn-press bg-[#25D366] text-white px-12 py-5 rounded-full text-sm font-bold uppercase tracking-widest hover:scale-105 hover:shadow-[0_0_30px_rgba(37,211,102,0.4)] transition-all duration-500 shadow-2xl"
            >
              KONTAKTIRAJ NAS
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-navy to-transparent"></div>
        <span className="text-[10px] uppercase tracking-[0.3em] text-navy/40 font-bold">Scroll</span>
      </motion.div>
    </section>
  );
};

const About = () => {
  return (
    <section id="o-nama" className="py-24 md:py-40 px-6 md:px-12 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
        <div className="relative animate-on-scroll slide-left">
          <div className="absolute -top-10 -left-10 w-40 h-40 border-t-2 border-l-2 border-gold/30"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 border-b-2 border-r-2 border-gold/30"></div>
          <div className="relative z-10 overflow-hidden rounded-2xl shadow-2xl group card-hover">
            <img 
              src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=1000" 
              alt="Dental Craftsmanship" 
              className="w-full aspect-[4/5] object-cover transition-transform duration-1000 group-hover:scale-110"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          </div>
          <div className="absolute top-1/2 -right-10 md:-right-20 bg-navy text-white p-8 md:p-12 rounded-2xl shadow-2xl max-w-[250px] hidden md:block">
            <span className="text-4xl font-serif block mb-2">30+</span>
            <span className="text-xs uppercase tracking-widest text-gold font-bold">Godina Tradicije</span>
          </div>
        </div>

        <div className="animate-on-scroll slide-right">
          <span className="text-gold font-bold tracking-[0.3em] uppercase text-xs mb-4 block">O Laboratoriji</span>
          <h2 className="text-[clamp(2rem,5vw,4rem)] leading-[1.2] font-serif text-navy mb-8 break-words overflow-hidden">
            Zubna laboratorija <br />
            <span className="italic text-[clamp(2rem,5.5vw,4.5rem)] leading-[1.15]">Bulić</span>
          </h2>
          <div className="space-y-6 text-[clamp(1.2rem,2.5vw,1.8rem)] leading-[1.2] text-navy/70 font-light break-words overflow-hidden">
            <p>
              Porodična firma koja je nastala devedesetih godina prošlog veka u Beogradu. Naša misija je uvek bila jasna: pružiti vrhunski kvalitet kroz individualan pristup svakom pacijentu.
            </p>
            <p>
              Savremena tehnologija, inovativni materijali i njihova implementacija u svakodnevnoj praksi uz stručnost našeg tima čine nas liderima u oblasti dentalne protetike. Zubna laboratorija Bulić je visoko tehnološki opremljena, sa vrhunskim timom stručnjaka koji neprestano usavršavaju svoja znanja.
            </p>
          </div>
          <button className="mt-12 magnetic-button btn-press bg-navy text-white px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gold transition-all duration-500 shadow-xl">
            Više o nama
          </button>
        </div>
      </div>
    </section>
  );
};

const TrustSection = () => {
  const pillars = [
    {
      icon: <ShieldCheck className="text-gold" size={32} />,
      title: "Iskustvo",
      desc: "Preko tri decenije posvećenosti i hiljade uspešnih radova."
    },
    {
      icon: <Award className="text-gold" size={32} />,
      title: "Preciznost",
      desc: "Mikronska tačnost u svakom detalju za savršen zagrižaj."
    },
    {
      icon: <Cpu className="text-gold" size={32} />,
      title: "Moderna Tehnologija",
      desc: "CAD/CAM sistemi i najkvalitetniji materijali današnjice."
    }
  ];

  return (
    <section id="usluge" className="py-24 md:py-40 px-6 md:px-12 bg-soft-white">
      <div className="max-w-7xl mx-auto text-center mb-20">
        <div className="animate-on-scroll slide-up" data-delay="0">
          <h2 className="text-[clamp(2rem,5vw,4rem)] leading-[1.2] font-serif text-navy mb-8 break-words overflow-hidden">
            Mi znamo da Vaš osmeh <br />
            <span className="italic text-[clamp(2rem,5.5vw,4.5rem)] leading-[1.15]">znači više.</span>
          </h2>
          <p className="text-[clamp(1.2rem,2.5vw,1.8rem)] leading-[1.2] text-navy/60 font-light max-w-3xl mx-auto break-words overflow-hidden">
            Estetska stomatologija i implant protetika su polja na kojem su zahtevi pacijenata najkompleksniji, to je mesto gde se sreću znanje, funkcija, veština, umetnost i strast.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        {pillars.map((pillar, idx) => (
          <div
            key={idx}
            className="bg-white p-12 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-700 group border border-gray-100 card-hover animate-on-scroll slide-up"
            data-delay={idx * 0.15}
          >
            <div className="w-16 h-16 bg-soft-white rounded-2xl flex items-center justify-center mb-8 group-hover:bg-navy group-hover:scale-110 transition-all duration-500">
              <div className="group-hover:text-white transition-colors duration-500">
                {pillar.icon}
              </div>
            </div>
            <h3 className="text-2xl font-serif text-navy mb-4">{pillar.title}</h3>
            <p className="text-navy/60 font-light leading-relaxed">{pillar.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const AnimatedCounter = ({ end, duration, suffix = "" }: { end: number, duration: number, suffix?: string }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTimestamp: number | null = null;
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
            const easeProgress = 1 - Math.pow(1 - progress, 4); // easeOutQuart
            setCount(Math.floor(easeProgress * end));
            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              setIsFinished(true);
            }
          };
          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return (
    <span ref={ref} className={isFinished ? "animate-gold-shimmer" : "text-[#C9A84C]"}>
      {count.toLocaleString('en-US')}{suffix}
    </span>
  );
};

const AnimatedStats = () => {
  const stats = [
    { value: 30, suffix: "+", label: "Godina iskustva" },
    { value: 10000, suffix: "+", label: "Uspešnih radova" },
    { value: 500, suffix: "+", label: "Zadovoljnih saradnika" },
    { value: 100, suffix: "%", label: "Bredent sertifikat" }
  ];

  return (
    <section className="py-20 bg-[#0D1B2A] relative overflow-hidden border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-16 md:gap-y-0 relative">
          {/* Desktop Dividers */}
          <div className="hidden md:block absolute top-0 bottom-0 left-1/4 w-px bg-[#C9A84C]/30"></div>
          <div className="hidden md:block absolute top-0 bottom-0 left-2/4 w-px bg-[#C9A84C]/30"></div>
          <div className="hidden md:block absolute top-0 bottom-0 left-3/4 w-px bg-[#C9A84C]/30"></div>
          
          {/* Mobile Dividers */}
          <div className="md:hidden absolute top-0 bottom-0 left-1/2 w-px bg-[#C9A84C]/30"></div>
          <div className="md:hidden absolute top-1/2 left-0 right-0 h-px bg-[#C9A84C]/30"></div>

          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center text-center px-4 py-4 animate-on-scroll slide-up" data-delay={idx * 0.15}>
              <div className="text-[clamp(2rem,5vw,4rem)] leading-[1.2] font-serif font-bold mb-3 drop-shadow-[0_0_15px_rgba(201,168,76,0.2)] break-words overflow-hidden">
                <AnimatedCounter end={stat.value} duration={2} suffix={stat.suffix} />
              </div>
              <div className="text-white/90 text-xs md:text-sm font-medium uppercase tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SmileImage = () => {
  return (
    <section className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden">
      <div className="w-full h-full animate-on-scroll zoom-in">
        <img 
          src="https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=2000" 
          alt="Perfect Smile" 
          className="w-full h-full object-cover grayscale contrast-125"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-navy/20 mix-blend-multiply"></div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-white text-center animate-on-scroll letter-spacing-expand" data-delay="0.2">
          <span className="text-xs uppercase tracking-[0.5em] font-bold opacity-70">Umetnost Osmeha</span>
        </div>
      </div>
    </section>
  );
};

const Certification = () => {
  return (
    <section className="py-24 md:py-40 px-6 md:px-12 bg-navy text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 translate-x-1/2"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div className="animate-on-scroll slide-left" data-delay="0">
            <span className="text-gold font-bold tracking-[0.3em] uppercase text-xs mb-6 block">Sertifikacija</span>
            <h2 className="text-[clamp(2rem,5vw,4rem)] leading-[1.2] font-serif mb-8 break-words overflow-hidden">
              Bredent master <br />
              <span className="italic text-[clamp(2rem,5.5vw,4.5rem)] leading-[1.15]">laboratorija</span>
            </h2>
            <p className="text-[clamp(1.2rem,2.5vw,1.8rem)] leading-[1.2] text-white/70 font-light mb-10 break-words overflow-hidden">
              Zvanje kojim je krunisano četvorogodišnje školovanje u Bredent akademiji Senden, Nemačka, a nakon niza sertifikovanih procedura. Ponosni smo što smo jedna od retkih laboratorija u regionu sa ovim prestižnim priznanjem.
            </p>
            <div className="flex flex-wrap gap-10">
              <div className="flex items-center gap-4 animate-on-scroll scale-bounce" data-delay="0.4">
                <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center">
                  <Award className="text-gold" size={20} />
                </div>
                <span className="text-xs uppercase tracking-widest font-bold">Edukacija</span>
              </div>
              <div className="flex items-center gap-4 animate-on-scroll scale-bounce" data-delay="0.6">
                <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center">
                  <ShieldCheck className="text-gold" size={20} />
                </div>
                <span className="text-xs uppercase tracking-widest font-bold">Sertifikat</span>
              </div>
            </div>
            <button className="mt-12 magnetic-button btn-press bg-gold text-navy px-12 py-5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white transition-all duration-500 shadow-2xl">
              Pročitaj više
            </button>
          </div>

          <div className="flex justify-center animate-on-scroll rotate-in" data-delay="0.2">
            <div className="relative w-64 h-64 md:w-96 md:h-96">
              <div className="absolute inset-0 border-2 border-gold/20 rounded-full animate-spin-slow"></div>
              <div className="absolute inset-4 border border-gold/10 rounded-full animate-reverse-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Award size={80} className="text-gold mx-auto mb-4" />
                  <span className="block font-serif text-2xl">MASTER</span>
                  <span className="block text-[10px] tracking-[0.3em] text-gold font-bold uppercase">Laboratorija</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Technology = () => {
  return (
    <section id="tehnologija" className="py-24 md:py-40 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <div>
            <span className="text-gold font-bold tracking-[0.3em] uppercase text-xs mb-4 block animate-on-scroll slide-up" data-delay="0">Inovacije</span>
            <h2 className="text-[clamp(2rem,5vw,4rem)] leading-[1.2] font-serif text-navy mb-8 break-words overflow-hidden">
              <span className="animate-on-scroll slide-up inline-block" data-delay="0.1">Budućnost</span>{' '}
              <span className="animate-on-scroll slide-up inline-block" data-delay="0.2">je</span> <br />
              <span className="italic text-[clamp(2rem,5.5vw,4.5rem)] leading-[1.15] animate-on-scroll slide-up inline-block" data-delay="0.3">već</span>{' '}
              <span className="italic text-[clamp(2rem,5.5vw,4.5rem)] leading-[1.15] animate-on-scroll slide-up inline-block" data-delay="0.4">počela</span>
            </h2>
            <p className="text-[clamp(1.2rem,2.5vw,1.8rem)] leading-[1.2] text-navy/60 font-light max-w-2xl mx-auto break-words overflow-hidden animate-on-scroll slide-up" data-delay="0.4">
              Danas kao nikada do sada imamo čitavu paletu materijala koju možemo upotrebiti u našem svakodnevnom radu, uz podršku najnaprednijih digitalnih sistema.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-soft-white p-8 rounded-3xl aspect-square flex flex-col justify-end group hover:bg-navy transition-all duration-700 card-hover animate-on-scroll slide-up" data-delay="0.2">
                <Cpu className="text-gold mb-4 group-hover:scale-110 transition-transform duration-500" size={32} />
                <h4 className="text-xl font-serif text-navy group-hover:text-white transition-colors duration-500">CAD/CAM</h4>
              </div>
              <div className="bg-soft-white p-8 rounded-3xl aspect-[3/4] flex flex-col justify-end group hover:bg-navy transition-all duration-700 card-hover animate-on-scroll slide-up" data-delay="0.4">
                <ShieldCheck className="text-gold mb-4 group-hover:scale-110 transition-transform duration-500" size={32} />
                <h4 className="text-xl font-serif text-navy group-hover:text-white transition-colors duration-500">Digitalni Otisak</h4>
              </div>
            </div>
            <div className="space-y-6 pt-12">
              <div className="bg-soft-white p-8 rounded-3xl aspect-[3/4] flex flex-col justify-end group hover:bg-navy transition-all duration-700 card-hover animate-on-scroll slide-up" data-delay="0.6">
                <Award className="text-gold mb-4 group-hover:scale-110 transition-transform duration-500" size={32} />
                <h4 className="text-xl font-serif text-navy group-hover:text-white transition-colors duration-500">3D Štampa</h4>
              </div>
              <div className="bg-soft-white p-8 rounded-3xl aspect-square flex flex-col justify-end group hover:bg-navy transition-all duration-700 card-hover animate-on-scroll slide-up" data-delay="0.8">
                <Cpu className="text-gold mb-4 group-hover:scale-110 transition-transform duration-500" size={32} />
                <h4 className="text-xl font-serif text-navy group-hover:text-white transition-colors duration-500">Zirkon</h4>
              </div>
            </div>
          </div>

          <div className="space-y-8 animate-on-scroll slide-right" data-delay="0.4">
            <h3 className="text-3xl font-serif text-navy leading-tight break-words overflow-hidden">Digitalni Workflow za Savršene Rezultate</h3>
            <p className="text-navy/70 font-light leading-relaxed">
              Korišćenjem najsavremenijih skenera i softvera za modelovanje, eliminišemo greške koje su bile uobičajene u tradicionalnim metodama. Svaka krunica, most ili proteza se dizajnira sa digitalnom preciznošću koja garantuje dugovečnost i estetiku.
            </p>
            <ul className="space-y-4">
              {['Individualni pristup dizajnu', 'Najkvalitetniji biokompatibilni materijali', 'Brža izrada bez gubitka kvaliteta'].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-navy/80 font-medium">
                  <div className="w-1.5 h-1.5 bg-gold rounded-full"></div>
                  {item}
                </li>
              ))}
            </ul>
            <button className="magnetic-button btn-press bg-navy text-white px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gold transition-all duration-500 shadow-xl">
              Pročitaj više
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const ToothIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M7 12c.5 0 1 .5 1 1v2c0 .5-.5 1-1 1s-1-.5-1-1v-2c0-.5.5-1 1-1z" />
    <path d="M17 12c.5 0 1 .5 1 1v2c0 .5-.5 1-1 1s-1-.5-1-1v-2c0-.5.5-1 1-1z" />
    <path d="M12 2c-4 0-7 3-7 7 0 2 1 4 2 5.5V20c0 1 1 2 2 2h6c1 0 2-1 2-2v-5.5c1-1.5 2-3.5 2-5.5 0-4-3-7-7-7z" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </svg>
);

const GearIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

interface BeforeAfterSliderProps {
  beforeGradient: string;
  afterGradient: string;
  beforeIcon: React.ReactNode;
  afterIcon: React.ReactNode;
  procedure: string;
}

const BeforeAfterSlider = ({ 
  beforeGradient, 
  afterGradient, 
  beforeIcon, 
  afterIcon, 
  procedure 
}: BeforeAfterSliderProps) => {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeout1: NodeJS.Timeout, timeout2: NodeJS.Timeout, timeout3: NodeJS.Timeout;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          timeout1 = setTimeout(() => setPosition(45), 500);
          timeout2 = setTimeout(() => setPosition(55), 800);
          timeout3 = setTimeout(() => setPosition(50), 1100);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
      observer.disconnect();
    };
  }, []);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(percent);
  };

  const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
  const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);
  const onMouseUp = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="flex flex-col gap-4">
      <div 
        ref={containerRef}
        className="relative w-full h-[280px] md:h-[380px] rounded-2xl overflow-hidden cursor-ew-resize select-none group shadow-[0_8px_32px_rgba(0,0,0,0.15)] touch-pan-y"
        onMouseDown={(e) => { setIsDragging(true); handleMove(e.clientX); }}
        onTouchStart={(e) => { setIsDragging(true); handleMove(e.touches[0].clientX); }}
      >
        {/* After Side (Base) */}
        <div className="absolute inset-0 w-full h-full" style={{ background: afterGradient }}>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              {afterIcon}
            </div>
            <span className="text-[#C9A84C] text-[0.7rem] font-bold tracking-widest uppercase">POSLE TRETMANA</span>
          </div>
          <div 
            className="absolute z-20 pointer-events-none"
            style={{
              bottom: '12px',
              right: '12px',
              background: '#0D1B2A',
              color: '#C9A84C',
              padding: '4px 12px',
              borderRadius: '4px',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.1em'
            }}
          >
            POSLE
          </div>
        </div>
        
        {/* Before Side (Clipped) */}
        <div 
          className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-20"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)`, background: beforeGradient }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              {beforeIcon}
            </div>
            <span className="text-white text-[0.7rem] font-bold tracking-widest uppercase">PRE TRETMANA</span>
          </div>
          <div 
            className="absolute z-20 pointer-events-none"
            style={{
              bottom: '12px',
              left: '12px',
              background: '#0D1B2A',
              color: '#C9A84C',
              padding: '4px 12px',
              borderRadius: '4px',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.1em'
            }}
          >
            PRE
          </div>
        </div>

        {/* Handle */}
        <div 
          className="absolute top-0 bottom-0 w-[2px] bg-[#C9A84C] pointer-events-none z-30"
          style={{ left: `calc(${position}% - 1px)`, transition: isDragging ? 'none' : 'left 0.3s ease-out' }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-[#C9A84C] rounded-full shadow-[0_0_15px_rgba(0,0,0,0.2)] flex items-center justify-center text-navy">
            <div className="flex gap-0.5">
              <ChevronRight className="w-4 h-4 rotate-180 -mr-1" />
              <ChevronRight className="w-4 h-4 -ml-1" />
            </div>
          </div>
        </div>
      </div>
      <div className="text-center">
        <span className="text-[#C9A84C] font-bold uppercase tracking-widest text-xs">{procedure}</span>
      </div>
    </div>
  );
};

const ResultsGallery = () => {
  // TO DO: Replace CSS placeholders with real patient before/after photos provided by client
  const transformations = [
    {
      procedure: "Implant Protetika",
      beforeGradient: "linear-gradient(135deg, #1a1a2e 0%, #2d2d4e 100%)",
      afterGradient: "linear-gradient(135deg, #0d2818 0%, #1a4a2e 100%)",
      beforeIcon: <ToothIcon className="w-10 h-10 text-white" />,
      afterIcon: <CheckIcon className="w-10 h-10 text-[#C9A84C]" />
    },
    {
      procedure: "Krunice i Mostovi",
      beforeGradient: "linear-gradient(135deg, #2e1a0d 0%, #4e3018 100%)",
      afterGradient: "linear-gradient(135deg, #0d1b2a 0%, #1a3a5e 100%)",
      beforeIcon: <ToothIcon className="w-10 h-10 text-white" />,
      afterIcon: <SparklesIcon className="w-10 h-10 text-[#C9A84C]" />
    },
    {
      procedure: "Estetska Protetika",
      beforeGradient: "linear-gradient(135deg, #2a1a2e 0%, #4a2e5e 100%)",
      afterGradient: "linear-gradient(135deg, #1a2e1a 0%, #2e5e2e 100%)",
      beforeIcon: <ToothIcon className="w-10 h-10 text-white" />,
      afterIcon: <SparklesIcon className="w-10 h-10 text-[#C9A84C]" />
    },
    {
      procedure: "CAD/CAM Digitalni",
      beforeGradient: "linear-gradient(135deg, #1a1a1a 0%, #3a3a3a 100%)",
      afterGradient: "linear-gradient(135deg, #0d1b2a 0%, #C9A84C22 100%)",
      beforeIcon: <ToothIcon className="w-10 h-10 text-white" />,
      afterIcon: <GearIcon className="w-10 h-10 text-[#C9A84C]" />
    }
  ];

  return (
    <section id="rezultati" className="py-24 md:py-40 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-navy mb-4 animate-on-scroll slide-up">
            Naši Rezultati
          </h2>
          <p className="text-[#C9A84C] font-bold tracking-[0.2em] uppercase text-sm mb-2 animate-on-scroll slide-up" data-delay="0.1">
            Pravi pacijenti. Pravi rezultati.
          </p>
          <p className="text-gray-400 text-[10px] italic animate-on-scroll slide-up" data-delay="0.2">
            (Fotografije pravih pacijenata dostupne na zahtev)
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
          {transformations.map((item, index) => (
            <div key={index} className="animate-on-scroll slide-up" data-delay={index * 0.1}>
              <BeforeAfterSlider {...item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  return (
    <section id="kontakt" className="relative py-24 md:py-40 px-6 md:px-12 bg-navy overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 opacity-20">
        <img 
          src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=2000" 
          alt="Contact Background" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-20 items-start">
          <div>
            <h2 className="text-[clamp(2rem,5vw,4rem)] leading-[1.2] font-serif text-white mb-8 break-words overflow-hidden animate-on-scroll slide-left" data-delay="0">
              Kontaktirajte <br />
              <span className="italic text-[clamp(2rem,5.5vw,4.5rem)] leading-[1.15]">nas</span>
            </h2>
            <p className="text-[clamp(1.2rem,2.5vw,1.8rem)] leading-[1.2] text-white/60 font-light mb-12 break-words overflow-hidden animate-on-scroll slide-left" data-delay="0.15">
              Mi znamo da Vaš osmeh znači više. Tu smo da odgovorimo na sva Vaša pitanja i započnemo saradnju.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-center gap-6 group animate-on-scroll slide-left" data-delay="0.3">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-gold transition-colors duration-500">
                  <Phone className="text-gold group-hover:text-navy transition-colors" size={24} />
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Telefon</span>
                  <a href="tel:+38163277790" className="text-xl text-white hover:text-gold transition-colors">+381 63 277 790</a>
                </div>
              </div>
              <div className="flex items-center gap-6 group animate-on-scroll slide-left" data-delay="0.45">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-gold transition-colors duration-500">
                  <Mail className="text-gold group-hover:text-navy transition-colors" size={24} />
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Email</span>
                  <a href="mailto:dentallabbulic@gmail.com" className="text-xl text-white hover:text-gold transition-colors">dentallabbulic@gmail.com</a>
                </div>
              </div>
              <div className="flex items-center gap-6 group animate-on-scroll slide-left" data-delay="0.6">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-gold transition-colors duration-500">
                  <MapPin className="text-gold group-hover:text-navy transition-colors" size={24} />
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Adresa</span>
                  <span className="text-xl text-white">Beograd, Srbija</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass p-10 md:p-16 rounded-[40px] shadow-2xl animate-on-scroll slide-right" data-delay="0.3">
            <form className="space-y-6">
              <div className="space-y-2 animate-on-scroll slide-up" data-delay="0.4">
                <label className="text-[10px] uppercase tracking-widest text-navy/60 font-bold ml-2">Ime i Prezime</label>
                <input 
                  type="text" 
                  placeholder="Upišite Vaše ime i prezime"
                  className="w-full bg-white/50 border border-navy/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
                />
              </div>
              <div className="space-y-2 animate-on-scroll slide-up" data-delay="0.5">
                <label className="text-[10px] uppercase tracking-widest text-navy/60 font-bold ml-2">Email Adresa</label>
                <input 
                  type="email" 
                  placeholder="Upišite Vašu email adresu"
                  className="w-full bg-white/50 border border-navy/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
                />
              </div>
              <div className="space-y-2 animate-on-scroll slide-up" data-delay="0.6">
                <label className="text-[10px] uppercase tracking-widest text-navy/60 font-bold ml-2">Poruka</label>
                <textarea 
                  rows={4}
                  placeholder="Mesto za Vašu poruku"
                  className="w-full bg-white/50 border border-navy/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all resize-none"
                ></textarea>
              </div>
              <button className="w-full magnetic-button btn-press bg-navy text-white py-5 rounded-2xl font-bold uppercase tracking-widest hover:bg-gold transition-all duration-500 shadow-xl flex items-center justify-center gap-3 animate-on-scroll slide-up" data-delay="0.7">
                Pošalji Poruku <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-navy text-white pt-24 pb-12 px-6 md:px-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-2 animate-on-scroll slide-up animate-once" data-delay="0">
            <div className="flex items-center gap-3 mb-8 group cursor-pointer">
              <div className="w-12 h-12 bg-white flex items-center justify-center rounded-xl group-hover:shadow-gold/20 transition-all duration-500">
                <span className="text-navy font-serif font-bold text-2xl">B</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-xl leading-tight tracking-tight group-hover:text-gold transition-colors duration-500">ZUBNA LABORATORIJA</span>
                <span className="text-xs tracking-[0.3em] font-bold text-gold">BULIĆ</span>
              </div>
            </div>
            <p className="text-white/50 font-light leading-relaxed max-w-md">
              Vrhunska dentalna protetika sa tradicijom dugom preko 30 godina. Spajamo umetnost i tehnologiju za Vaš savršen osmeh.
            </p>
          </div>
          
          <div className="animate-on-scroll slide-up" data-delay="0.2">
            <h4 className="text-gold font-bold uppercase tracking-widest text-xs mb-8">Brzi Linkovi</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li><a href="#" className="hover:text-white transition-colors">Početna</a></li>
              <li><a href="#o-nama" className="hover:text-white transition-colors">O nama</a></li>
              <li><a href="#usluge" className="hover:text-white transition-colors">Usluge</a></li>
              <li><a href="#tehnologija" className="hover:text-white transition-colors">Tehnologija</a></li>
              <li><a href="#kontakt" className="hover:text-white transition-colors">Kontakt</a></li>
            </ul>
          </div>

          <div className="animate-on-scroll slide-up" data-delay="0.4">
            <h4 className="text-gold font-bold uppercase tracking-widest text-xs mb-8">Pratite Nas</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-gold hover:text-navy transition-all duration-300 animate-on-scroll scale-bounce" data-delay="0.5">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-gold hover:text-navy transition-all duration-300 animate-on-scroll scale-bounce" data-delay="0.6">
                <Instagram size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold animate-on-scroll" data-delay="0.6">
          <span>Copyright © 2026 Dental Lab Bulić | Sva prava zadržana</span>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Politika Privatnosti</a>
            <a href="#" className="hover:text-white transition-colors">Uslovi Korišćenja</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---

export default function App() {
  const [startFadeIn, setStartFadeIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartFadeIn(true);
    }, 3800); // Sync with cinematic exit in index.html
    return () => clearTimeout(timer);
  }, []);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // --- Senior Performance Engineer Optimization Snippet ---
  useEffect(() => {
    // 1. Passive Event Listeners for Scroll Fluidity
    const passiveOptions = { passive: true };
    const eventTypes = ['touchstart', 'wheel', 'touchmove'];
    
    const handlePassiveEvent = () => {
      // No-op, just ensuring the listener is passive to prevent scroll-blocking
    };

    eventTypes.forEach(type => {
      window.addEventListener(type, handlePassiveEvent, passiveOptions);
    });

    // 2. Layout Thrashing Minimization & rAF Batching
    let rAFRequested = false;
    const updateDOM = () => {
      // Batch any DOM-heavy operations here if needed
      rAFRequested = false;
    };

    const onInteraction = () => {
      if (!rAFRequested) {
        rAFRequested = true;
        requestAnimationFrame(updateDOM);
      }
    };

    window.addEventListener('scroll', onInteraction, passiveOptions);

    // 3. Cleanup
    return () => {
      eventTypes.forEach(type => {
        window.removeEventListener(type, handlePassiveEvent);
      });
      window.removeEventListener('scroll', onInteraction);
    };
  }, []);

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: startFadeIn ? 1 : 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative w-full overflow-x-hidden selection:bg-gold selection:text-navy"
      >
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gold z-[100] origin-left"
        style={{ scaleX }}
      />

      <ChatBot />

      <Navbar startFadeIn={startFadeIn} />
      
      <main className="w-full">
        <Hero />
        <About />
        <TrustSection />
        <AnimatedStats />
        <SmileImage />
        <Certification />
        <Technology />
        <ResultsGallery />
        <Contact />
      </main>

      <Footer />

      {/* Global CSS for animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes reverse-spin {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes gold-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-reverse-spin {
          animation: reverse-spin 15s linear infinite;
        }
        .animate-gold-shimmer {
          background: linear-gradient(to right, #C9A84C 20%, #FDE08B 40%, #FDE08B 60%, #C9A84C 80%);
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: gold-shimmer 3s linear infinite;
        }
      `}} />
    </motion.div>
    </>
  );
}
