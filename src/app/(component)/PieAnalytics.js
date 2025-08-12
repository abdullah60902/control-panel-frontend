// PieAnalytics.jsx
'use client';
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#aa66cc', '#33b5e5', '#ff4444'];

const PieAnalytics = ({ data }) => {
  return (
    <div className="w-full h-96">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="careSetting"
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            label
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieAnalytics;
