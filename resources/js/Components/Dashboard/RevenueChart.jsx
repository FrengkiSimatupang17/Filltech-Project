import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RevenueChart = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-400 text-sm">Data grafik tidak tersedia</p>
            </div>
        );
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
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { borderDash: [2, 4] },
                ticks: {
                    font: { size: 10 },
                    callback: (value) => 'Rp ' + (value / 1000) + 'k'
                }
            },
            x: {
                grid: { display: false },
                ticks: { font: { size: 11 } }
            }
        }
    };

    return (
        <div className="relative h-full w-full">
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default RevenueChart;