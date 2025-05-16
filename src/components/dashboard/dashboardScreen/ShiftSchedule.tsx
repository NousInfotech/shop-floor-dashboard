import { Calendar, CalendarDays, ChevronRight } from "lucide-react";
import { useState } from "react";
import { GetCurrentDateTime } from "./getCurrentDateTime";

export const ShiftSchedule = () => {
  const [activeTab, setActiveTab] = useState('today');
  
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <CalendarDays className="h-5 w-5 text-gray-700 mr-2" />
          <h2 className="text-lg font-medium text-gray-800">Shift Schedule</h2>
        </div>
        <div className="flex space-x-2">
          <button 
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'prev' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('prev')}
          >
            Prev
          </button>
          <button 
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'today' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('today')}
          >
            Today
          </button>
          <button 
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'next' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('next')}
          >
            Next
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-700">{<GetCurrentDateTime/>}</h3>
      </div>
      
      <div className="flex flex-col items-center justify-center py-8 text-gray-500">
        <Calendar className="h-10 w-10 mb-3 text-gray-400" />
        <p className="text-center">No shifts scheduled for this day</p>
      </div>
      
      <div className="flex justify-end mt-4">
        <button className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium">
          View All Assignments
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  );
};
