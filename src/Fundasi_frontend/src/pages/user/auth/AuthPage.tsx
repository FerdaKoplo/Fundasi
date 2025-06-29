import React from "react";
import AuthCard from "../../../components/auth/AuthCard";
import LogoutButton from "../../../components/auth/LogoutButton";

const AuthPage = () => {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-b from-black to-[#0a0a0a] text-white px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#112222] to-black opacity-30 blur-3xl z-0" />
      <div className="absolute top-[-350px] left-1/2 transform -translate-x-1/2 w-[1000px] h-[700px] bg-[#34ce96c0] opacity-20 rounded-full blur-[100px] z-0 pointer-events-none" />
      {/* Konten utama */}
      <div className="relative z-10 w-full max-w-2xl text-center flex flex-col items-center justify-center space-y-8">
        <h1 className="text-5xl font-semibold font-montserrat tracking-tight drop-shadow-md bg-gradient-to-b from-[#d1d1d1e3] to-[#a1a1a1b7] bg-clip-text text-transparent">
          Welcome To Fundasi
        </h1>
        <div className="bg-[#1a1a1a]/90 rounded-2xl shadow-2xl ring-1 ring-white/10 px-10 py-12 w-max-w-xl">
          <AuthCard />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;