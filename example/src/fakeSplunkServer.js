const http = require('http')

const hostname = '127.0.0.1'
const port = 8088

const server = http.createServer((req, res) => {
  let body = []

  req
    .on('data', (chunk) => {
      body.push(chunk)
    })
    .on('end', () => {
      body = Buffer.concat(body).toString()
      console.info(`${req.method} ${req.url} ${body}`)
    })

  res.statusCode = 200
  res.end()
})

server.listen(port, () => {
  console.warn(`Server running at http://${hostname}:${port}/`)
})
