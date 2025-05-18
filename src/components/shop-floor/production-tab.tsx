'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { WorkOrder } from '@/types/work-order'
import { StatusBadge } from '@/components/shared/status-badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Pause, Play, Coffee, Clock, FileText } from 'lucide-react'

// Define proper types for operations
interface WorkOrderOperation {
  id: string | number
  name: string
  workCenter: string
  status: string
  // Replace any with Record<string, unknown> for additional properties
  [key: string]: string | number | boolean | null | undefined
}

type Operation = WorkOrderOperation & {
  id: string | number
  name: string
  workCenter: string
  status: string
  timer: number
  timerRunning: boolean
  timerDisplay: string
  breakEndsAt: string | null
  indirectEndsAt: string | null
  indirectReason: string
  canPlay: boolean
  canPause: boolean
  canBreak: boolean
  canIndirect: boolean
  canComplete: boolean
  completedAt?: string
  // Add index signature to match WorkOrderOperation
  [key: string]: string | number | boolean | null | undefined
}

interface ProductionTabProps {
  workOrder: WorkOrder
}

export default function ProductionTab({ workOrder }: ProductionTabProps) {
  // Define operation state with timers and statuses
  const [operations, setOperations] = useState<Operation[]>([])
  const [openBreakDialog, setOpenBreakDialog] = useState(false)
  const [openIndirectDialog, setOpenIndirectDialog] = useState(false)
  const [openTimeDialog, setOpenTimeDialog] = useState(false)
  const [currentBreakTime, setCurrentBreakTime] = useState(5)
  const [currentIndirectTime, setCurrentIndirectTime] = useState(15)
  const [selectedOperation, setSelectedOperation] = useState<string | number | null>(null)
  const [indirectReason, setIndirectReason] = useState('Machine Setup')
  const [manualTimeEntry, setManualTimeEntry] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [productionMetrics, setProductionMetrics] = useState({
    completedOperations: 0,
    runningOperations: 0,
    pausedOperations: 0,
    indirectOperations: 0,
    totalTime: "00:00:00"
  })
  
  // Format seconds to HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':')
  }
  
  // Update production metrics based on current operations
  // Wrapped in useCallback to prevent dependency changes on every render
  const updateProductionMetrics = useCallback((ops: Operation[]): void => {
    const completed = ops.filter(op => op.status === 'COMPLETED').length
    const running = ops.filter(op => op.status === 'RUNNING').length
    const paused = ops.filter(op => op.status === 'PAUSED').length
    const indirect = ops.filter(op => op.status === 'INDIRECT').length
    
    // Calculate total time across all operations
    const totalSeconds = ops.reduce((total, op) => total + op.timer, 0)
    
    setProductionMetrics({
      completedOperations: completed,
      runningOperations: running,
      pausedOperations: paused,
      indirectOperations: indirect,
      totalTime: formatTime(totalSeconds)
    })
  }, [formatTime])
  
useEffect(() => {
  if (workOrder.operations?.length) {
    const initializedOps: Operation[] = (workOrder.operations).map((op) => ({
      ...op,
      timer: 0,
      timerRunning: op.status === 'RUNNING',
      timerDisplay: '00:00:00',
      breakEndsAt: null,
      indirectEndsAt: null,
      indirectReason: '',
      canPlay: op.status !== 'RUNNING',
      canPause: op.status === 'RUNNING',
      canBreak: true,
      canIndirect: true,
      canComplete: true
    }))
    setOperations(initializedOps)
    updateProductionMetrics(initializedOps)
  }
}, [workOrder, updateProductionMetrics])

  
  // Timer update effect
  useEffect(() => {
    const interval = setInterval(() => {
      setOperations(prevOps => 
        prevOps.map(op => {
          // If operation is on break, check if break time is over
          if (op.breakEndsAt && new Date() >= new Date(op.breakEndsAt)) {
            return {
              ...op, 
              breakEndsAt: null,
              status: 'PAUSED', // Change to paused instead of auto-running
              timerRunning: false,
              canPlay: true,
              canPause: false,
              canBreak: true,
              canIndirect: true,
              canComplete: true
            }
          }

          // If operation is on indirect, check if indirect time is over
          if (op.indirectEndsAt && new Date() >= new Date(op.indirectEndsAt)) {
            return {
              ...op, 
              indirectEndsAt: null,
              status: 'PAUSED', // Change to paused instead of auto-running
              timerRunning: false,
              canPlay: true,
              canPause: false,
              canBreak: true,
              canIndirect: true,
              canComplete: true
            }
          }
          
          // Update timer if running
          if (op.timerRunning) {
            const newTimer = op.timer + 1
            return {
              ...op,
              timer: newTimer,
              timerDisplay: formatTime(newTimer)
            }
          }
          return op
        })
      )
    }, 1000)
    
    return () => clearInterval(interval)
  }, [formatTime])
  
  // Update metrics whenever operations change
  useEffect(() => {
    updateProductionMetrics(operations)
  }, [operations, updateProductionMetrics])
  
  // Pause an operation
  const pauseOperation = (opId: string | number): void => {
    setOperations(prevOps => 
      prevOps.map(op => {
        if (op.id === opId) {
          return {
            ...op,
            timerRunning: false,
            status: 'PAUSED',
            canPlay: true,
            canPause: false,
            canBreak: true,
            canIndirect: true,
            canComplete: true
          }
        }
        return op
      })
    )
  }
  
  // Play/start an operation
  const playOperation = (opId: string | number): void => {
    setOperations(prevOps => 
      prevOps.map(op => {
        if (op.id === opId) {
          return {
            ...op,
            timerRunning: true,
            status: 'RUNNING',
            canPlay: false,
            canPause: true,
            canBreak: true,
            canIndirect: true,
            canComplete: true
          }
        }
        return op
      })
    )
  }
  
  // Start indirect time for an operation
  const startIndirect = (opId: string | number): void => {
    setSelectedOperation(opId)
    setOpenIndirectDialog(true)
  }
  
  // Confirm indirect dialog
  const confirmIndirect = (): void => {
    if (selectedOperation === null) return
    
    const indirectEndTime = new Date()
    indirectEndTime.setMinutes(indirectEndTime.getMinutes() + currentIndirectTime)
    
    setOperations(prevOps => 
      prevOps.map(op => {
        if (op.id === selectedOperation) {
          return {
            ...op,
            timerRunning: false,
            status: 'INDIRECT',
            indirectEndsAt: indirectEndTime.toISOString(),
            indirectReason: indirectReason,
            canPlay: false,
            canPause: false,
            canBreak: false,
            canIndirect: false,
            canComplete: false
          }
        }
        return op
      })
    )
    
    setOpenIndirectDialog(false)
    setSelectedOperation(null)
  }

  // Save manual time entry
  const saveTimeEntry = (): void => {
    if (selectedOperation === null) return
    
    const totalSeconds = 
      manualTimeEntry.hours * 3600 + 
      manualTimeEntry.minutes * 60 + 
      manualTimeEntry.seconds
    
    setOperations(prevOps => 
      prevOps.map(op => {
        if (op.id === selectedOperation) {
          return {
            ...op,
            timer: op.timer + totalSeconds,
            timerDisplay: formatTime(op.timer + totalSeconds)
          }
        }
        return op
      })
    )
    
    // Reset manual time entry
    setManualTimeEntry({
      hours: 0,
      minutes: 0,
      seconds: 0
    })
    
    setOpenTimeDialog(false)
    setSelectedOperation(null)
  }
  
  // Handle manual time entry changes
  const handleTimeEntryChange = (field: 'hours' | 'minutes' | 'seconds', value: number): void => {
    setManualTimeEntry(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  // Start a break for an operation
  const startBreak = (opId: string | number): void => {
    setSelectedOperation(opId)
    setOpenBreakDialog(true)
  }
  
  // Confirm break dialog
  const confirmBreak = (): void => {
    if (selectedOperation === null) return
    
    const breakEndTime = new Date()
    breakEndTime.setMinutes(breakEndTime.getMinutes() + currentBreakTime)
    
    setOperations(prevOps => 
      prevOps.map(op => {
        if (op.id === selectedOperation) {
          return {
            ...op,
            timerRunning: false,
            status: 'BREAK',
            breakEndsAt: breakEndTime.toISOString(),
            canPlay: false,
            canPause: false,
            canBreak: false,
            canIndirect: false,
            canComplete: false
          }
        }
        return op
      })
    )
    
    setOpenBreakDialog(false)
    setSelectedOperation(null)
  }
  
  // Complete an operation
  const completeOperation = (opId: string | number): void => {
    setOperations(prevOps => 
      prevOps.map(op => {
        if (op.id === opId) {
          return {
            ...op,
            timerRunning: false,
            status: 'COMPLETED',
            completedAt: new Date().toLocaleTimeString(),
            canPlay: false,
            canPause: false,
            canBreak: false,
            canIndirect: false,
            canComplete: false
          }
        }
        return op
      })
    )
  }
  
  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-6">Operations</h3>
      
      {operations.length ? operations.map((op) => (
        <div key={op.id} className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h4 className="text-lg font-medium">Operation {op.id}: {op.name}</h4>
              <p className="text-gray-500 text-sm">Work Center: {op.workCenter}</p>
              <div className=" overflow-hidden whitespace-nowrap text-ellipsis text-sm">
                {op.breakEndsAt && (
                  <span className="text-orange-500 font-medium">
                    Break ends at {new Date(op.breakEndsAt).toLocaleTimeString()}
                  </span>
                )}
                {op.indirectEndsAt && (
                  <span className="text-yellow-500 font-medium">
                    Indirect work ({op.indirectReason}) ends at {new Date(op.indirectEndsAt).toLocaleTimeString()}
                  </span>
                )}
                {op.completedAt && (
                  <span className="text-green-600 font-medium">
                    Completed at: {op.completedAt}
                  </span>
                )}
                {!op.breakEndsAt && !op.indirectEndsAt && !op.completedAt && (
                  <span className="font-medium">
                    Time: {op.timerDisplay}
                  </span>
                )}
              </div>
            </div>
            <StatusBadge status={op.status} />
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">

            <div className="flex justify-end items-center">
              
              
              {op.status !== 'COMPLETED' && (
                <div className="flex gap-2">
            
                  
                  {/* Play button - enabled when paused or has break/indirect time expired */}
                  <Button
                    onClick={() => playOperation(op.id)}
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-md bg-blue-600 text-white border hover:bg-opacity-70"
                    disabled={op.status === 'RUNNING' || (op.breakEndsAt !== null && new Date() < new Date(op.breakEndsAt)) || (op.indirectEndsAt !== null && new Date() < new Date(op.indirectEndsAt))}
                  >
                    <Play className="h-6 w-6" />
                  </Button>
                  
                  {/* Pause button - enabled when running */}
                  <Button
                    onClick={() => pauseOperation(op.id)}
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-md bg-yellow-400 text-white border hover:bg-opacity-70"
                    disabled={op.status !== 'RUNNING'}
                  >
                    <Pause className="h-6 w-6" />
                  </Button>
                  
                  {/* Complete button - disabled during break or indirect */}
                  <Button
                    onClick={() => completeOperation(op.id)}
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-md bg-blue-100 text-blue-600 border hover:bg-opacity-70"
                    disabled={op.breakEndsAt !== null || op.indirectEndsAt !== null}
                  >
                    <Clock className="h-6 w-6" />
                  </Button>
                  
                  {/* Break button - enabled when not on break or indirect */}
                  <Button
                    onClick={() => startBreak(op.id)}
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-md bg-red-500 text-white border hover:bg-opacity-70"
                    disabled={op.breakEndsAt !== null || op.indirectEndsAt !== null}
                  >
                    <Coffee className="h-6 w-6" />
                  </Button>
                  
                  {/* Indirect button - enabled when not on break or indirect */}
                  <Button
                    onClick={() => startIndirect(op.id)}
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-md bg-purple-500 text-white border hover:bg-opacity-70"
                    disabled={op.indirectEndsAt !== null || op.breakEndsAt !== null}
                  >
                    <FileText className="h-6 w-6" />
                  </Button>
                </div>
              )}
              
              {op.status === 'COMPLETED' && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-md bg-blue-600 text-white border opacity-50"
                    disabled
                  >
                    <Play className="h-6 w-6" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-md bg-yellow-400 text-white border opacity-50"
                    disabled
                  >
                    <Pause className="h-6 w-6" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-md bg-blue-100 text-blue-600 border opacity-50"
                    disabled
                  >
                    <Clock className="h-6 w-6" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-md bg-red-500 text-white border opacity-50"
                    disabled
                  >
                    <Coffee className="h-6 w-6" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-md bg-purple-500 text-white border opacity-50"
                    disabled
                  >
                    <FileText className="h-6 w-6" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )) : (
        <p className="text-gray-500">No operations found.</p>
      )}
      
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Production Dashboard</h3>
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h4 className="text-gray-500 text-sm">Total Time</h4>
              <p className="text-lg font-semibold">{productionMetrics.totalTime}</p>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h4 className="text-gray-500 text-sm">Completed</h4>
              <p className="text-lg font-semibold text-green-600">{productionMetrics.completedOperations}</p>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h4 className="text-gray-500 text-sm">Running</h4>
              <p className="text-lg font-semibold text-blue-600">{productionMetrics.runningOperations}</p>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h4 className="text-gray-500 text-sm">Paused</h4>
              <p className="text-lg font-semibold text-amber-600">{productionMetrics.pausedOperations}</p>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h4 className="text-gray-500 text-sm">Indirect</h4>
              <p className="text-lg font-semibold text-yellow-500">{productionMetrics.indirectOperations}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Break Dialog */}
      <AlertDialog open={openBreakDialog} onOpenChange={setOpenBreakDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Coffee Break</AlertDialogTitle>
            <AlertDialogDescription>
              <p className="mb-4">Set break duration in minutes:</p>
              <div className="flex space-x-2">
                {[5, 10, 15, 30].map(time => (
                  <Button 
                    key={time}
                    onClick={() => setCurrentBreakTime(time)}
                    variant={currentBreakTime === time ? "default" : "outline"}
                    className="w-12 h-10"
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBreak}>Start Break</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Indirect Dialog */}
      <AlertDialog open={openIndirectDialog} onOpenChange={setOpenIndirectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Indirect Work</AlertDialogTitle>
            <AlertDialogDescription>
              <p className="mb-4">Select indirect work duration in minutes:</p>
              <div className="flex space-x-2">
                {[15, 30, 45, 60].map(time => (
                  <Button 
                    key={time}
                    onClick={() => setCurrentIndirectTime(time)}
                    variant={currentIndirectTime === time ? "default" : "outline"}
                    className="w-12 h-10"
                  >
                    {time}
                  </Button>
                ))}
              </div>
              <div className="mt-4">
                <p className="text-sm mb-2">Reason for indirect time:</p>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={indirectReason}
                  onChange={(e) => setIndirectReason(e.target.value)}
                >
                  <option>Machine Setup</option>
                  <option>Tool Change</option>
                  <option>Maintenance</option>
                  <option>Material Preparation</option>
                  <option>Other</option>
                </select>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmIndirect}>Start Indirect</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Time Recording Dialog */}
      <AlertDialog open={openTimeDialog} onOpenChange={setOpenTimeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Time Recording</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="mt-2">
                <div className="mb-4">
                  <p className="text-sm mb-2">Manual time entry:</p>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      placeholder="Hours" 
                      className="w-1/3 p-2 border rounded-md" 
                      min="0" 
                      max="24"
                      value={manualTimeEntry.hours}
                      onChange={(e) => handleTimeEntryChange('hours', parseInt(e.target.value) || 0)}
                    />
                    <input 
                      type="number" 
                      placeholder="Minutes" 
                      className="w-1/3 p-2 border rounded-md" 
                      min="0" 
                      max="59"
                      value={manualTimeEntry.minutes}
                      onChange={(e) => handleTimeEntryChange('minutes', parseInt(e.target.value) || 0)}
                    />
                    <input 
                      type="number" 
                      placeholder="Seconds" 
                      className="w-1/3 p-2 border rounded-md" 
                      min="0" 
                      max="59"
                      value={manualTimeEntry.seconds}
                      onChange={(e) => handleTimeEntryChange('seconds', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={saveTimeEntry}>Save Time</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
