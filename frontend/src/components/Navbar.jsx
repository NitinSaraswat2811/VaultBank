const Navbar = () => {
  return (
    <nav className="fixed w-full z-10 top-0 flex justify-between items-center p-6 px-10 bg-black/30 backdrop-blur-md border-b border-white/10">
      <div className="text-2xl font-bold text-blue-500">VaultBank</div>
      <div className="space-x-8 text-gray-300">
        <a href="#" className="hover:text-white">About Us</a>
        <a href="#" className="hover:text-white">Contact</a>
      </div>
      <div className="space-x-4">
        <button className="text-gray-300 hover:text-white">Login</button>
        <button className="bg-blue-600 px-5 py-2 rounded-full hover:bg-blue-700">Sign Up</button>
      </div>
    </nav>
  );
};
export default Navbar;