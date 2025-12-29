import type { Metric } from '../../types';
import { MetricCard } from './MetricCard';

interface MetricsGridProps {
    metrics: Metric[];
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {metrics.map((metric, index) => (
                <MetricCard key={index} metric={metric} />
            ))}
        </div>
    );
}
