# Bellboy
A simple bare-bones discord bot, with some useful commands out of the box.

## Setup with docker

1. Clone this repository and `cd` into it.
2. Copy `example.env` as `.env` and configure your `.env`.
3. Then simply run `docker build -t container-name .` and `docker run container-name`.


## Manual Setup:

This project was created using `bun init` in bun v1.1.18. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

1. Clone this repository and `cd` into it.
2. Run `cp example.env .env` and configure `.env`.
3. Run `bun install`.
4. Run `bun start`.


## Configuration
This bot will automatically create a new channel called `bellboy` (if not already created) in which, it will store all of it's configuration. Make sure this channel is only accesible to admins/mods.

## Commands

### `/role [role] [emoji]` 
Configure a role with this bot.
* `role` (required) Mentionable role to configure. If this is the only option, the role will be removed from [configuration](#configuration).
* `emoji` Assigns an emoji to this role.

### `/msg [message]` 
Subscribe to a message. Required for auto-assigning roles to members by reacting to the message.
* `message` (required) Message ID

### `/react [message] [emojis]` 
Makes the bot react to a message with a list of emojis.
* `message` (required) Message ID, must exist in current channel.
* `emojis` (required) Spaced separated list of emojis.

### `/unchannel [pattern]` 
Deletes all channels which names match the pattern. If a channel is a category, it will delete all the children.
* `pattern` (required) A regular expresion.


## Testing

Run tests by simply running:

```bash
bun test
```

