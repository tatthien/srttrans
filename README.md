# SRT Translator

## Quick start

1. Install `srttrans` (see [Installation](#Installation))
2. Setup Anthropic API Key
    ```bash
    export ANTHROPIC_API_KEY=your_anthropic_key
    ```
3. Translate an SRT file
    ```bash
    srttrans translate path/to/subtitle.srt
    ```
    
## Installation

Using `pnpm`

```
pnpm add -g @tatthien/srttrans # or using npm: npm install -g @tatthien/srttrans
```

If you want to develop this tool, you can use `pnpm link --global` to make the package accessible globally.

```
git clone git@github.com:tatthien/srttrans.git
cd srttrans
pnpm install
pnpm link-cli # This command will run: pnpm unlink && pnpm link --global
```

## Usage

### Available commands:

```
Usage: index [options] [command]

Options:
  -h, --help                  display help for command

Commands:
  translate [options] <path>  translate an SRT file
  help [command]              display help for command
```
