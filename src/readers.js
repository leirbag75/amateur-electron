
export class FieldReader {

  constructor(field, method) {
    this.field = field;
    this.method = method;
  }

  read(resource, viewer) {
    if(resource[this.field])
      viewer[this.method](resource[this.field]);
  }

}
