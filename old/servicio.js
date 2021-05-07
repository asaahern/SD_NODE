// Importar el cliente de MongoDB
const MongoClient = require('mongodb').MongoClient;


// Importar el modulo http de Node.js para crear un servicio web
const http = require('http');
// Definir el puerto a utilizar
const port = 8080;


// Importar el modulo querystring para traducir el cuerpo de la peticion a variables que se puedan utilizar
const querystring = require('querystring');


// Crear el servidor
const server = http.createServer((request, response) => {
	// Extraer el contenido de la petición
	const { headers, method, url } = request;
	console.log('headers: ', headers);
	console.log('method: ', method);
	console.log('url: ', url);

	let body = []; 
	request.on('error', (err) => {
    	console.error(err);
	}).on('data', (chunk) => {
		// El cuerpo de la peticion puede venir en partes, aqui se concatenan
    	body.push(chunk);
	}).on('end', () => {
		// El cuerpo de la peticion esta completo
		body = Buffer.concat(body).toString(); console.log('body: ', body);
        let document = querystring.parse(body);

        // Definir el código de estado HTTP que se devuelve
        response.statusCode = 200;
        // Definir el tipo de los encabezados de la respuesta (texto plano)
        response.setHeader('Content-Type', 'text/plain');


		// Especificar la URL de conexión al servidor local
		const url = 'mongodb://localhost:27017';
		// Nombre de la base de datos a la que conectarse
		const dbName = 'nodejs-mongo';
		// Crear una instancia del cliente de MongoDB
		const client = new MongoClient(url, {useNewUrlParser: true});
		// Conectar el cliente de MongoDB al servidor
		client.connect().then(async () => {
			console.log("Conectado con éxito al servidor");

			const db = client.db(dbName);
			try {
				// Obtener la referencia a la colección
				const Mycollection = db.collection('usuarios');

				// funciones para insertar y actualizar datos
				await Mycollection.insertOne(document);

            	let read_db = await Mycollection.find({}).toArray();

            	response.write(JSON.stringify(read_db));
            	response.end();
            }
            finally {
				client.close()
			}
		});
	});
});

// Ejecutar el servicio para que permanezca a la espera de peticiones
server.listen(port, () => {
	console.log('Servidor ejecutándose...');
	console.log('Abrir en un navegador http://localhost:8080');
});