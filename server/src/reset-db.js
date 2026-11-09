import db from './db.js'
db.prepare('DELETE FROM orders').run()
db.prepare('DELETE FROM messages').run()
db.prepare('DELETE FROM products').run()
console.log('Store data cleared. Restart the API to seed the sample catalog again.')
