function createTask(title, description, priority, startDate, limitDate) { // Cria uma nova task com os dados inseridos pelo utilizador
    let todoStateId = 'todo';
    let newPriority = parsePriorityToInt(priority);
    const task = {
    title: title,
    description: description,
    stateId: parseStateIdToInt(todoStateId),
    priority: newPriority,
    startDate: startDate,
    limitDate: limitDate
    }
    return task;
  }
  module.exports = {createTask};