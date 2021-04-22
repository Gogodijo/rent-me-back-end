const http = require('http')
const app = require('./app')

const server = http.createServer(app)

server.listen("3001", (err) => {
  if (err) console.error("error starting server: ", err)
  else console.log("Server running on port 3001")
})