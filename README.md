
# PlayArena - Turf Booking App

PlayArena is a React Native-based mobile application designed to facilitate seamless interaction between players and turf owners. The project consists of two separate apps: one for players and one for turf owners. Turf owners can manage their turfs and bookings, while players can search, book, and share their bookings.

## Features

### Turf Owner App:
- Add and manage turf details.
- View and manage bookings.
- Add manual bookings (e.g., cash bookings).
- Set and update turf pricing for different time slots.
- Store and retrieve turf images using Firebase.

### Player App:
- Search for available turfs.
- Book turfs for selected time slots.
- View and manage personal bookings.
- Share booking details with friends.

## Tech Stack

- **React Native**: For building cross-platform mobile apps.
- **Firebase**: For image storage.
- **Node.js**: Backend server for managing API requests.
- **MongoDB Atlas**: NoSQL database for storing turf and booking data.

## Setup Instructions

1. Clone the repository:

   ```
   git clone https://github.com/your-username/playarena.git
   ```

2. Navigate to the project directory:

   ```
   cd playarena
   ```

3. Install dependencies:

   ```
   npm install
   ```

4. Set up Firebase:
   - Create a Firebase project and enable storage.
   - Update Firebase configuration in the app with your Firebase credentials.

5. Set up the backend:
   - Clone or set up the Node.js backend server.
   - Configure MongoDB Atlas for storing turf and booking data.
   - Install necessary dependencies for the backend server.

6. Run the app:
   - Start the development server:

     ```
     npm start
     ```

   - For iOS:

     ```
     npx react-native run-ios
     ```

   - For Android:

     ```
     npx react-native run-android
     ```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://opensource.org/licenses/MIT)
