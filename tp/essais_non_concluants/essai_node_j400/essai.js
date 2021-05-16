const config = {
    host: '127.0.0.1',
    user: 'db2admin',
    password: 'db2admin'
}
const db2Pool = require('node-jt400').pool(config);

async function monTest(){
	try {
		const results = await db2Pool.query('SELECT code, name, change FROM myDB.Devise WHERE change>=? ', [0.92]);
		console.log('result');
		const field1 = result[0].name;
		console.log(field1);
	}
	catch (error) {
		console.log('error');
		console.log(error);
	}
}

monTest();