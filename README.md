Total Runtime
=============

Total Runtime is a web app to help check and compare how long it will take you to watch or catch up to TV shows, by season or from start to end.

This is a monorepo containing two mostly independent applications - a backend service and server-side-rendered frontend single page app.

## Development

Contributions are more than welcome! All that's required is signing up with TheTVDB and generating a free API key. See: https://thetvdb.com/api-information

Once you have the API key:

1. Clone this repo.
2. Run `./bin/dev <your key here>`.

This should spin up two local servers, one for the backend and another for the frontend. Most development can be done by opening the frontend development server in a web browser.

Both servers watch for changes and automatically restart.

Since this is a monorepo that's configured using [npm workspaces](https://docs.npmjs.com/cli/v11/using-npm/workspaces), note that there are three package.json files:

1. Top level: This contains dependencies and scripts to run both servers at the same time.
2. At `src/frontend/package.json`: For the SvelteKit frontend application.
3. At `src/backend/package.json`: For the Fastify backend server.

License
-------

Copyright © 2024-2025 Antriksh Yadav. All rights reserved.

This project is not open source despite being publicly viewable. You may not use, copy, modify, distribute, or self-host this software without explicit written authorization from the author.
