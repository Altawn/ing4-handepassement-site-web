interface CalendarWidgetProps {
    highlightDates?: Date[];
}

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface CalendarItem {
    day: number | null;
    date?: Date;
    key: string;
}

export default function CalendarWidget({ highlightDates = [] }: CalendarWidgetProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const handleDataChange = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
        setCurrentDate(newDate);
    };

    const getDaysToDisplay = () => {
        const days: CalendarItem[] = [];
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        // Fill start padding
        const startPadding = firstDay.getDay(); // 0 for Sunday
        for (let i = 0; i < startPadding; i++) {
            days.push({ day: null, key: `pad-start-${i}` });
        }

        // Fill actual days
        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push({ day: i, date: new Date(year, month, i), key: `day-${i}` });
        }

        return days;
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    // Check if the displayed date matches current selected date
    const isSelected = (date: Date) => {
        return date.getDate() === currentDate.getDate() &&
            date.getMonth() === currentDate.getMonth() &&
            date.getFullYear() === currentDate.getFullYear();
    };

    const hasEvent = (date: Date) => {
        return highlightDates.some(d =>
            d.getDate() === date.getDate() &&
            d.getMonth() === date.getMonth() &&
            d.getFullYear() === date.getFullYear()
        );
    };

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const displayDays = getDaysToDisplay();

    return (
        <div className="border border-gray-200 rounded-xl p-4 bg-white">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-md">
                        <Calendar className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-gray-700">Calendrier</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex bg-gray-100 rounded-md p-1">
                        <button
                            className="px-3 py-1 text-sm font-medium bg-white shadow-sm rounded-md text-gray-800 cursor-default"
                        >
                            Mois
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => handleDataChange('prev')}
                        className="p-1 hover:bg-gray-100 rounded text-gray-500"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={() => handleDataChange('next')}
                        className="p-1 hover:bg-gray-100 rounded text-gray-500"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-xs mb-2">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
                    <div key={day} className="font-semibold text-gray-400 py-2">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-sm">
                {displayDays.map((item: CalendarItem) => {
                    if (!item.day || !item.date) return <div key={item.key}></div>; // padding

                    const isCurrent = isToday(item.date);
                    const isHighlighted = hasEvent(item.date);

                    return (
                        <div
                            key={item.key}
                            onClick={() => {
                                setCurrentDate(item.date!);
                            }}
                            className={`h-10 w-10 mx-auto flex flex-col items-center justify-center rounded-full cursor-pointer transition relative ${isSelected(item.date)
                                ? 'bg-blue-600 text-white font-bold shadow-md'
                                : isCurrent
                                    ? 'border border-blue-600 text-blue-600 font-bold'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <span>{item.day}</span>
                            {/* Blue dot indicator for events */}
                            {isHighlighted && !isSelected(item.date) && (
                                <div className="absolute bottom-1 w-1 h-1 bg-blue-500 rounded-full"></div>
                            )}
                            {isHighlighted && isSelected(item.date) && (
                                <div className="absolute bottom-1 w-1 h-1 bg-white rounded-full"></div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
