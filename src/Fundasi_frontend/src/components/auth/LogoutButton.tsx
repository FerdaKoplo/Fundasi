const LogoutButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
  >
    Logout
  </button>
);

export default LogoutButton;
