'use client'

import { useState, useEffect } from 'react'
import { Clock, Users, User, LogIn, LogOut, Timer } from 'lucide-react'

interface ClockEntry {
  id: string;
  employeeId?: string;
  employeeName?: string;
  teamId?: string;
  teamName?: string;
  clockInTime: string;
  clockOutTime?: string;
  duration?: string;
  status: 'clocked-in' | 'clocked-out';
}

interface Employee {
  id: string;
  name: string;
  department: string;
}

interface Team {
  id: string;
  name: string;
  members: Employee[];
}

interface ClockInOutProps {
  onClockEvent?: (entry: ClockEntry) => void; // Callback to parent component
}

export default function ClockInOut({ onClockEvent }: ClockInOutProps) {
  const [clockingMode, setClockingMode] = useState<'individual' | 'team'>('individual');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [clockEntries, setClockEntries] = useState<ClockEntry[]>([]);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Mock data - in real app, this would come from props or API
  const employees: Employee[] = [
    { id: '001', name: 'John Smith', department: 'Assembly' },
    { id: '002', name: 'Sarah Johnson', department: 'Machining' },
    { id: '003', name: 'Mike Wilson', department: 'Quality Control' },
    { id: '004', name: 'Lisa Brown', department: 'Assembly' },
    { id: '005', name: 'David Lee', department: 'Machining' }
  ];

  const teams: Team[] = [
    {
      id: 'team-001',
      name: 'Assembly Team A',
      members: [employees[0], employees[3]]
    },
    {
      id: 'team-002', 
      name: 'Machining Team B',
      members: [employees[1], employees[4]]
    }
  ];

  // Update current time every second
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const calculateDuration = (clockIn: string, clockOut: string): string => {
    const start = new Date(clockIn);
    const end = new Date(clockOut);
    const diffMs = end.getTime() - start.getTime();
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const getCurrentClockEntry = (): ClockEntry | undefined => {
    if (clockingMode === 'individual') {
      return clockEntries.find(entry => 
        entry.employeeId === selectedEmployee && entry.status === 'clocked-in'
      );
    } else {
      return clockEntries.find(entry => 
        entry.teamId === selectedTeam && entry.status === 'clocked-in'
      );
    }
  };

  const getActiveDuration = (clockInTime: string): string => {
    const now = new Date();
    const start = new Date(clockInTime);
    const diffMs = now.getTime() - start.getTime();
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const handleClockIn = () => {
    if (clockingMode === 'individual' && !selectedEmployee) {
      alert('Please select an employee');
      return;
    }
    if (clockingMode === 'team' && !selectedTeam) {
      alert('Please select a team');
      return;
    }

    const currentEntry = getCurrentClockEntry();
    if (currentEntry) {
      alert('Already clocked in');
      return;
    }

    const timestamp = new Date().toISOString();
    const newEntry: ClockEntry = {
      id: `entry-${Date.now()}`,
      clockInTime: timestamp,
      status: 'clocked-in'
    };

    if (clockingMode === 'individual') {
      const employee = employees.find(emp => emp.id === selectedEmployee);
      newEntry.employeeId = selectedEmployee;
      newEntry.employeeName = employee?.name;
    } else {
      const team = teams.find(t => t.id === selectedTeam);
      newEntry.teamId = selectedTeam;
      newEntry.teamName = team?.name;
    }

    setClockEntries(prev => [newEntry, ...prev]);
    
    // Notify parent component
    if (onClockEvent) {
      onClockEvent(newEntry);
    }
  };

  const handleClockOut = () => {
    const currentEntry = getCurrentClockEntry();
    if (!currentEntry) {
      alert('No active clock-in session found');
      return;
    }

    const timestamp = new Date().toISOString();
    const duration = calculateDuration(currentEntry.clockInTime, timestamp);

    const updatedEntry = {
      ...currentEntry,
      clockOutTime: timestamp,
      duration,
      status: 'clocked-out' as const
    };

    setClockEntries(prev => 
      prev.map(entry => 
        entry.id === currentEntry.id ? updatedEntry : entry
      )
    );

    // Notify parent component
    if (onClockEvent) {
      onClockEvent(updatedEntry);
    }
  };

  const currentEntry = getCurrentClockEntry();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Clock In / Clock Out</h2>
        <div className="text-lg font-mono text-blue-600">
          {currentTime}
        </div>
      </div>

      {/* Mode Selection */}
      <div className="flex gap-3">
        <button
          onClick={() => setClockingMode('individual')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            clockingMode === 'individual'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <User size={18} />
          Individual
        </button>
        <button
          onClick={() => setClockingMode('team')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            clockingMode === 'team'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Users size={18} />
          Team
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selection */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-700">
            {clockingMode === 'individual' ? 'Select Employee' : 'Select Team'}
          </h3>
          
          {clockingMode === 'individual' ? (
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose employee...</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          ) : (
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose team...</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Current Status */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-700">Current Status</h3>
          
          {currentEntry ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-800 font-medium mb-2">
                <Timer size={18} />
                Clocked In
              </div>
              <div className="text-sm text-green-700">
                <div>Since: {new Date(currentEntry.clockInTime).toLocaleTimeString()}</div>
                <div className="font-medium">
                  Duration: {getActiveDuration(currentEntry.clockInTime)}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="text-gray-600 text-center">
                <Clock size={24} className="mx-auto mb-2 text-gray-400" />
                <div className="text-sm">Not clocked in</div>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-700">Actions</h3>
          
          <div className="space-y-2">
            <button
              onClick={handleClockIn}
              disabled={!!currentEntry || (clockingMode === 'individual' ? !selectedEmployee : !selectedTeam)}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-colors ${
                !!currentEntry || (clockingMode === 'individual' ? !selectedEmployee : !selectedTeam)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              <LogIn size={18} />
              Clock In
            </button>

            <button
              onClick={handleClockOut}
              disabled={!currentEntry}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-colors ${
                !currentEntry
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              <LogOut size={18} />
              Clock Out
            </button>
          </div>
        </div>
      </div>

      {/* Recent Entries (compact view) */}
      {clockEntries.length > 0 && (
        <div className="border-t pt-4">
          <h3 className="font-medium text-gray-700 mb-3">Recent Entries</h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {clockEntries.slice(0, 3).map((entry) => (
              <div key={entry.id} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                <span className="font-medium">
                  {entry.employeeName || entry.teamName}
                </span>
                <span className="text-gray-600">
                  {entry.status === 'clocked-in' 
                    ? `Active (${getActiveDuration(entry.clockInTime)})`
                    : entry.duration
                  }
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}