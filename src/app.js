import express from 'express';
import cors from 'cors';
import { uuid } from 'uuidv4';

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const checkRepositoryMiddleware = (request, response, next) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((project) => project.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: 'Repository not found' });
  }

  request.middlewareData = {};

  request.middlewareData.repositoryIndex = repositoryIndex;
  request.middlewareData.repositoryId = id;

  return next();
};

app.get('/repositories', (request, response) => {
  response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  response.json(repository);
});

app.put('/repositories/:id', checkRepositoryMiddleware, (request, response) => {
  const { title, url, techs } = request.body;
  const { repositoryIndex, repositoryId: id } = request.middlewareData;

  const oldRepository = repositories[repositoryIndex];
  const updatedRepository = {
    id,
    title: title || oldRepository.title,
    url: url || oldRepository.url,
    techs: techs || oldRepository.techs,
  };

  repositories[repositoryIndex] = updatedRepository;

  return response.json(updatedRepository);
});

app.delete('/repositories/:id', (request, response) => {
  // TODO
});

app.post('/repositories/:id/like', (request, response) => {
  // TODO
});

export default app;
