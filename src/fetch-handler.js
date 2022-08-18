
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
    if(isTagUrl(url))
      return new TagHandler(url, options, db);
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

}

class EntryHandler extends FetchHandler {

  async handle() {
    let rows = await this.getLibraryEntries();
    return {
      links: rows.map(row => ({
        rel: 'collection-image',
        href: makeImageUrl(row.id),
      }))
    };
  }

}

class ImageHandler extends FetchHandler {

  async handle() {
    let index = imageUrlIndex(this.url);
    let row = await this.getLibraryEntry(index);
    let tags = await this.getTags(index);
    return {
      ...row,
      links: [
        {
          rel: 'like',
          href: makeLikeUrl(index)
        },
        ...tags.map(tag => ({
          rel: 'tag',
          href: makeTagUrl(tag.id)
        }))
      ]
    };
  }

}

class LikeHandler extends FetchHandler {

  async handle() {
    let index = likeUrlIndex(this.url);
    return this.like(index);
  }

}

class TagHandler extends FetchHandler {

  async handle() {
    let index = tagUrlIndex(this.url);
    return this.getTag(index);
  }

}

module.exports = FetchHandler;
