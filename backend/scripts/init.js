require('dotenv').config({ path: '../.env' });
const { exec } = require('child_process');

exec('node ./createBenefitsTable.js', (err, stdout, stderr) => {
  if (err) {
    console.error(`Error executing createBenefitsTable.js: ${err.message}`);
    return;
  }
  console.log(`createBenefitsTable.js output: ${stdout}`);
  if (stderr) {
    console.error(`createBenefitsTable.js stderr: ${stderr}`);
  }

  exec('node ./insertBenefits.js', (err, stdout, stderr) => {
    if (err) {
      console.error(`Error executing insertBenefits.js: ${err.message}`);
      return;
    }
    console.log(`insertBenefits.js output: ${stdout}`);
    if (stderr) {
      console.error(`insertBenefits.js stderr: ${stderr}`);
    }
  });
});