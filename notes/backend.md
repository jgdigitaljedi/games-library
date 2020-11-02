# Backend TODOS

I'm going to stay with DiskDB for now because I like having a backup of my collection in the repo. I'll explore spinning up a MongoDB later and maybe making it back itself up with DiskDB to achieve the same thing but perform better.


- Whenever, get eBay stuff wired in (this is dependent on eBay actually getting me a new API key since they suspended my last one for no reason except MAYBE inactivity)
  - get server side call working
  - get average/high/low in GameDialog component
    - see about filtering out the wildly inconsistent price data since eBay is full of looney tunes
  

- First, make sure only I can change the data
  - ~~add login to navbar. Make sure it looks ok in mobile too since I use this in mobile as often as I do desktop~~
  - ~~add login modal to app. Make sure it looks ok in mobile too since I use this in mobile as often as I do desktop~~
  - ~~don't worry about being too secure as I only serve this on my local home server. A simple password in env will suffice. Maybe even randomly generate a hash to return as a key.   JWT seems like overkill, but is easy enough to implement that I could go that route too.~~
  - After auth happens, add to request headers in client side
  - Add check for headers in protected CRUD routes server side
- Second, migrate data structure to use only IGDB
  - BACKUP ALL YOUR DATA FIRST!
  - figure out what new data structure will be for games and consoles. Remember to add a PS Plus, Game Pass, Games with Gold toggle so I can easily remove those games if I cancel my subscriptions.
  - supplemental/extra data scripts
    - use existing logic in endpoints to fetch IGDB data to return it along with extra data all at once.
    - add extra form fields to display or even allow editing of extra data
  - make changes to Library -> Games and Library -> Consoles to have form field that makes this call and gets data
  - make changes to IGDB services to get the new fields and make sure you get the desired return to the client
  - write a script to migrate all old games and consoles to new data structure
  - configure save, update, and delete functions on backend. Old code is there, but probably needs changed.
    - add save success/error notifications to CRUD functions on client side
- Third, using new data structure. Edit the following views
  - Decider
  - Library
  - Lists
  - Viz
  - Home
- Finally, merge into master!
