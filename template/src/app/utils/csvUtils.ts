import Papa from 'papaparse';
import type { SensorData } from '../types';

export function parseCSV(file: File): Promise<SensorData[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const data = results.data.map((row: any) => ({
            data: row.data || row.Data || row.DATE || row.date || '',
            ora: row.ora || row.Ora || row.TIME || row.time || '',
            temperatura: parseFloat(row.temperatura || row.Temperatura || row.TEMP || row.temp || row.temperature || '0'),
            umidita: parseFloat(row.umidita || row.Umidita || row.umidità || row.HUMIDITY || row.humidity || '0'),
          }));
          resolve(data);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

export function exportToCSV(data: SensorData[], filename: string = 'dati_filtrati.csv') {
  const csv = Papa.unparse(data, {
    header: true,
    columns: ['data', 'ora', 'temperatura', 'umidita'],
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function generateSampleData(): SensorData[] {
  const data: SensorData[] = [];
  const startDate = new Date('2026-05-20');

  for (let i = 0; i < 48; i++) {
    const date = new Date(startDate);
    date.setHours(date.getHours() + i);

    data.push({
      data: date.toISOString().split('T')[0],
      ora: date.toTimeString().split(' ')[0].substring(0, 5),
      temperatura: 18 + Math.random() * 10 + Math.sin(i / 4) * 3,
      umidita: 45 + Math.random() * 20 + Math.cos(i / 3) * 10,
    });
  }

  return data;
}
