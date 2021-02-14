require('dotenv').config()

const { uploadFile, uploadForm } = require('./controllers/uploads') 

const PORT = process.env.PORT || 3000
const HOST = process.env.HOST_NAME || 'http://localhost'
const STATIC_PATH = process.env.STATIC_PATH || 'statics'

const fastify = require('fastify')({ logger: true })

fastify.register(require('fastify-file-upload'))

fastify.post('/fileupload/:fileType', {
  schema: {
    params:{
      fileType: {type: 'string'}
    }
  },
  handler: uploadFile
})

fastify.get('/soy',() => {
  return process.env.VIRTUAL_HOST
})

// Test and dev route for manual test
if(process.env.NODE_ENV == 'development'){
  fastify.get('/', {
    handler: uploadForm
  })
}


const start = async () => {
  try {
    await fastify.listen(PORT,'0.0.0.0')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()



