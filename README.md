# E-Commerce Application

This is an Angular-based e-commerce application that allows users to browse products, add them to a cart, and manage their purchases. The project is designed to demonstrate clean architecture, reusable components, and responsive design.

## Features

- **Product Listing**: View a list of products with details such as name, price, and availability.
- **Cart Management**: Add products to the cart, adjust quantities, and view the total price.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **API Integration**: Fetch product data from a mock API.
- **Error Handling**: Fallback mechanisms for missing images and invalid inputs.

## Project Structure
```sh
src/
├── app/
│   ├── components/       # Reusable components (e.g., product, cart)
│   ├── models/           # TypeScript models for data structures
│   ├── resolvers/        # Route resolvers for preloading data
│   ├── services/         # Services for API calls and state management
│   ├── app.component.*   # Root component
│   ├── app.routes.ts     # Application routes
├── index.html            # Main HTML file
├── main.ts               # Application entry point
├── styles.scss           # Global styles
```
## Installation

1. Clone the repository:
```sh
git clone https://github.com/HunSpeedi/e-commerce.git
cd e-commerce
```

2. Install dependencies:
```sh
npm install
```
3. Start the development server:
```sh
ng serve
```
4. Open the application in your browser at http://localhost:4200.

## Scripts

- **Build**: Build the project for production:
```sh
npm run build
```

- **Lint**: Run linting checks:
```sh
npm run lint
```
- **Test**: Run unit tests:
```sh
npm run test
```

## API

The application fetches product data from a mock API:
```sh
https://63c10327716562671870f959.mockapi.io/products
```
