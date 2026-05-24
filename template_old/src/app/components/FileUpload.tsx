import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export function FileUpload({ onFileSelect }: FileUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-8 border-2 border-dashed rounded-lg">
      <Upload className="w-12 h-12 text-gray-400" />
      <div className="text-center">
        <label htmlFor="file-upload" className="cursor-pointer">
          <span className="px-4 py-2 bg-blue-600 text-white rounded-lg inline-block hover:bg-blue-700">
            Carica file CSV
          </span>
          <input
            id="file-upload"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
        <p className="mt-2 text-sm text-gray-500">
          Oppure trascina un file CSV qui
        </p>
      </div>
    </div>
  );
}
