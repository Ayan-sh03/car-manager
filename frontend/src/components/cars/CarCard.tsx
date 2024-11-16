import { Link } from "react-router-dom";
import { Car } from "@/lib/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface CarCardProps {
  car: Car;
}

export function CarCard({ car }: CarCardProps) {
  const allTags = car.tags;

  console.log(car);

  //add
  const processedImage =
    `${import.meta.env.VITE_PUBLIC_SERVER_URL}/` + car.images[0];

  console.log("processed images ", processedImage.replace("\\", "/"));

  return (
    <Link to={`/cars/${car.id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <CardHeader className="p-0">
          <AspectRatio ratio={16 / 9}>
            <img
              src={
                processedImage ||
                "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1000&auto=format&fit=crop"
              }
              alt={car.title}
              className="object-cover w-full h-full"
            />
          </AspectRatio>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="line-clamp-1">{car.title}</CardTitle>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {car.description}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </CardFooter>
      </Card>
    </Link>
  );
}
