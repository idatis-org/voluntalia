import { useMemo } from 'react';

export interface StatConfig<T> {
  key: string;
  label: string;
  icon?: React.ComponentType<any>;
  calculate: (data: T[]) => number | string;
  color?: string;
}

export const useStats = <T>(data: T[], statConfigs: StatConfig<T>[]) => {
  const stats = useMemo(() => {
    return statConfigs.map(config => ({
      key: config.key,
      label: config.label,
      value: config.calculate(data),
      icon: config.icon,
      color: config.color
    }));
  }, [data, statConfigs]);

  const getStatValue = (key: string) => {
    const stat = stats.find(s => s.key === key);
    return stat?.value || 0;
  };

  return {
    stats,
    getStatValue
  };
};