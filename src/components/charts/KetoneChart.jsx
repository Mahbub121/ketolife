import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function KetoneChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12, fontFamily: 'Hind Siliguri' }}
          stroke="#7A7568"
        />
        <YAxis
          domain={[0, 'auto']}
          tick={{ fontSize: 12, fontFamily: 'Inter' }}
          stroke="#7A7568"
        />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: '1px solid rgba(44,51,32,0.1)',
            fontSize: 13,
            fontFamily: 'Hind Siliguri',
          }}
          formatter={(val) => [`${val} mmol/L`, 'কিটোন']}
        />
        <Line
          type="monotone"
          dataKey="mmol"
          stroke="#5B7F3F"
          strokeWidth={2}
          dot={{ r: 4, fill: '#5B7F3F' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
