import { useEffect, useState } from 'react';
import { X, Activity, MousePointer2, DollarSign, TrendingUp, Target, Calendar } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../context/ThemeContext';
import { fetchCampaignById, subscribeToCampaignInsights } from '../../lib/api';
import type { Campaign, ApiCampaignInsights } from '../../types';

interface CampaignDrawerProps {
    campaignId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

export function CampaignDrawer({ campaignId, isOpen, onClose }: CampaignDrawerProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [liveMetrics, setLiveMetrics] = useState<ApiCampaignInsights | null>(null);
    const [loading, setLoading] = useState(false);
    const [isLive, setIsLive] = useState(false);

    useEffect(() => {
        if (!campaignId || !isOpen) {
            setCampaign(null);
            setLiveMetrics(null);
            return;
        }

        async function loadCampaign() {
            setLoading(true);
            try {
                const data = await fetchCampaignById(campaignId!);
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
            } catch (err) {
                console.error('Failed to load campaign:', err);
            } finally {
                setLoading(false);
            }
        }

        loadCampaign();

        const unsubscribe = subscribeToCampaignInsights(
            campaignId,
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
    }, [campaignId, isOpen]);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
                onClick={onClose}
            />

            {/* Drawer Panel */}
            <div className={cn(
                "fixed top-0 right-0 h-full w-full max-w-md z-50 shadow-2xl transition-transform duration-300 ease-out",
                isDark ? "bg-slate-900 border-l border-slate-700" : "bg-white border-l border-gray-200",
                isOpen ? "translate-x-0" : "translate-x-full"
            )}>
                {/* Header */}
                <div className={cn(
                    "flex items-center justify-between p-4 border-b",
                    isDark ? "border-slate-700" : "border-gray-200"
                )}>
                    <div className="flex items-center gap-3">
                        <h2 className={cn("text-lg font-semibold", isDark ? "text-slate-100" : "text-gray-900")}>
                            Campaign Details
                        </h2>
                        {/* Live Indicator */}
                        <span className="flex items-center gap-1.5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            <span className={cn("text-xs", isDark ? "text-slate-400" : "text-gray-500")}>Live</span>
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className={cn(
                            "p-2 rounded-lg transition-colors",
                            isDark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-gray-100 text-gray-500"
                        )}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
                    {loading ? (
                        <div className="flex items-center justify-center h-40">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                    ) : campaign ? (
                        <div className="space-y-4">
                            {/* Campaign Name & Status */}
                            <div>
                                <h3 className={cn("text-xl font-bold", isDark ? "text-slate-100" : "text-gray-900")}>
                                    {campaign.name}
                                </h3>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={cn(
                                        "px-2.5 py-0.5 rounded-full text-xs font-medium capitalize",
                                        campaign.status === 'active'
                                            ? isDark ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30" : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                                            : campaign.status === 'paused'
                                                ? isDark ? "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/30" : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                                                : isDark ? "bg-slate-500/10 text-slate-400 ring-1 ring-slate-500/30" : "bg-gray-100 text-gray-600 ring-1 ring-gray-200"
                                    )}>
                                        {campaign.status}
                                    </span>
                                    <span className={cn("text-xs font-mono px-2 py-0.5 rounded", isDark ? "bg-slate-800 text-slate-400" : "bg-gray-100 text-gray-600")}>
                                        {campaign.id}
                                    </span>
                                </div>
                            </div>

                            {/* Configuration */}
                            <div className={cn(
                                "p-4 rounded-xl space-y-3",
                                isDark ? "bg-slate-800/50 border border-slate-700/50" : "bg-gray-50 border border-gray-200"
                            )}>
                                <div className="flex items-center gap-2">
                                    <Target className={cn("w-4 h-4", isDark ? "text-blue-400" : "text-blue-600")} />
                                    <span className={cn("text-sm font-medium", isDark ? "text-slate-200" : "text-gray-700")}>Configuration</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <p className={cn("text-xs", isDark ? "text-slate-500" : "text-gray-500")}>Budget</p>
                                        <p className={cn("font-medium", isDark ? "text-slate-200" : "text-gray-900")}>
                                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(10000)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className={cn("text-xs", isDark ? "text-slate-500" : "text-gray-500")}>Duration</p>
                                        <p className={cn("font-medium flex items-center gap-1", isDark ? "text-slate-200" : "text-gray-900")}>
                                            <Calendar className="w-3 h-3" />
                                            {new Date(campaign.startDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Live Metrics Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                {/* Impressions */}
                                <div className={cn(
                                    "p-4 rounded-xl relative overflow-hidden",
                                    isDark ? "bg-slate-800/50 border border-slate-700/50" : "bg-gray-50 border border-gray-200"
                                )}>
                                    <Activity className={cn("absolute top-2 right-2 w-8 h-8 opacity-20", isDark ? "text-blue-400" : "text-blue-600")} />
                                    <p className={cn("text-xs font-medium", isDark ? "text-slate-400" : "text-gray-500")}>Impressions</p>
                                    <p className={cn("text-xl font-bold mt-1", isLive ? "text-blue-400" : isDark ? "text-slate-100" : "text-gray-900")}>
                                        {new Intl.NumberFormat('en-US').format(liveMetrics?.impressions || 0)}
                                    </p>
                                </div>

                                {/* Clicks */}
                                <div className={cn(
                                    "p-4 rounded-xl relative overflow-hidden",
                                    isDark ? "bg-slate-800/50 border border-slate-700/50" : "bg-gray-50 border border-gray-200"
                                )}>
                                    <MousePointer2 className={cn("absolute top-2 right-2 w-8 h-8 opacity-20", isDark ? "text-purple-400" : "text-purple-600")} />
                                    <p className={cn("text-xs font-medium", isDark ? "text-slate-400" : "text-gray-500")}>Clicks</p>
                                    <p className={cn("text-xl font-bold mt-1", isLive ? "text-purple-400" : isDark ? "text-slate-100" : "text-gray-900")}>
                                        {new Intl.NumberFormat('en-US').format(liveMetrics?.clicks || 0)}
                                    </p>
                                    <p className={cn("text-xs mt-0.5", isDark ? "text-slate-500" : "text-gray-400")}>
                                        CTR: {liveMetrics?.ctr.toFixed(2)}%
                                    </p>
                                </div>

                                {/* Spend */}
                                <div className={cn(
                                    "p-4 rounded-xl relative overflow-hidden",
                                    isDark ? "bg-slate-800/50 border border-slate-700/50" : "bg-gray-50 border border-gray-200"
                                )}>
                                    <DollarSign className={cn("absolute top-2 right-2 w-8 h-8 opacity-20", isDark ? "text-emerald-400" : "text-emerald-600")} />
                                    <p className={cn("text-xs font-medium", isDark ? "text-slate-400" : "text-gray-500")}>Spend</p>
                                    <p className={cn("text-xl font-bold mt-1", isLive ? "text-emerald-400" : isDark ? "text-slate-100" : "text-gray-900")}>
                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(liveMetrics?.spend || 0)}
                                    </p>
                                    <p className={cn("text-xs mt-0.5", isDark ? "text-slate-500" : "text-gray-400")}>
                                        CPC: ${liveMetrics?.cpc?.toFixed(2) || '0.00'}
                                    </p>
                                </div>

                                {/* Conversions */}
                                <div className={cn(
                                    "p-4 rounded-xl relative overflow-hidden",
                                    isDark ? "bg-slate-800/50 border border-slate-700/50" : "bg-gray-50 border border-gray-200"
                                )}>
                                    <TrendingUp className={cn("absolute top-2 right-2 w-8 h-8 opacity-20", isDark ? "text-amber-400" : "text-amber-600")} />
                                    <p className={cn("text-xs font-medium", isDark ? "text-slate-400" : "text-gray-500")}>Conversions</p>
                                    <p className={cn("text-xl font-bold mt-1", isLive ? "text-amber-400" : isDark ? "text-slate-100" : "text-gray-900")}>
                                        {liveMetrics?.conversions || 0}
                                    </p>
                                    <p className={cn("text-xs mt-0.5", isDark ? "text-slate-500" : "text-gray-400")}>
                                        Rate: {liveMetrics?.conversion_rate?.toFixed(2) || '0.00'}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={cn("text-center py-8", isDark ? "text-slate-400" : "text-gray-500")}>
                            Campaign not found
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
