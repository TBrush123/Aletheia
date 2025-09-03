function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome to Aletheia</h1>
      <p className="text-lg mb-8">
        Your insights into poll data, powered by AI.
      </p>
      <button className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-bold">
        Get Started
      </button>
    </div>
  );
}

export default Home;
