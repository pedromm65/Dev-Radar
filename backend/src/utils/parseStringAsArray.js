module.exports =  function parseStringAsAray(arrayAsString) {
    return arrayAsString.split(',').map(tech => tech.trim())
}