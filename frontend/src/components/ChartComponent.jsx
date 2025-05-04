import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const ChartComponent = ({ data, isDarkMode }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis 
          dataKey="month" 
          tick={{ fill: isDarkMode ? '#e5e7eb' : '#374151' }}
        />
        <YAxis 
          tick={{ fill: isDarkMode ? '#e5e7eb' : '#374151' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
            color: isDarkMode ? '#e5e7eb' : '#374151',
            border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`
          }}
        />
        <Line 
          type="monotone" 
          dataKey="bookings" 
          stroke="#8884d8" 
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ChartComponent;
