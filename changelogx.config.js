/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

const usersHash = {
  'Roy Riojas': 'royriojas',
};

const inferTagFromCommit = (commit, availableTags) => {
  const commitLowerCased = (commit.subject || '').toLowerCase();
  const matchesAFix = !!commitLowerCased.match(/\bfix\b/ || commitLowerCased.match(/\bbug fix\b/));
  const matchesARef = !!(commitLowerCased.match(/\bref\b/) || commitLowerCased.match(/\brefactor\b/));

  if (matchesAFix) return { tagId: 'FIX', tagName: availableTags.FIX };
  if (matchesARef) return { tagId: 'REF', tagName: availableTags.REF };

  const { tagId, tagName } = commit;

  return { tagId, tagName };
};

module.exports = {
  changelogx: {
    processTags: tags => {
      const oTags = (tags || []).filter(t => {
        const TAGS_FILTER = process.env.TAGS_FILTER;
        if (TAGS_FILTER) {
          return t.indexOf(TAGS_FILTER) > -1;
        }
        return true;
      });

      const result = oTags.slice(0, 100);
      return result;
    },
    ignoreRegExp: ['BLD: Release', 'DOC: Generate Changelog', 'Generated Changelog'],
    issueIDRegExp: 'CPM-(\\d+)',
    commitURL: 'https://github.com/redisrupt/website-utils/commit/{0}',
    authorURL: 'https://github.com/{0}',
    issueIDURL: match => `https://redisrupt.atlassian.net/browse/${match}`,
    projectName: 'website-utils',
    processCommit: (entry, { commitTags }) => {
      const commit = entry.commit || {};
      entry.author = usersHash[entry.author] || entry.author;

      if (!commit.tagId || commit.tagId === 'NC') {
        entry.commit = {
          ...commit,
          ...inferTagFromCommit(commit, commitTags),
        };
      }
      return entry;
    },
  },
};
