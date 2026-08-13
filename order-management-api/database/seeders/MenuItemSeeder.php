<?php

namespace Database\Seeders;

use App\Models\MenuItem;
use Illuminate\Database\Seeder;

class MenuItemSeeder extends Seeder
{
    public function run(): void
    {
        MenuItem::create([
            'name' => 'Margherita Pizza',
            'description' => 'Classic pizza with tomato, mozzarella and fresh basil.',
            'price' => 299.00,
            'image' => 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002',
        ]);

        MenuItem::create([
            'name' => 'Chicken Burger',
            'description' => 'Crispy chicken burger with lettuce, tomato and special sauce.',
            'price' => 249.00,
            'image' => 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
        ]);

        MenuItem::create([
            'name' => 'Chicken Pasta',
            'description' => 'Creamy pasta with grilled chicken and parmesan.',
            'price' => 279.00,
            'image' => 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb',
        ]);

        MenuItem::create([
            'name' => 'French Fries',
            'description' => 'Crispy golden French fries served with seasoning.',
            'price' => 129.00,
            'image' => 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877',
        ]);

        MenuItem::create([
            'name' => 'Chocolate Cake',
            'description' => 'Rich and moist chocolate cake with chocolate frosting.',
            'price' => 199.00,
            'image' => 'https://images.unsplash.com/photo-1578985545062-69928b1d9587',
        ]);
    }
}