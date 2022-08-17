
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

  constructor(url, db) {
    this.url = url;
    this.db = db;
  }

  static forUrl(url, db) {
    if(url === 'entry')
      return new EntryHandler(url, db);
    if(isImageUrl(url))
      return new ImageHandler(url, db);
    if(isTagUrl(url))
      return new TagHandler(url, db);
  }

  async getLibraryEntries() {
    let rows = await this.db.all("SELECT id FROM library_entry");
    return {
      links: rows.map(row => ({
        rel: 'collection-image',
        href:`images/${row.id}`
      }))
    };
  }

  async getLibraryEntry(index) {
    let statement = this.db.prepare("SELECT src, likes FROM library_entry WHERE id = ?");
    let row = await statement.get(index);
    statement.finalize();
    return row;
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

};

class EntryHandler extends FetchHandler {

  async handle() {
    return this.getLibraryEntries();
  }

}

class ImageHandler extends FetchHandler {

  async handle() {
    let index = imageUrlIndex(this.url);
    let row = await this.getLibraryEntry(index);
    let tags = await this.getTags(index);
    return {
      ...row,
      links: tags.map(tag => ({
        rel: 'tag',
        href: makeTagUrl(tag.id),
        embed: {
          name: tag.name
        }
      }))
    };
  }

}

class TagHandler extends FetchHandler {

  async handle() {
    let index = tagUrlIndex(this.url);
    return this.getTag(index);
  }

}

module.exports = FetchHandler;
