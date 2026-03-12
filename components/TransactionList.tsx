'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // 🔑 นำเข้าคาถาวาร์ปทะลุกรอบ
import { Transaction } from '../types';

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export default function TransactionList({ transactions, onDelete }: Props) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // เช็คว่าโหลดหน้าเว็บเสร็จหรือยัง เพื่อให้ใช้ createPortal ได้อย่างปลอดภัย
  useEffect(() => {
    setMounted(true);
  }, []);

  // ล็อคไม่ให้หน้าจอข้างหลังเลื่อนได้ ตอนที่เปิดรูปดูอยู่
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
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <div className="space-y-3">
        {transactions.map((t) => (
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
                <h3 className="font-bold text-slate-800">
                  {t.category}
                </h3>
                <p className="text-xs font-medium text-slate-500 mt-0.5">
                  {formatDate(t.date)} {t.note ? <span className="text-slate-400 italic"> • {t.note}</span> : ''}
                </p>
                
                {t.imageUrl && (
                  <button 
                    onClick={() => setSelectedImage(t.imageUrl || null)}
                    className="mt-2 flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                  >
                    <span>📸</span> 
                    <span>ดูสลิปโอนเงิน</span>
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
        ))}
      </div>

      {/* --- ระบบ Modal เต็มจอที่แท้จริง (วาร์ปไปติดที่ <body> โดยตรง) --- */}
      {mounted && selectedImage && createPortal(
        <div 
          className="fixed inset-0 z-[9999] w-screen h-screen flex items-center justify-center bg-black/95 backdrop-blur-md p-0 animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setSelectedImage(null)}
        >
          {/* ปุ่มปิด */}
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white rounded-full flex items-center justify-center font-black text-xl transition-all z-[10000]"
            title="ปิดรูปภาพ"
          >
            ✕
          </button>
          
          {/* รูปภาพขยายเต็มจอแบบ 100% */}
          <img 
            src={selectedImage} 
            alt="Slip Fullscreen" 
            className="w-full h-full object-contain animate-[scaleIn_0.2s_ease-out] select-none"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>,
        document.body // 🔑 ส่งไปโผล่ที่ชั้นนอกสุดของเบราว์เซอร์
      )}
    </>
  );
}