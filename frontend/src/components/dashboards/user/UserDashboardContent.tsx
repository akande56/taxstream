const UserDashboardContent = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-start justify-start m-4">
      <div className="bg-white  p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4">Welcome - Usman</h1>
        <div className="bg-red-500 text-white text-center py-2 rounded mb-4">
          Your Payment Is Due!
        </div>
        <div className="  border-blue-500 rounded p-4">
          <div className="flex justify-between mb-2 bg-gray-100 p-4">
            <span className="font-medium">Payment Due:</span>
            <span>Annually</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="font-medium">Amount to be paying:</span>
            <span>N 70506.00</span>
          </div>
          <div className="flex justify-around bg-gray-100 p-4">
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
              Print
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardContent;
