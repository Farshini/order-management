<?php

namespace Tests\Feature;

use App\Models\MenuItem;
use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_order_can_be_created(): void
    {
        $menuItem = MenuItem::create([
            'name' => 'Test Pizza',
            'description' => 'Test pizza description',
            'price' => 299.00,
            'image' => 'https://example.com/pizza.jpg',
        ]);

        $response = $this->postJson('/api/orders', [
            'customer_name' => 'Farshini',
            'address' => 'Kochi, Kerala',
            'phone' => '9876543210',
            'items' => [
                [
                    'menu_item_id' => $menuItem->id,
                    'quantity' => 2,
                ],
            ],
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('message', 'Order created successfully.')
            ->assertJsonPath('data.customer_name', 'Farshini')
            ->assertJsonPath('data.status', 'received')
            ->assertJsonPath('data.total_amount', 598);

        $this->assertDatabaseHas('orders', [
            'customer_name' => 'Farshini',
            'total_amount' => 598,
            'status' => 'received',
        ]);

        $this->assertDatabaseHas('order_items', [
            'menu_item_id' => $menuItem->id,
            'quantity' => 2,
            'price' => 299.00,
        ]);
    }

    public function test_order_creation_requires_valid_data(): void
    {
        $response = $this->postJson('/api/orders', [
            'customer_name' => '',
            'address' => '',
            'phone' => '',
            'items' => [],
        ]);
    
        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'customer_name',
                'address',
                'phone',
                'items',
            ]);
    
        $this->assertDatabaseCount('orders', 0);
    }
    
    public function test_order_cannot_be_created_with_invalid_menu_item(): void
    {
        $response = $this->postJson('/api/orders', [
            'customer_name' => 'Farshini',
            'address' => 'Kochi, Kerala',
            'phone' => '9876543210',
            'items' => [
                [
                    'menu_item_id' => 9999,
                    'quantity' => 1,
                ],
            ],
        ]);
    
        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'items.0.menu_item_id',
            ]);
    
        $this->assertDatabaseCount('orders', 0);
    }
    
    public function test_order_cannot_be_created_with_invalid_quantity(): void
    {
        $menuItem = MenuItem::create([
            'name' => 'Test Burger',
            'description' => 'Test burger description',
            'price' => 249.00,
            'image' => 'https://example.com/burger.jpg',
        ]);
    
        $response = $this->postJson('/api/orders', [
            'customer_name' => 'Farshini',
            'address' => 'Kochi, Kerala',
            'phone' => '9876543210',
            'items' => [
                [
                    'menu_item_id' => $menuItem->id,
                    'quantity' => 0,
                ],
            ],
        ]);
    
        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'items.0.quantity',
            ]);
    
        $this->assertDatabaseCount('orders', 0);
    }
    
    public function test_order_status_can_be_updated(): void
    {
        $order = Order::create([
            'customer_name' => 'Farshini',
            'address' => 'Kochi, Kerala',
            'phone' => '9876543210',
            'status' => 'received',
            'total_amount' => 299.00,
        ]);
    
        $response = $this->patchJson("/api/orders/{$order->id}/status", [
            'status' => 'preparing',
        ]);
    
        $response->assertStatus(200)
            ->assertJsonPath('message', 'Order status updated successfully.')
            ->assertJsonPath('data.status', 'preparing');
    
        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'preparing',
        ]);
    }
    
    public function test_order_status_must_be_valid(): void
    {
        $order = Order::create([
            'customer_name' => 'Farshini',
            'address' => 'Kochi, Kerala',
            'phone' => '9876543210',
            'status' => 'received',
            'total_amount' => 299.00,
        ]);
    
        $response = $this->patchJson("/api/orders/{$order->id}/status", [
            'status' => 'invalid_status',
        ]);
    
        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'status',
            ]);
    
        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'received',
        ]);
    }
    
    public function test_orders_can_be_retrieved(): void
    {
        $order = Order::create([
            'customer_name' => 'Farshini',
            'address' => 'Kochi, Kerala',
            'phone' => '9876543210',
            'status' => 'received',
            'total_amount' => 598.00,
        ]);
    
        $response = $this->getJson('/api/orders');
    
        $response->assertStatus(200)
            ->assertJsonPath('data.0.id', $order->id)
            ->assertJsonPath('data.0.customer_name', 'Farshini')
            ->assertJsonPath('data.0.status', 'received')
            ->assertJsonPath('data.0.total_amount', 598);
    }  
    
    public function test_single_order_can_be_retrieved(): void
    {
        $order = Order::create([
            'customer_name' => 'Farshini',
            'address' => 'Kochi, Kerala',
            'phone' => '9876543210',
            'status' => 'received',
            'total_amount' => 598.00,
        ]);
    
        $response = $this->getJson("/api/orders/{$order->id}");
    
        $response->assertStatus(200)
            ->assertJsonPath('data.id', $order->id)
            ->assertJsonPath('data.customer_name', 'Farshini')
            ->assertJsonPath('data.status', 'received')
            ->assertJsonPath('data.total_amount', 598);
    }  
    
    public function test_order_can_be_deleted(): void
    {
        $order = Order::create([
            'customer_name' => 'Farshini',
            'address' => 'Kochi, Kerala',
            'phone' => '9876543210',
            'status' => 'received',
            'total_amount' => 598.00,
        ]);
    
        $response = $this->deleteJson("/api/orders/{$order->id}");
    
        $response->assertStatus(200)
            ->assertJsonPath('message', 'Order deleted successfully.');
    
        $this->assertDatabaseMissing('orders', [
            'id' => $order->id,
        ]);
    }    
}