# Figma AI Tickets 

> A Figma plugin leveraging GenAI models to create tickets within your taskboard. 

<div >
    <a href="https://www.loom.com/share/e7a97ea990224fbfb911ca7bf116ea01">
      <img style="width: 100%" src="https://cdn.loom.com/sessions/thumbnails/e7a97ea990224fbfb911ca7bf116ea01-f736df9fec992ae7-full-play.gif">
    </a>
</div>


## Inspiration 

In my past roles as a Frontend Engineer, I've often seen project managers and other engineers (including myself) spend significant amount of time creating tickets within the epics for a sprint to implement a specific design or feature. I think Generative AI models are better suited for this task!

I wrote a Figma Plugin that extracts frames from Figma, and passes the frame to a GenAI model (GPT-4o) to generate a title, description, acceptance criteria and implementation scope for the ticket. If you're pleased with the generated data, the plugin also creates a ticket within a task management board (e.g Trello) in the board and column of your choosing. 

## Development Setup

This project uses [Turborepo](https://turbo.build/repo) to manage the monorepo with the following packages:

- **backend** - Node.js backend server
- **portal** - React Router v7 web portal 
- **plugin** - Figma plugin built with Vite/React
- **web** - Next.js web application

### Getting Started

Install dependencies:
```bash
yarn install
```

### Available Scripts

Run all packages in development mode:
```bash
yarn dev
```

Build all packages:
```bash
yarn build
```

Run linting across all packages:
```bash
yarn lint
```

Run type checking across all packages:
```bash
yarn typecheck
```

Start all built applications:
```bash
yarn start
```

Clean build artifacts:
```bash
yarn clean
```

### Individual Package Scripts

You can also run scripts for individual packages:

```bash
# Run specific package
yarn workspace backend dev
yarn workspace portal dev
yarn workspace plugin dev  
yarn workspace web dev

# Build specific package
yarn workspace web build
yarn workspace plugin build
```

## Todo
- [x] Setup Turborepo to manage the web, plugin, portal, and backend projects as a monorepo.
- [ ] Begin implementing E2E test to establish a happy path for users. 
- [ ] Fix TS errors across projects.
- [ ] Create documentation across child projects.

## Contributing
Please feel free to fork this package and contribute by submitting a pull request to enhance the functionalities.

## How can I thank you?
Why not star the github repo? I'd love the attention! Why not share the link for this repository on Twitter or HackerNews? Spread the word!

Don't forget to follow and connect with me on [Twitter](https://x.com/iamnwani) and [Linkedln](https://www.linkedin.com/in/victory-nwani/)!

## License