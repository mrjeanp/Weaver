# Weaver

A simple bare-bones discord bot, with some useful commands out of the box.

## Setup with Docker

1. Clone this repository and `cd` into it.
2. Copy `example.env` as `.env` and configure your `.env`.
3. Then simply run `docker build -t container-name .` and `docker run container-name`.

## Manual Setup:

This project was created using `bun init`. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

1. Clone this repository and `cd` into it.
2. Run `cp example.env .env` and configure `.env`.
3. Run `bun install`.
4. Run `bun start`.

## Configuration

By default this bot will automatically create a new channel called `weaver` (if not already created) in which, it will store all of it's configuration. You can change this name in your `.env` file. Make sure this channel is only accesible to admins/mods.

## Built-in Commands

### `/role [role*] [emoji]`

Configure a role.

- `role` (required) Mentionable role to configure. If this is the only option, the [configuration](#configuration) will be removed.
- `emoji` Assigns an emoji to this role.

### `/msg [message*] [emojis]`

Configure a message.

- `message` (required) Message ID, if this is the only option, the [configuration](#configuration) will be removed.
- `emojis` assigns a space separated list of emojis to the message.

### `/react [message*] [emojis*]`

Makes the bot react to a message with a list of emojis.

- `message` (required) Message ID, must exist in current channel.
- `emojis` (required) Spaced separated list of emojis.

### `/unchannel [pattern*]`

Deletes all channels which names match the pattern. If a channel is a category, it will delete all its children along with it.
Before deleting, it will show you the channels and ask you for confirmation before proceeding.

- `pattern` (required) A regular expresion.

## Testing

Run tests by simply running:

```bash
bun test
```
