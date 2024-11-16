export interface User {
  id: string;
  email: string;
  userName: string;
}

export interface Car {
  id: string;
  userId: string;
  title: string;
  description: string;
  images: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type CarFormData = Omit<
  Car,
  "id" | "userId" | "createdAt" | "updatedAt"
>;
