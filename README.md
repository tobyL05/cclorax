# cclorax

> monitor the environmental impact of your claude code sessions

## How it works

On every ccstatusline updated, cclorax reads the conversation transcript, sums token usage across every turn, and converts that into a running Wh (watt-hour) estimate according to the following conversions

| Token type  | Wh/MTok |
| ----------- | ------- |
| Input       | 390     |
| Output      | 1950    |
| Cache read  | 39      |
| Cache write | 490     |

[source](https://simonpcouch.com/blog/2026-01-20-cc-impact/)

## Prerequisites

- Claude Code
- [ccstatusline](https://github.com/sirmalloc/ccstatusline)

## Install

1. Run `npx -y ccstatusline@latest`
2. Add a Custom Command widget
3. Set the command to `npx -y cclorax@latest`
