'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { ChevronLeft, PieChart as PieIcon, BarChart3, Calendar, AlertCircle } from 'lucide-react';

// ประกาศ Type ไว้ตรงนี้เลยเพื่อตัดปัญหาหาไฟล์ไม่เจอ
export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date?: string; // ใส่ ? เผื่อข้อมูลเก่าไม่มีวันที่
  note?: string;
}

const formatMonthThai = (monthStr: string) => {
  if (!monthStr) return '';
  const [year, month] = monthStr.split('-');
  const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  return `${thaiMonths[parseInt(month) - 1]} ${year}`;
};

// ฟังก์ชันตัวช่วย: ถ้าไม่มีวันที่ ให้ใช้วันที่ปัจจุบันแทน
const getSafeDate = (date?: string) => {
  return date ? date : new Date().toISOString();
};

export default function ReportPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  
  const [selectedMonth, setSelectedMonth] = useState('');
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);

  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = document.cookie.includes("isLoggedIn=true");
    const userCookie = document.cookie.split('; ').find(row => row.startsWith('currentUser='));
    const username = userCookie ? userCookie.split('=')[1] : null;

    if (!isLoggedIn || !username) {
      router.push("/login");
      return;
    }

    setCurrentUser(username);
    const savedTransactions = localStorage.getItem(`transactions-${username}`);
    
    if (savedTransactions) {
      const parsedTransactions: Transaction[] = JSON.parse(savedTransactions);
      setTransactions(parsedTransactions);

      // ใช้ getSafeDate เพื่อป้องกัน Error ตอนดึง substring
      const months = Array.from(new Set(parsedTransactions.map(t => getSafeDate(t.date).substring(0, 7)))).sort().reverse();
      setAvailableMonths(months);
      
      if (months.length > 0) {
        setSelectedMonth(months[0]);
      } else {
        setSelectedMonth(new Date().toISOString().substring(0, 7));
      }
    } else {
      setSelectedMonth(new Date().toISOString().substring(0, 7));
    }
    
    setIsLoaded(true);
  }, [router]);

  // ใช้ getSafeDate ในการดึงข้อมูลมาทำกราฟ
  const currentMonthTransactions = transactions.filter(t => getSafeDate(t.date).startsWith(selectedMonth));
  const incomeTransactions = currentMonthTransactions.filter(t => t.type === 'income');
  const expenseTransactions = currentMonthTransactions.filter(t => t.type === 'expense');

  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const barData = [
    { name: 'รายรับ', amount: totalIncome, fill: '#10B981' },
    { name: 'รายจ่าย', amount: totalExpense, fill: '#EF4444' },
  ];

  const categoryData = expenseTransactions.reduce((acc: any[], t) => {
    const existing = acc.find(item => item.name === t.category);
    if (existing) {
      existing.value += t.amount;
    } else {
      acc.push({ name: t.category, value: t.amount });
    }
    return acc;
  }, []);

  const COLORS = ['#F472B6', '#fb923c', '#818cf8', '#c084fc', '#4ade80', '#2dd4bf'];

  const historicalData = availableMonths.slice(0, 6).reverse().map(monthStr => {
    const tx = transactions.filter(t => getSafeDate(t.date).startsWith(monthStr));
    const inc = tx.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const exp = tx.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    return {
      name: formatMonthThai(monthStr),
      รายรับ: inc,
      รายจ่าย: exp,
    };
  });

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-indigo-50/50 pb-20 font-sans relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl -z-10"></div>

      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ChevronLeft className="w-6 h-6 text-slate-600" />
            </Link>
            <h1 className="text-xl font-black text-slate-800">รายงานการเงิน 📊</h1>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-2xl border border-slate-200">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer"
            >
              {availableMonths.length === 0 && <option value={selectedMonth}>{formatMonthThai(selectedMonth)}</option>}
              {availableMonths.map(month => (
                <option key={month} value={month}>{formatMonthThai(month)}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 mt-8 space-y-8">
        
        <div className={`p-6 rounded-[2rem] border-2 border-white shadow-xl flex flex-col md:flex-row items-center gap-6 ${balance >= 0 ? 'bg-emerald-500' : 'bg-rose-500'} text-white`}>
          <img 
            src={`https://api.dicebear.com/7.x/fun-emoji/svg?seed=${balance >= 0 ? 'happy' : 'sad'}&backgroundColor=transparent`} 
            className="w-20 h-20 animate-bounce" 
            alt="Mascot"
          />
          <div className="text-center md:text-left w-full">
            <h2 className="text-2xl font-black">
              {balance >= 0 ? 'สุดยอดไปเลย!' : 'ต้องระวังหน่อยนะ!'}
            </h2>
            <p className="font-medium opacity-90 mt-1">
              {balance >= 0 
                ? `เดือน ${formatMonthThai(selectedMonth)} คุณมีเงินเก็บเหลือถึง ฿${balance.toLocaleString()}` 
                : `เดือน ${formatMonthThai(selectedMonth)} รายจ่ายมากกว่ารายรับอยู่ ฿${Math.abs(balance).toLocaleString()}`}
            </p>
          </div>
          <div className="bg-white/20 p-4 rounded-2xl w-full md:w-auto text-center shrink-0">
            <p className="text-xs uppercase tracking-widest font-bold opacity-80 mb-1">ยอดสุทธิเดือนนี้</p>
            <p className="text-2xl font-black">฿{balance.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] shadow-sm border border-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-pink-100 rounded-xl"><PieIcon className="w-5 h-5 text-pink-600" /></div>
              <h3 className="font-black text-slate-800 uppercase tracking-tight">รายจ่ายเดือนนี้</h3>
            </div>
            
            <div className="h-[300px] w-full">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                    <Legend verticalAlign="bottom" />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                   <AlertCircle className="w-12 h-12 mb-2 opacity-20" />
                   <p className="font-bold">ไม่มีข้อมูลรายจ่ายในเดือนนี้</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] shadow-sm border border-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-100 rounded-xl"><BarChart3 className="w-5 h-5 text-indigo-600" /></div>
              <h3 className="font-black text-slate-800 uppercase tracking-tight">รับ VS จ่าย (เดือนนี้)</h3>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontWeight: 'bold'}} />
                  <YAxis hide />
                  <RechartsTooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="amount" radius={[15, 15, 15, 15]} barSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {historicalData.length > 0 && (
          <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] shadow-sm border border-white mt-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-xl"><BarChart3 className="w-5 h-5 text-purple-600" /></div>
              <h3 className="font-black text-slate-800 uppercase tracking-tight">สรุปภาพรวมย้อนหลัง (สูงสุด 6 เดือน)</h3>
            </div>

            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={historicalData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontWeight: 'bold'}} />
                  <YAxis tickFormatter={(value) => `฿${value}`} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                  <Legend />
                  <Bar dataKey="รายรับ" fill="#10B981" radius={[8, 8, 0, 0]} barSize={40} />
                  <Bar dataKey="รายจ่าย" fill="#EF4444" radius={[8, 8, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}