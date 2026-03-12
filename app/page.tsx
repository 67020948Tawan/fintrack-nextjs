'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Transaction } from '../types';
import SummaryCards from '../components/SummaryCards';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import BudgetTracker from '../components/BudgetTracker';

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budget, setBudget] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(''); 
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = document.cookie.includes("isLoggedIn=true");
    const userCookie = document.cookie.split('; ').find(row => row.startsWith('currentUser='));
    const username = userCookie ? userCookie.split('=')[1] : null;
    
    if (!isLoggedIn || !username) {
      router.push("/login");
      return;
    }
    
    setIsAuthenticated(true);
    setCurrentUser(username);

    const savedTransactions = localStorage.getItem(`transactions-${username}`);
    const savedBudget = localStorage.getItem(`budget-${username}`);
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    if (savedBudget) setBudget(Number(savedBudget));
    setIsLoaded(true);
  }, [router]);

  const handleLogout = () => {
    document.cookie = "isLoggedIn=; Max-Age=0; path=/";
    document.cookie = "currentUser=; Max-Age=0; path=/";
    router.push("/login");
  };

  useEffect(() => {
    if (isLoaded && currentUser) {
      localStorage.setItem(`transactions-${currentUser}`, JSON.stringify(transactions));
    }
  }, [transactions, isLoaded, currentUser]);

  useEffect(() => {
    if (isLoaded && currentUser) {
      localStorage.setItem(`budget-${currentUser}`, budget.toString());
    }
  }, [budget, isLoaded, currentUser]);

  const handleAddTransaction = async (newTransaction: Transaction) => {
    setTransactions([newTransaction, ...transactions]);
    const confetti = (await import('canvas-confetti')).default;

    if (newTransaction.type === 'income') {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#10B981', '#F59E0B', '#34D399'] });
    } else {
      confetti({ particleCount: 100, spread: 120, origin: { y: 0.7 }, colors: ['#EF4444', '#F97316', '#FCA5A5'], startVelocity: 30, gravity: 1.2 });
    }
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  if (!isLoaded || !isAuthenticated) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
      <img src="https://api.dicebear.com/7.x/fun-emoji/svg?seed=loading&backgroundColor=transparent" className="w-24 h-24 animate-bounce mb-4" alt="Loading" />
      <p className="font-bold text-indigo-600 animate-pulse">กำลังเตรียมบัญชีของคุณ...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-indigo-400/10 blur-[150px]"></div>
      </div>

      <div className="relative z-10">
        <header className="bg-white/70 backdrop-blur-xl border-b border-white shadow-sm sticky top-0 z-30 transition-all">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${currentUser}&backgroundColor=b6e3f4`} alt="Avatar" className="w-12 h-12 rounded-full border-2 border-white shadow-md" />
              <div>
                <h1 className="text-xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 leading-none">FinTrack</h1>
                <p className="text-xs font-bold text-slate-500 mt-0.5">ยินดีต้อนรับ, <span className="text-indigo-600 capitalize">{currentUser}</span>!</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/report" className="group flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-2.5 rounded-2xl text-sm font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all">
                <span>ดูรายงานสรุป</span>
                <span className="group-hover:translate-x-1 transition-transform">✨</span>
              </Link>
              <button onClick={handleLogout} className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors bg-white/50 px-3 py-2 rounded-xl">ออกจากระบบ</button>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* คอลัมน์ซ้าย: สรุปยอดเงิน */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
              <section className="bg-white/80 backdrop-blur-md p-6 rounded-[2rem] shadow-sm border border-white hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-xl">💰</div>
                  <h2 className="text-sm font-black text-slate-600 uppercase tracking-widest">สถานะการเงิน</h2>
                </div>
                <SummaryCards totalIncome={totalIncome} totalExpense={totalExpense} balance={balance} />
              </section>
              
              <section className="bg-white/80 backdrop-blur-md p-6 rounded-[2rem] shadow-sm border border-white hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-xl">🎯</div>
                  <h2 className="text-sm font-black text-slate-600 uppercase tracking-widest">เป้าหมายงบประมาณ</h2>
                </div>
                <BudgetTracker totalExpense={totalExpense} budget={budget} onSetBudget={setBudget} />
              </section>
            </div>

            {/* คอลัมน์ขวา: ฟอร์มแยก รายรับ/รายจ่าย */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* --- แยกฟอร์ม --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ฝั่งเพิ่มรายรับ */}
                <section className="bg-emerald-50/60 backdrop-blur-md p-6 rounded-[2rem] border-2 border-emerald-100/50 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-200">
                       <span className="text-white text-xl font-black">+</span>
                    </div>
                    <h2 className="text-lg font-black text-emerald-800">เพิ่มรายรับ</h2>
                  </div>
                  {/* ส่ง forcedType เป็น income */}
                  <TransactionForm onAdd={handleAddTransaction} forcedType="income" />
                </section>

                {/* ฝั่งเพิ่มรายจ่าย */}
                <section className="bg-rose-50/60 backdrop-blur-md p-6 rounded-[2rem] border-2 border-rose-100/50 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full flex items-center justify-center shadow-lg shadow-rose-200">
                       <span className="text-white text-xl font-black">-</span>
                    </div>
                    <h2 className="text-lg font-black text-rose-800">เพิ่มรายจ่าย</h2>
                  </div>
                  {/* ส่ง forcedType เป็น expense */}
                  <TransactionForm onAdd={handleAddTransaction} forcedType="expense" />
                </section>
              </div>

              {/* กิจกรรมล่าสุด */}
              <section className="bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-[2rem] shadow-sm border border-white hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">📝</div>
                    <h2 className="text-xl font-black text-slate-800">ประวัติรายการ</h2>
                  </div>
                  <span className="bg-indigo-100 text-indigo-600 text-xs font-bold px-3 py-1 rounded-full">
                    {transactions.length} รายการ
                  </span>
                </div>
                
                {transactions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 opacity-70">
                    <img src="https://api.dicebear.com/7.x/fun-emoji/svg?seed=sleep&backgroundColor=transparent" className="w-32 h-32 mb-4" alt="Empty" />
                    <p className="text-slate-500 font-bold">ยังไม่มีรายการเลย ลองเริ่มบันทึกดูสิ!</p>
                  </div>
                ) : (
                  <TransactionList transactions={transactions} onDelete={handleDeleteTransaction} />
                )}
              </section>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}