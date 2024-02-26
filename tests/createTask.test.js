const task1 = require('./createTask');

test('creates a task with the correct properties', () => {
  const title = 'My Task';
  const description = 'This is a test task';
  const priority = 'high';
  const startDate = '2024-01-21';
  const limitDate = '2024-01-28';

  const task = task1.createTask(title, description, priority, startDate, limitDate);

  expect(task.title).toBe(title);
  expect(task.description).toBe(description);
  expect(task.priority).toBe(300);
  expect(task.stateId).toBe(100); 
  expect(task.startDate).toBe(startDate);
  expect(task.limitDate).toBe(limitDate);
});

test('creates a task with default priority and stateId', () => {
    const title = 'My Task';
    const description = 'This is a test task';
    const startDate = '2024-01-21';
    const limitDate = '2024-01-28';
  
    const task = createTask(title, description, undefined, startDate, limitDate);
  
    expect(task.priority).toBe(100);
    expect(task.stateId).toBe(100); 
  });

  test('throws an error for an empty title', () => {
    const title = '';
    const description = 'This is a test task';
    const priority = 'high';
    const startDate = '2024-01-21';
    const limitDate = '2024-01-28';
  
    expect(() => createTask(title, description, priority, startDate, limitDate)).toThrow('Invalid data. Please check all fields and try again');
  });

  
  test('throws an error for an empty description', () => {
    const title = 'My Task';
    const description = '';
    const priority = 'high';
    const startDate = '2024-01-21';
    const limitDate = '2024-01-28';
  
    expect(() => createTask(title, description, priority, startDate, limitDate)).toThrow('Invalid data. Please check all fields and try again');
  });

  
  test('throws an error for an invalid priority', () => {
    const title = 'My Task';
    const description = 'This is a test task';
    const priority = 'invalid'; 
    const startDate = '2024-01-21';
    const limitDate = '2024-01-28';
  
    expect(() => createTask(title, description, priority, startDate, limitDate)).toThrow('Invalid data. Please check all fields and try again');
  });

  
  test('throws an error for an invalid start date', () => {
    const title = 'My Task';
    const description = 'This is a test task';
    const priority = 'high';
    const startDate = '2024-01-21T00:00:00Z'; 
    const limitDate = '2024-01-28';
  
    expect(() => createTask(title, description, priority, startDate, limitDate)).toThrow('Invalid data. Please check all fields and try again');
  });

  
  test('throws an error for an invalid limit date', () => {
    const title = 'My Task';
    const description = 'This is a test task';
    const priority = 'high';
    const startDate = '2024-01-21';
    const limitDate = '2024-01-28T00:00:00Z'; 
  
    expect(() => createTask(title, description, priority, startDate, limitDate)).toThrow('Invalid data. Please check all fields and try again');
  });

  
  test('throws an error for a start date after the limit date', () => {
    const title = 'My Task';
    const description = 'This is a test task';
    const priority = 'high';
    const startDate = '2024-01-29';
    const limitDate = '2024-01-28';
  
    expect(() => createTask(title, description, priority, startDate, limitDate)).toThrow('Invalid data. Please check all fields and try again');
  });

  
  test('throws an error for an invalid date range', () => {
    const title = 'My Task';
    const description = 'This is a test task';
    const priority = 'high';
    const startDate = '2024-01-21';
    const limitDate = '2024-01-14'; 
  
    expect(() => createTask(title, description, priority, startDate, limitDate)).toThrow('Invalid data. Please check all fields and try again');
  });

  
  test('creates a task with valid input', () => {
    const title = 'My Task';
    const description = 'This is a test task';
    const priority = 'high';
    const startDate = '2024-01-21';
    const limitDate = '2024-01-28';
  
    const task = createTask(title, description, priority, startDate, limitDate);
  
    expect(task.title).toBe(title);
    expect(task.description).toBe(description);
    expect(task.priority).toBe(300); 
    expect(task.stateId).toBe(100); 
    expect(task.startDate).toBe(startDate);
    expect(task.limitDate).toBe(limitDate);
  });

  
  
  
