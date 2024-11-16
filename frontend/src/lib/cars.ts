import { create } from "zustand";
import { Car } from "./types";

interface CarsState {
  cars: Car[];
  addCar: (car: Omit<Car, "id" | "createdAt" | "updatedAt">) => void;
  setCars: (cars: Car[]) => void;

  updateCar: (id: string, car: Partial<Car>) => void;
  deleteCar: (id: string) => void;
  searchCars: (query: string, userId: string) => Car[];
}

export const useCars = create<CarsState>((set, get) => ({
  cars: [],
  setCars: (cars) => set({ cars }),
  addCar: (car) => {
    const newCar: Car = {
      ...car,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ cars: [...state.cars, newCar] }));
  },
  updateCar: (id, updates) => {
    set((state) => ({
      cars: state.cars.map((car) =>
        car.id === id
          ? { ...car, ...updates, updatedAt: new Date().toISOString() }
          : car
      ),
    }));
  },
  deleteCar: (id) => {
    set((state) => ({
      cars: state.cars.filter((car) => car.id !== id),
    }));
  },
  searchCars: (query, userId) => {
    const cars = get().cars;
    const lowercaseQuery = query.toLowerCase();
    return cars.filter(
      (car) =>
        car.userId === userId &&
        (car.title.toLowerCase().includes(lowercaseQuery) ||
          car.description.toLowerCase().includes(lowercaseQuery) ||
          car.tags?.some((tag: string) =>
            tag.toLowerCase().includes(lowercaseQuery)
          ))
    );
  },
}));
