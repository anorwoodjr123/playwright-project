const { expect } = require('@playwright/test');

class KanbanPage {
  constructor(page) {
    this.page = page;
    
    // Navigation selectors (verified against actual DOM)
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
    this.projectsSidebar = page.locator('.w-64.bg-gray-800');
    this.projectsHeading = page.getByRole('heading', { name: 'Projects' });
    
    // Project navigation selectors (based on actual DOM structure)
    this.webApplicationProject = page.locator('nav button').filter({ hasText: 'Web Application' });
    this.mobileApplicationProject = page.locator('nav button').filter({ hasText: 'Mobile Application' });
    this.marketingCampaignProject = page.locator('nav button').filter({ hasText: 'Marketing Campaign' });
    
    // Main content selectors
    this.mainContentArea = page.locator('.flex-1.flex.flex-col.bg-gray-100');
    this.kanbanColumnsContainer = page.locator('.inline-flex.gap-6.p-6.h-full');
    
    // Column selectors (based on actual DOM structure)
    this.toDoColumn = page.locator('.flex.flex-col.w-80.bg-gray-50.rounded-lg.p-4').filter({ hasText: 'To Do' });
    this.inProgressColumn = page.locator('.flex.flex-col.w-80.bg-gray-50.rounded-lg.p-4').filter({ hasText: 'In Progress' });
    this.reviewColumn = page.locator('.flex.flex-col.w-80.bg-gray-50.rounded-lg.p-4').filter({ hasText: 'Review' });
    this.doneColumn = page.locator('.flex.flex-col.w-80.bg-gray-50.rounded-lg.p-4').filter({ hasText: 'Done' });
    
    // Card selectors (based on actual DOM structure)
    this.cardContainer = page.locator('.bg-white.p-4.rounded-lg.shadow-sm.border.border-gray-200');
  }

  // Navigation methods
  async logout() {
    await this.logoutButton.click();
  }

  async navigateToProject(projectName) {
    switch (projectName) {
      case 'Web Application':
        await this.webApplicationProject.click();
        break;
      case 'Mobile Application':
        await this.mobileApplicationProject.click();
        break;
      case 'Marketing Campaign':
        await this.marketingCampaignProject.click();
        break;
      default:
        throw new Error(`Unknown project: ${projectName}`);
    }
  }

  // Verification methods
  async verifyProjectLoaded(projectName, subtitle) {
    // Verify project title in main content area (use heading role to be more specific)
    await expect(this.mainContentArea.getByRole('heading', { name: projectName })).toBeVisible();
    await expect(this.mainContentArea.getByText(subtitle)).toBeVisible();
  }

  async verifyColumnCounts(expectedCounts) {
    // Verify all column counts using data-driven approach
    const columns = [
      { element: this.toDoColumn, name: 'To Do', count: expectedCounts.toDo },
      { element: this.inProgressColumn, name: 'In Progress', count: expectedCounts.inProgress },
      { element: this.reviewColumn, name: 'Review', count: expectedCounts.review },
      { element: this.doneColumn, name: 'Done', count: expectedCounts.done }
    ];

    for (const column of columns) {
      await expect(column.element).toContainText(`${column.name} (${column.count})`);
    }
  }

  async verifyCardDetails(cardData) {
    // Find card by title (using the actual card container class)
    const card = this.cardContainer.filter({ hasText: cardData.title });
    
    // Verify card title (h3 element)
    await expect(card.getByRole('heading', { name: cardData.title })).toBeVisible();
    
    // Verify card description (p element)
    await expect(card.getByText(cardData.description)).toBeVisible();
    
    // Verify tags (span elements with specific classes)
    for (const tag of cardData.tags) {
      const tagElement = card.locator('span').filter({ hasText: tag });
      await expect(tagElement).toBeVisible();
      await expect(tagElement).toHaveText(tag);
    }
    
    // Verify assignee (in the flex container with user icon)
    const assigneeElement = card.getByText(cardData.assignee);
    await expect(assigneeElement).toBeVisible();
    await expect(assigneeElement).toHaveText(cardData.assignee);
    
    // Verify due date (in the flex container with calendar icon)
    const dueDateElement = card.getByText(cardData.dueDate);
    await expect(dueDateElement).toBeVisible();
    await expect(dueDateElement).toHaveText(cardData.dueDate);
  }

  async verifyCardExistsInColumn(cardTitle, columnName) {
    const column = this.getColumnByName(columnName);
    await expect(column.getByText(cardTitle)).toBeVisible();
  }

  // Helper methods
  getColumnByName(columnName) {
    switch (columnName) {
      case 'To Do':
        return this.toDoColumn;
      case 'In Progress':
        return this.inProgressColumn;
      case 'Review':
        return this.reviewColumn;
      case 'Done':
        return this.doneColumn;
      default:
        throw new Error(`Unknown column: ${columnName}`);
    }
  }

  // Wait for page to load - verify all key elements are visible
  async waitForPageLoad() {
    // Verify sidebar and navigation elements
    await expect(this.projectsSidebar).toBeVisible();
    await expect(this.projectsHeading).toBeVisible();
    
    // Verify all project navigation buttons are visible
    await expect(this.webApplicationProject).toBeVisible();
    await expect(this.mobileApplicationProject).toBeVisible();
    await expect(this.marketingCampaignProject).toBeVisible();
    
    // Verify main content area
    await expect(this.mainContentArea).toBeVisible();
    await expect(this.kanbanColumnsContainer).toBeVisible();
    
    // Verify all kanban columns are visible
    await expect(this.toDoColumn).toBeVisible();
    await expect(this.inProgressColumn).toBeVisible();
    await expect(this.reviewColumn).toBeVisible();
    await expect(this.doneColumn).toBeVisible();
  }

  // Verify basic kanban board functionality (common across all projects)
  async verifyBasicKanbanBoardFunctionality() {
    // Verify main kanban elements are visible
    await expect(this.projectsHeading).toBeVisible();
    await expect(this.mainContentArea).toBeVisible();
    await expect(this.kanbanColumnsContainer).toBeVisible();
    
    // Verify all columns are visible AND contain correct text
    const columns = [
      { element: this.toDoColumn, text: 'To Do' },
      { element: this.inProgressColumn, text: 'In Progress' },
      { element: this.reviewColumn, text: 'Review' },
      { element: this.doneColumn, text: 'Done' }
    ];
    
    for (const column of columns) {
      await expect(column.element).toBeVisible();
      await expect(column.element).toContainText(column.text);
    }
  }

}

module.exports = KanbanPage;
