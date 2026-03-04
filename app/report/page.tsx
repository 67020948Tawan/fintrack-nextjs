'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Transaction } from '../../types';
import ExpenseChart from '../../components/ExpenseChart';

export default function ReportPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('my-transactions');
    if (saved) {
      setTransactions(JSON.parse(saved));
    }
    setIsLoaded(true);
  }, []);

  if (!isLoaded) return <div className="p-8 text-center text-gray-500">กำลังโหลดรายงาน...</div>;

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
            ← กลับหน้าหลัก
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">รายงานสรุปผล</h1>
        </div>
      </div>

      <div className="mb-6">
        <ExpenseChart transactions={transactions} />
      </div>

      <div className="bg-blue-50 border border-blue-100 text-blue-800 p-4 rounded-lg text-center shadow-sm">
        <p className="font-bold">📊 สรุปข้อมูล</p>
        <p className="text-sm mt-1">ข้อมูลถูกดึงมาจากบันทึกในเครื่องของคุณเรียบร้อยแล้ว</p>
      </div>
    </main>
  );
}