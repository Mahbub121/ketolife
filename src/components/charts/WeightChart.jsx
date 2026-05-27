import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

export default function WeightChart({ data, targetKg }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data}>
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fontFamily: 'Hind Siliguri' }}
          stroke="#7A7568"
          interval="preserveStartEnd"
        />
        <YAxis
          domain={['auto', 'auto']}
          tick={{ fontSize: 11, fontFamily: 'Inter' }}
          stroke="#7A7568"
        />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: '1px solid rgba(44,51,32,0.1)',
            fontSize: 13,
            fontFamily: 'Hind Siliguri',
          }}
          formatter={(val) => [`${val} kg`, 'ওজন']}
        />
        {targetKg && (
          <ReferenceLine
            y={targetKg}
            stroke="#E8B647"
            strokeDasharray="4 4"
            label={{
              value: 'লক্ষ্য',
              position: 'right',
              fontSize: 11,
              fontFamily: 'Hind Siliguri',
              fill: '#E8B647',
            }}
          />
        )}
        <Line
          type="monotone"
          dataKey="kg"
          stroke="#5B7F3F"
          strokeWidth={2}
          dot={{ r: 3, fill: '#5B7F3F' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
