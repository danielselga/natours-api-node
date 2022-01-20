class APIFeatures {
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
    }
  
    filter() {
      const queryObj = { ...this.queryString }; // Creating a NEW object copy of an object (not referenced)
      const excludeFields = ['page', 'sort', 'limit', 'fields'];
      excludeFields.forEach((el) => delete queryObj[el]);
  
      // 2B) Avanced filtering
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(
        /(\bgte\b|\blt\b|\bgt\b|\blte\b)/g,
        (match) => `$${match}`
      );
  
      this.query = this.query.find(JSON.parse(queryStr));
  
      return this;
    }
  
    sort() {
      if (this.queryString.sort) {
        const sortBy = this.queryString.sort.split(',').join(' ');
        this.query = this.query.sort(sortBy);
      } else {
        this.query = this.query.sort('-createdAt');
      }
  
      return this;
    }
  
    limitFields() {
      if (this.queryString.fields) {
        const fields = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fields); // Includes this fields to the response
      } else {
        this.query = this.query.select('-__v'); // Exclude this fields to the response
      }
  
      return this;
    }
  
    paginate() {
      const page = this.queryString.page * 1 || 1; // Convert str to num
      const limit = this.queryString.limit * 1 || 100;
      const skip = (page - 1) * limit;
      // page=2&limit=10, 1-10, page 1, 11-20, page 2, 21-30 page 3
      this.query.skip(skip).limit(limit);
      return this
    }
  }

  module.exports = APIFeatures