const crypto = require("crypto");
const { pki } = require("node-forge");
const path = require("path");
const fs = require("fs/promises");

const SSL_CERT_DIR = path.resolve(__dirname, "..", ".ssl");
const CERT_FILE = path.resolve(SSL_CERT_DIR, "certificate.pem");
const KEY_FILE = path.resolve(SSL_CERT_DIR, "private-key.pem");

/**
 * @type {{ name: string, value: string }[]}
 */
const CERT_ATTRS = [
  {
    name: "commonName",
    value: "localhost",
  },
  {
    name: "countryName",
    value: "AU",
  },
  {
    name: "stateOrProvinceName",
    value: "New South Wales",
  },
  {
    name: "localityName",
    value: "Sydney",
  },
  {
    name: "organizationName",
    value: "Test",
  },
  {
    name: "organizationalUnitName",
    value: "Test",
  },
];

/**
 * @return {Promise<{ publicKey: string, privateKey: string }>}
 */
const generateRsaKeys = async () =>
  new Promise((resolve, reject) => {
    crypto.generateKeyPair(
      "rsa",
      {
        modulusLength: 2096,
        publicKeyEncoding: {
          type: "spki",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs8",
          format: "pem",
        },
      },
      (err, publicKey, privateKey) => {
        if (err) {
          reject(err);
        } else {
          resolve({ publicKey, privateKey });
        }
      }
    );
  });

/**
 * @param {object} opts
 * @param {string} opts.privateKey
 * @param {string} opts.publicKey
 * @return {string}
 */
const generateCertificate = (opts) => {
  const privateKey = pki.privateKeyFromPem(opts.privateKey);
  const publicKey = pki.publicKeyFromPem(opts.publicKey);

  const cert = pki.createCertificate();

  cert.publicKey = publicKey;
  cert.serialNumber = "01";
  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);

  cert.setSubject(CERT_ATTRS);
  cert.setIssuer(CERT_ATTRS);

  // the actual certificate signing
  cert.sign(privateKey);

  // now convert the Forge certificate to PEM format
  return pki.certificateToPem(cert);
};

/**
 * @param {string} cert
 * @param {string} privateKey
 * @return {Promise<void>}
 */
const writeCertFiles = async ({ cert, privateKey }) => {
  await fs.mkdir(SSL_CERT_DIR, { recursive: true });
  await Promise.all([
    fs.writeFile(CERT_FILE, cert, { encoding: "utf8" }),
    fs.writeFile(KEY_FILE, privateKey, { encoding: "utf8" }),
  ]);
};

/**
 * @return {Promise<boolean>}
 */
const cerfFilesExist = async () => {
  try {
    await Promise.all([
      fs.access(CERT_FILE, fs.constants.R_OK | fs.constants.W_OK),
      fs.access(KEY_FILE, fs.constants.R_OK | fs.constants.W_OK),
    ]);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * @return {Promise<{ keyFile: string, certFile: string }>}
 */
const maybeCreateCertificates = async () => {
  if (!(await cerfFilesExist())) {
    const keys = await generateRsaKeys();
    const cert = generateCertificate(keys);
    await writeCertFiles({ cert, privateKey: keys.privateKey });
  }

  return {
    certFile: CERT_FILE,
    keyFile: KEY_FILE,
  };
};

module.exports = {
  maybeCreateCertificates,
};
