import { DbProperties } from "../models/db-entity";
import { DbQuery } from "../models/db-query";
import { DbQueryService } from "./db-query.service";
import { Injectable } from "@angular/core";
import { promise } from "protractor";

interface User {
    id: number;
    departmentId: number;
    name: string;
    email: string;
}

interface Department {
    id: number;
    name: string;
}

interface DataSource {
    users: User[];
    departments: Department[];
}

export const sampleTestData: DataSource = {
    users: [
        {
            id: 1,
            departmentId: 5,
            name: "Kathy",
            email: "khugh0@dyndns.org",
        },
        {
            id: 2,
            departmentId: 5,
            name: "Ahmad",
            email: "abubbings1@walmart.com",
        },
        {
            id: 3,
            departmentId: 3,
            name: "Modestia",
            email: "mcaen2@bbc.co.uk",
        },
        {
            id: 4,
            departmentId: 5,
            name: "Lorry",
            email: "llawlor3@wiley.com",
        },
        {
            id: 5,
            departmentId: 4,
            name: "Marina",
            email: "mibbett4@hud.gov",
        },
        {
            id: 6,
            departmentId: 3,
            name: "Bale",
            email: "bpaddock5@ezinearticles.com",
        },
        {
            id: 7,
            departmentId: 1,
            name: "Beth",
            email: "badamo6@google.co.uk",
        },
        {
            id: 8,
            departmentId: 4,
            name: "Sheila-kathryn",
            email: "skillock7@nih.gov",
        },
        {
            id: 9,
            departmentId: 5,
            name: "Aline",
            email: "adowson8@studiopress.com",
        },
        {
            id: 10,
            departmentId: 4,
            name: "Virgie",
            email: "vcockin9@arstechnica.com",
        },
    ],
    departments: [
        {
            id: 1,
            name: "Support",
        },
        {
            id: 2,
            name: "Research and Development",
        },
        {
            id: 3,
            name: "Engineering",
        },
        {
            id: 4,
            name: "Training",
        },
        {
            id: 5,
            name: "Legal",
        },
    ],
};

@Injectable()
export class SampleDbQueryService implements DbQueryService {
    select(query: DbQuery): Promise<DbProperties[]> {
        let array: any[] =
            sampleTestData[query.from.name.name as keyof DataSource];

        if (query.where) {
            array = array.filter((_) => {
                for (const prop in query.where) {
                    if (_[prop] != query.where[prop]) return false;
                }

                return true;
            });
        }

        const returnValue: DbProperties[] = array.map((_) => {
            const item: DbProperties = {};

            for (const prop of query.select) {
                item[prop.name] = _[prop.name];
            }

            return item;
        });

        return Promise.resolve(returnValue);
    }
}
