class API {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString
  }

  /** Filer the tours using 
   * @find returns only tours withing the query criteria
   * @param {object|objectId} - req.query: =, gt, gte, lt and lte
  */
  filter() {

    // Simple query filter; excluding: page, limit, sort and field
    const queryObj = { ...this.queryString };
    const excludedQuery = ['page', 'limit', 'sort', 'fields'];
    excludedQuery.forEach(el => delete queryObj[el]); //TODO

    // Advance query filter with operators: gt, gte, lt and lte (duration[lte]=5)
    let queryStr = JSON.stringify(queryObj)

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)
    this.query = this.query.find(JSON.parse(queryStr));

    return this
  }

  /**Sort tour
   * @sort returns tours sorted on query criteria
   * @param {object|string} req.query.sort
  */

  sort() {
    if (this.queryString.sort) {
      // sort by 
      //query = query.sort(req.query.sort) // single sort
      const sortBy = this.queryString.sort.split(',').join(' ') // in url use comma, in mongo use space
      this.query = this.query.sort(sortBy)
    } else {
      this.query = this.query.sort('-createdAt')
    }

    return this
  }

  /** Field limiting 
   * @select returns only queried fields 
   * @param {object|string}: req.query.fields
  */
  limitFields() {
    if (this.queryString.fields) {

      const fields = this.queryString.fields.split(',').join(' ')
      this.query = this.query.select(fields)

    } else {
      this.query = this.query.select('-__v')
    }

    return this
  }

  /** paginate uses
   * @skip returns number of items to be skipped
   * @param {number} 
   * 
   * @limit returns the no of items to be displayed
   * @param {number}    
  **/
  paginate() {

    const page = this.queryString.page * 1; //transform into a number
    const limit = this.queryString.limit * 1;
    const pageItems = (page - 1) * limit;
    //page 1 = 1-10 11-20 21 -30 31 -40
    this.query = this.query.skip(pageItems).limit(limit);

    return this
  }

}

module.exports = API

