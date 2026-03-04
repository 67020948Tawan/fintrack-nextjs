'use client';

import { useState } from 'react';
import { Transaction } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export default function TransactionList({ transactions, onDelete }: TransactionListProps) {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  // กรองข้อมูลตาม Tab ที่เลือก
  const filtered = transactions.filter((t) => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  return (
    <div className="space-y-5">
      {/* 1. ตัวกรองข้อมูล (Filter Tabs) - สไตล์ Pill Button */}
      <div className="flex bg-slate-200/50 p-1.5 rounded-2xl backdrop-blur-sm">
        {(['all', 'income', 'expense'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all uppercase tracking-widest ${
              filter === f 
                ? 'bg-white text-indigo-600 shadow-md' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {f === 'all' ? 'ทั้งหมด' : f === 'income' ? 'รายรับ' : 'รายจ่าย'}
          </button>
        ))}
      </div>

      {/* 2. รายการกิจกรรม (Transaction Items) */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
            <p className="text-slate-400 text-sm font-medium">ไม่มีรายการบันทึกในหมวดนี้</p>
          </div>
        ) : (
          filtered.map((t) => (
            <div 
              key={t.id} 
              className="group bg-white p-5 rounded-[2rem] flex justify-between items-center shadow-sm border border-transparent hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50/40 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                {/* ไอคอนแสดงประเภท */}
                <div className={`w-12 h-12 rounded-[1.2rem] flex items-center justify-center text-xl shadow-inner ${
                  t.type === 'income' 
                    ? 'bg-emerald-50 text-emerald-500' 
                    : 'bg-rose-50 text-rose-500'
                }`}>
                  {t.type === 'income' ? '💰' : '🛍️'}
                </div>

                {/* รายละเอียดรายการ */}
                <div>
                  <p className="font-bold text-slate-800 text-base leading-tight">
                    {t.title}
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em] mt-1.5 bg-slate-50 px-2 py-0.5 rounded-md inline-block">
                    {t.category}
                  </p>
                </div>
              </div>

              {/* จำนวนเงินและปุ่มลบ */}
              <div className="text-right flex flex-col items-end">
                <p className={`text-lg font-black tracking-tight ${
                  t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'
                }`}>
                  {t.type === 'income' ? '+' : '-'}฿{t.amount.toLocaleString()}
                </p>
                <button 
                  onClick={() => onDelete(t.id)} 
                  className="text-[9px] font-black text-slate-300 hover:text-rose-500 uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-all duration-200"
                >
                  ลบรายการ
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}