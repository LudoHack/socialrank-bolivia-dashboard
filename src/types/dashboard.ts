export interface DashboardMetrics {
  totalNews: number;
  highImpactNews: number;
  activeUsers: number;
  averageViews: number;
}

export interface MetricTrend {
  value: number;
  isPositive: boolean;
}

export interface NewsDistribution {
  impactLevel: string;
  count: number;
  color: string;
}

export interface TagMetric {
  name: string;
  count: number;
  x: number;
  y: number;
  z: number;
}

export interface NewsTrend {
  date: string;
  highImpact: number;
  mediumImpact: number;
  lowImpact: number;
}

export interface DashboardFilters {
  dateRange: {
    from?: Date;
    to?: Date;
  };
  impactLevel: string[];
  sources: string[];
  tags: string[];
}

export interface DashboardData {
  metrics: {
    current: DashboardMetrics;
    trends: Record<keyof DashboardMetrics, MetricTrend>;
  };
  distribution: NewsDistribution[];
  tags: TagMetric[];
  trends: NewsTrend[];
}
