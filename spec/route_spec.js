var Route = require('./../route.js');

describe("Route should be available", function() {  
  
  it("should launch an error without parameters", function() {
    expect(new Route()).toThrowError(Error);
  });
  
  it("should be initialized with start and stop", function() {
    var start = "721684,116933";
    var stop = "715844,99601";
    expect(new Route(start, stop)).not.toBeNull();
  });
  
});