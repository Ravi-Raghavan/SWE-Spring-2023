function getPostData(req) {
    return new Promise((resolve, reject) => {
        try {
            let bodyData = '';
            req.on('data', (chunk) => {
                bodyData += chunk.toString()
            });
            req.on('end', () => {
                resolve(bodyData);
            })
        } catch (err) {
            console.log(err);
        }
    })
}

module.exports = {
    getPostData
};