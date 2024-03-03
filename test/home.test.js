// Import the jsdom package
const { JSDOM } = require('jsdom');

// Create a DOM environment using jsdom
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;

// Now you can mock DOM elements
document.getElementById = jest.fn(id => ({
  value: '', // Mocking value attribute
  innerText: '', // Mocking innerText attribute
}));

const { createTask, newTask } = require('./home');

// Mock the sessionStorage getItem method
global.sessionStorage = {
  getItem: jest.fn(() => 'mocked-token'),
};

describe('createTask', () => {
  test('creates a task object with provided data', () => {
    const task = createTask('Task Title', 'Task Description', 'HIGH_PRIORITY', 'Work', '2024-03-04', '2024-03-05');
    expect(task).toEqual({
      title: 'Task Title',
      description: 'Task Description',
      priority: 'HIGH_PRIORITY',
      category: 'Work',
      startDate: '2024-03-04',
      endDate: '2024-03-05',
    });
  });
});

describe('newTask', () => {
  test('sends a POST request with task data', async () => {
    const task = {
      title: 'Task Title',
      description: 'Task Description',
      priority: 'HIGH_PRIORITY',
      category: 'Work',
      startDate: '2024-03-04',
      endDate: '2024-03-05',
    };

    await newTask(task);

    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/project3-backend/rest/tasks/addTask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
        Authorization: 'Bearer mocked-token',
      },
      body: JSON.stringify(task),
    });
  });

  test('throws an error when POST request fails', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: false, text: () => Promise.resolve('Error message') }));

    const task = {
      title: 'Task Title',
      description: 'Task Description',
      priority: 'HIGH_PRIORITY',
      category: 'Work',
      startDate: '2024-03-04',
      endDate: '2024-03-05',
    };

    await expect(newTask(task)).rejects.toThrow('An error occurred while adding the task: Error message');
  });
});
