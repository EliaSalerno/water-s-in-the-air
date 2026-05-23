import { useState } from 'react';
import { Filter, X } from 'lucide-react';

interface FiltersProps {
  onFilterChange: (filters: FilterValues) => void;
  dateRange: { min: string; max: string };
  tempRange: { min: number; max: number };
  humidityRange: { min: number; max: number };
}

export interface FilterValues {
  dateFrom: string;
  dateTo: string;
  timeFrom: string;
  timeTo: string;
  tempMin: string;
  tempMax: string;
  humidityMin: string;
  humidityMax: string;
}

export function Filters({ onFilterChange, dateRange, tempRange, humidityRange }: FiltersProps) {
  const [filters, setFilters] = useState<FilterValues>({
    dateFrom: '',
    dateTo: '',
    timeFrom: '',
    timeTo: '',
    tempMin: '',
    tempMax: '',
    humidityMin: '',
    humidityMax: '',
  });

  const handleFilterChange = (key: keyof FilterValues, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters: FilterValues = {
      dateFrom: '',
      dateTo: '',
      timeFrom: '',
      timeTo: '',
      tempMin: '',
      tempMax: '',
      humidityMin: '',
      humidityMax: '',
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          <h3 className="text-lg font-medium">Filtri</h3>
        </div>
        <button
          onClick={clearFilters}
          className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
        >
          <X className="w-4 h-4" />
          Cancella filtri
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data da
          </label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data a
          </label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ora da
          </label>
          <input
            type="time"
            value={filters.timeFrom}
            onChange={(e) => handleFilterChange('timeFrom', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ora a
          </label>
          <input
            type="time"
            value={filters.timeTo}
            onChange={(e) => handleFilterChange('timeTo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Temperatura min (°C)
          </label>
          <input
            type="number"
            value={filters.tempMin}
            onChange={(e) => handleFilterChange('tempMin', e.target.value)}
            placeholder={tempRange.min.toFixed(1)}
            step="0.1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Temperatura max (°C)
          </label>
          <input
            type="number"
            value={filters.tempMax}
            onChange={(e) => handleFilterChange('tempMax', e.target.value)}
            placeholder={tempRange.max.toFixed(1)}
            step="0.1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Umidità min (%)
          </label>
          <input
            type="number"
            value={filters.humidityMin}
            onChange={(e) => handleFilterChange('humidityMin', e.target.value)}
            placeholder={humidityRange.min.toFixed(1)}
            step="0.1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Umidità max (%)
          </label>
          <input
            type="number"
            value={filters.humidityMax}
            onChange={(e) => handleFilterChange('humidityMax', e.target.value)}
            placeholder={humidityRange.max.toFixed(1)}
            step="0.1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
    </div>
  );
}
