// ไฟล์: components/BudgetTracker.tsx

'use client';
import { useState } from 'react';

export default function BudgetTracker({
  totalExpense,
  budget,
  onSetBudget
}: {
  totalExpense: number;
  budget: number;
  onSetBudget: (b: number) => void;
}) {
  // สร้าง State เพื่อเช็คว่ากำลังกดพิมพ์แก้ไขงบอยู่หรือไม่
  const [isEditing, setIsEditing] = useState(false);
  const [inputBudget, setInputBudget] = useState(budget.toString());

  const handleSave = () => {
    onSetBudget(parseFloat(inputBudget) || 0);
    setIsEditing(false); // บันทึกเสร็จก็ปิดโหมดแก้ไข
  };

  // คำนวณเปอร์เซ็นต์ว่าใช้เงินไปกี่ % ของงบแล้ว (ห้ามเกิน 100%)
  const percent = budget > 0 ? Math.min((totalExpense / budget) * 100, 100) : 0;
  
  // กำหนดสีของหลอดตามเปอร์เซ็นต์
  let progressColor = 'bg-green-500';
  if (percent > 80) progressColor = 'bg-red-500'; // ใช้ไปเกิน 80% สีแดง
  else if (percent > 50) progressColor = 'bg-yellow-500'; // ใช้ไปเกิน 50% สีเหลือง

  return (
    <div className="border p-4 rounded-lg shadow-sm mb-6 bg-white">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold text-gray-800">🎯 งบประมาณรายจ่าย</h2>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="text-sm text-blue-600 hover:underline">
            แก้ไขงบ
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="flex gap-2 mb-2">
          <input
            type="number"
            value={inputBudget}
            onChange={(e) => setInputBudget(e.target.value)}
            className="border rounded p-1 w-full text-black"
            placeholder="ตั้งงบประมาณ (บาท)"
          />
          <button onClick={handleSave} className="bg-blue-600 text-white px-3 py-1 rounded font-bold">
            ตกลง
          </button>
        </div>
      ) : (
        <div className="mb-2">
          <p className="text-sm text-gray-600">
            ใช้ไปแล้ว: <span className="font-bold">฿{totalExpense.toLocaleString()}</span> / ฿{budget.toLocaleString()}
          </p>
        </div>
      )}

      {/* หลอด Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
        <div 
          className={`h-2.5 rounded-full transition-all duration-500 ${progressColor}`} 
          style={{ width: `${percent}%` }}
        ></div>
      </div>
      
      {/* แจ้งเตือนเมื่อเกินงบ */}
      {percent >= 100 && (
        <p className="text-xs text-red-600 mt-2 font-bold animate-pulse">
          ⚠️ แจ้งเตือน: คุณใช้เงินเกินงบประมาณที่ตั้งไว้แล้ว!
        </p>
      )}
    </div>
  );
}