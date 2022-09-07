import * as pgLib from 'pg-promise';

const pgp = pgLib(/* initialization options */);

// generic singleton creator:
function createSingleton<T>(name: string, create: () => T): T {
    const s = Symbol.for(name);
    let scope = (global as any)[s];
    if (!scope) {
        scope = {...create()};
        (global as any)[s] = scope;
    }
    return scope;
}

interface IDatabaseScope {
    db: pgLib.IDatabase<any>;
    pgp: pgLib.IMain;
}

export function getDB(): IDatabaseScope {
    return createSingleton<IDatabaseScope>('my-app-db-space', () => {
        return {
            db: pgp('postgres://christopher@localhost:5432/christopher'),
            pgp
        };
    });
}