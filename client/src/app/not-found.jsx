"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground px-4 text-center">
            <Image
                src="/404.svg"
                alt="404 Not Found"
                width={400}
                height={300}
                className="mb-8"
            />
            <h1 className="text-6xl font-bold tracking-tight mb-4">Error 404</h1>
            <p className="text-xl mb-6">Oops! The page you are looking for does not exist.</p>
            <Link href="https://skill-trade-next-15.vercel.app/">
                <Button className="px-6 py-3 text-lg">
                    <span className="mr-2">🏠</span> Go to Home
                </Button>
            </Link>
        </div>
    );
}
