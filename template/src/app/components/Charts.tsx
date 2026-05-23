import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { SensorData } from '../types';

interface ChartsProps {
  data: SensorData[];
}

export function Charts({ data }: ChartsProps) {
  const chartData = data.map((item) => ({
    time: `${item.data} ${item.ora}`,
    temperatura: item.temperatura,
    umidita: item.umidita,
  }));

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Temperatura nel tempo</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fontSize: 12 }}
            />
            <YAxis label={{ value: '°C', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="temperatura"
              stroke="#ef4444"
              strokeWidth={2}
              name="Temperatura (°C)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Umidità nel tempo</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fontSize: 12 }}
            />
            <YAxis label={{ value: '%', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="umidita"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Umidità (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Temperatura e Umidità combinate</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="temperatura"
              stroke="#ef4444"
              strokeWidth={2}
              name="Temperatura (°C)"
            />
            <Line
              type="monotone"
              dataKey="umidita"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Umidità (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
