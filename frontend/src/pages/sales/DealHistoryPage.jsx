import SalesLayout from "../../layouts/SalesLayout";
import DealHistory from "../../components/tables/DealHistory";
import PageHeader from "../../components/common/PageHeader";

const DealHistoryPage = () => {
  return (
    <SalesLayout>
      <div className="space-y-10">
        <PageHeader
          heading="Deal Portfolio"
          subtitle="Monitor all assigned and submitted deals with their current status."
        />
        <DealHistory />
      </div>
    </SalesLayout>
  );
};

export default DealHistoryPage;
