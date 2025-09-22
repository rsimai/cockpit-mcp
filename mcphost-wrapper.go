package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"path/filepath"

	"github.com/mark3labs/mcphost/sdk"
)

func main() {
	if len(os.Args) < 2 {
		log.Fatal("Usage: mcphost-wrapper <message>")
	}

	message := os.Args[1]
	ctx := context.Background()
	
	// Use persistent session file
	sessionFile := filepath.Join(os.TempDir(), "cockpit-mcp-session.json")

	host, err := sdk.New(ctx, &sdk.Options{
		Model: "ollama:qwen2.5:3b",
	})
	if err != nil {
		log.Fatal(err)
	}
	defer host.Close()

	// Load existing session if it exists
	if _, err := os.Stat(sessionFile); err == nil {
		host.LoadSession(sessionFile)
	}

	response, err := host.Prompt(ctx, message)
	if err != nil {
		log.Fatal(err)
	}

	// Save session for next interaction
	host.SaveSession(sessionFile)

	fmt.Print(response)
}