// import React, { createContext, useState, useEffect, useMemo } from 'react';

// // إنشاء Context
// export const UserContext = createContext();

// // Provider Component
// export const UserProvider = ({ children }) => {
//   const [userId, setUserId] = useState(null);
//   const [token, setToken] = useState(null);

//   // استرداد البيانات من localStorage عند التحميل
//   useEffect(() => {
//     const storedUserId = localStorage.getItem('userId');
//     const storedToken = localStorage.getItem('userToken');

//     if (storedUserId && storedToken) {
//       setUserId(storedUserId);
//       setToken(storedToken);
//     }
//   }, []);

//   // تسجيل الدخول
//   const login = (newUserId, newToken) => {
//     localStorage.setItem('userId', newUserId);
//     localStorage.setItem('userToken', newToken);
//     setUserId(newUserId);
//     setToken(newToken);
//   };

//   // تسجيل الخروج
//   const logout = () => {
//     localStorage.removeItem('userId');
//     localStorage.removeItem('userToken');
//     setUserId(null);
//     setToken(null);
//   };

//   // استخدام useMemo لتحسين الأداء
//   const value = useMemo(() => ({ userId, token, login, logout }), [userId, token]);

//   return (
//     <UserContext.Provider value={value}>
//       {children}
//     </UserContext.Provider>
//   );
// };