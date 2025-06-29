const LogoutButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="red-gradient px-1 text-white p-3 rounded-full"
  >
    <span className="px-5 bg-black rounded-full p-3 ">Logout</span>
  </button>
);

export default LogoutButton;
