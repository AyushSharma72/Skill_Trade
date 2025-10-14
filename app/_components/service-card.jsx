import { Card, CardContent } from "@/components/ui/card";
import { Star } from 'lucide-react';
import Image from "next/image";


export default function ServiceCard({ service }) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="relative h-48 w-full">
        <Image
          src={service.image || "/placeholder.svg"}
          alt={service.title}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-bold mb-2">{service.title}</h3>
        <p className="text-gray-600 text-sm mb-3">{service.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="ml-1 text-sm font-medium">{service.rating}</span>
            <span className="ml-1 text-xs text-gray-500">({service.reviews})</span>
          </div>
          <div className="text-sm font-semibold">{service.price}</div>
        </div>
      </CardContent>
    </Card>
  );
}
