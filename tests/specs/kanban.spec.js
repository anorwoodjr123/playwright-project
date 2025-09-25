const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const KanbanPage = require('../pages/KanbanPage');
const projects = require('../data/projects.json');
const cards = require('../data/cards.json');
const { login, verifyAllCardDetailsOnBoard, getProjectKey } = require('../utils/helpers');

test.describe('Kanban Board - Comprehensive Test Suite', () => {
  let loginPage;
  let kanbanPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    kanbanPage = new KanbanPage(page);
    
    // Login before each test using credentials from environment
    await login(loginPage);
    await kanbanPage.waitForPageLoad();
  });


  test.describe('Project-Level Verification - Data-Driven Kanban Board Tests', () => {
    // Data-driven test for all projects
    projects.projects.forEach((project) => {
      test(`should verify ${project.name} project structure and column counts`, async () => {
        // Navigate to the project and verify it loads with correct title and subtitle
        await kanbanPage.navigateToProject(project.name);
        await kanbanPage.verifyProjectLoaded(project.name, project.subtitle);
        
        // Verify basic kanban board functionality (common across all projects)
        await kanbanPage.verifyBasicKanbanBoardFunctionality();
        
        // Verify column counts match expected data
        await kanbanPage.verifyColumnCounts(project.expectedCards);
        
        // Verify project has the expected total number of cards
        const projectKey = getProjectKey(project.name);
        const projectCards = cards[projectKey];
        const totalExpectedCards = project.expectedCards.toDo + 
                                  project.expectedCards.inProgress + 
                                  project.expectedCards.review + 
                                  project.expectedCards.done;
        
        const totalActualCards = projectCards.toDo.length + 
                                projectCards.inProgress.length + 
                                projectCards.review.length + 
                                projectCards.done.length;
        
        // Verify that the test data is internally consistent - the total number of cards
        // in cards.json should match the expected counts from projects.json
        expect(totalActualCards).toBe(totalExpectedCards);
      });
    });
  });

  test.describe('Card Verification Tests', () => {
    // Verify all card details for each project
    projects.projects.forEach(project => {
      test(`should verify all cards in ${project.name}`, async () => {
        // Navigate to the project
        await kanbanPage.navigateToProject(project.name);
        
        // Verify basic kanban board functionality
        await kanbanPage.verifyBasicKanbanBoardFunctionality();
        
        // Verify ALL cards in each column
        const projectKey = getProjectKey(project.name);
        await verifyAllCardDetailsOnBoard(kanbanPage, cards[projectKey]);
      });
    });
  });

  test.describe('Verify logout', () => {
    test('should logout successfully', async () => {
      // Click logout button
      await kanbanPage.logout();
      
      // Verify redirected to login page
      await expect(loginPage.pageTitle).toBeVisible();
    });
  });
});
