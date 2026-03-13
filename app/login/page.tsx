'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type AuthMode = 'login' | 'register' | 'forgot';

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('login'); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(''); 
  
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const users = JSON.parse(localStorage.getItem('fintrack-users') || '[]');

    if (mode === 'login') {
      // 🔑 ระบบบัญชีพิเศษสำหรับอาจารย์ (ซ่อนไว้ในโค้ด)
      const isAdmin = username === 'admin' && password === 'admin1234';
      
      const user = users.find((u: any) => u.username === username && u.password === password);
      
      if (user || isAdmin) {
        document.cookie = `isLoggedIn=true; path=/`;
        document.cookie = `currentUser=${isAdmin ? 'Admin' : username}; path=/`; 
        router.push('/'); 
      } else {
        setErrorMsg('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง!');
      }

    } else if (mode === 'register') {
      if (password !== confirmPassword) {
        setErrorMsg('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน!');
        return;
      }
      if (username.trim() === '' || password.trim() === '') {
        setErrorMsg('กรุณากรอกข้อมูลให้ครบถ้วน!');
        return;
      }
      // ห้ามคนทั่วไปตั้งชื่อว่า admin
      if (username.toLowerCase() === 'admin') {
         setErrorMsg('ไม่สามารถใช้ชื่อผู้ใช้นี้ได้!');
         return;
      }
      if (users.some((u: any) => u.username === username)) {
        setErrorMsg('ชื่อผู้ใช้นี้มีคนใช้แล้ว!');
        return;
      }

      users.push({ username, password });
      localStorage.setItem('fintrack-users', JSON.stringify(users));
      
      setSuccessMsg('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
      setMode('login');
      setPassword('');
      setConfirmPassword('');

    } else if (mode === 'forgot') {
      if (username.trim() === '' || password.trim() === '') {
        setErrorMsg('กรุณากรอกชื่อผู้ใช้ และรหัสผ่านใหม่ให้ครบถ้วน!');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน!');
        return;
      }
      // ดักไม่ให้เปลี่ยนรหัส admin
      if (username.toLowerCase() === 'admin') {
         setErrorMsg('ไม่ได้รับอนุญาตให้เปลี่ยนรหัสผ่านของบัญชีผู้ดูแลระบบ!');
         return;
      }

      const userIndex = users.findIndex((u: any) => u.username === username);
      if (userIndex === -1) {
        setErrorMsg('ไม่พบชื่อผู้ใช้นี้ในระบบ!');
        return;
      }

      users[userIndex].password = password;
      localStorage.setItem('fintrack-users', JSON.stringify(users));

      setSuccessMsg('รีเซ็ตรหัสผ่านสำเร็จ! สามารถเข้าสู่ระบบด้วยรหัสใหม่ได้เลย');
      setMode('login');
      setPassword('');
      setConfirmPassword('');
    }
  };

  const getTitle = () => {
    if (mode === 'login') return 'Welcome Back';
    if (mode === 'register') return 'Create Account';
    return 'Reset Password';
  };

  const getButtonText = () => {
    if (mode === 'login') return 'เข้าสู่ระบบ';
    if (mode === 'register') return 'ยืนยันการสมัครสมาชิก';
    return 'เปลี่ยนรหัสผ่าน';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-6 selection:bg-indigo-200">
      
      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(79,70,229,0.15)] w-full max-w-md border border-white transition-all duration-500 hover:shadow-[0_20px_50px_-12px_rgba(79,70,229,0.25)] hover:-translate-y-1">
        
        <div className="flex flex-col items-center gap-3 mb-8 justify-center">
          <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-200 animate-bounce transition-all duration-300">
            F
          </div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
            {getTitle()}
          </h1>
          <p className="text-slate-400 text-sm font-medium">FinTrack Application</p>
        </div>

        {errorMsg && (
          <div className="mb-5 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-xl font-bold shadow-sm animate-[pulse_1s_ease-in-out]">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 text-sm rounded-r-xl font-bold shadow-sm transition-all animate-[bounce_1s_ease-in-out]">
            {successMsg}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="group">
            <label className="text-xs font-black text-slate-400 uppercase ml-1 tracking-wider group-focus-within:text-indigo-600 transition-colors">
              Username
            </label>
            <input 
              type="text" 
              className="w-full p-4 mt-1.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:-translate-y-0.5 outline-none transition-all duration-300 shadow-sm"
              placeholder={mode === 'forgot' ? 'กรอกชื่อผู้ใช้ของคุณ' : 'กรอกชื่อผู้ใช้'}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="group">
            <label className="text-xs font-black text-slate-400 uppercase ml-1 tracking-wider group-focus-within:text-indigo-600 transition-colors">
              {mode === 'forgot' ? 'New Password' : 'Password'}
            </label>
            <input 
              type="password" 
              className="w-full p-4 mt-1.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:-translate-y-0.5 outline-none transition-all duration-300 shadow-sm"
              placeholder={mode === 'forgot' ? 'ตั้งรหัสผ่านใหม่' : 'กรอกรหัสผ่าน'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {mode !== 'login' && (
            <div className="group animate-[fadeIn_0.5s_ease-in-out]">
              <label className="text-xs font-black text-slate-400 uppercase ml-1 tracking-wider group-focus-within:text-indigo-600 transition-colors">
                Confirm Password
              </label>
              <input 
                type="password" 
                className="w-full p-4 mt-1.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:-translate-y-0.5 outline-none transition-all duration-300 shadow-sm"
                placeholder="ยืนยันรหัสผ่านอีกครั้ง"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}

          {mode === 'login' && (
            <div className="text-right mt-2">
              <button 
                type="button"
                onClick={() => { setMode('forgot'); setErrorMsg(''); setSuccessMsg(''); }}
                className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors"
              >
                ลืมรหัสผ่านใช่ไหม?
              </button>
            </div>
          )}

          <button 
            type="submit" 
            className="w-full py-4 mt-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black text-sm rounded-2xl shadow-[0_10px_20px_-10px_rgba(79,70,229,0.5)] hover:shadow-[0_15px_25px_-10px_rgba(79,70,229,0.6)] hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] transition-all duration-300"
          >
            {getButtonText()}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500 font-medium border-t border-slate-100 pt-6">
          {mode === 'login' ? (
            <>
              ยังไม่มีบัญชีใช่ไหม?{' '}
              <button 
                onClick={() => { setMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
                className="text-indigo-600 font-black hover:text-indigo-800 transition-colors"
              >
                สร้างบัญชีใหม่
              </button>
            </>
          ) : (
            <>
              มีบัญชีอยู่แล้วใช่ไหม?{' '}
              <button 
                onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
                className="text-indigo-600 font-black hover:text-indigo-800 transition-colors"
              >
                กลับไปหน้าเข้าสู่ระบบ
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}