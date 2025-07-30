'use client';

import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartProps {
  title: string;
  type: 'line' | 'bar';
  xAxis: string;
  yAxis: string;
  data: Array<Record<string, any>>;
  className?: string;
}

export default function Chart({ title, type, xAxis, yAxis, data, className = '' }: ChartProps) {
  const dataKeys = Object.keys(data[0] || {}).filter(key => key !== 'name');
  const colors = ['#B8956F', '#6B5A44', '#D4B896', '#8B7355'];

  if (type === 'line') {
    return (
      <div className={`chart-container flex flex-col h-full ${className}`}>
        <h4 className="text-lg font-medium mb-3 text-center text-foreground/90">{title}</h4>
        <div className="flex-1 min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 20, left: 30, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D6" />
              <XAxis 
                dataKey="name" 
                stroke="#6B6B6B" 
                fontSize={13}
                axisLine={{ stroke: '#D4C8BB' }}
              />
              
              <YAxis 
                stroke="#6B6B6B" 
                fontSize={13}
                axisLine={{ stroke: '#D4C8BB' }}
                label={{ value: yAxis, angle: -90, position: 'insideLeft' }}
              />
              
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FEFCF8', 
                  border: '2px solid #B8956F',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#2D2D2D',
                  boxShadow: '0 4px 12px rgba(45, 45, 45, 0.15)',
                  padding: '12px 16px'
                }}
                labelStyle={{ color: '#2D2D2D', fontWeight: '600' }}
              />
              <Legend />
              {dataKeys.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[index % colors.length]}
                  strokeWidth={4}
                  dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-center text-xs text-foreground/60 mt-1">{xAxis}</p>
      </div>
    );
  }

  if (type === 'bar') {
    return (
      <div className={`chart-container flex flex-col h-full ${className}`}>
        <h4 className="text-lg font-medium mb-3 text-center text-foreground/90">{title}</h4>
        <div className="flex-1 min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 20, left: 30, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D6" />
              <XAxis 
                dataKey="name" 
                stroke="#6B6B6B" 
                fontSize={13}
                axisLine={{ stroke: '#D4C8BB' }}
              />
              <YAxis 
                stroke="#6B6B6B" 
                fontSize={13}
                axisLine={{ stroke: '#D4C8BB' }}
                label={{ value: yAxis, angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FEFCF8', 
                  border: '2px solid #B8956F',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#2D2D2D',
                  boxShadow: '0 4px 12px rgba(45, 45, 45, 0.15)',
                  padding: '12px 16px'
                }}
                labelStyle={{ color: '#2D2D2D', fontWeight: '600' }}
              />
              <Legend />
              {dataKeys.map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={colors[index % colors.length]}
                  radius={[2, 2, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-center text-xs text-foreground/60 mt-1">{xAxis}</p>
      </div>
    );
  }

  return null;
}