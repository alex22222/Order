function store() {
    this.products = [];
    this.dvaCaption = [
        "Negligible",
        "Low",
        "Average",
        "Good",
        "Great"
    ];
    this.dvaRange = [
        "below 5%",
        "between 5 and 10%",
        "between 10 and 20%",
        "between 20 and 40%",
        "above 40%"
    ];
}
store.prototype.getProduct = function (code) {
    for (var i = 0; i < this.products.length; i++) {
        if (this.products[i]._id == code)
            return this.products[i];
    }
    return null;
}
