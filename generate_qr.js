const QRCode = require("qrcode");
const path = require("path");
const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const imgDir = path.join(__dirname, "img");

// Ensure img directory exists
if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir);
}

const askQuestion = (query) => {
  return new Promise((resolve) => rl.question(query, resolve));
};

const sanitizeFilename = (url) => {
  try {
    const hostname = new URL(url).hostname;
    return (
      hostname.replace(/[^a-z0-9]/gi, "_").toLowerCase() + "_" + Date.now()
    );
  } catch (e) {
    return "qrcode_" + Date.now();
  }
};

const main = async () => {
  try {
    const url = await askQuestion("Entrez l'URL pour le QR code : ");
    if (!url) {
      console.error("URL vide.");
      rl.close();
      return;
    }

    let defaultName = sanitizeFilename(url);
    const nameInput = await askQuestion(
      `Entrez le nom du fichier (sans extension) [defaut: ${defaultName}] : `,
    );
    const filename = (nameInput.trim() || defaultName) + ".png";
    const filePath = path.join(imgDir, filename);

    await QRCode.toFile(filePath, url, {
        margin: 1,
        width: 1024
    });

    console.log(`\n✅ QR Code généré avec succès : ${filePath}`);
    console.log("\n📋 Copiez ce snippet Markdown :");
    console.log("------------------------------------------------");
    console.log(`![QR Code vers ${url}](img/${filename})`);
    console.log("------------------------------------------------\n");
  } catch (err) {
    console.error("Erreur lors de la génération du QR code :", err);
  } finally {
    rl.close();
  }
};

main();
