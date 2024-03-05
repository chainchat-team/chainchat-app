![ChainChat Demo](/public/assets/images/chainchat-demo.gif)

# ChainChat: Connect with peers

---

## Summary

ChainChat is a collaborative text editor developed with a focus on real-time collaboration and decentralized communication. Inspired by popular tools like Google Docs, the project was initiated with the aim of creating a similar collaborative platform from scratch. Leveraging Conflict-Free Replicated Data Types (CRDT) ensures synchronization among users, while WebRTC technology enables direct messaging capabilities, fostering a private and decentralized environment for document collaboration. To delve deeper into the design and development journey of ChainChat, readers are encouraged to explore the accompanying [case study](https://chainchat-team.github.io/chainchat-site/) .

## How to Run Locally

1. **Clone the repository**

   First, clone the repository to your local machine:

   ```bash
   git clone https://github.com/chainchat-team/chainchat-app.git
   ```

2. **Install the dependencies**

   Navigate to the project directory and install the dependencies:

   ```bash
   cd chainchat-app
   npm install
   ```

3. **Start the development server**

   Start the Vite development server:

   ```bash
   npm run dev
   ```

   This will start the server and open the application in your default web browser. If it doesn't open automatically, you can navigate to `http://localhost:3000` in your web browser.

You can also run the application using Docker:

1. **Build the Docker image**

   First, build the Docker image:

   ```bash
   docker build -t chainchat . && docker image prune -f
   ```

   This will create a Docker image named `chainchat`.

2. **Run the Docker image**

   Then, run the Docker image:

   ```bash
   docker run --rm -p 3000:3000 chainchat
   ```

   This will start the application and make it available at `http://localhost:3000`.
