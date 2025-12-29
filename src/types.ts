export interface Metric {
    label: string;
    value: string;
    change: number; // percentage
    trend: 'up' | 'down' | 'neutral';
}

export interface Campaign {
    id: string;
    name: string;
    status: 'active' | 'paused' | 'completed';
    impressions: number;
    clicks: number;
    ctr: number; // percentage
    spend: number;
    startDate: string;
    endDate: string;
}

export interface ChartData {
    date: string;
    impressions: number;
    clicks: number;
    conversions: number;
}

export interface ApiCampaign {
    id: string;
    name: string;
    brand_id: string;
    status: 'active' | 'paused' | 'completed';
    budget: number;
    daily_budget: number;
    platforms: string[];
    created_at: string;
}

export interface ApiCampaignInsights {
    campaign_id: string;
    timestamp: string;
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
    ctr: number;
    cpc: number;
    conversion_rate: number;
}

export interface ApiResponse {
    campaigns: ApiCampaign[];
    total: number;
}

export interface ApiSingleCampaignResponse {
    campaign: ApiCampaign;
}

export interface ApiInsightsResponse {
    insights: ApiCampaignInsights;
}

export interface ApiAggregateInsightsResponse {
    insights: {
        timestamp: string;
        total_campaigns: number;
        active_campaigns: number;
        paused_campaigns: number;
        completed_campaigns: number;
        total_impressions: number;
        total_clicks: number;
        total_conversions: number;
        total_spend: number;
        avg_ctr: number;
        avg_cpc: number;
        avg_conversion_rate: number;
    }
}
