export const deleteEmptyValue = (objectDto: {}) => {
    for (const key in objectDto) {
        if (Object.prototype.hasOwnProperty.call(objectDto, key)) {
            const element = objectDto[key];
            element ? objectDto[key] = element : delete objectDto[key];
        }
    }
}