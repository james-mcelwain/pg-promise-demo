/// <reference path='../../../node_modules/pg-promise/typescript/pg-promise' />

import {QueryFile} from 'pg-promise';
var path = require('path');

// Helper for linking to external query files;
function sql(file:string) {

    var fullPath = path.join(__dirname, file); // generating full path;

    var options = {

        // minifying the SQL is always advised;
        // see also option 'compress' in the API;
        minify: true,

        // Showing how to use static pre-formatting parameters -
        // we have variable 'schema' in each SQL (as an example);
        params: {
            schema: 'public' // replace ${schema~} with "public"
        }
    };

    return new QueryFile(fullPath, options);

    // See QueryFile API:
    // http://vitaly-t.github.io/pg-promise/QueryFile.html
}

///////////////////////////////////////////////////////////////////////////////////////////////
// Criteria for deciding whether to place a particular query into an external SQL file or to
// keep it in-line (hard-coded):
//
// - Size / complexity of the query, because having it in a separate file will let you develop
//   the query and see the immediate updates without having to restart your application.
//
// - The necessity to document your query, and possibly keeping its multiple versions commented
//   out in the query file.
//
// In fact, the only reason one might want to keep a query in-line within the code is to be able
// to easily see the relation between the query and its formatting parameters. However, this is
// very easy to overcome by using only Named Parameters for your query formatting.
////////////////////////////////////////////////////////////////////////////////////////////////

// We import only a few queries here, while using the rest in-line in the code, only to provide a
// diverse example here, but you may just as well put all of your queries into SQL files.

export = {
    users: {
        create: sql('users/create.sql'),
        empty: sql('users/empty.sql'),
        init: sql('users/init.sql'),
        drop: sql('users/drop.sql'),
        add: sql('users/add.sql')
    },
    products: {
        create: sql('products/create.sql'),
        empty: sql('products/empty.sql'),
        drop: sql('products/drop.sql'),
        add: sql('products/add.sql')
    }
};

//////////////////////////////////////////////////////////////////////////
// Consider an alternative - enumerating all SQL files automatically ;)
// API: http://vitaly-t.github.io/pg-promise/utils.html#.enumSql

/*
// generating a recursive SQL tree for dynamic use of camelized names:
import {utils} from 'pg-promise';

export = utils.enumSql(__dirname, {recursive: true}, file=> {
    // NOTE: 'file' contains the full path to the SQL file, because we use __dirname for enumeration.
    return new QueryFile(file, {
        minify: true,
        params: {
            schema: 'public' // replace ${schema~} with "public"
        }
    });
});
*/

