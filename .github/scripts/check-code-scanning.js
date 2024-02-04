const { Octokit } = require("@octokit/core");

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

async function checkCodeScanning() {
  const owner = process.env.GITHUB_REPOSITORY.split("/")[0];
  const repo = process.env.GITHUB_REPOSITORY.split("/")[1];

  const { data: alerts } = await octokit.request(
    "GET /repos/{owner}/{repo}/code-scanning/alerts",
    {
      owner,
      repo,
      state: "open",
    },
  );

  if (alerts.length > 0) {
    console.error(
      "Code scanning alerts found. Please fix the issues and re-run the workflow.",
    );
    process.exit(1);
  } else {
    console.log("No code scanning alerts found. Continuing with the workflow.");
  }
}

checkCodeScanning();
