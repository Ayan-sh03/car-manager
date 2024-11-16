import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { useCars } from "@/lib/cars";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { ImageUpload } from "./ImageUpload";

const MAX_IMAGES = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  images: z
    .array(z.instanceof(File))
    .min(1, "At least one image is required")
    .max(MAX_IMAGES),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
});

type FormData = z.infer<typeof formSchema>;

export function CarForm() {
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [previews, setPreviews] = useState<string[]>([]);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { addCar } = useCars();
  const { user } = useAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      images: [],
      tags: [],
    },
  });

  async function onSubmit(data: FormData) {
    if (!user) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      data.tags.forEach((tag) => formData.append("tags", tag));

      // Append each image file to formData
      data.images.forEach((image, index) => {
        formData.append("images", image);
      });

      formData.append("userId", user.id);

      const res = await fetch(
        `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/cars`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );
      const car = await res.json();

      console.log("====================");
      console.log("car is ", car);
      console.log("====================");
      addCar({
        title: car.title,
        description: car.description,
        images: car.images,
        tags: car.tags,
        userId: car.user,
      });

      toast({
        title: "Car added successfully",
      });
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Images (Max {MAX_IMAGES})</FormLabel>
              <FormControl>
                <ImageUpload
                  value={previews}
                  onChange={(files) => {
                    // Create preview URLs for new files
                    const newPreviews = files.map((file) =>
                      URL.createObjectURL(file)
                    );

                    // Update previews
                    setPreviews((prev) => {
                      // Clean up old preview URLs
                      prev.forEach((url) => URL.revokeObjectURL(url));
                      return newPreviews;
                    });

                    // Update form field with File objects
                    field.onChange([...field.value, ...files]);
                  }}
                  maxImages={MAX_IMAGES}
                  maxSize={MAX_FILE_SIZE}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter car title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter car description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <div className="space-y-2">
                  <Input
                    placeholder="Type a tag and press Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const newTag = tagInput.trim();
                        if (newTag) {
                          const currentTags = form.getValues("tags");
                          if (!currentTags.includes(newTag)) {
                            form.setValue("tags", [...currentTags, newTag]);
                          }
                          setTagInput("");
                        }
                      }
                    }}
                    className="w-full"
                  />

                  <div className="flex flex-wrap gap-2">
                    {field.value.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="animate-in fade-in slide-in-from-bottom-1 duration-200 bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-all"
                      >
                        {tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="ml-1 h-4 w-4 p-0 hover:bg-yellow-200 rounded-full"
                          onClick={() => {
                            const currentTags = field.value.filter(
                              (t) => t !== tag
                            );
                            form.setValue("tags", currentTags);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/")}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            Add Car
          </Button>
        </div>
      </form>
    </Form>
  );
}
