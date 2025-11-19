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

    return (
        <>
            <Head title="Internet Cepat & Berkah" />
            
            <div className="min-h-screen bg-base-100 font-sans text-base-content">
                
                <div className="navbar bg-white fixed top-0 z-50 border-b border-gray-200 shadow-sm px-4 sm:px-8 flex justify-between items-center">
                    <div className="flex-1">
                        <Link href="/" className="btn btn-ghost normal-case text-xl gap-2 hover:bg-gray-100">
                            <ApplicationLogo className="h-8 w-auto fill-current text-blue-600" />
                            <span className="hidden sm:inline font-bold text-gray-800">Filltech Berkah</span>
                        </Link>
                    </div>
                    <div className="flex-none gap-3">
                        {auth.user ? (
                            <Link href={route('dashboard')} className="btn btn-primary btn-sm text-white">
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="btn btn-ghost btn-sm text-gray-700 font-bold hover:bg-gray-100 hover:text-blue-600">
                                    Log in
                                </Link>
                                <Link href={route('register')} className="btn btn-primary btn-sm text-white border-none">
                                    Daftar Sekarang
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                <div className="hero min-h-[85vh] bg-gradient-to-br from-blue-600 to-blue-900 text-white pt-20">
                    <div className="hero-content text-center p-6">
                        <div className="max-w-3xl">
                            <div className="mb-6 inline-flex items-center justify-center px-4 py-1.5 bg-white/20 rounded-full backdrop-blur-sm border border-white/30 shadow-lg">
                                <span className="badge badge-warning badge-sm mr-2 font-bold border-none text-blue-900">BARU</span>
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
                                <button onClick={scrollToPricing} className="btn bg-yellow-400 hover:bg-yellow-300 text-blue-900 btn-lg shadow-xl border-none font-bold">
                                    Lihat Paket WiFi
                                </button>
                                <Link href={route('register')} className="btn btn-outline btn-lg text-white border-2 hover:bg-white hover:text-blue-600 hover:border-white font-bold">
                                    Pasang Sekarang
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="py-24 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold mb-4 text-gray-900">Kenapa Memilih Filltech?</h2>
                            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Kami berkomitmen memberikan layanan terbaik dengan infrastruktur modern dan transparan.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="card bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
                                <div className="card-body items-center text-center p-8">
                                    <div className="p-4 bg-blue-100 rounded-full mb-4 text-blue-600">
                                        <BoltIcon className="h-10 w-10" />
                                    </div>
                                    <h3 className="card-title text-xl mb-2 text-gray-800">Koneksi Super Cepat</h3>
                                    <p className="text-gray-600">Nikmati streaming 4K, gaming tanpa lag, dan download cepat dengan jaringan fiber optic murni.</p>
                                </div>
                            </div>
                            
                            <div className="card bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
                                <div className="card-body items-center text-center p-8">
                                    <div className="p-4 bg-green-100 rounded-full mb-4 text-green-600">
                                        <CurrencyDollarIcon className="h-10 w-10" />
                                    </div>
                                    <h3 className="card-title text-xl mb-2 text-gray-800">Harga Transparan</h3>
                                    <p className="text-gray-600">Tanpa biaya tersembunyi. Apa yang Anda lihat adalah apa yang Anda bayar setiap bulannya.</p>
                                </div>
                            </div>
                            
                            <div className="card bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
                                <div className="card-body items-center text-center p-8">
                                    <div className="p-4 bg-purple-100 rounded-full mb-4 text-purple-600">
                                        <WifiIcon className="h-10 w-10" />
                                    </div>
                                    <h3 className="card-title text-xl mb-2 text-gray-800">Unlimited Tanpa FUP</h3>
                                    <p className="text-gray-600">Bebas internetan sepuasnya tanpa batasan kuota (Fair Usage Policy). Benar-benar unlimited.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="pricing" className="py-24 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold mb-4 text-gray-900">Pilih Paket Sesuai Kebutuhan</h2>
                            <p className="text-gray-600 text-lg">Semua paket sudah termasuk modem WiFi dan instalasi gratis.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center max-w-6xl mx-auto">
                            {packages.map((pkg, index) => (
                                <div key={pkg.id} className={`card bg-white shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col ${index === 1 ? 'border-2 border-blue-600 relative scale-105 z-10' : 'border border-gray-200'}`}>
                                    
                                    {index === 1 && (
                                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                            <div className="badge bg-blue-600 border-none p-4 font-bold tracking-wide shadow-md text-white uppercase">Paling Laris</div>
                                        </div>
                                    )}

                                    <div className="card-body p-8 flex-grow">
                                        <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">{pkg.name}</h3>
                                        <div className="text-center mb-8 pt-4 border-t border-gray-100">
                                            <span className="text-4xl font-extrabold text-blue-600">
                                                {parseFloat(pkg.price).toLocaleString('id-ID')}
                                            </span>
                                            <div className="text-sm font-medium text-gray-500 mt-1">Rupiah / bulan</div>
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

                                        <div className="card-actions">
                                            <Link 
                                                href={auth.user ? route('client.subscribe.index') : route('register')} 
                                                className={`btn w-full btn-lg ${index === 1 ? 'btn-primary text-white shadow-lg hover:shadow-blue-500/50' : 'btn-outline btn-primary hover:text-white'}`}
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

                <section className="py-24 bg-blue-700 text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
                    
                    <div className="container mx-auto px-4 text-center relative z-10">
                        <h2 className="text-4xl font-bold mb-6">Siap untuk Internet Lebih Baik?</h2>
                        <p className="text-blue-100 mb-10 max-w-2xl mx-auto text-xl leading-relaxed">
                            Bergabunglah dengan ribuan pelanggan puas lainnya di Batam. Pemasangan cepat, proses mudah, dan berkah.
                        </p>
                        <Link href={route('register')} className="btn btn-white text-blue-700 btn-lg font-bold border-none shadow-lg hover:bg-gray-100 hover:scale-105 transition-transform">
                            Daftar & Pasang Sekarang
                        </Link>
                    </div>
                </section>

                <footer className="footer p-10 bg-gray-900 text-gray-300">
                    <aside>
                        <ApplicationLogo className="h-14 w-auto fill-current mb-2 text-blue-500" />
                        <p className="font-bold text-xl mt-2 text-white">
                            PT. Filltech Berkah Bersama
                        </p>
                        <p className="text-gray-400 mt-1">Penyedia Layanan Internet Terpercaya.<br/>Memberikan koneksi terbaik untuk masa depan.</p>
                    </aside> 
                    <nav>
                        <header className="footer-title text-white opacity-100">Layanan</header> 
                        <a className="link link-hover text-gray-400 hover:text-white">Internet Rumah</a> 
                        <a className="link link-hover text-gray-400 hover:text-white">Internet Bisnis</a> 
                        <a className="link link-hover text-gray-400 hover:text-white">Dedicated Server</a>
                    </nav> 
                    <nav>
                        <header className="footer-title text-white opacity-100">Perusahaan</header> 
                        <a className="link link-hover text-gray-400 hover:text-white">Tentang Kami</a> 
                        <a className="link link-hover text-gray-400 hover:text-white">Kontak</a> 
                        <a className="link link-hover text-gray-400 hover:text-white">Karir</a>
                    </nav> 
                    <nav>
                        <header className="footer-title text-white opacity-100">Hubungi Kami</header> 
                        <div className="flex items-center gap-3 text-gray-300">
                            <PhoneIcon className="h-5 w-5 text-blue-500" />
                            <span>+62 812-3456-7890</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                            <span className="font-bold text-lg text-blue-500">@</span>
                            <span>support@filltech.com</span>
                        </div>
                    </nav>
                </footer>
                
                <footer className="footer px-10 py-6 border-t bg-gray-900 text-gray-400 border-gray-800">
                    <aside className="items-center grid-flow-col">
                        <p>© 2025 PT. Filltech Berkah Bersama. All rights reserved.</p>
                    </aside>
                    <nav className="md:place-self-center justify-self-end">
                        <div className="grid grid-flow-col gap-4">
                             <a className="link link-hover hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg></a> 
                        </div>
                    </nav>
                </footer>
            </div>
        </>
    );
}