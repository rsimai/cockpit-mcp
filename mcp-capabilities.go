package main

import (
	"context"
	"fmt"
	"log"

	"github.com/mark3labs/mcphost/sdk"
)

func main() {
	ctx := context.Background()

	host, err := sdk.New(ctx, &sdk.Options{
		Model: "ollama:qwen2.5:3b",
	})
	if err != nil {
		log.Fatal(err)
	}
	defer host.Close()

	response, err := host.Prompt(ctx, "What tools and capabilities do you have available? List them.")
	if err != nil {
		log.Fatal(err)
	}

	fmt.Print(response)
}