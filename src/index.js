const express = require('express');
const crypto = require('crypto');
const validator = require('validator');

const { readFile, writeFile } = require('./talker');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar.
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

app.get('/talker', async (req, res) => {
  const talkers = await readFile();

  return res.status(200).json(talkers);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talkers = await readFile();
  const talker = talkers.find((tlk) => tlk.id === Number(id));

  if (!talker) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  return res.status(200).json(talker);
});

function generateToken() {
  return crypto
    .randomBytes(16)
    .toString('hex')
    .slice(0, 16);
}

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const token = generateToken();
  if (!email) {
 return res.status(400).json({ message: 'O campo "email" é obrigatório' }); 
}
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  if (!password) {
    return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  await writeFile(email, password);
  return res.status(200).json({ token });
});
