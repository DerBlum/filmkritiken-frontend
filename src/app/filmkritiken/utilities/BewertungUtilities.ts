import { Bewertung } from "src/app/openapi";

export function getAverageWertung(bewertungen: Array<Bewertung>): string {
    if (!bewertungen || bewertungen.length == 0) {
        return null;
    }
    var counter = 0;
    var rating = 0;
    bewertungen.forEach(element => {
        rating = rating + element.wertung;
        counter = counter + 1;
    });

    var average = rating / counter;
    return average.toLocaleString(undefined, { maximumFractionDigits: 2 });
};
