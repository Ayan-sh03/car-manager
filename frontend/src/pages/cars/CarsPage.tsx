import { CarGrid } from "@/components/cars/CarGrid";
import { CarSearch } from "@/components/cars/CarSearch";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useCars } from "@/lib/cars";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Car } from "../../lib/types";

export function CarsPage() {
  const [search, setSearch] = useState("");
  const { user } = useAuth();
  const { cars, searchCars, setCars } = useCars();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/cars`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        // console.log(data);
        const fetchCars: Car[] = data.map((car: any) => {
          return {
            title: car.title,
            description: car.description,
            images: car.images,
            tags: car.tags,
            id: car._id,
            userId: car.user,
          };
        });

        console.log(fetchCars);

        setCars(fetchCars);
      } catch (er) {}
    };

    fetchCars();
  }, []);

  const filteredCars = search
    ? searchCars(search, user!.id)
    : cars.filter((car) => car.userId === user!.id);

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">My Cars</h1>
        <Link to="/cars/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Car
          </Button>
        </Link>
      </div>
      <CarSearch value={search} onChange={setSearch} />
      {filteredCars.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No cars found.</p>
        </div>
      ) : (
        <CarGrid cars={filteredCars} />
      )}
    </div>
  );
}
