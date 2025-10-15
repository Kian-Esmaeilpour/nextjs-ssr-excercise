import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AccidentStat } from "@/types/accident-stat";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function page({
  searchParams,
}: {
  searchParams: { accidentId: string };
}) {
  const params = await searchParams;
  const response = await fetch(
    `http://localhost:3030/accidents-stat/${params?.accidentId}`
  );

  // Handle 404 case
  if (!response.ok) {
    if (response.status === 404) {
      notFound();
    }
    // For other errors, you might want to throw an error
    throw new Error(`Failed to fetch accident: ${response.status}`);
  }

  const accident = (await response.json()) as AccidentStat;

  // Additional check in case the API returns 200 but with null/undefined data
  if (!accident || !accident.id) {
    notFound();
  }

  return (
    <div className="min-h-dvh flex justify-center items-center p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-4">
          <Link href="/">
            <Button variant="outline">← Back to Accidents</Button>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Accident {accident.id}</CardTitle>
            <CardDescription>
              {accident.location} ({accident.borough})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Date: {accident.date}</p>
            <p>Severity: {accident.severity}</p>
            <p>Casualties: </p>
            <div className="ml-4">
              <ol className="list-['-']">
                {accident.casualties.map((casualty, i) => (
                  <li key={i} className="px-2">
                    <p>
                      {casualty.class} {casualty.age}yo ({casualty.ageBand})
                    </p>
                  </li>
                ))}
              </ol>
            </div>

            <p>Vehicles: </p>
            <div className="ml-4">
              <ol className="list-['-']">
                {accident.vehicles.map((vehicle, i) => (
                  <li key={i} className="px-2">
                    <p>{vehicle.type}</p>
                  </li>
                ))}
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
