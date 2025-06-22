const LoginButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
  >
    Login with Internet Identity
  </button>
);

export default LoginButton;
