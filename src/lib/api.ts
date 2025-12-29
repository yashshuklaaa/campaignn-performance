import type {
    ApiCampaign,
    ApiCampaignInsights,
    ApiAggregateInsightsResponse,
    ApiInsightsResponse,
    ApiResponse,
    ApiSingleCampaignResponse,
    Campaign,
    ChartData,
    Metric
} from '../types';

const BASE_URL = 'https://mixo-fe-backend-task.vercel.app';

export async function fetchCampaigns(): Promise<Campaign[]> {
    try {
        const response = await fetch(`${BASE_URL}/campaigns`);
        if (!response.ok) {
            throw new Error('Failed to fetch campaigns list');
        }
        const data: ApiResponse = await response.json();

        // Fetch insights for all campaigns in parallel
        const campaignsWithInsights = await Promise.all(
            data.campaigns.map(async (apiCampaign) => {
                try {
                    const insights = await fetchCampaignInsights(apiCampaign.id);
                    return mapApiDataToCampaign(apiCampaign, insights);
                } catch (error) {
                    console.error(`Failed to fetch insights for campaign ${apiCampaign.id}`, error);
                    return mapApiDataToCampaign(apiCampaign, null);
                }
            })
        );

        return campaignsWithInsights;
    } catch (error) {
        console.error('Error fetching campaigns:', error);
        throw error;
    }
}

export async function fetchCampaignById(id: string): Promise<Campaign> {
    try {
        const [campaignResponse, insightsResponse] = await Promise.all([
            fetch(`${BASE_URL}/campaigns/${id}`),
            fetch(`${BASE_URL}/campaigns/${id}/insights`)
        ]);

        if (!campaignResponse.ok) {
            throw new Error(`Failed to fetch campaign details for ${id}`);
        }

        const campaignData: ApiSingleCampaignResponse = await campaignResponse.json();

        // Handle insights separately as they might not exist or error out
        let insights: ApiCampaignInsights | null = null;
        if (insightsResponse.ok) {
            const insightsData: ApiInsightsResponse = await insightsResponse.json();
            insights = insightsData.insights;
        }

        return mapApiDataToCampaign(campaignData.campaign, insights);
    } catch (error) {
        console.error(`Error fetching campaign ${id}:`, error);
        throw error;
    }
}

export async function fetchCampaignInsights(id: string): Promise<ApiCampaignInsights> {
    const response = await fetch(`${BASE_URL}/campaigns/${id}/insights`);
    if (!response.ok) {
        throw new Error(`Failed to fetch insights for campaign ${id}`);
    }
    const data: ApiInsightsResponse = await response.json();
    return data.insights;
}

export async function fetchGlobalInsights(): Promise<Metric[]> {
    try {
        const response = await fetch(`${BASE_URL}/campaigns/insights`);
        if (!response.ok) {
            throw new Error('Failed to fetch aggregate insights');
        }
        const data: ApiAggregateInsightsResponse = await response.json();
        const i = data.insights;

        return [
            {
                label: 'Total Campaigns',
                value: i.total_campaigns.toString(),
                change: 0,
                trend: 'neutral'
            },
            {
                label: 'Active Campaigns',
                value: i.active_campaigns.toString(),
                change: 0,
                trend: 'neutral'
            },
            {
                label: 'Paused Campaigns',
                value: i.paused_campaigns.toString(),
                change: 0,
                trend: 'neutral'
            },
            {
                label: 'Completed Campaigns',
                value: i.completed_campaigns.toString(),
                change: 0,
                trend: 'neutral'
            },
            {
                label: 'Total Spend',
                value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(i.total_spend),
                change: 12.5,
                trend: 'up'
            },
            {
                label: 'Total Impressions',
                value: new Intl.NumberFormat('en-US').format(i.total_impressions),
                change: 8.2,
                trend: 'up'
            },
            {
                label: 'Total Clicks',
                value: new Intl.NumberFormat('en-US').format(i.total_clicks),
                change: 5.4,
                trend: 'up'
            },
            {
                label: 'Total Conversions',
                value: new Intl.NumberFormat('en-US').format(i.total_conversions),
                change: 3.1,
                trend: 'up'
            },
            {
                label: 'Avg. CTR',
                value: `${i.avg_ctr.toFixed(2)}%`,
                change: -2.1,
                trend: 'down'
            },
            {
                label: 'Avg. CPC',
                value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(i.avg_cpc),
                change: -1.5,
                trend: 'down'
            },
            {
                label: 'Avg. Conversion Rate',
                value: `${i.avg_conversion_rate.toFixed(2)}%`,
                change: 2.3,
                trend: 'up'
            },
        ];

    } catch (error) {
        console.error('Error fetching global insights:', error);
        // Return empty metrics or some error state representation if needed
        return [];
    }
}

function mapApiDataToCampaign(apiCampaign: ApiCampaign, insights: ApiCampaignInsights | null): Campaign {
    // If we have real insights, use them. Otherwise default to 0.
    const impressions = insights?.impressions || 0;
    const clicks = insights?.clicks || 0;
    const spend = insights?.spend || 0;
    // ctr from API is a number (e.g. 2.15), keep it as is. If missing, calc it.
    const ctr = insights?.ctr ?? (impressions > 0 ? (clicks / impressions) * 100 : 0);

    const startDate = apiCampaign.created_at;
    const endObj = new Date(startDate);
    endObj.setDate(endObj.getDate() + 30);
    const endDate = endObj.toISOString();

    return {
        id: apiCampaign.id,
        name: apiCampaign.name,
        status: apiCampaign.status,
        impressions: impressions,
        clicks: clicks,
        ctr: ctr,
        spend: spend,
        startDate: startDate,
        endDate: endDate
    };
}

export function subscribeToCampaignInsights(id: string, onData: (data: ApiCampaignInsights) => void, onError?: (error: Event) => void): () => void {
    const url = `${BASE_URL}/campaigns/${id}/insights/stream`;
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
        try {
            const parsedData: ApiCampaignInsights = JSON.parse(event.data);
            onData(parsedData);
        } catch (e) {
            console.error('Error parsing SSE data', e);
        }
    };

    eventSource.onerror = (error) => {
        // EventSource often retries automatically, but for this implementation we might want to let the caller know
        console.error(`SSE Error for campaign ${id}:`, error);
        if (onError) onError(error);
    };

    // Return cleanup function to close connection
    return () => {
        eventSource.close();
    };
}

// Generate Chart Data based on aggregate
// Still mocked as API doesn't provide historical data
export function generateChartData(): ChartData[] {
    return Array.from({ length: 7 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            impressions: Math.floor(Math.random() * 50000) + 10000,
            clicks: Math.floor(Math.random() * 5000) + 1000,
            conversions: Math.floor(Math.random() * 500) + 100,
        };
    });
}
