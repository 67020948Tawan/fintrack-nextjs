'use client';
import { useState } from 'react';
import { Transaction } from '../types';

export default function TransactionForm({ onAdd }: { onAdd: (t: Transaction) => void }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('อาหาร');

  const categories = ['อาหาร', 'เดินทาง', 'ช้อปปิ้ง', 'บันเทิง', 'เงินเดือน', 'อื่นๆ'];

  const calculateAmount = (value: string) => {
    try {
      const sanitized = value.replace(/[^0-9+\-*/.]/g, '');
      if (!sanitized) return '';
      const result = new Function(`return ${sanitized}`)();
      return result.toString();
    } catch (error) {
      return value;
    }
  };

  const handleBlur = () => {
    setAmount(calculateAmount(amount));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = calculateAmount(amount);
    const parsedAmount = parseFloat(finalAmount);

    if (!title || isNaN(parsedAmount) || parsedAmount <= 0) return;

    const newTransaction: Transaction = {
      id: Math.random().toString(),
      title,
      amount: parsedAmount,
      type,
      category,
    };

    onAdd(newTransaction);
    setTitle('');
    setAmount('');
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-wider">ชื่อรายการ</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-300 outline-none"
            placeholder="จ่ายค่าอะไรดี?"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-wider">จำนวนเงิน</label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onBlur={handleBlur}
              className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              placeholder="0.00 หรือ 100+50"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-wider">ประเภท</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'income' | 'expense')}
              className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all outline-none appearance-none cursor-pointer"
            >
              <option value="expense">รายจ่าย</option>
              <option value="income">รายรับ</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-wider">หมวดหมู่</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all outline-none appearance-none cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl py-4 font-bold shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]">
          บันทึกรายการ
        </button>
      </form>
    </div>
  );
}