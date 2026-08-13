<?php

namespace Tests\Feature;

use App\Models\MenuItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MenuItemApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_menu_items_can_be_retrieved(): void
    {
        MenuItem::create([
            'name' => 'Test Pizza',
            'description' => 'Test pizza description',
            'price' => 299.00,
            'image' => 'https://example.com/pizza.jpg',
        ]);

        $response = $this->getJson('/api/menu-items');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'description',
                        'price',
                        'image',
                    ],
                ],
            ]);
    }
}