import SalesLayout from "../../layouts/SalesLayout";
import DealHistory from "../../components/tables/DealHistory";

const DealHistoryPage = () => {
  return (
    <SalesLayout>
      <div className="space-y-10">
        <div>
          <h1 className="section-title">Deal History</h1>
          <div className="h-px bg-black w-24 mt-2"></div>
          <p className="section-subtitle mt-4">View & Manage Records</p>
        </div>
      <DealHistory />
      </div>
    </SalesLayout>
  );
};

export default DealHistoryPage;
