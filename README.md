# WIP

### Todo

- Make way to customzie message

- Vercel Deploy
- Upstash Qstash Cron
- https://github.com/gigobyte/HLTV
- DayJS form simple date formats

https://discohook.org/
https://gist.github.com/Birdie0/78ee79402a4301b1faf412ab5f1cdcf9

#### .env Format

```
DISCORD_WEBHOOK="<webhook_url>"
QSTASH_CURRENT_SIGNING_KEY="<get_at_qstash>"
QSTASH_NEXT_SIGNING_KEY="<get_at_qstash>"
```

If you want to clone this repo and run it yourself I recommend setting up a free [Upstash](https://upstash.com/) account and use Qstash to send messages to your discord channel. Just follow the instructions and use a url in this format:

```
cs-news-discord.vercel.app/api/csnews?team=teamName
```

**OBS:** Check HLTV to see how should you format the team name.
