// SPDX-FileCopyrightText: 2025 Mass Labs
//
// SPDX-License-Identifier: MIT

/**
 * This script writes the current git commit and/or tag to a JSON file
 * that can be imported in the rest of the codebase.
 */

import { ensureDir } from "https://deno.land/std/fs/mod.ts";
import * as path from "https://deno.land/std/path/mod.ts";

async function getCurrentGitInfo(): Promise<
  { commit: string; tag: string | null; timestamp: string }
> {
  // Get current commit hash
  const commitProcess = new Deno.Command("git", {
    args: ["rev-parse", "HEAD"],
    stdout: "piped",
    stderr: "piped",
  });

  const commitResult = await commitProcess.output();
  const commit = new TextDecoder().decode(commitResult.stdout).trim();

  // Try to get current tag if any
  const tagProcess = new Deno.Command("git", {
    args: ["describe", "--tags", "--exact-match", "HEAD"],
    stdout: "piped",
    stderr: "piped",
  });

  const tagResult = await tagProcess.output();
  let tag: string | null = null;

  if (tagResult.code === 0) {
    tag = new TextDecoder().decode(tagResult.stdout).trim();
  }

  // Get commit timestamp
  const timestampProcess = new Deno.Command("git", {
    args: ["show", "-s", "--format=%ci", commit],
    stdout: "piped",
    stderr: "piped",
  });

  const timestampResult = await timestampProcess.output();
  const gitTimestamp = new TextDecoder().decode(timestampResult.stdout).trim();
  const timestamp = new Date(gitTimestamp).toISOString();

  return { commit, tag, timestamp };
}

async function main() {
  try {
    const gitInfo = await getCurrentGitInfo();

    const releaseInfo = {
      version: gitInfo.tag ?? gitInfo.commit.slice(0, 8),
      commit: gitInfo.commit,
      tag: gitInfo.tag,
      timestamp: gitInfo.timestamp,
    };

    // Ensure the directory exists
    const outputDir = path.join(Deno.cwd(), "src/");
    await ensureDir(outputDir);

    // Write to file
    const outputPath = path.join(outputDir, "release-info.json");
    await Deno.writeTextFile(outputPath, JSON.stringify(releaseInfo, null, 2));

    console.log(`Release info written to ${outputPath}`);
  } catch (error) {
    console.error("Failed to write release info:", error);
    Deno.exit(1);
  }
}

if (import.meta.main) {
  main();
}
