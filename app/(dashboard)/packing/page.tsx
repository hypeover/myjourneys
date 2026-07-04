import React from "react";
import FileTree from "@/components/ui/packing-tree"; // Dopasuj ścieżkę do swojego folderu components

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
    <h1></h1>
    <FileTree initialData={myPackingData} /></main>;
};

export default Packing;


//border border-zinc-200 dark:border-zinc-800 shadow-sm - styl do file tree