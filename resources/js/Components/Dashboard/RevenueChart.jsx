import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function RevenueChart({ data }) {
    // Fungsi format rupiah untuk tooltip
    const formatRupiah = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(value);
    };

    // Custom Tooltip agar terlihat rapi
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg">
                    <p className="font-bold text-gray-700">{label}</p>
                    <p className="text-blue-600 font-semibold">
                        {formatRupiah(payload[0].value)}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height="100%">
            {/* Pastikan data yang diterima tidak null */}
            <BarChart data={data || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                
                {/* Sumbu X menampilkan nama bulan (Jan, Feb...) */}
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6B7280', fontSize: 12 }} 
                    dy={10}
                />
                
                {/* Sumbu Y menampilkan angka */}
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6B7280', fontSize: 12 }} 
                    tickFormatter={(value) => `${value / 1000}k`} // Singkat angka (150k)
                />
                
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F3F4F6' }} />
                
                {/* Batang Grafik: dataKey WAJIB 'total' sesuai controller */}
                <Bar 
                    dataKey="total" 
                    fill="#3B82F6" 
                    radius={[4, 4, 0, 0]} 
                    barSize={40}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}