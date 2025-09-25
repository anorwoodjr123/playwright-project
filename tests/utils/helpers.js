/**
 * Helper utilities for Playwright tests
 * Focused on actual test requirements for this assessment
 */

/**
 * Login using environment variables
 * @param {Object} loginPage - The LoginPage instance
 */
async function login(loginPage) {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  await loginPage.goto();
  await loginPage.login(email, password);
}

/**
 * Helper function to verify all cards in a project
 * @param {Object} kanbanPage - The KanbanPage instance
 * @param {Object} projectCards - The project cards data from JSON
 */
async function verifyAllCardDetailsOnBoard(kanbanPage, projectCards) {
  const columns = ["toDo", "inProgress", "review", "done"];

  for (const column of columns) {
    if (projectCards[column]) {
      for (const card of projectCards[column]) {
        // Verify each card's details: title, description, tags, assignee, and due date
        // This ensures test data exactly matches what's displayed in the UI
        await kanbanPage.verifyCardDetails(card);
      }
    }
  }
}

/**
 * Helper function to convert project name to JSON key
 * @param {string} projectName - The project name from UI
 * @returns {string} - The corresponding JSON key
 */
function getProjectKey(projectName) {
  const keyMap = {
    'Web Application': 'webApplication',
    'Mobile Application': 'mobileApplication',
    'Marketing Campaign': 'marketingCampaign'
  };
  return keyMap[projectName];
}

module.exports = {
  login,
  verifyAllCardDetailsOnBoard,
  getProjectKey
};
