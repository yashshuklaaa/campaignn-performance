import { ArrowUpRight, ArrowDownRight, Minus, DollarSign, Zap, MousePointer2, Eye, TrendingUp, Percent, BarChart3, CheckCircle2, PauseCircle, LayoutGrid, type LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Metric } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface MetricCardProps {
    metric: Metric;
}

function getMetricIcon(label: string): LucideIcon {
    const lowerLabel = label.toLowerCase();

    if (lowerLabel.includes('total campaigns')) return LayoutGrid;
    if (lowerLabel.includes('active')) return Zap;
    if (lowerLabel.includes('paused')) return PauseCircle;
    if (lowerLabel.includes('completed')) return CheckCircle2;
    if (lowerLabel.includes('spend')) return DollarSign;
    if (lowerLabel.includes('impressions')) return Eye;
    if (lowerLabel.includes('clicks')) return MousePointer2;
    if (lowerLabel.includes('conversions') || lowerLabel.includes('conversion rate')) return TrendingUp;
    if (lowerLabel.includes('ctr')) return Percent;
    if (lowerLabel.includes('cpc')) return BarChart3;
    return LayoutGrid;
}

function getAccentColor(label: string): { text: string; textLight: string; bg: string; bgLight: string } {
    const lowerLabel = label.toLowerCase();

    if (lowerLabel.includes('spend')) {
        return { text: 'text-blue-400', textLight: 'text-blue-600', bg: 'bg-blue-500/10', bgLight: 'bg-blue-50' };
    } else if (lowerLabel.includes('active')) {
        return { text: 'text-emerald-400', textLight: 'text-emerald-600', bg: 'bg-emerald-500/10', bgLight: 'bg-emerald-50' };
    } else if (lowerLabel.includes('paused')) {
        return { text: 'text-amber-400', textLight: 'text-amber-600', bg: 'bg-amber-500/10', bgLight: 'bg-amber-50' };
    } else if (lowerLabel.includes('completed')) {
        return { text: 'text-purple-400', textLight: 'text-purple-600', bg: 'bg-purple-500/10', bgLight: 'bg-purple-50' };
    } else if (lowerLabel.includes('impressions')) {
        return { text: 'text-cyan-400', textLight: 'text-cyan-600', bg: 'bg-cyan-500/10', bgLight: 'bg-cyan-50' };
    } else if (lowerLabel.includes('clicks')) {
        return { text: 'text-pink-400', textLight: 'text-pink-600', bg: 'bg-pink-500/10', bgLight: 'bg-pink-50' };
    } else if (lowerLabel.includes('conversions') || lowerLabel.includes('conversion rate')) {
        return { text: 'text-orange-400', textLight: 'text-orange-600', bg: 'bg-orange-500/10', bgLight: 'bg-orange-50' };
    } else if (lowerLabel.includes('ctr')) {
        return { text: 'text-rose-400', textLight: 'text-rose-600', bg: 'bg-rose-500/10', bgLight: 'bg-rose-50' };
    } else if (lowerLabel.includes('cpc')) {
        return { text: 'text-indigo-400', textLight: 'text-indigo-600', bg: 'bg-indigo-500/10', bgLight: 'bg-indigo-50' };
    } else if (lowerLabel.includes('total campaigns')) {
        return { text: 'text-teal-400', textLight: 'text-teal-600', bg: 'bg-teal-500/10', bgLight: 'bg-teal-50' };
    }
    return { text: 'text-slate-400', textLight: 'text-gray-600', bg: 'bg-slate-500/10', bgLight: 'bg-gray-50' };
}

export function MetricCard({ metric }: MetricCardProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const accent = getAccentColor(metric.label);
    const Icon = getMetricIcon(metric.label);

    return (
        <div className={cn(
            "relative p-3 sm:p-4 rounded-xl transition-all duration-300 group",
            isDark
                ? "bg-slate-900/80 border border-slate-700/50 hover:border-slate-600/50"
                : "bg-white border border-gray-200 shadow-sm hover:shadow-md"
        )}>
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                    <p className={cn(
                        "text-xs sm:text-sm font-medium truncate",
                        isDark ? "text-slate-400" : "text-gray-500"
                    )}>{metric.label}</p>
                    <p className={cn("text-lg sm:text-xl font-bold mt-1", isDark ? accent.text : accent.textLight)}>{metric.value}</p>
                    <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                        <div className={cn(
                            "flex items-center text-xs font-semibold rounded-full px-1.5 py-0.5",
                            metric.trend === 'up'
                                ? isDark ? "text-emerald-400 bg-emerald-500/10" : "text-emerald-600 bg-emerald-50"
                                : metric.trend === 'down'
                                    ? isDark ? "text-red-400 bg-red-500/10" : "text-red-600 bg-red-50"
                                    : isDark ? "text-slate-400 bg-slate-700/50" : "text-gray-500 bg-gray-100"
                        )}>
                            {metric.trend === 'up' && <ArrowUpRight className="w-3 h-3" />}
                            {metric.trend === 'down' && <ArrowDownRight className="w-3 h-3" />}
                            {metric.trend === 'neutral' && <Minus className="w-3 h-3" />}
                            <span className="ml-0.5">{Math.abs(metric.change)}%</span>
                        </div>
                    </div>
                </div>

                <div className={cn(
                    "p-2 rounded-lg flex-shrink-0",
                    isDark ? accent.bg : accent.bgLight
                )}>
                    <Icon className={cn("w-4 h-4 sm:w-5 sm:h-5", isDark ? accent.text : accent.textLight)} />
                </div>
            </div>
        </div>
    );
}
