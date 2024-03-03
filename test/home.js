
function createTask(
    title,
    description,
    priority,
    category,
    startDate,
    endDate
  ) {
    const task = {
      title: title,
      description: description,
      priority: priority,
      category: category,
      startDate: startDate,
      endDate: endDate,
    };
    return task;
  }
  
  async function newTask(task) {
    let newTaskUrl = `http://localhost:8080/project3-backend/rest/tasks/addTask`;
  
    try {
      const response = await fetch(newTaskUrl, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
            Authorization: 'Bearer mocked-token',
          },
        body: JSON.stringify(task),
      });
  
      if (!response.ok) {
        // Handle error response
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }
  
      const message = await response.text();
      return message;
    } catch (error) {
      console.error("Error updating task status:", error.message);
      throw new Error("An error occurred while adding the task: " + error.message);
    }
  }
  
  
  module.exports = { createTask, newTask };
  