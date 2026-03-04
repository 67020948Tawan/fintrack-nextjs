'use client';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Transaction } from '../types';

export default function ExpenseChart({ transactions }: { transactions: Transaction[] }) {
  // 1. ดึงมาเฉพาะ "รายจ่าย"
  const expenses = transactions.filter(t => t.type === 'expense');

  // 2. นำรายจ่ายมารวมยอดตามหมวดหมู่
  const dataMap = expenses.reduce((acc, curr) => {
    if (!acc[curr.category]) {
      acc[curr.category] = 0;
    }
    acc[curr.category] += curr.amount;
    return acc;
  }, {} as Record<string, number>);

  // 3. แปลงข้อมูลให้อยู่ในรูปแบบที่ Recharts ต้องการ: [{ name: 'อาหาร', value: 500 }, ...]
  const data = Object.keys(dataMap).map(key => ({
    name: key,
    value: dataMap[key]
  }));

  // กำหนดสีให้แต่ละหมวดหมู่
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  // ถ้าไม่มีรายจ่ายเลย ไม่ต้องแสดงกราฟ
  if (data.length === 0) {
    return (
      <div className="border p-4 rounded-lg shadow-sm mb-6 bg-white text-center text-gray-500 py-8">
        ยังไม่มีข้อมูลรายจ่ายสำหรับสร้างกราฟ
      </div>
    );
  }

  return (
    <div className="border p-4 rounded-lg shadow-sm mb-6 bg-white">
      <h2 className="text-center font-bold mb-4">สัดส่วนรายจ่ายตามหมวดหมู่</h2>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: any) => `฿${Number(value).toLocaleString()}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}