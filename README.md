# n8n MCP Server (v1.1.0)

A Model Context Protocol (MCP) server that allows AI assistants to interact with n8n workflows through natural language.

## Overview

This MCP server provides comprehensive tools and resources for AI assistants to manage n8n workflows, executions, and related resources. It allows assistants to:

- **Workflow Management**: List, create, update, delete, activate, and deactivate workflows
- **Execution Monitoring**: List and view workflow executions, delete execution history
- **Webhook Integration**: Execute workflows via webhook triggers with authentication
- **Tag Management**: Organize workflows with tags and manage workflow categorization
- **Resource Access**: Direct access to workflow and execution data through structured resources

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
  chol369/n8n-mcp-server
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

The server provides comprehensive tools organized by functionality:

### Webhook Integration

Execute workflows through n8n webhooks with built-in authentication support:

- **`run_webhook`**: Execute a workflow via webhook trigger

**Example Usage:**
```javascript
// Execute a webhook-triggered workflow
const result = await runWebhook({
  workflowName: "data-processor", // Calls <n8n-url>/webhook/data-processor
  data: {
    input: "Process this data",
    priority: "high"
  }
});
```

### Workflow Management

Complete lifecycle management for n8n workflows:

- **`list_workflows`**: List all workflows with filtering options
- **`workflow_read`**: Get detailed information about a specific workflow
- **`create_workflow`**: Create new workflows from JSON definitions
- **`update_workflow`**: Update existing workflows (name, nodes, connections, settings)
- **`delete_workflow`**: Delete workflows permanently
- **`activate_workflow`**: Activate workflows to enable automatic execution
- **`deactivate_workflow`**: Deactivate workflows to pause automatic execution

### Execution Management

Monitor and manage workflow executions:

- **`list_executions`**: List workflow executions with status and filtering
- **`get_execution`**: Get detailed execution information including input/output data
- **`delete_execution`**: Delete execution records and history

### Tag Management

Organize and categorize workflows with tags:

- **`tag_list`**: List all available tags
- **`tag_read`**: Get details of a specific tag
- **`tag_create`**: Create new tags for organization
- **`tag_update`**: Update tag properties (name)
- **`tag_delete`**: Delete unused tags

### Workflow Tag Management

Associate tags with workflows for better organization:

- **`workflow_tags_list`**: List tags assigned to a specific workflow
- **`workflow_tags_update`**: Add or remove tags from workflows

### Enterprise Features

Advanced features available with enterprise licensing:

- **`credential_create`**: Create new credentials for workflow authentication
- **`credential_delete`**: Delete credentials
- **`project_list`**: List projects (requires enterprise license)
- **`project_create`**: Create new projects (requires enterprise license)
- **`project_update`**: Update existing projects (requires enterprise license)
- **`project_delete`**: Delete projects (requires enterprise license)
- **`user_list`**: List system users
- **`user_read`**: Get user details
- **`user_create`**: Create new users (requires multi-user license)
- **`user_change_role`**: Change user roles (requires advanced permissions)
- **`user_delete`**: Delete users (requires advanced permissions)
- **`variable_list`**: List environment variables (requires enterprise license)
- **`variable_create`**: Create environment variables (requires enterprise license)
- **`variable_delete`**: Delete environment variables (requires enterprise license)

### Security and Administration

System administration and security tools:

- **`security_audit_generate`**: Generate comprehensive security audit reports
- **`source_control_pull`**: Pull changes from remote source control repositories

## Resources

The server provides direct access to n8n data through structured resources:

- **`n8n://workflows/list`**: Complete list of all workflows with metadata
- **`n8n://workflow/{id}`**: Detailed workflow information including nodes and connections
- **`n8n://executions/{workflowId}`**: Execution history for a specific workflow
- **`n8n://execution/{id}`**: Detailed execution data including input/output and logs

## Webhook Authentication

This MCP server supports secure webhook execution with built-in authentication:

1. **Create webhook-triggered workflows** in n8n
2. **Configure Basic Authentication** on your webhook nodes
3. **Set environment variables** for automatic authentication:
   - `N8N_WEBHOOK_USERNAME`: Username for webhook authentication
   - `N8N_WEBHOOK_PASSWORD`: Password for webhook authentication
4. **Use the `run_webhook` tool** - authentication is handled automatically

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

The test suite is written in TypeScript and uses Jest with comprehensive API client coverage and consistent mocking approaches.

### Linting

```bash
npm run lint
```

## Enterprise Features

Many advanced features require specific n8n licensing:

- **Projects**: Requires enterprise license for project management
- **Variables**: Requires enterprise license for environment variables
- **Advanced User Management**: Requires multi-user or enterprise license
- **Source Control**: Requires enterprise license for Git integration

Community edition users can still use all core workflow management, execution monitoring, and webhook features.

## What's New in v1.1.0

This release focuses on robustness, API compliance, and user experience:

- **Enhanced API Compliance**: All tools now strictly follow n8n API specifications
- **Improved Error Handling**: Better error messages and licensing requirement notifications
- **TypeScript Migration**: Complete TypeScript implementation with improved type safety
- **Enhanced Testing**: Comprehensive test coverage for all API clients
- **Documentation Updates**: Updated documentation reflecting current functionality
- **Performance Optimizations**: Improved request handling and data processing

## License

MIT

---


