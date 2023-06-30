export const idGenerator = (type) => {
    let randomId = Math.random()
        .toString(36)
        .substr(3, 9);
    return `${type}-${randomId}`;
}