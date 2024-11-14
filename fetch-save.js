const axios = require("axios");
const { MongoClient } = require("mongodb");

// MongoDB connection URI (update if needed)
const mongoURI = "mongodb://localhost:27017";
const dbName = "swapiDB";
const collectionName = "people";

async function fetchDataAndSave() {
    let client;

    try {
        // Connect to MongoDB
        client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        console.log("Connected to MongoDB");

        //Choose a database to work in
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Fetch data from the SWAPI API
        const response = await axios.get("https://swapi.dev/api/people/1/");
        const data = response.data;
        console.log(`data received $data`);

        // Fetch a single person from the database and display it
        const existingPerson = await collection.findOne({ url: data.url });

        // Insert the data into MongoDB
        const result = await collection.insertOne(data);
        console.log("Data saved to MongoDB with ID:", result.insertedId);

    } catch (error) {
        console.error("Error fetching or saving data:", error);

    } finally {
        // Close the MongoDB connection
        if (client) {
            await client.close();
            console.log("MongoDB connection closed");
        }
    }
}

// Run the function
fetchDataAndSave();
