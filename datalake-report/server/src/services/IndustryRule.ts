import Database from '../database/Database';
import { DbQueries } from '../database/DbQueries';

export class IndustryRuleService {
  private industryRuleList: Array<any> = [];
  constructor() {
  }

  getSubRuleGroupList(rowDataPackets, RuleGroupID) {
    const subRuleList = [];
    for (const row of rowDataPackets) {
      if (row.RuleGroupID === RuleGroupID) {
        subRuleList.push({
          RuleGroupID: row.RuleGroupID,
          RuleSubGroupID: row.RulesubGroupID,
          RuleGroupName: row.RuleGroupName,
          RuleSubGroupName: row.RulesubGroupname,
          isActive: row.IsActive,
          CompanyFlag: row.CompanyFlag,
          RuleSubGroupIcon: row.RulesubGroupIcon
        });
      }
    }

    return subRuleList;
  }


  private async getIndustryRules(ruleGroupId: string) {
    return Database.query(DbQueries.getIndustryGroup(ruleGroupId));
  }

  private getRuleSubGroups(industryRuleId: string) {
    return Database.query(DbQueries.getSubRuleGroup(industryRuleId))
      .then(resp => resp)
      .catch(err => {
        return [];
      });
  }


  async _getRuleGroups(): Promise<any> {

    return Database.query(DbQueries.ruleGroups())
      .then(async (rowDataPackets) => {
        const ruleGroupList = rowDataPackets.map(async row => {
          const {
            RuleGroupID,
            RuleGroupName,
            RuleGroupSystemName,
            DefaultHiveTable,
            CompanyFlag,
            RuleGroupIcon
          } = row;
          let indGroupList = [];
          try {
            const industryRuleList = await this.getIndustryRules(RuleGroupID);
            if (industryRuleList.length > 0) {
              indGroupList = industryRuleList.map(async indRule => {
                const {
                  RuleGroupID,
                  IndustryRuleID,
                  IndustryRuleName,
                  IndustryRuleIcon,
                  IsActive
                } = indRule;
                try {

                } catch (err) {

                  const subRuleList = await this.getRuleSubGroups(IndustryRuleID);
                  return {
                    RuleGroupID,
                    IndustryRuleID,
                    IndustryRuleName,
                    IndustryRuleIcon,
                    IsActive,
                    RuleSubGroupList: subRuleList
                  }
                }
              });
              return Promise.all(indGroupList)
                .then(indGroupListResp => {
                  return {
                    RuleGroupID,
                    RuleGroupName,
                    RuleGroupSystemName,
                    DefaultHiveTable,
                    CompanyFlag,
                    RuleGroupIcon,
                    IndustryRuleList: indGroupListResp
                  }
                })
            }
          } catch (err) {
            console.log(err);
            indGroupList = [];
          }


        });
        return Promise.all(ruleGroupList);
      }).catch(err => console.log(err))



  }

  async getRuleGroupsOld() {
    try {
      const ruleGroupList = await Database.query(DbQueries.ruleGroups());
      let industryList = [];
      for (let rule of ruleGroupList) {
        const { RuleGroupID } = rule;
        const industryRuleGroupList = await this.getIndustryRules(RuleGroupID);
        let subRuleList = [];
        for (let industry of industryRuleGroupList) {
          const { IndustryRuleID } = industry;
          const subRuleGroupList = await this.getRuleSubGroups(IndustryRuleID);
          subRuleList.push({ ...industry, subRuleGroupList });
        }
        industryList.push({ ...rule, industryList: subRuleList });
       
      }
      return industryList;
    } catch (err) {
      return err;
    }
  }

  async getIndustryRule(ruleGroupID: any) {
    try {
      //const ruleGroupList = await Database.query(DbQueries.ruleGroups());
      let industryList = [];
      //for (let rule of ruleGroupList) {
        //const { RuleGroupID } = rule;
        const RuleGroupID = ruleGroupID;
        const industryRuleGroupList = await this.getIndustryRules(RuleGroupID);
        let subRuleList = [];
        for (let industry of industryRuleGroupList) {
          const { RuleIndustryID } = industry;
          const subRuleGroupList = await this.getRuleSubGroups(RuleIndustryID);
          subRuleList.push({ ...industry, subRuleGroupList });
        }
        //industryList.push({ ...rule, industryList: subRuleList });
       
      //}
      //return industryList;
      console.log("SubRuleList "+JSON.stringify(subRuleList));
      return subRuleList;
    } catch (err) {
      return err;
    }
  }

  getIndustryRuleList() {
    return this.industryRuleList;
  }
}