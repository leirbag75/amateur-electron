
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

module.exports = FetchHandler;
