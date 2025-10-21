"use strict";
const axios = require("axios");
const mime = require("mime-types");

async function downloadBuffer(url) {
  const { data, headers } = await axios.get(url, {
    responseType: "arraybuffer",
    timeout: 20000,
  });
  const contentType =
    headers["content-type"] || mime.lookup(url) || "application/octet-stream";
  return { buffer: Buffer.from(data), contentType };
}

/**
 * Téléverse un fichier dans Strapi Upload et renvoie l'objet média créé
 * @param {object} strapi
 * @param {string} url - URL publique du fichier
 * @param {string} filename - nom de fichier souhaité
 * @param {object} [data] - métadonnées (ex: { folder: '/posters' })
 */
module.exports = async function uploadFromUrl(
  strapi,
  url,
  filename,
  data = {}
) {
  const { buffer, contentType } = await downloadBuffer(url);
  const file = {
    name: filename,
    type: contentType,
    size: buffer.length,
    buffer,
  };

  const uploadService = strapi.plugin("upload").service("upload");
  const res = await uploadService.upload({
    data,
    files: file,
  });

  return Array.isArray(res) ? res[0] : res;
};
