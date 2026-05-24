import { Settings } from 'lucide-react';

interface LimitSettingsProps {
  tempLimit: { min: number; max: number };
  humidityLimit: { min: number; max: number };
  onTempLimitChange: (min: number, max: number) => void;
  onHumidityLimitChange: (min: number, max: number) => void;
}

export function LimitSettings({
  tempLimit,
  humidityLimit,
  onTempLimitChange,
  onHumidityLimitChange,
}: LimitSettingsProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5" />
        <h3 className="text-lg font-medium">Livelli limite</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">Temperatura (°C)</h4>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Minimo</label>
              <input
                type="number"
                value={tempLimit.min}
                onChange={(e) => onTempLimitChange(parseFloat(e.target.value), tempLimit.max)}
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Massimo</label>
              <input
                type="number"
                value={tempLimit.max}
                onChange={(e) => onTempLimitChange(tempLimit.min, parseFloat(e.target.value))}
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">Umidità (%)</h4>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Minimo</label>
              <input
                type="number"
                value={humidityLimit.min}
                onChange={(e) => onHumidityLimitChange(parseFloat(e.target.value), humidityLimit.max)}
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Massimo</label>
              <input
                type="number"
                value={humidityLimit.max}
                onChange={(e) => onHumidityLimitChange(humidityLimit.min, parseFloat(e.target.value))}
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
