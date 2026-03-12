'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Transaction } from '../types';

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export default function TransactionList({ transactions, onDelete }: Props) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  // States สำหรับเก็บค่าการค้นหาและตัวกรอง
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all'); // 🔑 ตัวกรองหมวดหมู่ใหม่

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedImage]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  // 🔑 ดึงรายชื่อหมวดหมู่ทั้งหมดที่มีในรายการ (แบบไม่ซ้ำกัน) มาทำเป็นตัวเลือก
  const uniqueCategories = Array.from(new Set(transactions.map(t => t.category)));

  // กรองข้อมูลตามคำค้นหา, ประเภท และ หมวดหมู่!
  const filteredTransactions = transactions.filter(t => {
    const matchSearch = t.category.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (t.note && t.note.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchType = filterType === 'all' ? true : t.type === filterType;
    const matchCategory = filterCategory === 'all' ? true : t.category === filterCategory;
    
    return matchSearch && matchType && matchCategory;
  });

  return (
    <>
      {/* --- ส่วน UI ค้นหาและกรองข้อมูล --- */}
      <div className="mb-6 space-y-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
        
        {/* ช่องค้นหา */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          <input 
            type="text" 
            placeholder="ค้นหาจากบันทึกเพิ่มเติม..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border-2 border-transparent focus:border-indigo-300 rounded-xl outline-none transition-all shadow-sm text-sm font-medium"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* ปุ่มกรองประเภท (รายรับ/รายจ่าย) */}
          <div className="flex gap-2 flex-1">
            <button 
              onClick={() => setFilterType('all')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${filterType === 'all' ? 'bg-slate-700 text-white shadow-md' : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'}`}
            >
              ทั้งหมด
            </button>
            <button 
              onClick={() => setFilterType('income')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${filterType === 'income' ? 'bg-emerald-500 text-white shadow-md' : 'bg-white text-slate-500 hover:bg-emerald-50 border border-slate-200'}`}
            >
              รายรับ
            </button>
            <button 
              onClick={() => setFilterType('expense')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${filterType === 'expense' ? 'bg-rose-500 text-white shadow-md' : 'bg-white text-slate-500 hover:bg-rose-50 border border-slate-200'}`}
            >
              รายจ่าย
            </button>
          </div>

          {/* 🔑 เมนูเลือกกรองตามหมวดหมู่ */}
          <div className="flex-1 relative">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full appearance-none py-2 px-4 pr-10 bg-white border border-slate-200 focus:border-indigo-400 rounded-xl outline-none text-sm font-bold text-slate-600 shadow-sm cursor-pointer transition-all"
            >
              <option value="all">📂 ดูทุกหมวดหมู่</option>
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>📌 {cat}</option>
              ))}
            </select>
            {/* ไอคอนลูกศรชี้ลงสำหรับ Select */}
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs">▼</span>
          </div>
        </div>
      </div>

      {/* --- ส่วนแสดงรายการที่ผ่านการกรองแล้ว --- */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 pb-4 scrollbar-thin scrollbar-thumb-slate-200">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-10 flex flex-col items-center">
            <div className="text-4xl mb-3 opacity-50">📭</div>
            <div className="text-slate-400 font-bold">ไม่พบรายการที่คุณค้นหา</div>
            <button 
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
                setFilterCategory('all');
              }}
              className="mt-3 text-xs font-bold text-indigo-500 hover:text-indigo-600 underline"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          </div>
        ) : (
          filteredTransactions.map((t) => (
            <div 
              key={t.id} 
              className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-inner shrink-0 ${
                  t.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                }`}>
                  {t.type === 'income' ? '💰' : '💸'}
                </div>
                
                <div>
                  <h3 className="font-bold text-slate-800">{t.category}</h3>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">
                    {formatDate(t.date)} {t.note ? <span className="text-slate-400 italic"> • {t.note}</span> : ''}
                  </p>
                  
                  {t.imageUrl && (
                    <button 
                      onClick={() => setSelectedImage(t.imageUrl || null)}
                      className="mt-2 flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                    >
                      <span>📸</span> ดูสลิป
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className={`font-black whitespace-nowrap ${t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {t.type === 'income' ? '+' : '-'}฿{t.amount.toLocaleString()}
                </span>
                
                <button 
                  onClick={() => onDelete(t.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-rose-100 hover:text-rose-500 transition-all shrink-0"
                  title="ลบรายการ"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- Popup รูปสลิปเต็มจอ --- */}
      {mounted && selectedImage && createPortal(
        <div 
          className="fixed inset-0 z-[9999] w-screen h-screen flex items-center justify-center bg-black/95 backdrop-blur-md p-0 animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white rounded-full flex items-center justify-center font-black text-xl transition-all z-[10000]"
          >
            ✕
          </button>
          <img 
            src={selectedImage} 
            alt="Slip Fullscreen" 
            className="w-full h-full object-contain animate-[scaleIn_0.2s_ease-out] select-none"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>,
        document.body
      )}
    </>
  );
}