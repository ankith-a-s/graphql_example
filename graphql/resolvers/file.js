const { postRequestByUrl } = require('../../helpers/request-helpers');
const { transformFile } = require('../../helpers/file-helpers');

module.exports = {
  createFile: async ({ fileInput: { base64image } }, req) => {
    if (!req.isAuth) throw new Error('Unauthorized request');
    const file = await postRequestByUrl(
      'file',
      {
        base64image: base64image,
      },
      req.headers['authorizationtoken']
    );
    return transformFile(file);
  },
};
