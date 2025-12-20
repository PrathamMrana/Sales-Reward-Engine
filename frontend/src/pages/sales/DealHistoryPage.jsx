import SalesLayout from "../../layouts/SalesLayout";
import DealHistory from "../../components/tables/DealHistory";

const DealHistoryPage = () => {
  return (
    <SalesLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Deal History</h1>
          <p className="text-sm text-gray-600">View and manage all your recorded deals</p>
        </div>
        <DealHistory />
      </div>
    </SalesLayout>
  );
};

export default DealHistoryPage;
