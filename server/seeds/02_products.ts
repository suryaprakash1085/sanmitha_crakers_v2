import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("products").del();
  await knex("products").insert([
    { name: "Sky Shot Rocket", price: 599, category_id: 1, image: "/assets/product-rocket.png", badge: "Hot" },
    { name: "Flower Pot", price: 199, category_id: 3, image: "/assets/product-flowerpot.png", badge: null },
    { name: "Mega Rocket", price: 249, category_id: 1, image: "/assets/product-rocket.png", badge: "New" },
    { name: "Sparklers Pack", price: 99, category_id: 2, image: "/assets/product-sparklers.png", badge: null },
    { name: "Ground Chakkar", price: 149, category_id: 3, image: "/assets/product-chakkar.png", badge: null },
    { name: "Lakshmi Bomb", price: 129, category_id: 4, image: "/assets/product-bomb.png", badge: "Top" },
    { name: "Color Sparklers", price: 79, category_id: 2, image: "/assets/product-sparklers.png", badge: null },
    { name: "Atom Bomb", price: 189, category_id: 4, image: "/assets/product-bomb.png", badge: null },
    { name: "Whistle Rocket", price: 299, category_id: 1, image: "/assets/product-rocket.png", badge: null },
    { name: "Big Fountain", price: 349, category_id: 3, image: "/assets/product-flowerpot.png", badge: "Sale" },
    { name: "Diamond Sparklers", price: 119, category_id: 2, image: "/assets/product-sparklers.png", badge: null },
    { name: "Sound Bomb", price: 169, category_id: 4, image: "/assets/product-bomb.png", badge: null },
  ]);
}
