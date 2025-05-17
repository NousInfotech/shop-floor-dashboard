'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { WorkOrder } from '@/types/work-order'
import { StatusBadge } from '@/components/shared/status-badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Pause, Play, Coffee, ClipboardList, Clock } from 'lucide-react'

interface ProductionTabProps {
  workOrder: WorkOrder
}

export default function ProductionTab({ workOrder }: ProductionTabProps) {
  // Define operation state with timers and statuses
  const [operations, setOperations] = useState<any[]>([])
  const [openTaskDialog, setOpenTaskDialog] = useState(false)
  const [openBreakDialog, setOpenBreakDialog] = useState(false)
  const [currentBreakTime, setCurrentBreakTime] = useState(5)
  const [selectedOperation, setSelectedOperation] = useState<number | null>(null)
  const [productionMetrics, setProductionMetrics] = useState({
    completedOperations: 0,
    runningOperations: 0,
    pausedOperations: 0,
    totalTime: "00:00:00"
  })
  
  // Initialize operations state from props
  useEffect(() => {
    if (workOrder.operations?.length) {
      const initializedOps = workOrder.operations.map(op => ({
        ...op,
        timer: 0,
        timerRunning: op.status === 'RUNNING',
        timerDisplay: '00:00:00',
        breakEndsAt: null
      }))
      setOperations(initializedOps)
      
      // Update metrics
      updateProductionMetrics(initializedOps)
    }
  }, [workOrder])
  
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
              status: 'RUNNING',
              timerRunning: true
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
  }, [])
  
  // Update metrics whenever operations change
  useEffect(() => {
    updateProductionMetrics(operations)
  }, [operations])
  
  // Format seconds to HH:MM:SS
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':')
  }
  
  // Toggle play/pause for an operation
  const togglePlayPause = (opId: number) => {
    setOperations(prevOps => 
      prevOps.map(op => {
        if (op.id === opId) {
          const newStatus = op.timerRunning ? 'PAUSED' : 'RUNNING'
          return {
            ...op,
            timerRunning: !op.timerRunning,
            status: newStatus
          }
        }
        return op
      })
    )
  }
  
  // Start a break for an operation
  const startBreak = (opId: number) => {
    setSelectedOperation(opId)
    setOpenBreakDialog(true)
  }
  
  // Confirm break dialog
  const confirmBreak = () => {
    if (selectedOperation === null) return
    
    const breakEndTime = new Date()
    breakEndTime.setMinutes(breakEndTime.getMinutes() + currentBreakTime)
    
    setOperations(prevOps => 
      prevOps.map(op => {
        if (op.id === selectedOperation) {
          return {
            ...op,
            timerRunning: false,
            status: 'PAUSED',
            breakEndsAt: breakEndTime.toISOString(),
          }
        }
        return op
      })
    )
    
    setOpenBreakDialog(false)
    setSelectedOperation(null)
  }
  
  // Open tasks dialog for an operation
  const openTasks = (opId: number) => {
    setSelectedOperation(opId)
    setOpenTaskDialog(true)
  }
  
  // Complete an operation
  const completeOperation = (opId: number) => {
    setOperations(prevOps => 
      prevOps.map(op => {
        if (op.id === opId) {
          return {
            ...op,
            timerRunning: false,
            status: 'COMPLETED',
            completedAt: new Date().toLocaleTimeString()
          }
        }
        return op
      })
    )
  }
  
  // Update production metrics based on current operations
  const updateProductionMetrics = (ops: any[]) => {
    const completed = ops.filter(op => op.status === 'COMPLETED').length
    const running = ops.filter(op => op.status === 'RUNNING').length
    const paused = ops.filter(op => op.status === 'PAUSED').length
    
    // Calculate total time across all operations
    const totalSeconds = ops.reduce((total, op) => total + op.timer, 0)
    
    setProductionMetrics({
      completedOperations: completed,
      runningOperations: running,
      pausedOperations: paused,
      totalTime: formatTime(totalSeconds)
    })
  }
  
  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-6">Operations</h3>
      
      {operations.length ? operations.map((op) => (
        <div key={op.id} className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-lg font-medium">Operation {op.id}: {op.name}</h4>
            <StatusBadge status={op.status} />
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-sm">Work Center: {op.workCenter}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm flex items-center">
                  <Clock className="mr-1 h-4 w-4" /> {op.timerDisplay}
                  {op.breakEndsAt && (
                    <span className="ml-2 text-amber-600 font-medium">
                      Break ends at {new Date(op.breakEndsAt).toLocaleTimeString()}
                    </span>
                  )}
                  {op.completedAt && (
                    <span className="ml-2 text-green-600 font-medium">
                      Completed at: {op.completedAt}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex mt-4 gap-4 justify-start flex-wrap">
              {op.status !== 'COMPLETED' && (
                <>
                  <Button
                    onClick={() => togglePlayPause(op.id)}
                    variant="outline"
                    className={`flex items-center gap-2 px-4 py-2 rounded-md ${op.timerRunning ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'} border hover:bg-opacity-70`}
                  >
                    <span className="text-lg">{op.timerRunning ? <Pause /> : <Play />}</span>
                    <span className="text-md">{op.timerRunning ? 'Pause' : 'Play'}</span>
                  </Button>
                  
                  <Button
                    onClick={() => startBreak(op.id)}
                    variant="outline"
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-red-100 text-red-500 border hover:bg-opacity-70"
                    disabled={op.breakEndsAt !== null}
                  >
                    <span className="text-lg"><Coffee /></span>
                    <span className="text-md">Coffee Break</span>
                  </Button>
                  
                  <Button
                    onClick={() => openTasks(op.id)}
                    variant="outline"
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100 text-gray-600 border hover:bg-opacity-70"
                  >
                    <span className="text-lg"><ClipboardList /></span>
                    <span className="text-md">Tasks</span>
                  </Button>
                  
                  <Button
                    onClick={() => completeOperation(op.id)}
                    variant="outline"
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-green-100 text-green-600 border hover:bg-opacity-70"
                  >
                    <span className="text-md">Mark Complete</span>
                  </Button>
                </>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
      
      {/* Tasks Dialog */}
      <AlertDialog open={openTaskDialog} onOpenChange={setOpenTaskDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Operation Tasks</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedOperation !== null && operations.find(op => op.id === selectedOperation) && (
                <div className="mt-2">
                  <h4 className="font-medium">Operation {selectedOperation}: {operations.find(op => op.id === selectedOperation)?.name}</h4>
                  <ul className="mt-3 space-y-2">
                    <li className="flex items-center">
                      <input type="checkbox" className="mr-2 h-4 w-4" /> Setup machine
                    </li>
                    <li className="flex items-center">
                      <input type="checkbox" className="mr-2 h-4 w-4" /> Check materials
                    </li>
                    <li className="flex items-center">
                      <input type="checkbox" className="mr-2 h-4 w-4" /> Run quality checks
                    </li>
                    <li className="flex items-center">
                      <input type="checkbox" className="mr-2 h-4 w-4" /> Document results
                    </li>
                  </ul>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}