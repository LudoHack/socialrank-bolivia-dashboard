import axios from 'axios';
import { DashboardData, DashboardFilters } from '@/types/dashboard';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export class DashboardService {
  private static instance: DashboardService;
  private constructor() {}

  static getInstance(): DashboardService {
    if (!DashboardService.instance) {
      DashboardService.instance = new DashboardService();
    }
    return DashboardService.instance;
  }

  async getDashboardData(filters: DashboardFilters): Promise<DashboardData> {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard`, {
        params: {
          ...filters,
          dateRange: filters.dateRange ? {
            from: filters.dateRange.from?.toISOString(),
            to: filters.dateRange.to?.toISOString(),
          } : undefined,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }

  async exportDashboardData(filters: DashboardFilters, format: 'csv' | 'xlsx'): Promise<Blob> {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard/export`, {
        params: {
          ...filters,
          format,
          dateRange: filters.dateRange ? {
            from: filters.dateRange.from?.toISOString(),
            to: filters.dateRange.to?.toISOString(),
          } : undefined,
        },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting dashboard data:', error);
      throw error;
    }
  }

  async getSavedFilters(): Promise<{ id: string; name: string; filters: DashboardFilters }[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard/filters`);
      return response.data;
    } catch (error) {
      console.error('Error fetching saved filters:', error);
      throw error;
    }
  }

  async saveFilter(name: string, filters: DashboardFilters): Promise<{ id: string }> {
    try {
      const response = await axios.post(`${API_BASE_URL}/dashboard/filters`, {
        name,
        filters,
      });
      return response.data;
    } catch (error) {
      console.error('Error saving filter:', error);
      throw error;
    }
  }
}
