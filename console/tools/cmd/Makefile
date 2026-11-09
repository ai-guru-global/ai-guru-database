# Makefile for AI News Database
# Quality assurance and development tasks

BINARY_NAME=ai-news-database
MAIN_PATH=main.go
BUILD_DIR=.
COVERAGE_FILE=coverage.out

VERSION ?= $(shell git describe --tags --always --dirty 2>/dev/null || echo "dev")
BUILD_TIME := $(shell date -u +"%Y-%m-%dT%H:%M:%SZ")
GIT_COMMIT := $(shell git rev-parse --short HEAD 2>/dev/null || echo "unknown")

LDFLAGS := -ldflags "-X github.com/spf13/cobra.version=$(VERSION) -X main.version=$(VERSION) -X main.buildTime=$(BUILD_TIME) -X main.gitCommit=$(GIT_COMMIT)"

# Quality thresholds
COVERAGE_MIN=60
GOLANGCI_LINT_FLAGS=--timeout=5m

.PHONY: all build run test clean install fmt vet lint lint-fix test-coverage benchmark security quality help

all: build

## build: Build the binary for current platform
build:
	@echo "Building $(BINARY_NAME) $(VERSION)..."
	go build $(LDFLAGS) -o $(BUILD_DIR)/$(BINARY_NAME) $(MAIN_PATH)

## run: Build and run the binary
run: build
	./$(BINARY_NAME)

## test: Run all tests
test:
	go test ./... -v -race

## test-short: Run tests quickly
test-short:
	go test ./... -short

## test-coverage: Run tests with coverage report
test-coverage:
	@mkdir -p .coverage
	go test ./... -race -coverprofile=.coverage/coverage.out -covermode=atomic
	go tool cover -html=.coverage/coverage.out -o .coverage/coverage.html
	@echo "Coverage report: .coverage/coverage.html"
	@COVERAGE=$$(go tool cover -func=.coverage/coverage.out | grep total | awk '{print $$3}' | tr -d '%'); \
	echo "Current coverage: $$COVERAGE%"; \
	if [ "$$COVERAGE" -lt "$(COVERAGE_MIN)" ]; then \
		echo "ERROR: Coverage $$COVERAGE% is below minimum $(COVERAGE_MIN)%"; \
		exit 1; \
	fi

## clean: Remove built binaries and test artifacts
clean:
	rm -f $(BINARY_NAME) $(BINARY_NAME).exe
	rm -rf .coverage/ dist/
	go clean -testcache

## install: Install binary to $GOPATH/bin
install:
	go install $(LDFLAGS) .

## fmt: Format Go code
fmt:
	go fmt ./...

## vet: Run go vet
vet:
	go vet ./...

## lint: Run golangci-lint
lint:
	golangci-lint run $(GOLANGCI_LINT_FLAGS) ./...

## lint-fix: Run golangci-lint with auto-fix
lint-fix:
	golangci-lint run $(GOLANGCI_LINT_FLAGS) --fix ./...

## security: Run security checks
security:
	gosec ./...
	go build -ldflags="-s -w" -o /dev/null $(MAIN_PATH)

## mod: Download and tidy dependencies
mod:
	go mod download
	go mod tidy

## quality: Run all quality checks (fmt, vet, lint, test-coverage)
quality: fmt vet lint test-coverage security
	@echo "All quality checks passed!"

## release: Build cross-platform binaries for release
release:
	@echo "Building release binaries..."
	mkdir -p dist
	GOOS=darwin GOARCH=amd64 go build $(LDFLAGS) -o dist/$(BINARY_NAME)-darwin-amd64 $(MAIN_PATH)
	GOOS=darwin GOARCH=arm64 go build $(LDFLAGS) -o dist/$(BINARY_NAME)-darwin-arm64 $(MAIN_PATH)
	GOOS=linux GOARCH=amd64 go build $(LDFLAGS) -o dist/$(BINARY_NAME)-linux-amd64 $(MAIN_PATH)
	GOOS=linux GOARCH=arm64 go build $(LDFLAGS) -o dist/$(BINARY_NAME)-linux-arm64 $(MAIN_PATH)
	GOOS=windows GOARCH=amd64 go build $(LDFLAGS) -o dist/$(BINARY_NAME)-windows-amd64.exe $(MAIN_PATH)
	@echo "Done. Binaries in dist/"

## web: Serve the web UI locally on port 8080
web:
	cd web && python3 -m http.server 8080

## docs: List documentation in docs/
docs:
	@echo "Documentation lives in ../../docs/ and topic folders in repo root."

## benchmark: Run benchmark tests
benchmark:
	mkdir -p benchmark
	go test -bench=. -benchmem -benchtime=3s -cpuprofile=benchmark/cpu.prof -memprofile=benchmark/mem.prof ./...
	go tool pprof -http=:8080 benchmark/cpu.prof

## help: Show this help message
help:
	@cat Makefile | grep -E "^##" | sed 's/## //'
