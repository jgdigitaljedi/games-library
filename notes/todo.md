# TODO

## Bugs

These are issues I've found and haven't gotten around to fixing yet.

- When adding consoles, it now seems to put the purchased date, or possibly even the current date, into the relased date field.

## Utility

Some things that I thought about and need to get done.

- import new Everdrive/ODE games (GC, SNES, N64)

## Improvements

Some smaller things I've found that work ok but could be improved.

- Centralize more data. There's too much duplication.
  - Handhelds checks live in multiple places
- Delete some older files that aren't being used
- Viz section kinda sucks. Make it better.
- finish my 'extraData' branch where I build a way to pull in new data from my supplemental games data project easily.
- the Gallery Section is terrible. Reimagine it and build it better.

## New Features

What else can be done here to make this more useful.

- integrate Steam API to potentially pull my Steam game data in when viewing games
- add 'free' and 'sealed' field to games so I can quit reading that data from the notes field
- try to pull in Steam sales, GOG sales, Green Man Gaming, Nintendo Switch Online, etc data
- maybe revisit my web scraping idea from GS-Scraper to add at least Craiglist scraping for local used games acquisitions
- pull in friends statuses from the various game apps so you can see who is online now
  - compare games to friends' game so you know what you can play with which friend
- rebuild the whole damned thing. I've learned a lot about React and Fastify since starting this and could do it so much better now. This app was how I learned React.
- add an Everdrive view, maybe to the Decider, for the sake of being able to quickly pick a game to play on an Everdrive
- figure out how to add sub games to compilation games
  - would be useful to make the sub games searchable with all other games as well

## Don't-dos

Don't bother with this stuff.

- DOn't worry about refactoring to make this codebase cleaner. This app started as a way to teach myself React and is now just something I use, but I know it got messy and I'd rather build it from scratch than try to clean this up. The backend could use WAY better design and a lot of the front end logic was a result of me trying to use a feature of React, but I now realize it could have been done SOOOO much better.
