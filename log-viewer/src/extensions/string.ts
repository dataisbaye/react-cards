interface String {
    toTitleCase(): string;
}
String.prototype.toTitleCase = function() {
    return this.replace(/\w\S*/g, function(txt: string) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};