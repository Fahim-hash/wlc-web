"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Menu, X, Feather, Mail, Phone, ChevronDown } from "lucide-react";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { SiBehance } from "react-icons/si";
import Link from "next/link";

// --- ১. কাস্টম কার্সার কম্পোনেন্ট ---
const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const moveCursor = (e) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 border border-[#c5a47e] rounded-full pointer-events-none z-[999] hidden lg:block"
      animate={{ x: position.x - 16, y: position.y - 16 }}
      transition={{ type: "spring", damping: 20, stiffness: 250, mass: 0.5 }}
    />
  );
};

// --- ২. নেভিগেশন ও সাইড প্যানেল ---
const Navigation = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    { name: "সূচনা", link: "#home" },
    { name: "দর্শন", link: "#philosophy" },
    { name: "গ্যালারি", link: "#album" },
    { name: "সংকলন", link: "#gallery" },
    { name: "সদস্যপদ", link: "#join" },
    { name: "বার্তা", link: "#contact" },
  ];

  return (
    <>
      <aside className="fixed left-0 top-0 h-full w-[100px] bg-[#050505] border-r border-white/5 hidden xl:flex flex-col justify-between items-center py-10 z-[100]">
        <div className="cursor-pointer">
          <Image src="/logo.png" alt="Logo" width={50} height={50} className="object-contain" />
        </div>
        <div className="flex flex-col gap-8 text-gray-500">
          <a href="#" target="_blank"><FaFacebookF className="hover:text-[#c5a47e] transition-colors" size={18} /></a>
          <a href="#" target="_blank"><FaInstagram className="hover:text-[#c5a47e] transition-colors" size={18} /></a>
          <FaXTwitter className="hover:text-[#c5a47e] transition-colors" size={18} />
          <SiBehance className="hover:text-[#c5a47e] transition-colors" size={18} />
        </div>
        <button onClick={() => setIsOpen(true)} className="p-4 bg-[#c5a47e]/10 text-[#c5a47e] rounded-full hover:bg-[#c5a47e] hover:text-black transition-all">
          <Menu size={20} />
        </button>
      </aside>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-[#0a0a0a] z-[110] flex flex-col p-10 lg:p-20"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm tracking-[0.5em] text-gray-500 uppercase">মেনু সূচী</span>
              <button onClick={() => setIsOpen(false)} className="text-[#c5a47e] border border-[#c5a47e]/20 p-4 rounded-full">
                <X size={32} />
              </button>
            </div>
            <nav className="mt-20 space-y-8">
              {menuItems.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="group">
                  <a href={item.link} onClick={() => setIsOpen(false)} className="text-5xl lg:text-8xl font-serif text-white hover:text-[#c5a47e] transition-colors flex items-center gap-6">
                    <span className="text-xs font-sans text-gray-600">০{i + 1}</span>
                    {item.name}
                    <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// --- ৩. হিরো সেকশন ---
const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <section id="home" className="relative h-screen flex items-center justify-center bg-[#050505] overflow-hidden px-6">
      <motion.div style={{ y: y1 }} className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#c5a47e]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[100px]" />
      </motion.div>

      <div className="relative z-10 text-center space-y-10">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <span className="px-6 py-2 border border-white/10 rounded-full text-[10px] tracking-[0.6em] text-[#c5a47e] uppercase">
            ESTD 2024 • Dhaka
          </span>
        </motion.div>
        
        <h1 className="text-6xl md:text-[12rem] font-serif leading-[0.8] tracking-tighter text-white">
          উইল্‌স সাহিত্য<span className="italic font-light text-[#c5a47e]"> ক্লাব</span>
        </h1>
        
        <p className="max-w-xl mx-auto text-gray-400 font-light text-lg md:text-xl leading-relaxed">
          সাহিত্যের বন্ধনে, প্রতিভার সন্ধানে
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 pt-4">
          <Link href="#join" className="px-12 py-5 bg-[#c5a47e] text-black font-bold uppercase text-xs tracking-widest hover:bg-white transition-all shadow-[0_0_30px_rgba(197,164,126,0.3)]">
            সদস্য হোন
          </Link>
          <div className="flex items-center gap-4 text-white/40 cursor-pointer hover:text-[#c5a47e] transition-colors">
            <span className="text-xs uppercase tracking-widest">নিচের দিকে যান</span>
            <ChevronDown size={16} className="animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};

// --- নতুন: ইনফিনিট অ্যালবাম স্লাইডার ---
const AlbumSlider = () => {
  const images = ["/album/1.jpg", "/album/2.jpg", "/album/3.jpg", "/album/4.jpg", "/album/5.jpg", "/album/6.jpg"];
  const duplicatedImages = [...images, ...images]; 

  return (
    <section id="album" className="py-24 bg-white overflow-hidden">
      <div className="mb-16 px-6 lg:px-24">
        <h2 className="text-4xl md:text-6xl font-serif tracking-tighter text-black">স্মৃতির <span className="italic text-gray-400">অ্যালবাম</span></h2>
      </div>
      <div className="flex relative">
        <motion.div 
          className="flex gap-4 md:gap-8"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, ease: "linear", repeat: Infinity }}
        >
          {duplicatedImages.map((src, i) => (
            <div key={i} className="relative w-[300px] md:w-[450px] aspect-[4/5] flex-shrink-0 bg-gray-100 group overflow-hidden">
              <Image 
                src={src} 
                alt="Memory" 
                fill 
                sizes="(max-width: 768px) 300px, 450px"
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                onError={(e) => { e.currentTarget.style.opacity = '0.1'; }} 
              />
              <div className="absolute inset-0 border-[15px] border-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// --- ৪. সংকলন সেকশন ---
const Showcase = () => {
  const items = [
    { title: "অরণ্যের কবিতা", year: "২০২৪", tag: "কাব্য" },
    { title: "ধূসর পাণ্ডুলিপি", year: "২০২৫", tag: "উপন্যাস" },
    { title: "স্মৃতির মিছিল", year: "২০২৬", tag: "স্মৃতি" },
  ];

  return (
    <section id="gallery" className="py-40 bg-white text-black px-6 lg:px-24 border-t border-black/5">
      <div className="flex flex-col md:flex-row justify-between items-end mb-24 border-b border-black/5 pb-12">
        <h2 className="text-5xl md:text-8xl font-serif tracking-tighter italic">আমাদের <br /> সংকলন</h2>
        <p className="max-w-xs text-sm text-gray-500 font-light italic uppercase tracking-wider">
          বিগত কয়েক বছরের শ্রেষ্ঠ লেখনী ও আয়োজনের একটি সংক্ষিপ্ত আর্কাইভ।
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
        {items.map((item, i) => (
          <motion.div key={i} whileHover={{ y: -20 }} className="group relative cursor-pointer">
            <div className="aspect-[3/4] bg-[#f9f7f2] overflow-hidden relative">
               <div className="absolute inset-0 bg-[#c5a47e]/0 group-hover:bg-[#c5a47e]/10 transition-colors z-10" />
               <div className="w-full h-full border border-black/5 flex items-center justify-center text-4xl font-serif text-black/10">
                  {item.tag}
               </div>
            </div>
            <div className="mt-8 flex justify-between items-start">
              <div>
                <h4 className="text-3xl font-serif">{item.title}</h4>
                <p className="text-xs text-gray-400 mt-2 uppercase tracking-widest">{item.year} — {item.tag}</p>
              </div>
              <ArrowUpRight className="text-gray-300 group-hover:text-black transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// --- ৫. ফুটার ---
const Footer = () => {
  return (
    <footer id="contact" className="bg-[#050505] text-white pt-40 pb-10 px-6 lg:px-24">
      <div className="grid lg:grid-cols-2 gap-32 mb-40">
        <div className="space-y-12">
          <h3 className="text-6xl md:text-8xl font-serif tracking-tighter italic">যোগাযোগ <br /> করুন</h3>
          <div className="space-y-6">
            <div className="flex items-center gap-6 group cursor-pointer">
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#c5a47e] transition-colors">
                <Mail size={18} className="group-hover:text-[#c5a47e]" />
              </div>
              <span className="text-xl font-serif">info@shabdachayan.club</span>
            </div>
            <div className="flex items-center gap-6 group cursor-pointer">
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#c5a47e] transition-colors">
                <Phone size={18} className="group-hover:text-[#c5a47e]" />
              </div>
              <span className="text-xl font-serif">+৮৮০ ১৭১২-৩৪৫৬৭৮</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">সামাজিক যোগাযোগ</p>
            <div className="flex flex-wrap gap-4">
              <a href="#" className="p-4 bg-white/5 rounded-full hover:bg-[#c5a47e] hover:text-black transition-all"><FaFacebookF /></a>
              <a href="#" className="p-4 bg-white/5 rounded-full hover:bg-[#c5a47e] hover:text-black transition-all"><FaInstagram /></a>
              <a href="#" className="p-4 bg-white/5 rounded-full hover:bg-[#c5a47e] hover:text-black transition-all"><FaXTwitter /></a>
              <a href="#" className="p-4 bg-white/5 rounded-full hover:bg-[#c5a47e] hover:text-black transition-all"><SiBehance /></a>
            </div>
          </div>
          <div className="mt-20 lg:mt-0 p-10 bg-[#c5a47e] text-black text-center">
            <p className="text-xs uppercase tracking-[0.3em] font-bold">প্রতিদিন নতুন কিছু শিখুন</p>
            <h4 className="text-2xl font-serif mt-2 italic">"শব্দরাই আমাদের পরিচয়।"</h4>
          </div>
        </div>
      </div>
      <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-600 uppercase tracking-[0.2em] gap-6 text-center">
        <p>© ২০২৬ শব্দলোক সাহিত্য সংসদ। ডিজাইন ও ডেভেলপমেন্ট ফাহিম মুদ্দাসির।</p>
        <div className="flex gap-8"><span>গোপনীয়তা নীতি</span><span>শর্তাবলী</span></div>
      </div>
    </footer>
  );
};

// --- ৬. মেইন কম্পোনেন্ট ---
export default function Portfolio() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-[#050505] min-h-screen selection:bg-[#c5a47e] selection:text-black">
      <CustomCursor />
      <Navigation isOpen={isOpen} setIsOpen={setIsOpen} />
      
      <main className="xl:ml-[100px] transition-all duration-700">
        <Hero />
        
        <section id="philosophy" className="py-40 bg-[#0a0a0a] text-white px-6 lg:px-24 border-y border-white/5">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <Feather size={40} className="text-[#c5a47e] mx-auto animate-pulse" />
            <h2 className="text-4xl md:text-6xl font-serif leading-tight italic font-light">
              "কবিতা হলো সেই আয়না, যেখানে আমরা আমাদের আত্মাকে সবচেয়ে স্পষ্টভাবে দেখতে পাই।"
            </h2>
            <div className="h-[1px] w-24 bg-[#c5a47e] mx-auto opacity-30"></div>
            <p className="text-gray-500 text-sm uppercase tracking-[0.4em]">স্থাপিত ২০২৪ • শব্দলোক</p>
          </div>
        </section>

        <AlbumSlider />
        <Showcase />
        
        <section id="join" className="py-40 bg-black text-white px-6">
          <div className="max-w-3xl mx-auto border border-white/5 p-12 lg:p-20 text-center space-y-10 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#c5a47e]/10 blur-3xl rounded-full" />
             <h3 className="text-4xl font-serif italic">আমাদের পাণ্ডুলিপি পেতে চান?</h3>
             <div className="flex flex-col md:flex-row gap-4">
                <input type="email" placeholder="আপনার ইমেইল..." className="flex-1 bg-white/5 border border-white/10 px-6 py-4 outline-none focus:border-[#c5a47e] transition-all font-serif italic" />
                <button className="px-10 py-4 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-[#c5a47e] transition-colors">সাবস্ক্রাইব</button>
             </div>
          </div>
        </section>

        <Footer />
      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Noto+Serif+Bengali:wght@300;400;700&display=swap');
        html { scroll-behavior: smooth; }
        body { font-family: 'Noto Serif Bengali', serif; background: #050505; cursor: none; overflow-x: hidden; }
        h1, h2, h3, h4, .font-serif { font-family: 'Playfair Display', 'Noto Serif Bengali', serif; }
        @media (max-width: 1024px) { body { cursor: auto; } }
      `}</style>
    </div>
  );
}