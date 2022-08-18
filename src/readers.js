
export class FieldReader {

  constructor(field, method) {
    this.field = field;
    this.method = method;
  }

  read(resource, viewer) {
    if(Object.hasOwn(resource, this.field))
      viewer[this.method](resource[this.field]);
  }

}

export class LinkReader {

  constructor(rel, method) {
    this.rel = rel;
    this.method = method;
  }

  read(resource, viewer) {
    let link = resource.links.find(link => link.rel === this.rel);
    if(link)
      viewer[this.method](link.href);
    else
      viewer[this.method](null);
  }

}

export class LinkListReader {

  constructor(rel, method) {
    this.rel = rel;
    this.method = method;
  }

  read(resource, viewer) {
    let links = resource.links.filter(link => link.rel === this.rel);
    if(links.length > 0)
      viewer[this.method](links);
  }

}
