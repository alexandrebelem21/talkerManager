const fs = require('fs/promises');
const path = require('path');

const express = require('express');
const crypto = require('crypto');

const { readFile, writeFile } = require('./talker');
const fieldValidation = require('./middlewares/fieldValidation');
const ageValidation = require('./middlewares/ageValidation');
const nameValidation = require('./middlewares/nameValidation');
const talkValidation = require('./middlewares/talkValidation');
const { rateValidation, rateNumValidation } = require('./middlewares/rateValidation');
const tokenValidation = require('./middlewares/tokenValidation');

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

app.post('/login', fieldValidation, async (req, res) => {
  const { email, password } = req.body;
  const token = generateToken();

  await writeFile(email, password);
  return res.status(200).json({ token });
});

app.post('/talker',
tokenValidation,
nameValidation,
ageValidation, 
talkValidation,
rateValidation,
rateNumValidation,
async (req, res) => {
  const { name, age, talk: { watchedAt, rate } } = req.body;
  const dados = await readFile();
  const newTalker = {
    id: dados.length + 1,
    name,
    age,
    talk: {
      watchedAt,
      rate,
    },
  };
  dados.push(newTalker);
  await fs.writeFile(path.resolve(__dirname, './talker.json'), JSON.stringify(dados), 'utf-8');
  return res.status(201).json(newTalker);
});

app.put('/talker/:id',
tokenValidation,
nameValidation,
ageValidation, 
talkValidation,
rateValidation,
rateNumValidation,
async (req, res) => {
  const { id } = req.params;
  const { name, age, talk: { watchedAt, rate } } = req.body;
  const dados = await readFile();
  const dadosId = dados.findIndex((tlk) => tlk.id === Number(id));
  // findIndex usado para pegar diretamente o index. Usando so o find
  // precisaria fazer algo como const index = dados.indexOf(dadosId);
  const updateTalker = {
    id: Number(id),
    name,
    age,
    talk: {
      watchedAt,
      rate,
    },
  };
  dados[dadosId] = updateTalker;
  await fs.writeFile(path.resolve(__dirname, './talker.json'), JSON.stringify([...dados]), 'utf-8');
  return res.status(200).json(updateTalker);
});
