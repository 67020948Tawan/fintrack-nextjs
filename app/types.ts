export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string; // <-- ตัวนี้แหละครับที่ TypeScript มันกำลังตามหา!
  note?: string; 
}