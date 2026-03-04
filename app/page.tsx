'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Transaction } from '../types';
import SummaryCards from '../components/SummaryCards';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import BudgetTracker from '../components/BudgetTracker';

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budget, setBudget] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedTransactions = localStorage.getItem('my-transactions');
    const savedBudget = localStorage.getItem('my-budget');
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    if (savedBudget) setBudget(Number(savedBudget));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) localStorage.setItem('my-transactions', JSON.stringify(transactions));
  }, [transactions, isLoaded]);

  useEffect(() => {
    if (isLoaded) localStorage.setItem('my-budget', budget.toString());
  }, [budget, isLoaded]);

  const handleAddTransaction = (newTransaction: Transaction) => {
    setTransactions([newTransaction, ...transactions]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  if (!isLoaded) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-indigo-600 animate-pulse">
      กำลังโหลดข้อมูล...
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* Header - ปรับให้กว้างขึ้นบน PC */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black shadow-lg shadow-indigo-200">F</div>
            <h1 className="text-xl font-black tracking-tighter text-slate-800">FinTrack</h1>
          </div>
          <Link href="/report" className="group flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-2xl text-xs font-bold hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200">
            <span>ดูรายงานสรุป</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </header>

      {/* Main Content - หัวใจของการทำ Responsive */}
      <main className="max-w-5xl mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* คอลัมน์ซ้าย (4/12 ส่วนบน PC): ยอดรวมและงบประมาณ */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <section className="space-y-2">
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest ml-2">สถานะการเงิน</h2>
              <SummaryCards totalIncome={totalIncome} totalExpense={totalExpense} balance={balance} />
            </section>
            
            <section className="space-y-2">
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest ml-2">เป้าหมายงบประมาณ</h2>
              <BudgetTracker totalExpense={totalExpense} budget={budget} onSetBudget={setBudget} />
            </section>
          </div>

          {/* คอลัมน์ขวา (7/12 ส่วนบน PC): ฟอร์มและประวัติรายการ */}
          <div className="lg:col-span-7 space-y-8">
            <section className="space-y-4">
              <div className="flex items-center gap-3 ml-2">
                <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
                <h2 className="text-lg font-black text-slate-800">เพิ่มรายการบันทึก</h2>
              </div>
              <TransactionForm onAdd={handleAddTransaction} />
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 ml-2">
                <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
                <h2 className="text-lg font-black text-slate-800">กิจกรรมล่าสุด</h2>
              </div>
              <TransactionList transactions={transactions} onDelete={handleDeleteTransaction} />
            </section>
          </div>

        </div>
      </main>
    </div>
  );
}