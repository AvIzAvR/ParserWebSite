'use client'

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/useUser"
import { LogoutButton } from "@/components/logout-button"; // путь подстрой под себя
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const predictRating = async (data: { productName: string, description: string, brandName: string, price: number }) => {
  const response = await axios.post(`${API_URL}/rating`, data);
  return response.data;
};

export default function HomePage() {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [brandName, setBrandName] = useState("");
  const [price, setPrice] = useState("");
  const [result, setResult] = useState<{ predictedRating: number; status: string; error?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const { username } = useUser()

  const [cards, setCards] = useState<{ productName: string; predictedRating: number; date: string }[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);

  // Функция для получения истории запросов пользователя
  useEffect(() => {
    const fetchHistory = async (username: string) => {
      try {
        const response = await axios.get(`${API_URL}/requests/user/${username}`);
        console.log(response.data); // Проверка, что пришло с API

        // Преобразуем данные, извлекая только productName из requestData
        const parsedData = response.data.map((item: any) => {
          const requestData = JSON.parse(item.requestData); // Предполагаем, что requestData - это строка JSON
          return {
            productName: requestData.productName,
            predictedRating: item.predictedRating,
            date: item.timestamp,
          };
        });

        setCards(parsedData); // Обновляем состояние карт с продуктами
        setInitialLoading(false); // Завершаем начальную загрузку
      } catch (error) {
        console.error("Failed to fetch user history:", error);
        setInitialLoading(false); // Завершаем начальную загрузку даже в случае ошибки
      }
    };

    if (username) {
      fetchHistory(username); // Загружаем историю запросов при наличии username
    }
  }, [username]);

  // Обработка отправки формы для предсказания рейтинга
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
          productName: productName, // Теперь используем productName
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">👋 Hello, {username ?? "guest"}!</h1>
        {username && <LogoutButton />}
      </div>

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

        <Button className="w-full" onClick={handleSubmit} disabled={loading}>
          {loading ? "Predicting..." : "Predict Rating"}
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
          {initialLoading ? (
            <Skeleton className="h-24 w-full rounded-xl" />
          ) : cards.length === 0 ? (
            <p className="text-center text-gray-400">No predictions yet.</p>
          ) : (
            cards.map((card, idx) => (
              <Card key={idx} className="border border-gray-200">
                <CardContent className="p-4 space-y-2">
                  <p className="font-semibold">{card.productName}</p> {/* Используем productName */}
                  <p>Predicted Rating: {card.predictedRating}</p>
                  <p className="text-sm text-muted-foreground">{new Date(card.date).toLocaleString()}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
