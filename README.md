# 🌏 cclorax

⚡️ Monitor the environmental impact of your Claude Code sessions

<img width="866" height="141" alt="Screenshot 2026-07-12 at 14 18 23" src="https://github.com/user-attachments/assets/123c1d91-e241-4956-acf8-e190c4667b0d" />

## Prerequisites

- Claude Code
- [ccstatusline](https://github.com/sirmalloc/ccstatusline)

## Install

1. Run `npx -y ccstatusline@latest`
2. Add a Custom Command widget
3. Set the command to `npx -y cclorax@latest`

## How it works

On every ccstatusline update, cclorax reads the conversation transcript, sums token usage across every turn, and converts that into a running Wh (watt-hour) estimate according to the following conversions. Numbers may fluctuate due to background subagent/hooks/sessions still running.

| Token type  | Wh/MTok |
| ----------- | ------- |
| Input       | 390     |
| Output      | 1950    |
| Cache read  | 39      |
| Cache write | 490     |

[source](https://simonpcouch.com/blog/2026-01-20-cc-impact/)

## Motivation

There's a lot of talk right now about "tokenmaxxing" and unlimited AI spend. Throwing more tokens at every problem because context is cheap, models are fast, and somehow a measure of employee performance. But tokens aren't free. Every one of them runs through a data center pulling real power and creating a carbon footprint. cclorax makes that metric visible to developers, so you can see how an individual coding session adds up.

## Future Work

- view/visualize consumption
- change conversions based on selected model/effort
- footprint API?
