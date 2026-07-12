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

On every ccstatusline update, cclorax reads the conversation transcript, sums token usage across every turn, and converts that into a running Wh (watt-hour) estimate according to the following conversions.
| Token type | Wh/MTok |
| ----------- | ------- |
| Input | 390 |
| Output | 1950 |
| Cache read | 39 |
| Cache write | 490 |

[source](https://simonpcouch.com/blog/2026-01-20-cc-impact/)

Numbers may fluctuate due to background subagent/hooks/sessions still running.
