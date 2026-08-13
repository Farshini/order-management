# Order Management System

A full-stack food order management application built with **Laravel REST API** and **Next.js**.

The application allows customers to browse menu items, add items to a cart, adjust quantities, provide delivery details, place orders, and track simulated order status updates.

## Tech Stack

### Backend

* Laravel
* PHP
* MySQL
* Laravel Eloquent ORM
* REST API
* PHPUnit / Laravel Feature Tests

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

## Features

### Menu

* Retrieve available menu items from the Laravel API
* Display item name, description, price, and image
* Responsive menu interface

### Cart

* Add menu items to cart
* Increase/decrease item quantity
* Remove items from cart
* Calculate cart total
* Display cart item count

### Checkout

Customers can provide:

* Name
* Delivery address
* Phone number

The frontend sends the order details to the Laravel API.

### Order Management

The backend supports:

* Create an order
* Retrieve all orders
* Retrieve a single order
* Delete an order
* Update order status
* Validate order data
* Calculate the order total
* Store order items and their prices

### Order Status

Orders follow a simulated status flow:

```text
received
   ↓
preparing
   ↓
out_for_delivery
```

The frontend uses timed API requests to simulate real-time order status progression.

## API Endpoints

| Method | Endpoint                     | Description             |
| ------ | ---------------------------- | ----------------------- |
| GET    | `/api/menu-items`            | Retrieve menu items     |
| GET    | `/api/orders`                | Retrieve all orders     |
| POST   | `/api/orders`                | Create a new order      |
| GET    | `/api/orders/{order}`        | Retrieve a single order |
| DELETE | `/api/orders/{order}`        | Delete an order         |
| PATCH  | `/api/orders/{order}/status` | Update order status     |

## Example Order Request

```json
{
  "customer_name": "Farshini",
  "address": "Kochi, Kerala",
  "phone": "9876543210",
  "items": [
    {
      "menu_item_id": 1,
      "quantity": 2
    },
    {
      "menu_item_id": 2,
      "quantity": 1
    }
  ]
}
```

## Testing

The backend follows a **test-driven development (TDD)** approach for the main order functionality.

The test suite covers:

* Order creation
* Required field validation
* Invalid menu item validation
* Invalid quantity validation
* Order status updates
* Invalid order status validation
* Order listing
* Single order retrieval
* Order deletion
* Menu item retrieval

Current test result:

```text
12 tests passed
53 assertions
```

Run the Laravel test suite with:

```bash
cd order-management-api
php artisan test
```

## Backend Setup

Clone the repository:

```bash
git clone https://github.com/Farshini/order-management.git
cd order-management/order-management-api
```

Install PHP dependencies:

```bash
composer install
```

Create the environment file:

```bash
cp .env.example .env
```

Generate the Laravel application key:

```bash
php artisan key:generate
```

Configure the database in `.env`.

Run migrations and seed the menu data:

```bash
php artisan migrate --seed
```

Start the Laravel development server:

```bash
php artisan serve
```

The API will be available at:

```text
http://127.0.0.1:8000
```

## Frontend Setup

Open another terminal:

```bash
cd order-management/order-management-web
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file in `order-management-web` and add the Laravel API URL:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000

Configure the API URL in `.env.local`.

Start the development server:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:3000
```

## Production Build

To verify the Next.js application can be built for production:

```bash
npm run build
```

The production build completes successfully.

## Project Structure

```text
order-management/
│
├── order-management-api/
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   └── Resources/
│   │   └── Models/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   │   └── api.php
│   └── tests/
│       └── Feature/
│
├── order-management-web/
│   ├── app/
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── lib/
│   │   └── api.ts
│   └── public/
│
└── README.md
```

## Architecture

```text
Next.js Frontend
       │
       │ HTTP / REST API
       ▼
Laravel API
       │
       ▼
MySQL Database
```

The frontend is responsible for the customer interface, cart, checkout, and order tracking.

The Laravel backend handles business logic, validation, order processing, persistence, and status updates.

## Notes

The order status progression is intentionally simulated for the assessment requirement. The frontend triggers status updates through the Laravel API at timed intervals rather than using WebSockets or a third-party real-time service.

## Repository

GitHub:

https://github.com/Farshini/order-management
