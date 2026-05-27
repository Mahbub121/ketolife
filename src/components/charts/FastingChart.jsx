import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function FastingChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <XAxis
          dataKey="day"
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
          formatter={(val) => [`${val} ঘন্টা`, 'ফাস্টিং']}
        />
        <Bar dataKey="hours" fill="#5B7F3F" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
