import { db } from 'asset/functions';
import { Setting } from './setting.interface';

export class SettingDao {
  public getAllSetting(SET_GRP: string = '') {
    const query = `
      SELECT * FROM DTB_SETTING
      WHERE ('' = ? OR SET_GRP = ?)
        AND DEL_DT IS NULL
      ORDER BY SET_GRP;
    `;
    return db<Setting[]>(query, [SET_GRP, SET_GRP]);
  }

  public updateSetting(SET_GRP: string, SET_VAL: string | number) {
    const query = `
      UPDATE DTB_SETTING SET
        SET_VAL = ?
      WHERE SET_GRP = ?
    `;
    return db(query, [SET_VAL, SET_GRP]);
  }
}
