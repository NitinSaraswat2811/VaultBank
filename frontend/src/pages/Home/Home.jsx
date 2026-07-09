import Navbar from '../../components/Navbar';

const Home = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center h-screen text-center px-4">
        <h1 className="text-6xl font-extrabold mb-6">Banking, Simplified.</h1>
        <p className="text-xl text-gray-400 max-w-2xl mb-8">
           Modern banking for the digital age.
        </p>
      </main>
    </div>
  );
};
export default Home;