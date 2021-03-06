export const getAllDatesBetweenInclusive = (startDate: Date, endDate: Date): Date[] => {
    let currentDate: Date = new Date(startDate.getTime());
    let datesBetween: Date[] = [];

    while (currentDate <= endDate) {
        datesBetween.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return datesBetween;
}

export const getFirstOfPreviousMonth = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth() - 1, 1)
}

export const getLastOfPreviousMonth = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), 0)
}