import { Card, CardContent } from "@/components/ui/card";
import { Star } from 'lucide-react';
import Image from "next/image";


export default function ServiceCard({ service }) {
  return (
    <Card 
      className="overflow-hidden transition-all hover:shadow-lg focus-within:shadow-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
      role="article"
      aria-labelledby={`service-title-${service.id}`}
    >
      <div className="relative h-48 w-full">
        <Image
          src={service.image || "/placeholder.svg"}
          alt={`${service.title} service illustration`}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 id={`service-title-${service.id}`} className="text-lg font-bold mb-2">{service.title}</h3>
        <p className="text-gray-600 text-sm mb-3">{service.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" aria-hidden="true" />
            <span className="ml-1 text-sm font-medium" aria-label={`Rating: ${service.rating} stars`}>
              {service.rating}
            </span>
            <span className="ml-1 text-xs text-gray-500" aria-label={`${service.reviews} reviews`}>
              ({service.reviews})
            </span>
          </div>
          <div className="text-sm font-semibold" aria-label={`Price: ${service.price}`}>
            {service.price}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
