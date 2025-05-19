# n8n MCP Server (v1.1.0)

A Model Context Protocol (MCP) server that allows AI assistants to interact with n8n workflows through natural language.

## Overview

This MCP server provides tools and resources for AI assistants to manage n8n workflows and executions. It allows assistants to:

- List, create, update, and delete workflows
- Activate and deactivate workflows
- Execute workflows and monitor their status
- Access workflow information and execution statistics

## Installation

### Prerequisites

- Node.js 18 or later
- n8n instance with API access enabled

### Install from npm

```bash
npm install -g n8n-mcp-server
```

### Install from source

```bash
# Clone the repository
git clone https://github.com/chol369/n8n-mcp-server.git
cd n8n-mcp-server

# Install dependencies
npm install

# Build the project
npm run build

# Optional: Install globally
npm install -g .
```

### Docker Installation

You can also run the server using Docker:

```bash
# Pull the image
docker pull chol369/n8n-mcp-server

# Run the container with your n8n API configuration
docker run -e N8N_API_URL=http://your-n8n:5678/api/v1 \
  -e N8N_API_KEY=your_n8n_api_key \
  -e N8N_WEBHOOK_USERNAME=username \
  -e N8N_WEBHOOK_PASSWORD=password \
  leonardsellem/n8n-mcp-server
```

## Configuration

Create a `.env` file in the directory where you'll run the server, using `.env.example` as a template:

```bash
cp .env.example .env
```

Configure the following environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `N8N_API_URL` | Full URL of the n8n API, including `/api/v1` | `http://localhost:5678/api/v1` |
| `N8N_API_KEY` | API key for authenticating with n8n | `n8n_api_...` |
| `N8N_WEBHOOK_USERNAME` | Username for webhook authentication (if using webhooks) | `username` |
| `N8N_WEBHOOK_PASSWORD` | Password for webhook authentication | `password` |
| `DEBUG` | Enable debug logging (optional) | `true` or `false` |

### Generating an n8n API Key

1. Open your n8n instance in a browser
2. Go to Settings > API > API Keys
3. Create a new API key with appropriate permissions
4. Copy the key to your `.env` file

## Usage

### Running the Server

From the installation directory:

```bash
n8n-mcp-server
```

Or if installed globally:

```bash
n8n-mcp-server
```

### Integrating with AI Assistants

After building the server (`npm run build`), you need to configure your AI assistant (like VS Code with the Claude extension or the Claude Desktop app) to run it. This typically involves editing a JSON configuration file.

**Example Configuration (e.g., in VS Code `settings.json` or Claude Desktop `claude_desktop_config.json`):**

```json
{
  "mcpServers": {
    // Give your server a unique name
    "n8n-local": {
      // Use 'node' to execute the built JavaScript file
      "command": "node",
      // Provide the *absolute path* to the built index.js file
      "args": [
        "/path/to/your/cloned/n8n-mcp-server/build/index.js"
        // On Windows, use double backslashes:
        // "C:\\path\\to\\your\\cloned\\n8n-mcp-server\\build\\index.js"
      ],
      // Environment variables needed by the server
      "env": {
        "N8N_API_URL": "http://your-n8n-instance:5678/api/v1", // Replace with your n8n URL
        "N8N_API_KEY": "YOUR_N8N_API_KEY", // Replace with your key
        // Add webhook credentials only if you plan to use webhook tools
        // "N8N_WEBHOOK_USERNAME": "your_webhook_user",
        // "N8N_WEBHOOK_PASSWORD": "your_webhook_password"
      },
      // Ensure the server is enabled
      "disabled": false,
      // Default autoApprove settings
      "autoApprove": []
    }
    // ... other servers might be configured here
  }
}
```

**Key Points:**

*   Replace `/path/to/your/cloned/n8n-mcp-server/` with the actual absolute path where you cloned and built the repository.
*   Use the correct path separator for your operating system (forward slashes `/` for macOS/Linux, double backslashes `\\` for Windows).
*   Ensure you provide the correct `N8N_API_URL` (including `/api/v1`) and `N8N_API_KEY`.
*   The server needs to be built (`npm run build`) before the assistant can run the `build/index.js` file.

## Available Tools

The server provides the following tools:

### Using Webhooks

This MCP server supports executing workflows through n8n webhooks. To use this functionality:

1. Create a webhook-triggered workflow in n8n.
2. Set up Basic Authentication on your webhook node.
3. Use the `run_webhook` tool to trigger the workflow, passing just the workflow name.

Example:
```javascript
const result = await useRunWebhook({
  workflowName: "hello-world", // Will call <n8n-url>/webhook/hello-world
  data: {
    prompt: "Hello from AI assistant!"
  }
});
```

The webhook authentication is handled automatically using the `N8N_WEBHOOK_USERNAME` and `N8N_WEBHOOK_PASSWORD` environment variables.

### Workflow Management

- `workflow_list`: List all workflows
- `workflow_get`: Get details of a specific workflow
- `workflow_create`: Create a new workflow
- `workflow_update`: Update an existing workflow
- `workflow_delete`: Delete a workflow
- `workflow_activate`: Activate a workflow
- `workflow_deactivate`: Deactivate a workflow

### Execution Management

- `execution_run`: Execute a workflow via the API
- `run_webhook`: Execute a workflow via a webhook
- `execution_get`: Get details of a specific execution
- `execution_list`: List executions for a workflow
- `execution_stop`: Stop a running execution

### Credential Management

- `credential_create`: Create a new credential
- `credential_delete`: Delete a credential
- `credential_move`: Move a credential to a different owner

### Project Management

- `project_list`: List all projects
- `project_create`: Create a new project
- `project_update`: Update an existing project
- `project_delete`: Delete a project

### Tag Management

- `tag_list`: List all tags
- `tag_read`: Get details of a specific tag
- `tag_create`: Create a new tag
- `tag_update`: Update an existing tag
- `tag_delete`: Delete a tag

### Workflow Tag Management

- `workflow_tag_list`: List all workflow tags
- `workflow_tag_update`: Update workflow tags

### User Management

- `user_list`: List all users
- `user_read`: Get details of a specific user
- `user_create`: Create a new user
- `user_delete`: Delete a user
- `user_change_role`: Change a user's role

### Variable Management

- `variable_list`: List all variables
- `variable_create`: Create a new variable
- `variable_delete`: Delete a variable

### Security Audit

- `security_audit_generate`: Generate a security audit report

### Source Control

- `source_control_pull`: Pull changes from a remote repository

## Resources

The server provides the following resources:

- `n8n://workflows/list`: List of all workflows
- `n8n://workflow/{id}`: Details of a specific workflow
- `n8n://executions/{workflowId}`: List of executions for a workflow
- `n8n://execution/{id}`: Details of a specific execution

## Development

### Building

```bash
npm run build
```

### Running in Development Mode

```bash
npm run dev
```

### Testing

```bash
npm test
```

The test suite is written in TypeScript and uses Jest. All API client tests use a consistent mocking approach that doesn't rely on environment variables. This makes tests more reliable and easier to maintain.

For more information on the test approach, see [Testing Documentation](./docs/development/testing.md).

### Linting

```bash
npm run lint
```

## What's New in v1.1.0

This release includes significant improvements to the test suite, code quality, and development experience:

- **TypeScript Migration**: All API client test files converted from JavaScript to TypeScript
- **Enhanced Testing**: Implemented standardized mocking approach across all test files
- **Improved Coverage**: Enhanced test coverage for all API clients
- **Documentation Updates**: Updated documentation with TypeScript best practices

See the [Release Notes](./docs/RELEASE_NOTES.md) for complete details.

## License

MIT

---


