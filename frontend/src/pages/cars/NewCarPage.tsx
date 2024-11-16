import { CarForm } from '@/components/cars/CarForm';

export function NewCarPage() {
  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Add New Car</h1>
        <CarForm />
      </div>
    </div>
  );
}