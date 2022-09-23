
function parseQuery(query) {
  let { condition, args } = parseJSONQuery(JSON.parse(query));
  return {
    query: 'SELECT id, src, likes FROM library_entry WHERE ' + condition,
    args
  };
}

// If we decide to make it easy to add new search operations, this will need to
// be refactored, but for now, this set seems pretty stable
function parseJSONQuery(query) {
  switch(query.operation) {
    case 'and': {
      let parseResults = query.values.map(parseJSONQuery);
      return {
        condition: `(${parseResults.map(result => result.condition).join(' AND ')})`,
        args: parseResults.flatMap(result => result.args)
      };
    }
    case 'or': {
      let parseResults = query.values.map(parseJSONQuery);
      return {
        condition: `(${parseResults.map(result => result.condition).join(' OR ')})`,
        args: parseResults.flatMap(result => result.args)
      };
    }
    case 'not': {
      if(query.values.length !== 1)
        throw new Error('Invalid "not" operation');
      let parseResult = parseJSONQuery(query.values[0]);
      return {
        condition: `(NOT ${parseResult.condition})`,
        args: parseResult.args
      };
    }
    case 'has_tag': {
      if(query.values.length !== 1)
        throw new Error('Invalid "has_tag" query');
      return {
        condition: '(EXISTS (SELECT tag_id FROM tag_entry JOIN tag ON tag_entry.tag_id = tag.id WHERE tag.name = ? AND tag_entry.library_entry_id = library_entry.id))',
        args: [query.values[0]]
      };
    }
    case 'likes_equal_to': {
      if(query.values.length !== 1)
        throw new Error('Invalid "likes_equal_to" query');
      return {
        condition: '(likes = ?)',
        args: [query.values[0]]
      };
    }
    case 'likes_less_than': {
      if(query.values.length !== 1)
        throw new Error('Invalid "likes_less_than" query');
      return {
        condition: '(likes < ?)',
        args: [query.values[0]]
      };
    }
    case 'likes_greater_than': {
      if(query.values.length !== 1)
        throw new Error('Invalid "likes_greater_than" query');
      return {
        condition: '(likes > ?)',
        args: [query.values[0]]
      };
    }
    case 'likes_less_than_or_equal_to': {
      if(query.values.length !== 1)
        throw new Error('Invalid "likes_less_than_or_equal_to" query');
      return {
        condition: '(likes <= ?)',
        args: [query.values[0]]
      };
    }
    case 'likes_greater_than_or_equal_to': {
      if(query.values.length !== 1)
        throw new Error('Invalid "likes_greater_than_or_equal_to" query');
      return {
        condition: '(likes >= ?)',
        args: [query.values[0]]
      };
    }
    default:
      throw new Error('Invalid query operation');
  }
}

function makeImageUrl(index) {
  return `images/${index}`;
}

function imageUrlIndex(url) {
  let match = url.match(/images\/([0-9]+)/);
  if(match)
    return parseInt(match[1]);
  else
    throw new Error("Not a valid image URL");
}

function isImageUrl(url) {
  return !!url.match(/^images\/[0-9]+$/);
}

function makeAddEntryUrl() {
  return 'images';
}

function isAddEntryUrl(url) {
  return url === 'images';
}

function makeLikeUrl(index) {
  return `images/${index}/likes`;
}

function likeUrlIndex(url) {
  // Since imageUrlIndex makes no assumptions about where the URL begins or
  // ends, imageUrlIndex works out to be the same as likeUrlIndex
  return imageUrlIndex(url);
}

function isLikeUrl(url) {
  return !!url.match(/^images\/[0-9]+\/likes$/);
}

function makeUnlikeUrl(index) {
  return `images/${index}/unlikes`;
}

function unlikeUrlIndex(url) {
  // Since imageUrlIndex makes no assumptions about where the URL begins or
  // ends, imageUrlIndex works out to be the same as likeUrlIndex
  return imageUrlIndex(url);
}

function isUnlikeUrl(url) {
  return !!url.match(/^images\/[0-9]+\/unlikes$/);
}

function makeTagUrl(index) {
  return `tags/${index}`;
}

function tagUrlIndex(url) {
  let match = url.match(/tags\/([0-9]+)/);
  if(match)
    return parseInt(match[1]);
  else
    throw new Error("Not a valid tag URL");
}

function isTagUrl(url) {
  return !!url.match(/^tags\/[0-9]+$/);
}

function makeSearchUrl() {
  return 'search';
}

function isSearchUrl(url) {
  return url === 'search';
}

class FetchHandler {

  constructor(url, options, db) {
    this.url = url;
    this.options = options;
    this.db = db;
  }

  static forUrl(url, options, db) {
    if(url === 'entry')
      return new EntryHandler(url, options, db);
    if(isImageUrl(url))
      return new ImageHandler(url, options, db);
    if(isLikeUrl(url) && options.method === 'POST')
      return new LikeHandler(url, options, db);
    if(isUnlikeUrl(url) && options.method === 'POST')
      return new UnlikeHandler(url, options, db);
    if(isTagUrl(url))
      return new TagHandler(url, options, db);
    if(isAddEntryUrl(url) && options.method === 'POST')
      return new AddEntryHandler(url, options, db);
    if(isSearchUrl(url) && options.method === 'POST')
      return new SearchHandler(url, options, db);
  }

  async getLibraryEntries() {
    return this.db.all("SELECT id FROM library_entry");
  }

  async getLibraryEntry(index) {
    let statement = this.db.prepare("SELECT src, likes FROM library_entry WHERE id = ?");
    let row = await statement.get(index);
    statement.finalize();
    return row;
  }

  async like(index) {
    let statement = this.db.prepare("UPDATE library_entry SET likes = likes + 1 WHERE id = ?");
    let result = await statement.run(index);
    statement.finalize();
    return result;
  }

  async unlike(index) {
    let statement = this.db.prepare("UPDATE library_entry SET likes = likes - 1 WHERE id = ?");
    let result = await statement.run(index);
    statement.finalize();
    return result;
  }

  async getTags(libraryEntryIndex) {
    let statement = this.db.prepare("SELECT tag.id, tag.name FROM tag JOIN tag_entry ON tag.id = tag_entry.tag_id WHERE tag_entry.library_entry_id = ?");
    let tags = await statement.all(libraryEntryIndex);
    statement.finalize();
    return tags;
  }

  async getTag(index) {
    let statement = this.db.prepare("SELECT name FROM tag WHERE id = ?");
    let tag = await statement.get(index);
    statement.finalize();
    return tag;
  }

  async addLibraryEntry(url) {
    let statement = this.db.prepare("INSERT INTO library_entry(src) VALUES(?)");
    await statement.run(url);
    statement.finalize();
    return (await this.db.get("SELECT last_insert_rowid() as id")).id;
  }

}

class EntryHandler extends FetchHandler {

  async handle() {
    let rows = await this.getLibraryEntries();
    return {
      links: [
        ...rows.map(row => ({
          rel: 'collection-image',
          href: makeImageUrl(row.id),
        })),
        {
          rel: 'add-library-entry',
          href: makeAddEntryUrl()
        },
        {
          rel: 'search',
          href: 'search'
        }
      ]
    };
  }

}

class AddEntryHandler extends FetchHandler {

  async handle() {
    let src = JSON.parse(this.options.body).src;
    let newIndex = await this.addLibraryEntry(src);
    return {
      links: [{
        rel: 'created-image',
        href: makeImageUrl(newIndex)
      }]
    };
  }

}

class ImageHandler extends FetchHandler {

  async handle() {
    let index = imageUrlIndex(this.url);
    let row = await this.getLibraryEntry(index);
    let tags = await this.getTags(index);
    let links = tags.map(tag => ({
      rel: 'tag',
      href: makeTagUrl(tag.id)
    }));
    links.push({
      rel: 'like',
      href: makeLikeUrl(index)
    });
    if(row.likes > 0)
      links.push({
        rel: 'unlike',
        href: makeUnlikeUrl(index)
      });
    return {
      ...row,
      links
    };
  }

}

class LikeHandler extends FetchHandler {

  async handle() {
    let index = likeUrlIndex(this.url);
    return this.like(index);
  }

}

class UnlikeHandler extends FetchHandler {

  async handle() {
    let index = unlikeUrlIndex(this.url);
    return this.unlike(index);
  }

}

class TagHandler extends FetchHandler {

  async handle() {
    let index = tagUrlIndex(this.url);
    return this.getTag(index);
  }

}

class SearchHandler extends FetchHandler {

  async handle() {
    let { query, args } = parseQuery(this.options.body);
    let statement = this.db.prepare(query);
    let result = await statement.all(...args);
    statement.finalize();
    return {
      links: [
        ...result.map(row => ({
          rel: 'collection-image',
          href: makeImageUrl(row.id)
        })),
        {
          rel: 'add-library-entry',
          href: makeAddEntryUrl()
        },
        {
          rel: 'search',
          href: 'search'
        }
      ]
    };
  }

}

module.exports = FetchHandler;
