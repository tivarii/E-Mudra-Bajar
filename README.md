# E-Mudra-Bajar

**E-Mudra-Bajar** is a real-time stock trading application designed to facilitate stock purchasing and selling with support for both limit and market orders. This application utilizes WebSockets for live updates, Redis for fast data processing, and TimescaleDB for time-series data storage, aiming to provide a scalable, responsive, and robust trading experience.

## Architecture
 
![art](https://github.com/user-attachments/assets/e0af25b0-231f-4b93-baba-10c42f10d6ee)

## Features

- **Real-Time Order Placement**: Users can place market and limit orders for various stocks.
- **Order Management**: View, delete, or check the status of orders.
- **Real-Time Data Streams**: Real-time WebSocket streams for market depth, order books, and ticker data.
- **Quotes and Liquidity**: Ability to request market quotes and ensure liquidity through the Market Maker component.

## Architecture

The system is structured into several core components:

### API Component (Node.js)
- Handles requests from the frontend, such as placing orders or retrieving quotes.
- Pulls data into a Redis queue and subscribes to updates, passing processed data to the frontend.

### Engine Component
- Consumes data from the Redis queue, processes it, and updates market metrics such as depth, kline, and order book.
- Publishes updates to the WebSocket component, which provides real-time data to the frontend.
- Passes processed data to another Redis queue for the database component.

### WebSocket Component
- Provides real-time data streams, including current prices, recent trades, order books, and graphical data.
- Publishes processed data for frontend consumption using Redis pub/sub.

### Database (DB) Component (TimescaleDB)
- Stores processed data in TimescaleDB for time-series data management, updating records every second, minute, and hour.

### Market Maker (MM) Component
- Ensures liquidity by constantly updating and balancing the market through active buy/sell orders.

## Repository Structure

Here's an overview of the main components and recent updates:

- **API**: Added WebSocket component to handle real-time data (4 days ago).
- **DB**: Integrated TimescaleDB for efficient data storage (4 days ago).
- **Docker**: Configured `docker-compose.yml` for TimescaleDB and Redis initialization (3 days ago).
- **Engine**: Added tests for order book and frontend setup (47 minutes ago).
- **Frontend (Next.js)**: Added tests for order book and frontend setup (47 minutes ago).
- **MM**: Implemented Market Maker to maintain liquidity (3 days ago).
- **WebSocket (WS)**: WebSocket component setup (4 days ago).
- **.gitignore**: Project setup files ignored (2 weeks ago).
- **README.md**: Initial project setup documentation (2 weeks ago).

## API Endpoints

### Orders

- **Place an Order**  
  - **Endpoint**: `POST /api/v1/order`
  - **Request Parameters**:
    - `type`: `limit` or `market`
    - `kind`: `buy` or `sell`
    - `price`: `number` (for limit orders)
    - `quantity`: `number`
    - `market`: string (e.g., `TATA-INR`)
  - **Response**:
    - `orderId`: Unique order identifier
    - `fillStatus`: Status of order fill

- **Get Order Status**  
  - **Endpoint**: `GET /api/v1/order/:orderId`
  - **Description**: Retrieves the status of an existing order.

- **Delete an Order**  
  - **Endpoint**: `DELETE /api/v1/order/:orderId`
  - **Description**: Removes an unfilled order from the book.

- **Get a Quote**  
  - **Endpoint**: `POST /api/v1/order/quote`
  - **Request Parameters**:
    - `kind`: `buy` or `sell`
    - `quantity`: `number`
    - `market`: string (e.g., `TATA-INR`)
  - **Description**: Provides a quote based on specified order type, quantity, and market.

## Real-Time WebSocket Streams

The WebSocket component manages several real-time streams essential for stock trading:

- **Current Price**: Tracks live price movements.
- **Order Book**: Provides real-time updates on buy/sell orders.
- **Recent Trades**: Displays recent trade history.
- **Graph Data**: Updates graphical data for price and order trends.

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/E-Mudra-Bajar.git
   cd E-Mudra-Bajar

2. **Start Docker Containers** (for TimescaleDB and Redis)
   ```bash
   docker-compose up -d
3. **cd/eachComponet and run "npm run dev"
