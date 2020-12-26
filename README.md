# DalamudWorker
Automated Cloudflare Worker for creating a Dalamud repo from Github Actions using Github's releases API

## How to setup the script:
 - Create a new Cloudflare Worker.
 - Copy the index.js to the Worker.
 - Add your project to PROJECTS.
 - Change settings to fit your needs. (It's at the start of the script under PROJECTS)
 

## How to setup your github actions
 - Make 2 branches. (in this example we will be using `main` and `testing`. You can change these in the settings)
 - Add a new action workflow, call this whatever you want.
 - For testing builds, use the `create-release` action and upload a zip of your plugin to it, with a tag starting with `Testing-`. (unless you changed it)
 - For release builds, use the `create-release` action and upload a zip of your plugin to it, with a tag starting with `Release-`. (unless you changed it)
 
 ## Config options (PROJECTS)
  - `nameOverride`: Used to override the pluginDef name to whatever you want. (eg: `Fantasy Player (bleeding edge)`)
  - `github`: Where your repo is located. (eg: `https://github.com/BiscuitUmU/FantasyPlayer` would be `BiscuitUmU/FantasyPlayer`)
  - `pluginDef`: Where can the worker find your pluginDef in your github repo. (eg: `Data/FantasyPlayer.Dalamud.json`)
  - `isHide`: Set this if you want the plugin to be hidden in the plugin installer.
  
 ## Config options (SETTINGS)
 - `RELEASE_BRANCH`: What is the name of your release branch.
 - `TESTING_BRANCH`: What is the name of your testing branch.
 - `RELEASE_TAG`: What does your release tag start with.
 - `TESTING_TAG`: What does your testing tag start with.
 - `DOWNLOAD_COUNT`: This will change what's shown on the download count in the plugin installer.
 - `GITHUB_USER_AGENT`: This will change what user-agent will be used to fetch from the GitHub API (CHANGE THIS!)
 
## For a working example of this please check out the FantasyPlayer repo
https://github.com/BiscuitUmU/FantasyPlayer/tree/testing/.github/workflows
