import { useState, useMemo } from 'react';
import type { Campaign } from '../../types';
import { cn } from '../../lib/utils';
import { Eye, MousePointer2, Percent, DollarSign, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface CampaignTableProps {
    campaigns: Campaign[];
    onViewCampaign: (campaignId: string) => void;
}

type SortField = 'name' | 'status' | 'impressions' | 'clicks' | 'ctr' | 'spend';
type SortDirection = 'asc' | 'desc' | null;

interface SortState {
    field: SortField | null;
    direction: SortDirection;
}

const ITEMS_PER_PAGE = 10;

export function CampaignTable({ campaigns, onViewCampaign }: CampaignTableProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [sortState, setSortState] = useState<SortState>({ field: null, direction: null });
    const [currentPage, setCurrentPage] = useState(1);

    const handleSort = (field: SortField) => {
        setSortState(prev => {
            if (prev.field !== field) {
                return { field, direction: 'asc' };
            }
            if (prev.direction === 'asc') {
                return { field, direction: 'desc' };
            }
            if (prev.direction === 'desc') {
                return { field: null, direction: null };
            }
            return { field, direction: 'asc' };
        });
        setCurrentPage(1); // Reset to first page on sort
    };

    const sortedCampaigns = useMemo(() => {
        if (!sortState.field || !sortState.direction) {
            return campaigns;
        }

        return [...campaigns].sort((a, b) => {
            const field = sortState.field!;
            const direction = sortState.direction === 'asc' ? 1 : -1;

            if (field === 'name') {
                return a.name.localeCompare(b.name) * direction;
            }
            if (field === 'status') {
                return a.status.localeCompare(b.status) * direction;
            }
            return (a[field] - b[field]) * direction;
        });
    }, [campaigns, sortState]);

    // Pagination
    const totalPages = Math.ceil(sortedCampaigns.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedCampaigns = sortedCampaigns.slice(startIndex, endIndex);

    const goToPage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    const getSortIcon = (field: SortField) => {
        if (sortState.field !== field) {
            return <ArrowUpDown className="w-3 h-3 ml-1 opacity-50" />;
        }
        if (sortState.direction === 'asc') {
            return <ArrowUp className="w-3 h-3 ml-1 text-blue-400" />;
        }
        return <ArrowDown className="w-3 h-3 ml-1 text-blue-400" />;
    };

    const headerClass = cn(
        "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer select-none transition-colors",
        isDark ? "text-slate-400 hover:text-slate-200" : "text-gray-500 hover:text-gray-700"
    );

    return (
        <div className={cn(
            "rounded-xl overflow-hidden",
            isDark ? "glass-card" : "bg-white border border-gray-200 shadow-sm"
        )}>
            <div className={cn(
                "px-6 py-4 border-b flex items-center justify-between",
                isDark ? "border-slate-700/50" : "border-gray-200"
            )}>
                <h3 className={cn(
                    "text-lg font-semibold",
                    isDark ? "text-slate-100" : "text-gray-900"
                )}>Active Campaigns</h3>
                <span className={cn(
                    "text-sm",
                    isDark ? "text-slate-400" : "text-gray-500"
                )}>{campaigns.length} total</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className={cn(
                        "border-b",
                        isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-gray-50 border-gray-200"
                    )}>
                        <tr>
                            <th className={cn(
                                "px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider w-12",
                                isDark ? "text-slate-400" : "text-gray-500"
                            )}>
                                #
                            </th>
                            <th className={headerClass} onClick={() => handleSort('name')}>
                                <div className="flex items-center">
                                    Campaign
                                    {getSortIcon('name')}
                                </div>
                            </th>
                            <th className={headerClass} onClick={() => handleSort('status')}>
                                <div className="flex items-center">
                                    Status
                                    {getSortIcon('status')}
                                </div>
                            </th>
                            <th className={headerClass} onClick={() => handleSort('impressions')}>
                                <div className="flex items-center">
                                    Impressions
                                    {getSortIcon('impressions')}
                                </div>
                            </th>
                            <th className={headerClass} onClick={() => handleSort('clicks')}>
                                <div className="flex items-center">
                                    Clicks
                                    {getSortIcon('clicks')}
                                </div>
                            </th>
                            <th className={headerClass} onClick={() => handleSort('ctr')}>
                                <div className="flex items-center">
                                    CTR
                                    {getSortIcon('ctr')}
                                </div>
                            </th>
                            <th className={headerClass} onClick={() => handleSort('spend')}>
                                <div className="flex items-center">
                                    Spend
                                    {getSortIcon('spend')}
                                </div>
                            </th>
                            <th className={cn(
                                "px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider",
                                isDark ? "text-slate-400" : "text-gray-500"
                            )}>
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className={cn("divide-y", isDark ? "divide-slate-700/50" : "divide-gray-200")}>
                        {paginatedCampaigns.map((campaign, index) => (
                            <tr key={campaign.id} className={cn(
                                "transition-colors",
                                index % 2 === 0
                                    ? isDark ? "bg-slate-900/30" : "bg-white"
                                    : isDark ? "bg-slate-800/30" : "bg-gray-100",
                                isDark ? "hover:bg-slate-800/50" : "hover:bg-blue-50"
                            )}>
                                <td className={cn(
                                    "px-4 py-4 text-center text-sm font-medium",
                                    isDark ? "text-slate-400" : "text-gray-500"
                                )}>
                                    {startIndex + index + 1}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <span className={cn(
                                        "font-medium",
                                        isDark ? "text-slate-200" : "text-gray-900"
                                    )}>{campaign.name}</span>
                                    <div className={cn("text-xs", isDark ? "text-slate-500" : "text-gray-400")}>
                                        {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <span className={cn(
                                        "px-2.5 py-0.5 rounded-full text-xs font-medium",
                                        campaign.status === 'active'
                                            ? isDark ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30" : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                                            : campaign.status === 'paused'
                                                ? isDark ? "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/30" : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                                                : isDark ? "bg-slate-500/10 text-slate-400 ring-1 ring-slate-500/30" : "bg-gray-100 text-gray-600 ring-1 ring-gray-200"
                                    )}>
                                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                                    </span>
                                </td>
                                <td className={cn("px-4 py-4 whitespace-nowrap text-sm", isDark ? "text-slate-300" : "text-gray-600")}>
                                    <div className="flex items-center">
                                        <Eye className={cn("w-3 h-3 mr-1.5", isDark ? "text-slate-500" : "text-gray-400")} />
                                        {campaign.impressions.toLocaleString()}
                                    </div>
                                </td>
                                <td className={cn("px-4 py-4 whitespace-nowrap text-sm", isDark ? "text-slate-300" : "text-gray-600")}>
                                    <div className="flex items-center">
                                        <MousePointer2 className={cn("w-3 h-3 mr-1.5", isDark ? "text-slate-500" : "text-gray-400")} />
                                        {campaign.clicks.toLocaleString()}
                                    </div>
                                </td>
                                <td className={cn("px-4 py-4 whitespace-nowrap text-sm", isDark ? "text-slate-300" : "text-gray-600")}>
                                    <div className="flex items-center">
                                        <Percent className={cn("w-3 h-3 mr-1.5", isDark ? "text-slate-500" : "text-gray-400")} />
                                        {campaign.ctr.toFixed(2)}%
                                    </div>
                                </td>
                                <td className={cn("px-4 py-4 whitespace-nowrap text-sm font-medium", isDark ? "text-slate-100" : "text-gray-900")}>
                                    <div className="flex items-center">
                                        <DollarSign className={cn("w-3 h-3 mr-1.5", isDark ? "text-slate-500" : "text-gray-400")} />
                                        {campaign.spend.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-center">
                                    <button
                                        onClick={() => onViewCampaign(campaign.id)}
                                        className={cn(
                                            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                                            isDark
                                                ? "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/30"
                                                : "bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200"
                                        )}
                                    >
                                        <Eye className="w-3.5 h-3.5" />
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className={cn(
                    "px-6 py-3 border-t flex items-center justify-between",
                    isDark ? "border-slate-700/50" : "border-gray-200"
                )}>
                    <div className={cn("text-sm", isDark ? "text-slate-400" : "text-gray-500")}>
                        Showing {startIndex + 1}-{Math.min(endIndex, sortedCampaigns.length)} of {sortedCampaigns.length}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={cn(
                                "p-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
                                isDark
                                    ? "hover:bg-slate-800 text-slate-400"
                                    : "hover:bg-gray-100 text-gray-600"
                            )}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => goToPage(page)}
                                className={cn(
                                    "w-8 h-8 rounded-lg text-sm font-medium transition-colors",
                                    page === currentPage
                                        ? isDark
                                            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                            : "bg-blue-100 text-blue-600 border border-blue-200"
                                        : isDark
                                            ? "hover:bg-slate-800 text-slate-400"
                                            : "hover:bg-gray-100 text-gray-600"
                                )}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={cn(
                                "p-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
                                isDark
                                    ? "hover:bg-slate-800 text-slate-400"
                                    : "hover:bg-gray-100 text-gray-600"
                            )}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
