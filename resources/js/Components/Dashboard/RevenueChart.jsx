import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RevenueChart = ({ data }) => {
    // Debugging: Cek apakah data masuk
    if (!data || data.length === 0) {
        return <div className="p-4 text-center text-red-500">Data Chart Kosong</div>;
    }

    const chartData = {
        labels: data.map(item => item.month),
        datasets: [
            {
                label: 'Pendapatan',
                data: data.map(item => item.total),
                backgroundColor: '#3B82F6',
                hoverBackgroundColor: '#2563EB',
                borderRadius: 4,
                barThickness: 'flex', 
                maxBarThickness: 40,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: {
                beginAtZero: true,
                grid: { borderDash: [2, 4] },
            },
            x: {
                grid: { display: false }
            }
        }
    };

    return (
        <div className="relative w-full h-full min-h-[300px] bg-gray-50 rounded-lg p-2">
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default RevenueChart;