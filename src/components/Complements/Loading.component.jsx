
function Loading({ text = 'Chargement...' }) {
  return (
    <div className="flex flex-col items-center justify-center mt-20 text-center">
      <div
        className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"
        style={{ marginBottom: '20px' }}
      ></div>
      <p
        className="text-lg text-gray-700 animate-pulse"
        style={{ fontWeight: '500' }}
      >
        {text}
      </p>
    </div>
  );
}

export default Loading;
