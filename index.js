//Automated Cloudflare worker repo script
//By: BiscuitUmU

const PROJECTS = [
    {
        //nameOverride: "Fantasy Player (bleeding edge)",
        github: "BiscuitUmU/FantasyPlayer",
        pluginDef: "Data/FantasyPlayer.Dalamud.json",
        isHide: "False"
    }
]

const SETTINGS = {
    RELEASE_BRANCH: "main",
    TESTING_BRANCH: "testing",
    RELEASE_TAG: "Release-",
    TESTING_TAG: "Testing-",
    DOWNLOAD_COUNT: 42069,
    GITHUB_USER_AGENT: "DalamudWorker bot"
}

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

/**
 * Respond to the request
 * @param {Request} request
 */
async function handleRequest(request) {
    const url = new URL(request.url);

    var body = null;
    var status = 404;
    var errorMessage = "route not found."


    if (url.pathname == "/plugins") {
        status = 200;
        body = JSON.stringify(await handlePluginList());
    }

    if (body == null)
        return new Response(PAGE_HTML, {
            status: status,
            headers: {
                "content-type": "text/html;charset=UTF-8",
                "x-password": "hunter2"
            }
        })

    return new Response(body, {
        status: status,
        headers: {
            "content-type": "application/json",
            "x-password": "hunter2"
        }
    });
}

async function handlePluginList() {
    var list = [];

    for (i = 0; i < PROJECTS.length; i++) {
        const project = PROJECTS[i];
        let pluginDef = await getPluginDef(project, SETTINGS.RELEASE_BRANCH);
        let pluginRelease = await getPluginRelease(project);
        if (project.nameOverride !== undefined)
            pluginDef.Name = project.nameOverride;
        let pluginObject = {
            ...pluginDef,
            "IsHide": project.isHide,
            ...pluginRelease,
        }
        list.push(pluginObject);
    }
    return list;
}

async function getPluginRelease(project) {
    var lastUpdate = null;
    var testingUrl = null;
    var releaseUrl = null;
    var pluginDefTesting = null;

    var ignoreNextTesting = false;
    var ignoreNextRelease = false;
    const releases_response = await fetch(`https://api.github.com/repos/${project.github}/releases`, {
        headers: {
            'user-agent': SETTINGS.GITHUB_USER_AGENT
        }
    });
    const releases = await releases_response.json();
    for (i = 0; i < releases.length; i++) {
        const release = releases[i];

        if (release.tag_name.startsWith(SETTINGS.TESTING_TAG) && ignoreNextTesting == false) {
            ignoreNextTesting = true;
            testingUrl = release.assets[0].browser_download_url;
            if (lastUpdate == null)
                lastUpdate = new Date(release.assets[0].updated_at).getTime() / 1000;
            if (pluginDefTesting == null)
                pluginDefTesting = await getPluginDef(project, SETTINGS.TESTING_BRANCH);
        }

        if (release.tag_name.startsWith(SETTINGS.RELEASE_TAG) && ignoreNextRelease == false) {
            ignoreNextRelease = true;
            releaseUrl = release.assets[0].browser_download_url;
            if (lastUpdate == null)
                lastUpdate = new Date(release.assets[0].updated_at).getTime() / 1000;
        }
    }

    lastUpdate = lastUpdate.toString();
    var releaseBase = {
        "IsTestingExclusive": (releaseUrl == null) ? "True" : "False",
        "DownloadCount": SETTINGS.DOWNLOAD_COUNT,
        "LastUpdate": lastUpdate,
        "DownloadLinkInstall": releaseUrl,
        "DownloadLinkTesting": testingUrl,
        "DownloadLinkUpdate": releaseUrl,
    }

    if (pluginDefTesting != null)
        releaseBase.TestingAssemblyVersion = pluginDefTesting.AssemblyVersion;

    return releaseBase;
}

async function getPluginDef(project, branch) {
    const response = await fetch(`https://raw.githubusercontent.com/${project.github}/${branch}/${project.pluginDef}`);
    const def = await response.json();
    return def;
}

const PAGE_HTML = `<!DOCTYPE html>
<title>Dalamud Repo</title>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway">
<style>
body,h1 {
    font-family: "Raleway", sans-serif
}
body, html {
    height: 100%
}
body {
    background-color: #222126;
    overflow: hidden;
}
code {
    color: #e3e3e3;
    background-color: #2a292e;
    padding: 10px;
    font-weight: bold;
    border-radius: 10px;
}

.container {
    display: flex;
    justify-content: center;
    align-items: center;
}
.center {
    position: fixed;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    padding: 10px;
    text-align: center;
    color: #fff;
}
</style>
<body>

<div class="container">
    <div class="center">
        <div class="container">
            <img width="128" height="128" src="https://raw.githubusercontent.com/goatcorp/DalamudAssets/master/UIRes/logo.png" />
        </div>
        <h1>Hi there, this is a Dalamud Repo.</h1>
        <p>To add this repo please copy what's below into your Dalamud settings.</p>
        <code id=repoLoc></code>
    </div>
</div>

<script>
    document.getElementById("repoLoc").innerHTML = 
    window.location.protocol + "//" + window.location.hostname + "/plugins"
</script>

</body>
`
