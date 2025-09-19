package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/mark3labs/mcphost/sdk"
)

func main() {
	if len(os.Args) < 2 {
		log.Fatal("Usage: mcphost-wrapper <message>")
	}

	message := os.Args[1]
	ctx := context.Background()

	host, err := sdk.New(ctx, &sdk.Options{
		Model: "ollama:qwen2.5:3b",
	})
	if err != nil {
		log.Fatal(err)
	}
	defer host.Close()

	response, err := host.Prompt(ctx, message)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Print(response)
}