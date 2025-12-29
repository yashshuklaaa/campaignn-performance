import type { Campaign, ChartData, Metric } from '../types';

export const mockMetrics: Metric[] = [
    { label: 'Total Revenue', value: '$45,231.89', change: 20.1, trend: 'up' },
    { label: 'Active Campaigns', value: '12', change: -4, trend: 'down' },
    { label: 'Total Impressions', value: '2.4M', change: 12.5, trend: 'up' },
    { label: 'Avg. CTR', value: '4.3%', change: 0, trend: 'neutral' },
];

export const mockChartData: ChartData[] = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        impressions: Math.floor(Math.random() * 5000) + 1000,
        clicks: Math.floor(Math.random() * 500) + 100,
        conversions: Math.floor(Math.random() * 50) + 10,
    };
});

export const mockCampaigns: Campaign[] = [
    {
        id: '1',
        name: 'Summer Sale 2024',
        status: 'active',
        impressions: 450000,
        clicks: 12000,
        ctr: 2.6,
        spend: 4500.50,
        startDate: '2024-06-01',
        endDate: '2024-06-30'
    },
    {
        id: '2',
        name: 'Retargeting Mix',
        status: 'active',
        impressions: 120000,
        clicks: 3500,
        ctr: 2.9,
        spend: 1200.00,
        startDate: '2024-06-10',
        endDate: '2024-07-10'
    },
    {
        id: '3',
        name: 'Brand Awareness',
        status: 'paused',
        impressions: 800000,
        clicks: 5000,
        ctr: 0.6,
        spend: 2000.00,
        startDate: '2024-05-01',
        endDate: '2024-05-31'
    },
    {
        id: '4',
        name: 'New User Promo',
        status: 'completed',
        impressions: 250000,
        clicks: 8000,
        ctr: 3.2,
        spend: 1500.00,
        startDate: '2024-05-15',
        endDate: '2024-06-15'
    },
    {
        id: '5',
        name: 'Social Outreach',
        status: 'active',
        impressions: 65000,
        clicks: 2100,
        ctr: 3.2,
        spend: 850.00,
        startDate: '2024-07-01',
        endDate: '2024-07-31'
    }
];
