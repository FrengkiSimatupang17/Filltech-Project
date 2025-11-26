import { Link, Head } from '@inertiajs/react';
import { 
    WifiIcon, 
    BoltIcon, 
    CurrencyDollarIcon, 
    CheckCircleIcon, 
    PhoneIcon 
} from '@heroicons/react/24/outline';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Welcome({ auth, packages }) {
    
    const scrollToPricing = () => {
        const element = document.getElementById('pricing');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const formatRupiah = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <>
            <Head title="Internet Cepat & Berkah" />
            
            <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
                
                {/* Navbar */}
                <div className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm px-4 sm:px-8 flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <ApplicationLogo className="h-8 w-auto fill-current text-blue-600" />
                            <span className="ml-2 hidden sm:inline font-bold text-gray-800 text-xl">Filltech Berkah</span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-3">
                        {auth.user ? (
                            <Link href={route('dashboard')} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm shadow-md transition-colors">
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="px-4 py-2 text-gray-700 font-bold hover:bg-gray-100 hover:text-blue-600 rounded-lg text-sm transition-colors">
                                    Log in
                                </Link>
                                <Link href={route('register')} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm shadow-md transition-colors">
                                    Daftar Sekarang
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Hero Section */}
                <div className="min-h-[85vh] bg-gradient-to-br from-blue-600 to-blue-900 text-white flex items-center pt-16">
                    <div className="w-full text-center p-6">
                        <div className="max-w-3xl mx-auto">
                            <div className="mb-6 inline-flex items-center justify-center px-4 py-1.5 bg-white/20 rounded-full backdrop-blur-sm border border-white/30 shadow-lg">
                                <span className="px-2 py-0.5 bg-yellow-400 text-blue-900 font-bold rounded-full text-xs mr-2">BARU</span>
                                <span className="text-sm font-medium text-white">Jaringan Fiber Optic Terluas di Batam</span>
                            </div>
                            
                            <h1 className="text-5xl font-extrabold leading-tight sm:text-7xl mb-6 drop-shadow-md text-white">
                                Internet Cepat, <br/>
                                <span className="text-yellow-400">Hidup Lebih Berkah.</span>
                            </h1>
                            
                            <p className="py-6 text-lg sm:text-xl text-blue-50 max-w-2xl mx-auto leading-relaxed">
                                Solusi internet WiFi unlimited tanpa FUP untuk rumah dan bisnis Anda. 
                                Stabil, terjangkau, dan didukung layanan teknisi profesional 24/7.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
                                <button onClick={scrollToPricing} className="px-8 py-3 bg-yellow-400 hover:bg-yellow-300 text-blue-900 rounded-lg text-lg shadow-xl font-bold transition-colors">
                                    Lihat Paket WiFi
                                </button>
                                <Link href={route('register')} className="px-8 py-3 bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 rounded-lg text-lg font-bold transition-colors">
                                    Pasang Sekarang
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <section className="py-24 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold mb-4 text-gray-900">Kenapa Memilih Filltech?</h2>
                            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Kami berkomitmen memberikan layanan terbaik dengan infrastruktur modern dan transparan.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
                                <div className="p-8 items-center text-center">
                                    <div className="p-4 bg-blue-100 rounded-full mb-4 mx-auto text-blue-600 w-fit">
                                        <BoltIcon className="h-10 w-10" />
                                    </div>
                                    <h3 className="text-xl mb-2 text-gray-800 font-bold">Koneksi Super Cepat</h3>
                                    <p className="text-gray-600">Nikmati streaming 4K, gaming tanpa lag, dan download cepat dengan jaringan fiber optic murni.</p>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
                                <div className="p-8 items-center text-center">
                                    <div className="p-4 bg-green-100 rounded-full mb-4 mx-auto text-green-600 w-fit">
                                        <CurrencyDollarIcon className="h-10 w-10" />
                                    </div>
                                    <h3 className="text-xl mb-2 text-gray-800 font-bold">Harga Transparan</h3>
                                    <p className="text-gray-600">Tanpa biaya tersembunyi. Apa yang Anda lihat adalah apa yang Anda bayar setiap bulannya.</p>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
                                <div className="p-8 items-center text-center">
                                    <div className="p-4 bg-purple-100 rounded-full mb-4 mx-auto text-purple-600 w-fit">
                                        <WifiIcon className="h-10 w-10" />
                                    </div>
                                    <h3 className="text-xl mb-2 text-gray-800 font-bold">Unlimited Tanpa FUP</h3>
                                    <p className="text-gray-600">Bebas internetan sepuasnya tanpa batasan kuota (Fair Usage Policy). Benar-benar unlimited.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="py-24 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold mb-4 text-gray-900">Pilih Paket Sesuai Kebutuhan</h2>
                            <p className="text-gray-600 text-lg">Semua paket sudah termasuk modem WiFi dan instalasi gratis.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center max-w-6xl mx-auto">
                            {packages.map((pkg, index) => (
                                <div key={pkg.id} className={`bg-white shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col rounded-xl ${index === 1 ? 'border-4 border-blue-600 relative scale-105 z-10' : 'border border-gray-200'}`}>
                                    
                                    {index === 1 && (
                                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                            <div className="bg-blue-600 border-none px-4 py-1.5 font-bold tracking-wide shadow-md text-white uppercase rounded-full">Paling Laris</div>
                                        </div>
                                    )}

                                    <div className="p-8 flex-grow">
                                        <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">{pkg.name}</h3>
                                        <div className="text-center mb-8 pt-4 border-t border-gray-100">
                                            <span className="text-4xl font-extrabold text-blue-600">
                                                {formatRupiah(pkg.price)}
                                            </span>
                                            <div className="text-sm font-medium text-gray-500 mt-1">/ bulan</div>
                                        </div>
                                        
                                        <ul className="space-y-4 mb-8 flex-grow">
                                            <li className="flex items-center gap-3 text-gray-700">
                                                <CheckCircleIcon className="h-6 w-6 text-blue-600 flex-shrink-0" />
                                                <span className="font-bold text-lg">Kecepatan {pkg.speed}</span>
                                            </li>
                                            <li className="flex items-center gap-3 text-gray-600">
                                                <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                                                <span>Unlimited Quota</span>
                                            </li>
                                            <li className="flex items-center gap-3 text-gray-600">
                                                <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                                                <span className="text-sm leading-tight">{pkg.description}</span>
                                            </li>
                                            <li className="flex items-center gap-3 text-gray-600">
                                                <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                                                <span>Support 24/7</span>
                                            </li>
                                        </ul>

                                        <div className="mt-auto pt-4">
                                            <Link 
                                                href={auth.user ? route('client.subscribe.index') : route('register')} 
                                                className={`w-full py-3 rounded-lg text-lg font-bold shadow-md transition-colors flex justify-center ${index === 1 ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/50' : 'bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'}`}
                                            >
                                                Pilih Paket Ini
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Footer */}
                <section className="py-24 bg-blue-700 text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
                    
                    <div className="container mx-auto px-4 text-center relative z-10">
                        <h2 className="text-4xl font-bold mb-6">Siap untuk Internet Lebih Baik?</h2>
                        <p className="text-blue-100 mb-10 max-w-2xl mx-auto text-xl leading-relaxed">
                            Bergabunglah dengan ribuan pelanggan puas lainnya di Batam. Pemasangan cepat, proses mudah, dan berkah.
                        </p>
                        <Link href={route('register')} className="px-8 py-3 bg-white text-blue-700 rounded-lg text-lg font-bold shadow-lg hover:bg-gray-100 hover:scale-105 transition-transform">
                            Daftar & Pasang Sekarang
                        </Link>
                    </div>
                </section>

                {/* Footer */}
                <footer className="p-10 bg-gray-900 text-gray-300 grid grid-cols-1 md:grid-cols-4 gap-8">
                    <aside className="col-span-1">
                        <ApplicationLogo className="h-14 w-auto fill-current mb-2 text-blue-500" />
                        <p className="font-bold text-xl mt-2 text-white">PT. Filltech Berkah Bersama</p>
                        <p className="text-gray-400 mt-1">Penyedia Layanan Internet Terpercaya.<br/>Memberikan koneksi terbaik untuk masa depan.</p>
                    </aside> 
                    <nav>
                        <header className="font-bold text-white opacity-100 text-lg mb-3">Layanan</header> 
                        <a className="block link link-hover text-gray-400 hover:text-white mb-2">Internet Rumah</a> 
                        <a className="block link link-hover text-gray-400 hover:text-white mb-2">Internet Bisnis</a> 
                        <a className="block link link-hover text-gray-400 hover:text-white">Dedicated Server</a>
                    </nav> 
                    <nav>
                        <header className="font-bold text-white opacity-100 text-lg mb-3">Perusahaan</header> 
                        <a className="block link link-hover text-gray-400 hover:text-white mb-2">Tentang Kami</a> 
                        <a className="block link link-hover text-gray-400 hover:text-white mb-2">Kontak</a> 
                        <a className="block link link-hover text-gray-400 hover:text-white">Karir</a>
                    </nav> 
                    <nav>
                        <header className="font-bold text-white opacity-100 text-lg mb-3">Hubungi Kami</header> 
                        <div className="flex items-center gap-3 text-gray-300 mb-2">
                            <PhoneIcon className="h-5 w-5 text-blue-500" />
                            <span>+62 812-3456-7890</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                            <span className="font-bold text-lg text-blue-500">@</span>
                            <span>support@filltech.com</span>
                        </div>
                    </nav>
                </footer>
                
                <footer className="p-6 border-t bg-gray-900 text-gray-400 border-gray-800 text-sm flex justify-between items-center flex-wrap">
                    <aside className="mb-2 md:mb-0">
                        <p>© 2025 PT. Filltech Berkah Bersama. All rights reserved.</p>
                    </aside>
                    <nav className="flex gap-4">
                         {/* Placeholder for social icons (removed inline SVG for cleanliness) */}
                        <a className="link link-hover hover:text-white">Twitter</a> 
                        <a className="link link-hover hover:text-white">Facebook</a> 
                    </nav>
                </footer>
            </div>
        </>
    );
}