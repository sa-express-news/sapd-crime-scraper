import { ColumnSet } from 'pg-promise';

import { pgp } from './index';

export const callColSet = new pgp.helpers.ColumnSet([
    { name: 'incidentnumber' },
    { name: 'category' },
    { name: 'problemtype' },
    { name: 'responsedate' },
    { name: 'address' },
    { name: 'hoa' },
    { name: 'schooldistrict' },
    { name: 'councildistrict' },
    { name: 'zipcode' }
], { table: { table: 'calls' } });