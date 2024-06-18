const fs = require('fs');
const path = require('path');
const lunr = require('lunr');

module.exports = (context, options) => {
  options = options || {};

  return {
    name: 'docusaurus-lunr-hash',
    async contentLoaded({ content, actions }) {
    },
    async postBuild({ routesPaths, outDir, baseUrl }) {
      console.log('docusaurus-lunr-hash: Building search index');

      // Look in the source directory (one up from build) for the MD documents
      const folderPath = path.join(outDir, '../.docusaurus/docusaurus-plugin-content-docs/default');
      const dir = fs.opendirSync(folderPath);
      const files = <string[]>[];
      for await (const dirent of dir) {
        if (dirent.isFile() && dirent.name.endsWith('.json')) {
          files.push(dirent.name);
        }
      }

      const documents = <JSON[]>[];
      for (const file of files) {
        const filePath = path.join(folderPath, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const json = JSON.parse(fileContent);
        documents.push(json);
      }

      const idx = lunr(function () {
        this.ref('id');
        this.field('title');
        this.field('content');

        documents.forEach(function (doc) {
          this.add(doc);
        }, this);
      });
    },
  }
};