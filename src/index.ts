import express, { Request, Response, NextFunction } from 'express';

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

const app = express();
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const todos: Todo[] = [
  { id: 1, title: 'Buy groceries', completed: false },
  { id: 2, title: 'Write report', completed: false }
];

let nextId = todos.length > 0 ? Math.max(...todos.map((todo) => todo.id)) + 1 : 1;

app.get('/todos', (req: Request, res: Response) => {
  res.json(todos);
});

app.get('/todos/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const todo = todos.find((item) => item.id === id);

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  res.json(todo);
});

app.post('/todos', (req: Request, res: Response) => {
  const { title, completed } = req.body;

  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Missing required field: title' });
  }

  if (completed !== undefined && typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'Completed must be a boolean' });
  }

  const newTodo: Todo = {
    id: nextId++,
    title: title.trim(),
    completed: typeof completed === 'boolean' ? completed : false
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.put('/todos/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const todo = todos.find((item) => item.id === id);

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  const { title, completed } = req.body;

  if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
    return res.status(400).json({ error: 'Invalid title' });
  }

  if (completed !== undefined && typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'Completed must be a boolean' });
  }

  if (title !== undefined) {
    todo.title = title.trim();
  }

  if (completed !== undefined) {
    todo.completed = completed;
  }

  res.json(todo);
});

app.delete('/todos/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = todos.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  const deletedTodo = todos.splice(index, 1)[0];
  res.json(deletedTodo);
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Resource not found' });
});

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
