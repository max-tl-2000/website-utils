#!/bin/bash
# enable bash fail-fast
set -e

# Usage:
# Get dependencies and run tests:
# ./build.sh
# Run full build and publish module:
# ./buildh.sh publish [bump-patch|bump-minor|bump-major|prerelease] [branch] [remote]

./configure.sh

. ./nvm-load.sh;

if [[ "${1:-}" != "publish" ]]; then
  npm run check
  exit
fi

readonly BUMP_VERSION="${2:-bump-patch}"
readonly BRANCH="${3:-master}"
readonly REMOTE="${4:-origin}"

readonly SAFE_BRANCH="${BRANCH//./-}"
readonly SAFE_TAG="branch-${SAFE_BRANCH/_/-}"
echo "Building and publishing website-utils ${BUMP_VERSION} ${SAFE_TAG}"

NPMRC=""
if [[ "${CI}" == "true" ]]; then
  NPMRC="--userconfig=.npmrc"
  echo '//registry.npmjs.org/:_authToken=${NPM_TOKEN}' > .npmrc
else
  # in local we will use the file .npmrc-red
  NPMRC="--userconfig=~/.npmrc-red"
fi

echo "./bnr bump --type=${BUMP_VERSION} --tag ${SAFE_TAG}"
./bnr bump --type=${BUMP_VERSION} --tag ${SAFE_TAG}

echo "./bnr pushChangelogAndTags --remote=${REMOTE} --branch=${BRANCH} --tag ${SAFE_TAG}"
#./bnr pushChangelogAndTags --remote=${REMOTE} --branch=${BRANCH} --tag ${SAFE_TAG}

echo "npm ${NPMRC:-} publish --access=public --tag ${SAFE_TAG}"
npm ${NPMRC:-} publish --access=public --tag ${SAFE_TAG}
