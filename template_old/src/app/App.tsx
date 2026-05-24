import { useState, useMemo } from 'react';
import { Download, Database, BarChart3 } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { DataTable } from './components/DataTable';
import { Charts } from './components/Charts';
import { Filters, type FilterValues } from './components/Filters';
import { LimitSettings } from './components/LimitSettings';
import { parseCSV, exportToCSV, generateSampleData } from './utils/csvUtils';
import type { SensorData } from './types';

export default function App() {
  const [data, setData] = useState<SensorData[]>([]);
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
  const [tempLimit, setTempLimit] = useState({ min: 18, max: 26 });
  const [humidityLimit, setHumidityLimit] = useState({ min: 40, max: 70 });
  const [activeTab, setActiveTab] = useState<'data' | 'charts'>('data');

  const handleFileSelect = async (file: File) => {
    try {
      const parsedData = await parseCSV(file);
      setData(parsedData);
    } catch (error) {
      console.error('Errore durante la lettura del file CSV:', error);
      alert('Errore durante la lettura del file CSV. Controlla il formato del file.');
    }
  };

  const loadSampleData = () => {
    const sampleData = generateSampleData();
    setData(sampleData);
  };

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      if (filters.dateFrom && row.data < filters.dateFrom) return false;
      if (filters.dateTo && row.data > filters.dateTo) return false;
      if (filters.timeFrom && row.ora < filters.timeFrom) return false;
      if (filters.timeTo && row.ora > filters.timeTo) return false;
      if (filters.tempMin && row.temperatura < parseFloat(filters.tempMin)) return false;
      if (filters.tempMax && row.temperatura > parseFloat(filters.tempMax)) return false;
      if (filters.humidityMin && row.umidita < parseFloat(filters.humidityMin)) return false;
      if (filters.humidityMax && row.umidita > parseFloat(filters.humidityMax)) return false;
      return true;
    });
  }, [data, filters]);

  const dataRanges = useMemo(() => {
    if (data.length === 0) {
      return {
        dateRange: { min: '', max: '' },
        tempRange: { min: 0, max: 100 },
        humidityRange: { min: 0, max: 100 },
      };
    }

    const dates = data.map((d) => d.data).sort();
    const temps = data.map((d) => d.temperatura);
    const humidities = data.map((d) => d.umidita);

    return {
      dateRange: { min: dates[0], max: dates[dates.length - 1] },
      tempRange: { min: Math.min(...temps), max: Math.max(...temps) },
      humidityRange: { min: Math.min(...humidities), max: Math.max(...humidities) },
    };
  }, [data]);

  const handleExport = () => {
    exportToCSV(filteredData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Monitor Temperatura e Umidità
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {data.length === 0 ? (
          <div className="space-y-4">
            <FileUpload onFileSelect={handleFileSelect} />
            <div className="text-center">
              <button
                onClick={loadSampleData}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Carica dati di esempio
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('data')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    activeTab === 'data'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Database className="w-5 h-5" />
                  Dati
                </button>
                <button
                  onClick={() => setActiveTab('charts')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    activeTab === 'charts'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <BarChart3 className="w-5 h-5" />
                  Grafici
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setData([])}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Nuovo file
                </button>
                <button
                  onClick={handleExport}
                  disabled={filteredData.length === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-5 h-5" />
                  Esporta CSV ({filteredData.length})
                </button>
              </div>
            </div>

            <LimitSettings
              tempLimit={tempLimit}
              humidityLimit={humidityLimit}
              onTempLimitChange={(min, max) => setTempLimit({ min, max })}
              onHumidityLimitChange={(min, max) => setHumidityLimit({ min, max })}
            />

            <Filters
              onFilterChange={setFilters}
              dateRange={dataRanges.dateRange}
              tempRange={dataRanges.tempRange}
              humidityRange={dataRanges.humidityRange}
            />

            {activeTab === 'data' ? (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Dati ({filteredData.length} righe)
                  </h2>
                  <DataTable
                    data={filteredData}
                    tempLimit={tempLimit}
                    humidityLimit={humidityLimit}
                  />
                </div>
              </div>
            ) : (
              <Charts data={filteredData} />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
