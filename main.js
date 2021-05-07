const http = require('http');
const MongoClient = require('mongodb').MongoClient;
const querystring = require('querystring');

const url = 'mongodb://localhost:27017';
const dbName = 'nodejs-mongo';
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

const server = http.createServer((request, response) => {
	const { headers, method, url, data } = request;

	let q    = {};
	let body = [];
	let resultados;

	if(method == 'POST'){

		request.on('error', (err) =>{
			console.error(err)
		})
		.on('data', (chunk) =>{
			body.push(chunk)
		})
		.on('end', () =>{
			body = Buffer.concat(body).toString();
			q = querystring.parse(body);
		})

		client.connect().then( async ()=>{

			const db 		 = client.db(dbName)
			const collection = db.collection('usuarios')
			const resultadoGuardado = await collection.insertOne(q)
			resultados = await collection.find({}).toArray()
		}).then( async ()=>{

			response.writeHead( 200 , {'Content-type':'text/html'})
			response.write('<html><body><p>Usuarios en la base de datos:</p>');
				for(let i = 0; i < resultados.length; i++){
					response.write(`<li> ${resultados[i].name} ${resultados[i].phone}</li>`);
				}
			response.write('</body></html>');
			response.end()

		})
		.catch((error)=>{
			response.statusCode = 401;
			console.log(error);
			client.close();
		});


	}else{
		console.log('Metodo de envio no es de tipo POST. Cancelando la peticion.')
		response.end()
	}
})

server.listen(4000, () => {
	console.log('Escuchando peticiones');
	console.log('Abrir en un navegador http://localhost:4000');
});