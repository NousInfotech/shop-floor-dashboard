'use client'

import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { setSelectedDate } from '@/redux/features/shopFloor/shopFloorSlice'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const CalendarPicker = () => {
  const dispatch = useDispatch()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isOpen, setIsOpen] = useState(false)
  
  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (selectedDate) {
      dispatch(setSelectedDate(format(selectedDate, 'yyyy-MM-dd')))
      setIsOpen(false) // Auto-close calendar on selection
    }
  }
  
  const formattedDate = date ? format(date, 'MMMM d, yyyy') : 'Select a date'
  
  return (
    <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="py-2 px-3 flex items-center gap-2">
        <CalendarIcon size={18} className="text-blue-600" />
        
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-700 font-medium text-sm px-2 py-1 hover:bg-blue-50 flex items-center gap-1 h-auto"
            >
              {formattedDate}
              <ChevronDown className="text-gray-400" size={14} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 border border-gray-200 rounded-md shadow-lg">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleSelect}
              className="rounded-md bg-white"
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <Separator />
      
      <Button
        variant="ghost"
        size="sm"
        className="h-full py-2 px-3 text-blue-600 hover:text-blue-800 hover:bg-blue-50 font-medium text-sm border-l border-gray-200"
        onClick={() => {
          const today = new Date()
          setDate(today)
          dispatch(setSelectedDate(format(today, 'yyyy-MM-dd')))
        }}
      >
        Today
      </Button>
    </div>
  )
}

// Simple separator component
const Separator = () => (
  <div className="w-px h-6 bg-gray-200"></div>
)

export default CalendarPicker