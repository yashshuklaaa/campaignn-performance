import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ChartData } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';

interface PerformanceChartProps {
    data: ChartData[];
}

export function PerformanceChart({ data }: PerformanceChartProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className={cn(
            "p-4 sm:p-5 rounded-xl",
            isDark ? "glass-card" : "bg-white border border-gray-200 shadow-sm"
        )}>
            <h3 className={cn(
                "text-base font-semibold mb-4",
                isDark ? "text-slate-100" : "text-gray-900"
            )}>Performance Trends</h3>
            <div className="h-[250px] sm:h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={isDark ? 0.3 : 0.2} />
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={isDark ? 0.3 : 0.2} />
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke={isDark ? "#334155" : "#E5E7EB"}
                        />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: isDark ? '#94A3B8' : '#6B7280', fontSize: 11 }}
                            dy={8}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: isDark ? '#94A3B8' : '#6B7280', fontSize: 11 }}
                            width={45}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                                borderColor: isDark ? '#334155' : '#E5E7EB',
                                borderRadius: '8px',
                                color: isDark ? '#F1F5F9' : '#111827',
                                fontSize: '12px'
                            }}
                            labelStyle={{ color: isDark ? '#94A3B8' : '#6B7280' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="impressions"
                            stroke="#3B82F6"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorImpressions)"
                        />
                        <Area
                            type="monotone"
                            dataKey="clicks"
                            stroke="#10B981"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorClicks)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
