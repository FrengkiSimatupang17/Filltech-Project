import { Link, Head } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { 
    WifiIcon, 
    BoltIcon, 
    CurrencyDollarIcon, 
    CheckCircleIcon, 
    PhoneIcon, 
    MapPinIcon,
    EnvelopeIcon,
    Bars3Icon,
    XMarkIcon,
    ArrowRightIcon,
    ServerIcon,
    UserGroupIcon,
    GlobeAsiaAustraliaIcon
} from '@heroicons/react/24/outline';
import ApplicationLogo from '@/Components/ApplicationLogo';

// --- KOMPONEN UNTUK ANIMASI SCROLL (REVEAL) ---
const Reveal = ({ children, delay = 0 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => { if (ref.current) observer.disconnect(); };
    }, []);

    return (
        <div 
            ref={ref} 
            className={`transition-all duration-1000 ease-out transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

export default function Welcome({ auth, packages }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        setMobileMenuOpen(false);
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    };

    const formatRupiah = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

    return (
        <>
            <Head title="Internet Cepat & Berkah" />
            
            <div className="min-h-screen bg-white font-sans text-slate-800 overflow-x-hidden selection:bg-blue-600 selection:text-white">
                
                {/* --- NAVBAR --- */}
                <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-6'}`}>
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <ApplicationLogo className={`h-9 w-auto transition-colors ${isScrolled ? 'text-blue-700' : 'text-white'}`} />
                            <span className={`text-xl font-extrabold tracking-tight ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
                                Filltech<span className="text-blue-500">.Net</span>
                            </span>
                        </div>

                        <div className="hidden md:flex items-center gap-8">
                            {['Tentang', 'Keunggulan', 'Paket', 'Lokasi'].map((item) => (
                                <button 
                                    key={item} 
                                    onClick={() => scrollToSection(item.toLowerCase())}
                                    className={`text-sm font-semibold tracking-wide transition-colors hover:text-blue-500 ${isScrolled ? 'text-slate-600' : 'text-slate-200'}`}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>

                        <div className="hidden md:flex items-center gap-3">
                            {auth.user ? (
                                <Link href={route('dashboard')} className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/30">
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('login')} className={`px-6 py-2.5 rounded-full font-bold text-sm transition-colors ${isScrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'}`}>
                                        Masuk
                                    </Link>
                                    <Link href={route('register')} className="px-6 py-2.5 rounded-full bg-white text-blue-900 hover:bg-blue-50 font-bold text-sm transition-all shadow-lg">
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </div>

                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">
                            {mobileMenuOpen ? (
                                <XMarkIcon className={`h-8 w-8 ${isScrolled ? 'text-slate-800' : 'text-white'}`} />
                            ) : (
                                <Bars3Icon className={`h-8 w-8 ${isScrolled ? 'text-slate-800' : 'text-white'}`} />
                            )}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    <div className={`absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl transform transition-all duration-300 origin-top md:hidden ${mobileMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 h-0'}`}>
                        <div className="p-4 flex flex-col gap-4 text-center">
                            {['Tentang', 'Keunggulan', 'Paket', 'Lokasi'].map((item) => (
                                <button key={item} onClick={() => scrollToSection(item.toLowerCase())} className="text-slate-700 font-bold py-2">
                                    {item}
                                </button>
                            ))}
                            <hr className="border-gray-100" />
                            {auth.user ? (
                                <Link href={route('dashboard')} className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold">Dashboard</Link>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    <Link href={route('login')} className="py-3 text-slate-700 font-bold border border-gray-200 rounded-lg">Masuk</Link>
                                    <Link href={route('register')} className="py-3 bg-blue-600 text-white font-bold rounded-lg">Daftar</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>

                {/* --- HERO SECTION --- */}
                <section className="relative h-[110vh] min-h-[600px] flex items-center justify-center overflow-hidden">
                    {/* Background Image (Abstract Network) */}
                    <div className="absolute inset-0 z-0">
                        <img 
                            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" 
                            alt="Background Network" 
                            className="w-full h-full object-cover"
                        />
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-900 z-10"></div>
                    </div>

                    <div className="container mx-auto px-4 relative z-20 text-center -mt-20">
                        <Reveal>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-blue-200 text-xs font-bold tracking-widest uppercase mb-8 backdrop-blur-sm">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                Jaringan Fiber Optic No.1 Batam
                            </div>
                        </Reveal>
                        
                        <Reveal delay={100}>
                            <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tight mb-8 leading-tight drop-shadow-lg">
                                Internet <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Tanpa Batas,</span><br />
                                Kualitas Berkelas.
                            </h1>
                        </Reveal>
                        
                        <Reveal delay={200}>
                            <p className="text-lg sm:text-2xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
                                Solusi konektivitas fiber optic super cepat untuk rumah dan bisnis Anda. 
                                Nikmati streaming 4K, gaming tanpa lag, dan bekerja tanpa batas kuota (True Unlimited).
                            </p>
                        </Reveal>
                        
                        <Reveal delay={300}>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                                <button onClick={() => scrollToSection('paket')} className="w-full sm:w-auto px-10 py-5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3 group">
                                    Lihat Paket <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <Link href={route('register')} className="w-full sm:w-auto px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all">
                                    Hubungi Sales
                                </Link>
                            </div>
                        </Reveal>
                    </div>

                    {/* Stats Strip */}
                    <div className="absolute bottom-0 w-full bg-white/5 backdrop-blur-md border-t border-white/10 z-20 py-6 hidden md:block">
                        <div className="container mx-auto px-4 flex justify-center gap-16 text-white">
                            <div className="flex items-center gap-4">
                                <ServerIcon className="w-10 h-10 text-blue-400" />
                                <div>
                                    <p className="text-2xl font-bold">99.9%</p>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider">Uptime SLA</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <UserGroupIcon className="w-10 h-10 text-emerald-400" />
                                <div>
                                    <p className="text-2xl font-bold">1000+</p>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider">Pelanggan Aktif</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <GlobeAsiaAustraliaIcon className="w-10 h-10 text-purple-400" />
                                <div>
                                    <p className="text-2xl font-bold">100%</p>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider">Fiber Optic</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- ABOUT SECTION (IMAGE + TEXT) --- */}
                <section id="tentang" className="py-24 bg-white overflow-hidden">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row items-center gap-16">
                            
                            {/* Image Side */}
                            <div className="w-full lg:w-1/2 relative">
                                <Reveal>
                                    <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-100">
                                        <img 
                                            src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=2070&auto=format&fit=crop" 
                                            alt="Happy Family Internet" 
                                            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-8">
                                            <p className="text-white font-bold text-lg">Koneksi untuk Keluarga</p>
                                            <p className="text-slate-300 text-sm">Menghubungkan kebahagiaan di rumah.</p>
                                        </div>
                                    </div>
                                    {/* Decorative Dot Grid */}
                                    <div className="absolute -z-10 -bottom-10 -right-10 w-40 h-40 bg-[url('/grid-pattern.svg')] opacity-20"></div>
                                </Reveal>
                            </div>

                            {/* Text Side */}
                            <div className="w-full lg:w-1/2">
                                <Reveal delay={200}>
                                    <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-2 block">Tentang Filltech</span>
                                    <h2 className="text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                                        Lebih Dari Sekadar <br/>Penyedia Internet.
                                    </h2>
                                    <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                                        PT. Filltech Berkah Bersama hadir menjawab kebutuhan masyarakat Batam akan internet yang stabil, cepat, dan terjangkau. 
                                    </p>
                                    <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                        Kami menggunakan teknologi Fiber Optic terbaru yang tahan cuaca, minim gangguan, dan didukung oleh tim teknisi lokal yang siap siaga 24 jam. Visi kami sederhana: <strong>Internet Lancar, Hidup Berkah.</strong>
                                    </p>
                                    
                                    <div className="flex flex-col gap-4">
                                        {['Infrastruktur Milik Sendiri', 'Tim Support Lokal Batam', 'Harga Tetap Selamanya'].map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-3">
                                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                                    <CheckCircleIcon className="w-4 h-4" />
                                                </div>
                                                <span className="font-semibold text-slate-700">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </Reveal>
                            </div>

                        </div>
                    </div>
                </section>

                {/* --- FEATURES SECTION (CARDS) --- */}
                <section id="keunggulan" className="py-24 bg-slate-50 relative">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <Reveal>
                                <h2 className="text-3xl font-bold text-slate-900 mb-4">Kenapa Memilih Filltech?</h2>
                                <p className="text-slate-600">Kami fokus pada kualitas jaringan dan kepuasan pelanggan, bukan sekadar janji manis.</p>
                            </Reveal>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <Reveal delay={100}>
                                <div className="group p-8 rounded-3xl bg-white shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:-translate-y-2">
                                    <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                        <BoltIcon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">Kecepatan Stabil</h3>
                                    <p className="text-slate-600">Anti buffering saat jam sibuk. Jalur khusus yang kami optimasi untuk streaming dan meeting online.</p>
                                </div>
                            </Reveal>
                            
                            <Reveal delay={200}>
                                <div className="group p-8 rounded-3xl bg-white shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:-translate-y-2">
                                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                                        <CurrencyDollarIcon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">Tanpa Biaya Tersembunyi</h3>
                                    <p className="text-slate-600">Tagihan flat setiap bulan. Gratis biaya sewa modem dan gratis instalasi untuk pelanggan baru.</p>
                                </div>
                            </Reveal>
                            
                            <Reveal delay={300}>
                                <div className="group p-8 rounded-3xl bg-white shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:-translate-y-2">
                                    <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                                        <WifiIcon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">True Unlimited</h3>
                                    <p className="text-slate-600">Download file bergiga-giga sepuasnya tanpa takut kecepatan diturunkan (No FUP).</p>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </section>

                {/* --- PRICING SECTION --- */}
                <section id="paket" className="py-24 bg-slate-900 relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#4b5563_1px,transparent_1px)] [background-size:16px_16px]"></div>
                    
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-16">
                            <Reveal>
                                <span className="text-blue-400 font-bold tracking-widest text-sm uppercase">Pilihan Paket</span>
                                <h2 className="text-4xl font-bold text-white mt-2">Investasi Terbaik untuk Produktivitas</h2>
                            </Reveal>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {packages.map((pkg, index) => (
                                <Reveal key={pkg.id} delay={index * 100}>
                                    <div className={`relative rounded-3xl p-8 flex flex-col transition-all duration-300 h-full ${
                                        index === 1 
                                            ? 'bg-gradient-to-b from-blue-600 to-blue-800 shadow-2xl shadow-blue-900/50 transform md:-translate-y-4 border border-blue-400' 
                                            : 'bg-slate-800 border border-slate-700 hover:bg-slate-750'
                                    }`}>
                                        {index === 1 && (
                                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg tracking-wide uppercase">
                                                Best Seller
                                            </div>
                                        )}

                                        <div className="mb-6">
                                            <h3 className="text-2xl font-bold text-white">{pkg.name}</h3>
                                            <p className={`text-sm mt-2 ${index === 1 ? 'text-blue-100' : 'text-slate-400'}`}>
                                                {pkg.description || 'Pilihan tepat untuk aktivitas digital Anda'}
                                            </p>
                                        </div>

                                        <div className="mb-8 pb-8 border-b border-white/10">
                                            <div className="flex items-baseline">
                                                <span className="text-4xl font-bold text-white">{formatRupiah(pkg.price)}</span>
                                                <span className={`text-sm ml-2 ${index === 1 ? 'text-blue-200' : 'text-slate-500'}`}>/bln</span>
                                            </div>
                                        </div>

                                        <ul className="space-y-4 mb-8 flex-1">
                                            <li className="flex items-center gap-3">
                                                <div className={`p-1 rounded-full ${index === 1 ? 'bg-blue-500' : 'bg-slate-700'}`}>
                                                    <CheckCircleIcon className="w-4 h-4 text-white" />
                                                </div>
                                                <span className="font-bold text-white">Speed {pkg.speed}</span>
                                            </li>
                                            {['Unlimited Quota (No FUP)', 'Gratis Modem WiFi', 'Support Prioritas'].map((feat, i) => (
                                                <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                                                    <CheckCircleIcon className={`w-5 h-5 ${index === 1 ? 'text-blue-300' : 'text-slate-600'}`} />
                                                    <span>{feat}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <Link 
                                            href={auth.user ? route('client.subscribe.index') : route('register')} 
                                            className={`w-full py-4 rounded-xl font-bold text-center transition-all shadow-lg ${
                                                index === 1 
                                                    ? 'bg-white text-blue-700 hover:bg-blue-50' 
                                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                            }`}
                                        >
                                            {index === 1 ? 'Pilih Paket Ini' : 'Berlangganan'}
                                        </Link>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- CONTACT & LOCATION SECTION --- */}
                <section id="lokasi" className="py-24 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            
                            {/* Contact Info */}
                            <Reveal>
                                <div>
                                    <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-2 block">Hubungi Kami</span>
                                    <h2 className="text-4xl font-bold text-slate-900 mb-6">Jangan Ragu Bertanya</h2>
                                    <p className="text-slate-600 text-lg mb-8">
                                        Tim teknis dan layanan pelanggan kami berbasis di Batam, siap membantu Anda menyelesaikan masalah koneksi dengan cepat.
                                    </p>

                                    <div className="space-y-6">
                                        <div className="flex items-start gap-5 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                            <div className="p-4 bg-blue-100 text-blue-600 rounded-xl">
                                                <MapPinIcon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-lg">Alamat Kantor</h4>
                                                <p className="text-slate-600 mt-1 leading-relaxed">
                                                    PJB III, BLOK AX 28, Sagulung Kota,<br/>
                                                    Kec. Sagulung, Kota Batam,<br/>
                                                    Kepulauan Riau 29425
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-5 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                            <div className="p-4 bg-emerald-100 text-emerald-600 rounded-xl">
                                                <PhoneIcon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-lg">Layanan Pelanggan</h4>
                                                <p className="text-slate-600 mt-1 font-mono text-lg">+62 812-3456-7890</p>
                                                <p className="text-sm text-slate-400 mt-1">Senin - Minggu (08:00 - 22:00 WIB)</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-5 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                            <div className="p-4 bg-purple-100 text-purple-600 rounded-xl">
                                                <EnvelopeIcon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-lg">Email</h4>
                                                <p className="text-slate-600 mt-1">filltechberkahbersama@gmail.com</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Reveal>

                            {/* Map */}
                            <Reveal delay={200}>
                                <div className="h-[500px] w-full bg-slate-100 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white relative group">
<iframe 
    src="https://maps.google.com/maps?q=PT.FILTECH%20BERKAH%20BERSAMA%20Batam&t=&z=15&ie=UTF8&iwloc=&output=embed"
    width="100%" 
    height="100%" 
    style={{border:0}} 
    allowFullScreen="" 
    loading="lazy" 
    referrerPolicy="no-referrer-when-downgrade"
    title="Lokasi Filltech"
    className="grayscale group-hover:grayscale-0 transition-all duration-500"
></iframe>
                                    <div className="absolute bottom-6 left-6 right-6 bg-white p-4 rounded-xl shadow-lg flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-slate-900">Kantor Pusat</p>
                                            <p className="text-xs text-slate-500">Sagulung, Batam</p>
                                        </div>
                                        <a href="https://maps.google.com/?q=PT+Filltech+Berkah+Bersama" target="_blank" className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
                                            Buka Maps
                                        </a>
                                    </div>
                                </div>
                            </Reveal>

                        </div>
                    </div>
                </section>

                {/* --- FOOTER --- */}
                <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                            <div className="col-span-1 md:col-span-2">
                                <div className="flex items-center gap-3 mb-6">
                                    <ApplicationLogo className="h-10 w-auto text-blue-600 fill-current" />
                                    <span className="text-2xl font-bold text-white">Filltech<span className="text-blue-600">.Net</span></span>
                                </div>
                                <p className="max-w-sm text-slate-400 leading-relaxed mb-6">
                                    Penyedia layanan internet fiber optic terpercaya di Batam. Fokus kami adalah kualitas jaringan yang stabil dan pelayanan yang memanusiakan pelanggan.
                                </p>
                                <div className="flex gap-4">
                                    {/* Social Placeholders */}
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all cursor-pointer">
                                            <GlobeAsiaAustraliaIcon className="w-5 h-5" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Navigasi</h4>
                                <ul className="space-y-4 text-sm">
                                    <li><button onClick={() => scrollToSection('tentang')} className="hover:text-blue-400 transition-colors">Tentang Kami</button></li>
                                    <li><button onClick={() => scrollToSection('keunggulan')} className="hover:text-blue-400 transition-colors">Keunggulan</button></li>
                                    <li><button onClick={() => scrollToSection('paket')} className="hover:text-blue-400 transition-colors">Daftar Paket</button></li>
                                    <li><Link href={route('login')} className="hover:text-blue-400 transition-colors">Client Area</Link></li>
                                </ul>
                            </div>
                            
                            <div>
                                <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Bantuan</h4>
                                <ul className="space-y-4 text-sm">
                                    <li><a href="#" className="hover:text-blue-400 transition-colors">Cek Jangkauan</a></li>
                                    <li><a href="#" className="hover:text-blue-400 transition-colors">Lapor Gangguan</a></li>
                                    <li><a href="#" className="hover:text-blue-400 transition-colors">Syarat & Ketentuan</a></li>
                                    <li><a href="#" className="hover:text-blue-400 transition-colors">Kebijakan Privasi</a></li>
                                </ul>
                            </div>
                        </div>
                        
                        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                            <div>© {new Date().getFullYear()} PT. Filltech Berkah Bersama.</div>
                            <div className="text-slate-600">Designed with ❤️ in Batam.</div>
                        </div>
                    </div>
                </footer>

            </div>
        </>
    );
}