const core = require("@actions/core");
const github = require("@actions/github");
const fetch = require("node-fetch");

async function checkCodeScanning() {
  try {
    const repoOwner = github.context.repo.owner;
    const repoName = github.context.repo.repo;
    const accessToken = core.getInput("github-token");

    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/code-scanning`;

    const response = await fetch(url, {
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.enabled) {
        console.log(`Code scanning is enabled for ${repoOwner}/${repoName}`);
        return true;
      } else {
        console.log(
          `Code scanning is not enabled for ${repoOwner}/${repoName}`
        );
        return false;
      }
    } else {
      console.error(`Failed to check code scanning status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error:", error.message);
    core.setFailed(error.message);
  }
}

checkCodeScanning();
