// Importar el cliente de MongoDB
const MongoClient = require('mongodb').MongoClient;

// Especificar la URL de conexión por defecto al servidor local
const url = 'mongodb://localhost:27017';

// Nombre de la base de datos a la que conectarse
const dbName = 'nodejs-mongo';

// Crear una instancia del cliente de MongoDB
const client = new MongoClient(url, {useNewUrlParser: true});

// Conectar el cliente al servidor
client.connect().then(async () => {

	console.log("Conectado con éxito al servidor");

	const db = client.db(dbName);

	// Obtener la referencia a la colección
	const collection = db.collection('usuarios');

	// Definir documento
	const document = {
		"name": "Alan",
		"phone": "111-222-3333"
	};

	// Llamar a la función para insertar
	const insertResult = await collection.insertOne(document);
	console.log("Resultado de la inserción: ", insertResult.result);

	// Definir filtro
	const filter = { "name": "Alan" };

	// Llamar a la función para actualizar
	const updateResult = await collection.updateOne(filter,
	{ $set: { "updated": true } });
	console.log("Resultado de la actualización: ", updateResult.result);

	// Llamar a la función para eliminar
	const deleteResult = await collection.deleteOne(filter);
	console.log("Resultado de la eliminación: ", deleteResult.result);

	// Llamar a la función para recuperar
	const findResult = await collection.find({}).toArray();
	console.log("Documentos recuperados: ", findResult);
	client.close();
	}).catch((error) => {
		console.log("Se produjo algún error en las operaciones con la base de datos: " + error);

		client.close();

});