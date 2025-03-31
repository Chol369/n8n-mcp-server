# n8n MCP Server

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
git clone https://github.com/leonardsellem/n8n-mcp-server.git
cd n8n-mcp-server

# Install dependencies
npm install

# Build the project
npm run build

# Optional: Install globally
npm install -g .
```

## Configuration

Create a `.env` file in the directory where you'll run the server, using `.env.example` as a template:

```bash
cp .env.example .env
```

Configure the following environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `N8N_API_URL` | URL of the n8n API | `http://localhost:5678/api/v1` |
| `N8N_API_KEY` | API key for authenticating with n8n | `n8n_api_...` |
| `N8N_WEBHOOK_USERNAME` | Username for webhook authentication | `username` |
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

To use this MCP server with AI assistants, you need to register it with your AI assistant platform. The exact method depends on the platform you're using.

For example, with the MCP installer:

```bash
npx @anaisbetts/mcp-installer
```

Then register the server:

```
install_local_mcp_server path/to/n8n-mcp-server
```

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

- `list_workflows`: List all workflows
- `get_workflow`: Get details of a specific workflow
- `create_workflow`: Create a new workflow
- `update_workflow`: Update an existing workflow
- `delete_workflow`: Delete a workflow
- `activate_workflow`: Activate a workflow
- `deactivate_workflow`: Deactivate a workflow

### Execution Management

- `run_webhook`: Execute a workflow via a webhook
- `get_execution`: Get details of a specific execution
- `list_executions`: List executions for a workflow
- `delete_execution`: Delete a specific execution

## Resources

The server provides the following resources:

- `n8n://workflows`: List of all workflows (static resource)
- `n8n://workflows/{id}`: Details of a specific workflow (dynamic resource template)
- `n8n://executions/{id}`: Details of a specific execution (dynamic resource template)
- `n8n://execution-stats`: Summary statistics of recent executions (static resource)

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

### Linting

```bash
npm run lint
```

## License

MIT
