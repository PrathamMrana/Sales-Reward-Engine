import SalesLayout from "../../layouts/SalesLayout";
import DealHistory from "../../components/tables/DealHistory";

const DealHistoryPage = () => {
  return (
    <SalesLayout>
      <div className="space-y-10">
        <div>
          <h1 className="section-title">Deal History</h1>
          <div className="h-1 w-24 mt-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"></div>
          <p className="section-subtitle mt-4">View & Manage Records</p>
        </div>
        <DealHistory />
      </div>
    </SalesLayout>
  );
};

export default DealHistoryPage;
