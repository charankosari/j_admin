import { Breadcrumb } from "@/components/breadcrumb";
import { SalesManagement } from "@/components/promotions/sales-management";

export default function PromotionsPage() {
  return (
    <>
      <Breadcrumb items={["Convenience", "Promotions & Sales"]} />
      <main className="flex-1 p-6">
        <h1 className="text-2xl text-black font-bold">Promotions & Sales Page</h1>
        <SalesManagement />
      </main>
    </>
  );
}