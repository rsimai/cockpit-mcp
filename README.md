# Cockpit MCP

A Cockpit module that provides a web interface for interacting with MCP (Model Context Protocol) hosts using local Ollama models.

## How It Works

This solution consists of three components:

1. **Cockpit Web Interface**: React-based UI with text input/output for chatting
2. **Go Wrapper**: `mcphost-wrapper.go` that uses the mcphost SDK to process messages
3. **MCP Configuration**: Local setup with filesystem and bash tool access

The flow:
- User types message in Cockpit web interface
- Cockpit spawns the Go wrapper process with the message
- Wrapper uses mcphost SDK with local Ollama model
- MCP tools (file operations, shell commands) are available to the model
- Response is displayed in the web interface

## Setup

### Prerequisites
- Ollama running locally with a model (e.g., `qwen2.5:3b`)
- Go 1.21+
- Node.js and npm
- Cockpit installed

### Installation

1. **Clone and build**:
   ```bash
   git clone <this-repo>
   cd cockpit-mcp
   make
   make devel-install
   ```

2. **Build Go wrapper**:
   ```bash
   go mod tidy
   go build -o mcphost-wrapper mcphost-wrapper.go
   go build -o mcp-capabilities mcp-capabilities.go
   ```

3. **Configure MCP** - Create `~/.mcphost.yml`:
   ```yaml
   # MCPHost Configuration File
   mcpServers:
     # Builtin filesystem server for file operations
     filesystem:
       type: "builtin"
       name: "fs"
       options:
         allowed_directories: ["/tmp", "/home/user/workdir"]
       allowedTools: ["read_file", "write_file", "list_directory"]
     
     # Bash server for shell commands
     bash:
       type: "builtin"
       name: "bash"
   
   # Use local Ollama model
   model: "ollama:qwen2.5:3b"
   max-steps: 10
   ```

### Usage

1. Access Cockpit web interface
2. Navigate to "MCP" module
3. Click "Show Capabilities" to see available tools
4. Type messages like:
   - "List files in /tmp"
   - "Create a file /tmp/test.txt with hello world"
   - "Run the command 'ps aux'"
   - "What tools do you have?"

## MCP Capabilities

- **File Operations**: read_file, write_file, list_directory
- **Shell Commands**: bash command execution
- **Local Model**: No API keys required, uses Ollama

The model automatically chooses appropriate tools based on your requests.
