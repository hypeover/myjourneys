import React from "react";
import FileTree from "@/components/ui/packing-tree"; // Dopasuj ścieżkę do swojego folderu components
import { Button } from "@/components/ui/button";
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'


const myPackingData = [
  {
    id: "bag-1",
    name: "Główna Walizka",
    type: "folder",
    iconType: "suitcase",
    children: [
      {
        id: "sec-clothes",
        name: "Ubrania",
        type: "folder",
        iconType: "folder",
        children: [
          { id: "item-1", name: "Koszulki bawełniane (5x)", type: "file", iconType: "shirt" },
          { id: "item-2", name: "Krótkie spodenki", type: "file", iconType: "shirt" },
          { id: "item-3", name: "Ciepła bluza", type: "file", iconType: "shirt" },
          { id: "item-4", name: "Buty trekkingowe", type: "file", iconType: "footprints" },
          { id: "item-5", name: "Klapki na basen", type: "file", iconType: "footprints" }
        ]
      },
      {
        id: "sec-cosmetics",
        name: "Kosmetyczka",
        type: "folder",
        iconType: "folder",
        children: [
          { id: "item-6", name: "Szczoteczka do zębów", type: "file", iconType: "sparkles" },
          { id: "item-7", name: "Krem z filtrem UV", type: "file", iconType: "sparkles" }
        ]
      }
    ]
  },
  {
    id: "bag-2",
    name: "Plecak podręczny",
    type: "folder",
    iconType: "backpack",
    children: [
      { id: "item-8", name: "Paszport i bilety", type: "file", iconType: "credit-card" },
      { id: "item-9", name: "Portfel z gotówką", type: "file", iconType: "credit-card" },
      { id: "item-10", name: "Powerbank 20k mAh", type: "file", iconType: "plug-zap" },
      { id: "item-11", name: "Ładowarka do telefonu", type: "file", iconType: "plug-zap" },
      { id: "item-12", name: "Słuchawki", type: "file", iconType: "plug-zap" }
    ]
  }
];

const Packing = () => {
  return <main className="flex justify-center p-10">
    <div className="flex flex-col">
      <Link href='/'>
        <Button variant='secondary' className="h-auto cursor-pointer self-start w-auto py-2 mb-3">
          <ChevronLeft className="p-0" data-icon="inline-start" />Back to dashboard</Button>
      </Link>
      <h1 className="text-3xl mb-3 font-semibold">Luggage manager</h1>
      <p className="text-muted-foreground mb-4">Don't just log your trips—get ready for them. Create customized virtual bags, <br /> add your travel essentials, and check them off as you pack your real luggage.</p>
      <FileTree initialData={myPackingData} />
    </div>
  </main>;
};

export default Packing;


//border border-zinc-200 dark:border-zinc-800 shadow-sm - styl do file tree
//usuniete dodawac do pamieci przegladarki aby moc to pozniej przyrworcic kocham madzie