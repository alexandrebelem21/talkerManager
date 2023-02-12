const rateValidation = (req, res, next) => {
    const { talk } = req.body;

  if (talk.rate === undefined || talk.rate === '') {
    return res.status(400).json({ message: 'O campo "rate" é obrigatório' }); 
   }
      return next();
};

const rateNumValidation = (req, res, next) => {
  const { talk } = req.body;

 if (talk.rate < 1 || talk.rate > 5 || talk.rate % 1 !== 0) {
  return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5',
}); 
 }
    return next();
};

module.exports = { rateValidation, rateNumValidation };