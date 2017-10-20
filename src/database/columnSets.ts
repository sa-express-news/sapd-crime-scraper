import { ColumnSet } from 'pg-promise';

import { pgp } from './index';

export const callColSet = new pgp.helpers.ColumnSet([
    { name: 'id' },
    { name: 'incidentNumber' },
    { name: 'category' },
    { name: 'problemType' },
    { name: 'responseDate' },
    { name: 'address' },
    { name: 'hoa' },
    { name: 'schoolDistrict' },
    { name: 'councilDistrict' },
    { name: 'zipcode' }
], { table: { table: 'calls' } });