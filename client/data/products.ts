import rocket from "@/assets/product-rocket.png";
import flowerpot from "@/assets/product-flowerpot.png";
import sparklers from "@/assets/product-sparklers.png";
import chakkar from "@/assets/product-chakkar.png";
import bomb from "@/assets/product-bomb.png";

export type Category = "Rockets" | "Sparklers" | "Fountains" | "Bombs";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  image: string;
  badge?: string;
}

export const products: Product[] = [
  { id: "1", name: "Sky Shot Rocket", price: 599, category: "Rockets", image: rocket, badge: "Hot" },
  { id: "2", name: "Flower Pot", price: 199, category: "Fountains", image: flowerpot },
  { id: "3", name: "Mega Rocket", price: 249, category: "Rockets", badge: "New", image: rocket },
  { id: "4", name: "Sparklers Pack", price: 99, category: "Sparklers", image: sparklers },
  { id: "5", name: "Ground Chakkar", price: 149, category: "Fountains", image: chakkar },
  { id: "6", name: "Lakshmi Bomb", price: 129, category: "Bombs", badge: "Top", image: bomb },
  { id: "7", name: "Color Sparklers", price: 79, category: "Sparklers", image: sparklers },
  { id: "8", name: "Atom Bomb", price: 189, category: "Bombs", image: bomb },
  { id: "9", name: "Whistle Rocket", price: 299, category: "Rockets", image: rocket },
  { id: "10", name: "Big Fountain", price: 349, category: "Fountains", badge: "Sale", image: flowerpot },
  { id: "11", name: "Diamond Sparklers", price: 119, category: "Sparklers", image: sparklers },
  { id: "12", name: "Sound Bomb", price: 169, category: "Bombs", image: bomb },
];
