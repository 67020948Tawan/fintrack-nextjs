export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string;   // <--- ต้องมีบรรทัดนี้ครับ ระบบถึงจะยอมรับการบันทึกวันที่
  note?: string; 
}