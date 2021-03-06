import { Router } from 'express';
import multer from 'multer';

import {getCustomRepository} from 'typeorm';

 import TransactionsRepository from '../repositories/TransactionsRepository';
 import CreateTransactionService from '../services/CreateTransactionService';
 import DeleteTransactionService from '../services/DeleteTransactionService';
 import ImportTransactionsService from '../services/ImportTransactionsService';

import uploadConfig from '../config/upload';


const upload = multer(uploadConfig);

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transactionsRepository.find();
  const balance = await transactionsRepository.getBalance();

  return response.json({transactions, balance});
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category} = request.body;

  const CreateTransaction = new CreateTransactionService();

  const transaction = await CreateTransaction.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const {id} = request.params;

  const deletetransaction = new DeleteTransactionService();

  await deletetransaction.execute(id);

  return response.status(204).send();
});

transactionsRouter.post('/import', upload.single('file'), async (request, response) => {
  const ImportTransactions = new ImportTransactionsService();

  const transactions = await ImportTransactions.execute(request.file.path);

  return response.json(transactions);
  
});

export default transactionsRouter;
