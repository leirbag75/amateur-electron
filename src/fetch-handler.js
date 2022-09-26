
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

class UrlReader {

  constructor(url, method) {
    this.match = url.match(this.regex);
    this.givenMethod = method;
  }

  successful() {
    return !!this.match && this.givenMethod === this.method;
  }

}

class EntryUrlReader extends UrlReader {

  get regex() {
    return /^entry$/;
  }

  get method() {
    return 'GET';
  }

  get handlerClass() {
    return EntryHandler;
  }

}

class ImageUrlReader extends UrlReader {

  get regex() {
    return /^images\/(?<index>[0-9]+)$/;
  }

  get method() {
    return 'GET';
  }

  get index() {
    return this.match.groups.index;
  }

  get handlerClass() {
    return ImageHandler;
  }

}

class AddEntryUrlReader extends UrlReader {

  get regex() {
    return /^images$/
  }

  get method() {
    return 'POST';
  }

  get handlerClass() {
    return AddEntryHandler;
  }

}

class LikeUrlReader extends UrlReader {

  get regex() {
    return /^images\/(?<index>[0-9]+)\/likes$/;
  }

  get method() {
    return 'POST';
  }

  get index() {
    return this.match.groups.index;
  }

  get handlerClass() {
    return LikeHandler;
  }

}

class UnlikeUrlReader extends UrlReader {

  get regex() {
    return /^images\/(?<index>[0-9]+)\/unlikes$/;
  }

  get method() {
    return 'POST';
  }

  get index() {
    return this.match.groups.index;
  }

  get handlerClass() {
    return UnlikeHandler;
  }

}

class TagUrlReader extends UrlReader {

  get regex() {
    return /^tags\/(?<index>[0-9]+)$/;
  }

  get method() {
    return 'GET';
  }

  get index() {
    return this.match.groups.index;
  }

  get handlerClass() {
    return TagHandler;
  }

}

class TagEntryUrlReader extends UrlReader {

  get regex() {
    return /^tag_entries\/(?<imageIndex>[0-9]+)_(?<tagIndex>[0-9]+)$/;
  }

  get method() {
    return 'GET';
  }

  get imageIndex() {
    return this.match.groups.imageIndex;
  }

  get tagIndex() {
    return this.match.groups.tagIndex;
  }

  get handlerClass() {
    return TagEntryHandler
  }

}

class SearchUrlReader extends UrlReader {

  get regex() {
    return /^search$/;
  }

  get method() {
    return 'POST';
  }

  get handlerClass() {
    return SearchHandler;
  }

}

function makeImageUrl(index) {
  return `images/${index}`;
}

function makeAddEntryUrl() {
  return 'images';
}

function makeLikeUrl(index) {
  return `images/${index}/likes`;
}

function makeUnlikeUrl(index) {
  return `images/${index}/unlikes`;
}

function makeTagUrl(index) {
  return `tags/${index}`;
}

function makeTagEntryUrl(imageIndex, tagIndex) {
  return `tag_entries/${imageIndex}_${tagIndex}`;
}

function makeSearchUrl() {
  return 'search';
}

let urlReaderClasses = [
  EntryUrlReader,
  ImageUrlReader,
  AddEntryUrlReader,
  LikeUrlReader,
  UnlikeUrlReader,
  TagUrlReader,
  TagEntryUrlReader,
  SearchUrlReader
];

class FetchHandler {

  constructor(reader, options, db) {
    this.options = options;
    this.db = db;
    this.reader = reader;
  }

  static forUrl(url, options, db) {
    for(let readerClass of urlReaderClasses) {
      let reader = new readerClass(url, options.method);
      if(reader.successful())
        return new reader.handlerClass(reader, options, db);
    }
  }

  async getLibraryEntries() {
    return this.db.all("SELECT id FROM library_entry WHERE NOT EXISTS (SELECT hidden FROM tag JOIN tag_entry ON tag_entry.tag_id = tag.id WHERE library_entry.id = tag_entry.library_entry_id AND tag.hidden = TRUE)");
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
    let index = parseInt(this.reader.index);
    let row = await this.getLibraryEntry(index);
    let tags = await this.getTags(index);
    let links = tags.map(tag => ({
      rel: 'tag-entry',
      href: makeTagEntryUrl(index, tag.id)
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
    let index = parseInt(this.reader.index);
    return this.like(index);
  }

}

class UnlikeHandler extends FetchHandler {

  async handle() {
    let index = parseInt(this.reader.index);
    return this.unlike(index);
  }

}

class TagHandler extends FetchHandler {

  async handle() {
    let index = parseInt(this.reader.index);
    return this.getTag(index);
  }

}

class TagEntryHandler extends FetchHandler {

  async handle() {
    let tagIndex = parseInt(this.reader.tagIndex);
    return this.getTag(tagIndex);
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
