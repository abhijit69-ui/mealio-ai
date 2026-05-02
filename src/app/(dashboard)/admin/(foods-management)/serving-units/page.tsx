import ServingUnitFormDialog from "./_components/serving-unit-form-dialog";
import ServingUnitCards from "./_components/serving-unit-cards";

export default function ServingUnitPage() {
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Serving Units List</h1>
        <ServingUnitFormDialog />
      </div>
      <ServingUnitCards />
    </>
  );
}
