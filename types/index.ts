// ไฟล์: types/index.ts
// กำหนดหน้าตาของข้อมูลรายรับรายจ่าย เพื่อให้ทุกไฟล์ดึงไปใช้ร่วมกันได้

export type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
};