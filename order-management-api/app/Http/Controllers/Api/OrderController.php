<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'customer_name' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string'],
            'phone' => ['required', 'string', 'max:20'],

            'items' => ['required', 'array', 'min:1'],

            'items.*.menu_item_id' => [
                'required',
                'integer',
                'exists:menu_items,id',
            ],

            'items.*.quantity' => [
                'required',
                'integer',
                'min:1',
            ],
        ]);

        $order = DB::transaction(function () use ($validated) {
            $totalAmount = 0;

            $order = Order::create([
                'customer_name' => $validated['customer_name'],
                'address' => $validated['address'],
                'phone' => $validated['phone'],
                'status' => 'received',
                'total_amount' => 0,
            ]);

            foreach ($validated['items'] as $item) {
                $menuItem = MenuItem::findOrFail($item['menu_item_id']);

                $price = $menuItem->price;
                $quantity = $item['quantity'];

                $totalAmount += $price * $quantity;

                $order->items()->create([
                    'menu_item_id' => $menuItem->id,
                    'quantity' => $quantity,
                    'price' => $price,
                ]);
            }

            $order->update([
                'total_amount' => $totalAmount,
            ]);

            return $order->load('items.menuItem');
        });

        return response()->json([
            'message' => 'Order created successfully.',
            'data' => $order,
        ], 201);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => [
                'required',
                'in:received,preparing,out_for_delivery,delivered',
            ],
        ]);
    
        $order->update([
            'status' => $validated['status'],
        ]);
    
        return response()->json([
            'message' => 'Order status updated successfully.',
            'data' => $order,
        ]);
    }
    
    public function index()
    {
        $orders = Order::with('items.menuItem')
            ->latest()
            ->get();
    
        return response()->json([
            'data' => $orders,
        ]);
    } 
    
    public function show(Order $order)
    {
        $order->load('items.menuItem');
    
        return response()->json([
            'data' => $order,
        ]);
    } 
    
    public function destroy(Order $order)
    {
        $order->delete();
    
        return response()->json([
            'message' => 'Order deleted successfully.',
        ]);
    }    
}