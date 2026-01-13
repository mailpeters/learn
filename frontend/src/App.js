function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Craft Beverage Finder</h1>
      </header>

      <main className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <input
            type="text"
            placeholder="Search for venues..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">No venues yet. Start building!</p>
        </div>
      </main>
    </div>
  );
}

export default App;
