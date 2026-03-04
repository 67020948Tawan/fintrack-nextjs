export default function SummaryCards({ totalIncome, totalExpense, balance }: any) {
  return (
    <div className="space-y-6">
      {/* บัตรหลัก: ยอดคงเหลือ (Mesh Gradient) */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-200 transition-transform hover:scale-[1.02]">
        {/* แสงฟุ้งด้านหลังบัตร */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <p className="text-indigo-100 text-xs font-bold tracking-[0.2em] uppercase opacity-80">ยอดเงินคงเหลือ</p>
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">Active</span>
          </div>
          <h2 className="text-4xl font-extrabold mt-3 tracking-tight">
            ฿{balance.toLocaleString()}
          </h2>
          <div className="mt-10 flex justify-between items-end">
            <div className="text-[10px] text-indigo-200 font-mono tracking-widest uppercase opacity-60">**** **** **** 2026</div>
            <div className="text-xl font-black italic tracking-tighter opacity-40">FINTRACK</div>
          </div>
        </div>
      </div>

      {/* รายรับ-รายจ่าย (Soft Cards) */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-2">
          <div className="w-9 h-9 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center text-sm font-bold shadow-inner">↓</div>
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">รายรับ</p>
            <p className="text-emerald-600 text-xl font-black">+฿{totalIncome.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-2">
          <div className="w-9 h-9 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center text-sm font-bold shadow-inner">↑</div>
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">รายจ่าย</p>
            <p className="text-rose-600 text-xl font-black">-฿{totalExpense.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}