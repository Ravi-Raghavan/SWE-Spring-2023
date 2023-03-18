const Message = require('./testModel');
const { getPostData } = require('./utils');

async function createMyMessageProcess(req, res){
    try{
        let body = await getPostData(req);
        const sentence = JSON.parse(body);
        const sentenceRef = await Message.createMyMessage(sentence);
        const sentenceId = "all good?";
        const data = {
            id: sentenceId
        };

        res.writeHead(201, {'Content-Type':'application/json'});
        res.end(JSON.stringify(data));
    }catch (err){
        console.log(err);
    }
}

module.exports = {
    createMyMessageProcess
};