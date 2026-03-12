'use client';

import { useState, useEffect } from 'react';
import { Transaction } from '../types';

interface Props {
  onAdd: (transaction: Transaction) => void;
  forcedType?: 'income' | 'expense';
}

const incomeCategories = ['เงินเดือน', 'โบนัส', 'ค้าขาย', 'เงินลงทุน', 'อื่นๆ'];
const expenseCategories = ['อาหาร', 'เดินทาง', 'ช้อปปิ้ง', 'บันเทิง', 'บิล/ค่าเช่า', 'สุขภาพ', 'อื่นๆ'];

export default function TransactionForm({ onAdd, forcedType }: Props) {
  const [type, setType] = useState<'income' | 'expense'>(forcedType || 'expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null); // สำหรับเก็บรูปสลิป

  const currentCategories = type === 'income' ? incomeCategories : expenseCategories;

  useEffect(() => {
    if (!currentCategories.includes(category)) {
      setCategory(currentCategories[0]);
    }
  }, [type, currentCategories, category]);

  // ฟังก์ชันจัดการเมื่อเลือกรูปภาพ
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // ป้องกันการอัปโหลดไฟล์ที่ใหญ่เกินไป (เกิน 1.5MB) เพราะ LocalStorage มีพื้นที่จำกัด
      if (file.size > 1.5 * 1024 * 1024) {
        alert('รูปภาพใหญ่เกินไปครับ! กรุณาใช้รูปขนาดไม่เกิน 1.5MB');
        e.target.value = ''; // เคลียร์ไฟล์ทิ้ง
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string); // แปลงรูปเป็น Base64
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert('กรุณากรอกจำนวนเงินให้ถูกต้อง');
      return;
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type,
      amount: Number(amount),
      category: category || currentCategories[0],
      date: new Date().toISOString(),
      note,
      imageUrl: imagePreview || undefined, // บันทึกรูปเข้าไปด้วย (ถ้ามี)
    };

    onAdd(newTransaction);
    
    // เคลียร์ฟอร์ม
    setAmount('');
    setNote('');
    setImagePreview(null);
  };

  const isIncome = type === 'income';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!forcedType && (
        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-4">
          <button
            type="button"
            onClick={() => setType('income')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              type === 'income' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'
            }`}
          >
            รายรับ
          </button>
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              type === 'expense' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'
            }`}
          >
            รายจ่าย
          </button>
        </div>
      )}

      <div>
        <label className="text-xs font-black text-slate-400 uppercase ml-1">จำนวนเงิน (บาท)</label>
        <input
          type="number" // กลับมาใช้ number ธรรมดา
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className={`w-full p-3 mt-1 bg-white border-2 rounded-xl outline-none transition-all ${
            isIncome ? 'focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10' : 'focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10'
          } border-transparent shadow-sm`}
          required
        />
      </div>

      <div>
        <label className="text-xs font-black text-slate-400 uppercase ml-1">หมวดหมู่</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`w-full p-3 mt-1 bg-white border-2 rounded-xl outline-none transition-all ${
            isIncome ? 'focus:border-emerald-500' : 'focus:border-rose-500'
          } border-transparent shadow-sm`}
        >
          {currentCategories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-black text-slate-400 uppercase ml-1">บันทึกเพิ่มเติม</label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={isIncome ? "เช่น เงินเดือนงวดแรก..." : "เช่น ค่าเน็ตบ้าน..."}
          className={`w-full p-3 mt-1 bg-white border-2 rounded-xl outline-none transition-all ${
            isIncome ? 'focus:border-emerald-500' : 'focus:border-rose-500'
          } border-transparent shadow-sm`}
        />
      </div>

      {/* --- ส่วนอัปโหลดรูปสลิป --- */}
      <div>
        <label className="text-xs font-black text-slate-400 uppercase ml-1">แนบรูปสลิป / ใบเสร็จ (ไม่บังคับ)</label>
        <div className="mt-1 flex items-center gap-4">
          <label className={`cursor-pointer px-4 py-2 border-2 border-dashed rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all flex-1 text-center ${
            isIncome ? 'hover:border-emerald-400' : 'hover:border-rose-400'
          }`}>
            <span>📸 เลือกรูปภาพ</span>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageChange} 
            />
          </label>
          
          {/* แสดงรูปตัวอย่างก่อนกดบันทึก */}
          {imagePreview && (
            <div className="relative w-12 h-12 shrink-0">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg border shadow-sm" />
              <button 
                type="button" 
                onClick={() => setImagePreview(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center hover:bg-red-600 shadow"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        className={`w-full py-3.5 mt-2 text-white font-black rounded-xl shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 ${
          isIncome 
            ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 hover:shadow-emerald-200 shadow-emerald-500/30' 
            : 'bg-gradient-to-r from-rose-500 to-rose-400 hover:shadow-rose-200 shadow-rose-500/30'
        }`}
      >
        {isIncome ? 'บันทึกรายรับ' : 'บันทึกรายจ่าย'}
      </button>
    </form>
  );
}