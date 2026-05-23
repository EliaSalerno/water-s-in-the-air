import { Lightbulb } from 'lucide-react';
import type { SensorData } from '../types';

interface DataTableProps {
  data: SensorData[];
  tempLimit: { min: number; max: number };
  humidityLimit: { min: number; max: number };
}

export function DataTable({ data, tempLimit, humidityLimit }: DataTableProps) {
  const isOutOfRange = (value: number, min: number, max: number) => {
    return value < min || value > max;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ora
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Temperatura (°C)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Umidità (%)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stato
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => {
            const tempAlert = isOutOfRange(row.temperatura, tempLimit.min, tempLimit.max);
            const humAlert = isOutOfRange(row.umidita, humidityLimit.min, humidityLimit.max);
            const hasAlert = tempAlert || humAlert;

            return (
              <tr key={index} className={hasAlert ? 'bg-red-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {row.data}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {row.ora}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className={tempAlert ? 'text-red-600 font-medium' : ''}>
                    {row.temperatura.toFixed(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className={humAlert ? 'text-red-600 font-medium' : ''}>
                    {row.umidita.toFixed(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {hasAlert ? (
                    <Lightbulb className="w-5 h-5 text-red-500 fill-red-500" />
                  ) : (
                    <Lightbulb className="w-5 h-5 text-green-500 fill-green-500" />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
