function Result({ commission }) {
  return (
    <div className="mt-6 text-center">
      <p className="text-gray-400 text-sm uppercase tracking-widest">
        Commission
      </p>
      <h2 className="text-3xl font-bold text-white mt-2">
        ₹{commission}
      </h2>
    </div>
  );
}

export default Result;
