'use client'
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/useUser"
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const predictRating = async (data: { productName: string, description: string, brandName: string, price: number }) => {
  try {
    const response = await axios.post(`${API_URL}/rating`, data);
    console.log("API response:", response);
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};

export default function HomePage() {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [brandName, setBrandName] = useState("");
  const [price, setPrice] = useState("");
  const [result, setResult] = useState<{ predictedRating: number; status: string; error?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const { username } = useUser()

  const [cards, setCards] = useState<{ title: string; predictedRating: number; date: string }[]>([]);

  const handleSubmit = async () => {
    const data = {
      productName,
      description,
      brandName,
      price: parseFloat(price),
    };
    setLoading(true);
    try {
      const response = await predictRating(data);
      setResult(response);
      setCards((prev) => [
        ...prev,
        {
          title: productName,
          predictedRating: response.predictedRating,
          date: new Date().toLocaleString(),
        },
      ]);
    } catch (err) {
      setResult({ predictedRating: 0, status: "error", error: "Failed to fetch rating" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-20 space-y-6 p-6 shadow-xl rounded-2xl">
      <h1 className="text-2xl">👋 Hello, {username ?? "guest"}!</h1>
      <div className="space-y-4">
        <div>
          <Label htmlFor="productName" className="mb-1 inline-block text-base font-medium">
            Product Name
          </Label>
          <Input id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} />
        </div>

        <div>
          <Label htmlFor="description" className="mb-1 inline-block text-base font-medium">
            Description
          </Label>
          <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div>
          <Label htmlFor="brandName" className="mb-1 inline-block text-base font-medium">
            Brand Name
          </Label>
          <Input id="brandName" value={brandName} onChange={(e) => setBrandName(e.target.value)} />
        </div>

        <div>
          <Label htmlFor="price" className="mb-1 inline-block text-base font-medium">
            Price
          </Label>
          <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>

        <Button className="w-full" onClick={handleSubmit}>
          Predict Rating
        </Button>

        {result && (
          <div className="mt-6 bg-zinc-900 p-4 rounded-xl">
            <p>
              <strong>Status:</strong> {result.status}
            </p>
            <p>
              <strong>Predicted Rating:</strong> {result.predictedRating}
            </p>
            {result.error && <p className="text-red-500">Error: {result.error}</p>}
          </div>
        )}

        <div className="space-y-4 mt-6">
          {loading ? (
            <Skeleton className="h-24 w-full rounded-xl" />
          ) : (
            cards.map((card, idx) => (
              <Card key={idx} className="border border-gray-200">
                <CardContent className="p-4 space-y-2">
                  <p className="font-semibold">{card.title}</p>
                  <p>Predicted Rating: {card.predictedRating}</p>
                  <p className="text-sm text-muted-foreground">{card.date}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
