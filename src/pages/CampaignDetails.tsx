import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCampaignById, subscribeToCampaignInsights } from '../lib/api';
import type { Campaign, ApiCampaignInsights } from '../types';
import { Loader2, ArrowLeft, Target, Calendar, Activity, MousePointer2, DollarSign, TrendingUp } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTheme } from '../context/ThemeContext';

export function CampaignDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [liveMetrics, setLiveMetrics] = useState<ApiCampaignInsights | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLive, setIsLive] = useState(false);

    useEffect(() => {
        if (!id) return;

        async function init() {
            try {
                setLoading(true);
                const data = await fetchCampaignById(id!);
                setCampaign(data);
                setLiveMetrics({
                    campaign_id: data.id,
                    timestamp: new Date().toISOString(),
                    impressions: data.impressions,
                    clicks: data.clicks,
                    spend: data.spend,
                    ctr: data.ctr,
                    conversions: 0,
                    cpc: 0,
                    conversion_rate: 0
                });
                setError(null);
            } catch (err) {
                setError('Failed to load campaign details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        init();

        const unsubscribe = subscribeToCampaignInsights(
            id,
            (data) => {
                setLiveMetrics(data);
                setIsLive(true);
                setTimeout(() => setIsLive(false), 500);
            },
            () => setIsLive(false)
        );

        return () => {
            unsubscribe();
        };
    }, [id]);

    if (loading) return (
        <div className="flex h-full w-full items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
    );

    if (error || !campaign) return (
        <div className={cn("p-8 text-center", isDark ? "text-red-400" : "text-red-600")}>{error || 'Campaign not found'}</div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <button
                    onClick={() => navigate('/')}
                    className={cn(
                        "flex items-center text-sm transition-colors mb-4",
                        isDark ? "text-slate-400 hover:text-slate-100" : "text-gray-500 hover:text-gray-900"
                    )}
                >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Dashboard
                </button>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className={cn("text-3xl font-bold tracking-tight", isDark ? "text-slate-50" : "text-gray-900")}>{campaign.name}</h1>
                        <p className={cn("mt-1 flex items-center gap-2", isDark ? "text-slate-400" : "text-gray-500")}>
                            ID: <span className={cn(
                                "font-mono text-xs px-2 py-0.5 rounded",
                                isDark ? "bg-slate-800 text-slate-300" : "bg-gray-100 text-gray-700"
                            )}>{campaign.id}</span>
                            <span className={isDark ? "text-slate-600" : "text-gray-300"}>|</span>
                            <span className={cn(
                                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                                campaign.status === 'active'
                                    ? isDark ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30" : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                                    : campaign.status === 'paused'
                                        ? isDark ? "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/30" : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                                        : isDark ? "bg-slate-500/10 text-slate-400 ring-1 ring-slate-500/30" : "bg-gray-100 text-gray-600 ring-1 ring-gray-200"
                            )}>
                                {campaign.status}
                            </span>
                        </p>
                    </div>

                    {/* Live Indicator */}
                    <div className={cn(
                        "flex items-center gap-2 rounded-lg px-3 py-1.5",
                        isDark ? "glass-card" : "bg-white border border-gray-200 shadow-sm"
                    )}>
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                        </span>
                        <span className={cn("text-sm font-medium", isDark ? "text-slate-300" : "text-gray-700")}>Live SSE Stream</span>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left Column: Config */}
                <div className="lg:col-span-1 space-y-6">
                    <div className={cn(
                        "rounded-xl p-6 space-y-4",
                        isDark ? "glass-card" : "bg-white border border-gray-200 shadow-sm"
                    )}>
                        <h3 className={cn("font-semibold flex items-center gap-2", isDark ? "text-slate-100" : "text-gray-900")}>
                            <Target className={cn("h-4 w-4", isDark ? "text-blue-400" : "text-blue-600")} />
                            Configuration
                        </h3>
                        <div className="space-y-3 pt-2">
                            <div className="text-sm">
                                <span className={cn("block", isDark ? "text-slate-500" : "text-gray-500")}>Total Budget</span>
                                <span className={cn("font-medium", isDark ? "text-slate-200" : "text-gray-900")}>
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(10000)}
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className={cn("block", isDark ? "text-slate-500" : "text-gray-500")}>Start Date</span>
                                <span className={cn("font-medium flex items-center gap-1", isDark ? "text-slate-200" : "text-gray-900")}>
                                    <Calendar className="h-3 w-3" />
                                    {new Date(campaign.startDate).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Live Metrics */}
                <div className="lg:col-span-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                        {/* Impressions */}
                        <div className={cn(
                            "p-6 rounded-xl relative overflow-hidden group",
                            isDark ? "glass-card" : "bg-white border border-gray-200 shadow-sm"
                        )}>
                            <div className={cn("absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity", isDark ? "text-blue-400" : "text-blue-600")}>
                                <Activity className="h-16 w-16" />
                            </div>
                            <p className={cn("text-sm font-medium", isDark ? "text-slate-400" : "text-gray-500")}>Impressions</p>
                            <p className={cn("text-2xl font-bold mt-2 transition-colors duration-300", isLive ? "text-blue-400" : isDark ? "text-slate-100" : "text-gray-900")}>
                                {new Intl.NumberFormat('en-US').format(liveMetrics?.impressions || 0)}
                            </p>
                            <p className={cn("text-xs mt-1", isDark ? "text-slate-500" : "text-gray-400")}>Real-time updates</p>
                        </div>

                        {/* Clicks */}
                        <div className={cn(
                            "p-6 rounded-xl relative overflow-hidden group",
                            isDark ? "glass-card" : "bg-white border border-gray-200 shadow-sm"
                        )}>
                            <div className={cn("absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity", isDark ? "text-purple-400" : "text-purple-600")}>
                                <MousePointer2 className="h-16 w-16" />
                            </div>
                            <p className={cn("text-sm font-medium", isDark ? "text-slate-400" : "text-gray-500")}>Clicks</p>
                            <p className={cn("text-2xl font-bold mt-2 transition-colors duration-300", isLive ? "text-purple-400" : isDark ? "text-slate-100" : "text-gray-900")}>
                                {new Intl.NumberFormat('en-US').format(liveMetrics?.clicks || 0)}
                            </p>
                            <p className={cn("text-xs mt-1", isDark ? "text-slate-500" : "text-gray-400")}>CTR: {liveMetrics?.ctr.toFixed(2)}%</p>
                        </div>

                        {/* Spend */}
                        <div className={cn(
                            "p-6 rounded-xl relative overflow-hidden group",
                            isDark ? "glass-card" : "bg-white border border-gray-200 shadow-sm"
                        )}>
                            <div className={cn("absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity", isDark ? "text-emerald-400" : "text-emerald-600")}>
                                <DollarSign className="h-16 w-16" />
                            </div>
                            <p className={cn("text-sm font-medium", isDark ? "text-slate-400" : "text-gray-500")}>Spend</p>
                            <p className={cn("text-2xl font-bold mt-2 transition-colors duration-300", isLive ? "text-emerald-400" : isDark ? "text-slate-100" : "text-gray-900")}>
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(liveMetrics?.spend || 0)}
                            </p>
                            <p className={cn("text-xs mt-1", isDark ? "text-slate-500" : "text-gray-400")}>CPC: ${liveMetrics?.cpc?.toFixed(2) || '0.00'}</p>
                        </div>

                        {/* Conversions */}
                        <div className={cn(
                            "p-6 rounded-xl relative overflow-hidden group md:col-span-2 lg:col-span-3",
                            isDark ? "glass-card" : "bg-white border border-gray-200 shadow-sm"
                        )}>
                            <div className="flex items-center gap-4">
                                <div className={cn("p-3 rounded-lg", isDark ? "bg-amber-500/10" : "bg-amber-50")}>
                                    <TrendingUp className={cn("h-6 w-6", isDark ? "text-amber-400" : "text-amber-600")} />
                                </div>
                                <div>
                                    <p className={cn("text-sm font-medium", isDark ? "text-slate-400" : "text-gray-500")}>Conversions</p>
                                    <div className="flex items-baseline gap-2">
                                        <p className={cn("text-2xl font-bold", isLive ? "text-amber-400" : isDark ? "text-slate-100" : "text-gray-900")}>
                                            {liveMetrics?.conversions || 0}
                                        </p>
                                        <span className={cn("text-sm", isDark ? "text-slate-500" : "text-gray-500")}>
                                            ({liveMetrics?.conversion_rate?.toFixed(2)}% Rate)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
