const formidable = require('formidable');
const mv = require('mv')
const path = require('path')
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');


const PORT = process.env.PORT || 3000
const HOST = process.env.HOST_NAME || 'http://localhost'
const STATIC_PATH = process.env.STATIC_PATH || 'statics'

async function uploadFile(req, reply) {
    // some code to handle file
    const files = req.raw.files
    if(!files) return new Error('form-data: filetoupload is required')
    // console.log(req.raw.files);
    // reply.send(files)
    // return
    const uploadType = req.params.fileType
    

    try {
        fs.mkdirSync(path.join(__dirname,`../${STATIC_PATH}/${uploadType}/`))
    } catch (err) {
        if (err.code !== 'EEXIST') { // already exists!
            throw Error(err)
        }
    }

    
    
    let fileArr = []
    const moveFiles = Array.isArray(files.filetoupload)?files.filetoupload:files
    // console.log()
    // return
    for(let key in moveFiles){
        const stringDate = `${new Date().getMonth()}_${new Date().getDate()}_${new Date().getFullYear()}`
        const newFileName = `original_${uuidv4()}_${stringDate}.webp`
        moveFiles[key].mv(path.join(__dirname,`../${STATIC_PATH}/${uploadType}/${newFileName}`))
        fileArr.push({
            permalink: `${HOST}/${STATIC_PATH}/${uploadType}/${newFileName}`,
            mimetype: moveFiles[key].mimetype
        })
    }
    reply.send(fileArr)
  }



async function uploadForm(request, reply) {
    reply.raw.writeHead(200, { 'Content-Type': 'text/html' })
    reply.raw.write('<form action="fileupload/localTest" method="post" enctype="multipart/form-data">');
    reply.raw.write('<input type="file" name="filetoupload"><br>');
    reply.raw.write('<input type="submit">');
    reply.raw.write('</form>');
    reply.raw.end()
}

module.exports = {
    uploadFile,
    uploadForm
}