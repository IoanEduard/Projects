import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {
    public transform(values: any[], filter: string): any[] {
        if (!values || !values.length)
            return [];
        if (!filter)
            return values;

        return values.filter(it => {
            return it.value.name.toLowerCase().includes(filter);
        });
    }
}