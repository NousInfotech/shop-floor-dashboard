import React from 'react';
import { Calendar, CheckCircle2, Play } from 'lucide-react';
import ProgressBar from './ProgressBar';

interface QualityBatch {
  id: number;
  status: string;
  progress: number;
  date: string;
}

interface QualityBatchCardProps {
  batch: QualityBatch;
}

const QualityBatchCard: React.FC<QualityBatchCardProps> = ({ batch }) => (
  <div className="bg-white rounded-lg border border-gray-100 p-4">
    <div className="flex items-start justify-between mb-3">
      <div>
        <h4 className="font-semibold text-gray-900 text-sm">Quality Check Batch {batch.id}</h4>
        <div className="flex items-center mt-1">
          <Calendar className="w-4 h-4 text-gray-400 mr-1" />
          <span className="text-xs text-gray-500">{batch.date}</span>
        </div>
      </div>
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle2 className="w-3 h-3 mr-1" />
        {batch.status}
      </span>
    </div>
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Progress</span>
        <span className="font-medium text-gray-900">{batch.progress}%</span>
      </div>
      <ProgressBar progress={batch.progress} />
    </div>
    <div className="flex justify-end mt-3">
      <button className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors">
        <Play className="w-3 h-3 mr-1" />
        Start
      </button>
    </div>
  </div>
);

export default QualityBatchCard;
