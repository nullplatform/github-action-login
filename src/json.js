class Json {
    static parse(string) {
        try {
            return JSON.parse(string);
        } catch (error) {
            return {};
        }
    }
}

module.exports = Json;
