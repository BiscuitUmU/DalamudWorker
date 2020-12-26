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
 
## For a working example of this please check out the FantasyPlayer repo
https://github.com/BiscuitUmU/FantasyPlayer/tree/testing/.github/workflows
