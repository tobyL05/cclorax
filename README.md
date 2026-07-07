# cclorax

> monitor the environmental impact of your claude code sessions

<img width="824" height="260" alt="image" src="https://github.com/user-attachments/assets/2185fb17-2201-42d4-8648-6f686c7f1a72" />

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

## Prerequisites

- Claude Code
- [ccstatusline](https://github.com/sirmalloc/ccstatusline)

## Install

1. Run `npx -y ccstatusline@latest`
2. Add a Custom Command widget
3. Set the command to `npx -y cclorax@latest`
