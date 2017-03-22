# FUDGE
What's up with the name?
It's some sort of mangled acronym for `Filtering pUblic Discord Github wEbhooks`.

### The idea is to be able to give members a URL that they can add to their GitHub repositories to make a channel like this:
![Screenshot](https://i.imgur.com/rTRVoGZ.png)

The problem with that is if anyone you don't want has access to that URL they can use it to send whatever they want to that channel. Usually you don't want that.

This project retains the functionality of posting GitHub events to a channel like that, however will validate all requests before they are posted. This prevents users from spamming the channel.
FUDGE can detect automatically what requests *look like* and compare them to a real GitHub format, however this is still fallible.

There is also the option to make a login page where staff and authorized people can approve, deny, blacklist, or whitelist certain users or repositories. If you know someone is trustworthy, you can whitelist them or their repository so they always post without review first.

Now you can post this webhook publicly and not worry about what's posted in your Discord channel!
