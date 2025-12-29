import { useEffect, useState } from 'react';
import { MetricsGrid } from '../components/dashboard/MetricsGrid';
import { PerformanceChart } from '../components/dashboard/PerformanceChart';
import { CampaignTable } from '../components/dashboard/CampaignTable';
import { CampaignDrawer } from '../components/dashboard/CampaignDrawer';
import { fetchCampaigns, fetchGlobalInsights, generateChartData } from '../lib/api';
import type { Campaign, Metric, ChartData } from '../types';
import { Loader2, AlertCircle, TrendingUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/utils';

export function Dashboard() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [metrics, setMetrics] = useState<Metric[]>([]);
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Drawer state
    const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const [campaignsData, metricsData] = await Promise.all([
                    fetchCampaigns(),
                    fetchGlobalInsights()
                ]);

                setCampaigns(campaignsData);
                setMetrics(metricsData);
                setChartData(generateChartData());
                setError(null);
            } catch (err) {
                setError('Failed to load dashboard data. Please check your internet connection and try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    const handleViewCampaign = (campaignId: string) => {
        setSelectedCampaignId(campaignId);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setSelectedCampaignId(null);
    };

    const chartSummary = {
        totalImpressions: chartData.reduce((sum, d) => sum + d.impressions, 0),
        totalClicks: chartData.reduce((sum, d) => sum + d.clicks, 0),
        totalConversions: chartData.reduce((sum, d) => sum + d.conversions, 0),
        peakDay: chartData.length > 0 ? chartData.reduce((max, d) => d.impressions > max.impressions ? d : max, chartData[0]) : null,
    };

    if (loading) {
        return (
            <div className="flex h-full w-full items-center justify-center p-8">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-blue-500" />
                    <p className={cn("text-sm font-medium", isDark ? "text-slate-400" : "text-gray-500")}>Loading...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-full w-full items-center justify-center p-4">
                <div className={cn(
                    "p-6 rounded-xl max-w-md w-full text-center",
                    isDark ? "glass-card border-red-500/20" : "bg-white border border-red-200 shadow-lg"
                )}>
                    <div className={cn(
                        "mx-auto w-10 h-10 rounded-full flex items-center justify-center mb-3",
                        isDark ? "bg-red-500/10" : "bg-red-50"
                    )}>
                        <AlertCircle className={cn("h-5 w-5", isDark ? "text-red-400" : "text-red-600")} />
                    </div>
                    <h3 className={cn("text-base font-semibold mb-2", isDark ? "text-slate-100" : "text-gray-900")}>Connection Error</h3>
                    <p className={cn("text-sm mb-4", isDark ? "text-slate-400" : "text-gray-600")}>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors w-full"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4 sm:space-y-6">
                <div>
                    <h2 className={cn("text-xl sm:text-2xl font-bold tracking-tight", isDark ? "text-slate-50" : "text-gray-900")}>Campaign performance</h2>
                    <p className={cn("mt-0.5 text-xs sm:text-sm", isDark ? "text-slate-400" : "text-gray-500")}>Campaign performance overview</p>
                </div>

                <MetricsGrid metrics={metrics} />

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
                    <div className="xl:col-span-2">
                        <PerformanceChart data={chartData} />
                    </div>
                    <div className="xl:col-span-1">
                        <div className={cn(
                            "rounded-xl p-4 sm:p-5 h-full flex flex-col",
                            isDark ? "glass-card" : "bg-white border border-gray-200 shadow-sm"
                        )}>
                            <h3 className={cn("text-base font-semibold mb-3", isDark ? "text-slate-100" : "text-gray-900")}>Chart Statistics</h3>
                            <p className={cn("text-xs mb-3", isDark ? "text-slate-500" : "text-gray-400")}>7-day overview</p>

                            <div className="space-y-3 flex-1">
                                <div className={cn(
                                    "flex items-center justify-between p-2.5 rounded-lg border",
                                    isDark ? "bg-blue-500/10 border-blue-500/20" : "bg-blue-50 border-blue-200"
                                )}>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                                        <span className={cn("text-sm", isDark ? "text-slate-300" : "text-gray-700")}>Impressions</span>
                                    </div>
                                    <span className={cn("text-sm font-semibold", isDark ? "text-blue-400" : "text-blue-600")}>
                                        {chartSummary.totalImpressions.toLocaleString()}
                                    </span>
                                </div>

                                <div className={cn(
                                    "flex items-center justify-between p-2.5 rounded-lg border",
                                    isDark ? "bg-emerald-500/10 border-emerald-500/20" : "bg-emerald-50 border-emerald-200"
                                )}>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                                        <span className={cn("text-sm", isDark ? "text-slate-300" : "text-gray-700")}>Clicks</span>
                                    </div>
                                    <span className={cn("text-sm font-semibold", isDark ? "text-emerald-400" : "text-emerald-600")}>
                                        {chartSummary.totalClicks.toLocaleString()}
                                    </span>
                                </div>

                                <div className={cn(
                                    "flex items-center justify-between p-2.5 rounded-lg border",
                                    isDark ? "bg-amber-500/10 border-amber-500/20" : "bg-amber-50 border-amber-200"
                                )}>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                                        <span className={cn("text-sm", isDark ? "text-slate-300" : "text-gray-700")}>Conversions</span>
                                    </div>
                                    <span className={cn("text-sm font-semibold", isDark ? "text-amber-400" : "text-amber-600")}>
                                        {chartSummary.totalConversions.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {chartSummary.peakDay && (
                                <div className={cn("mt-3 pt-3 border-t", isDark ? "border-slate-700/50" : "border-gray-200")}>
                                    <div className={cn("flex items-center gap-1.5 text-xs mb-0.5", isDark ? "text-slate-500" : "text-gray-400")}>
                                        <TrendingUp className="w-3 h-3" />
                                        Peak Day
                                    </div>
                                    <p className={cn("text-sm font-medium", isDark ? "text-slate-200" : "text-gray-700")}>
                                        {chartSummary.peakDay.date} — {chartSummary.peakDay.impressions.toLocaleString()}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <CampaignTable campaigns={campaigns} onViewCampaign={handleViewCampaign} />
            </div>

            {/* Campaign Details Drawer */}
            <CampaignDrawer
                campaignId={selectedCampaignId}
                isOpen={isDrawerOpen}
                onClose={handleCloseDrawer}
            />
        </>
    );
}
