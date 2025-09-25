# Playwright Test Suite - Kanban Board Assessment

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory with the following variables:

```env
# Environment Configuration for Kanban Board Tests
BASE_URL=https://animated-gingersnap-8cf7f2.netlify.app
ADMIN_EMAIL=admin
ADMIN_PASSWORD=password123

# Test Configuration
HEADLESS=false
TIMEOUT=30000
```

### 3. Run Tests
```bash
# Run all tests
npx playwright test

# Run tests in headed mode
npx playwright test --headed

# Run specific test file
npx playwright test tests/specs/login.spec.js
```

## Test Structure

- **Login Tests**: Authentication and validation
- **Kanban Tests**: Data-driven project board and card verification
- **Page Object Model**: Organized UI interactions
- **Data-Driven**: JSON files for test data and invalid credentials

## Architecture

- `tests/pages/` - Page Object Model classes
- `tests/data/` - JSON test data files
- `tests/utils/` - Helper functions
- `tests/specs/` - Test specifications
