import React from "react";

interface Props {
  onClick: () => void;
}

const LoginButton: React.FC<Props> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 px-10 py-4 rounded-full black-gradient shadow-lg hover:scale-105 active:scale-95 transition-transform duration-200 text-white"
    >
      <img
        src="/images/icp_logo.png"
        alt="Internet Identity Logo"
        className="w-7 h-7"
      />
      <span className="text-base font-medium text-stone-400">
        Continue with Internet Identity
      </span>
    </button>
  );
};

export default LoginButton;
