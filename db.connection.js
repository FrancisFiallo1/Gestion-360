const MongoClient = require('mongodb').MongoClient;

const getConnection = async () => {
    try {
        const { DB_USER: user, DB_PASS: password, DB: dbName } = process.env;
        const uri = `mongodb+srv://${user}:${password}@gestion360db.5v1x4mb.mongodb.net/${dbName}?retryWrites=true&w=majority`;
        const mongoClient = new MongoClient(uri);   
        await mongoClient.connect();
        console.log('connected to MongoDB Atlas'); 
        return mongoClient.db(dbName)
    } catch (error) {
        console.log(error)
    }
}

module.exports = getConnection;