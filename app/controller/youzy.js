'use strict';
const Controller = require('../care/base_controller');
const urlencode = require('urlencode');
const youzyEptService = require('../helper/youzyEpt.service');
// const commonService = require('../helper/common.service');
const { data: rSchoolJson } = require('../public/json/r_school');
const { data: rProvinceJson } = require('../public/json/r_province');


class YouzyController extends Controller {

  constructor(ctx) {
    super(ctx);
    this.schoolList = null;
    this.offsetNum = 0;
  }

  async init() {
    const { ctx } = this;
    // const interval = setInterval(this.loadSchoolMajorAdmission(), 1800);

    await this.initSchoolAdmission();
    // this.offsetNum = 0;
    // await this.loadSchoolAdmission(this.offsetNum);
    // this.offsetNum = 40;
    // await this.loadSchoolAdmission(this.offsetNum);
    // this.offsetNum = 80;
    // await this.loadSchoolAdmission(this.offsetNum);
    // this.offsetNum = 120;
    // await this.loadSchoolAdmission(this.offsetNum);
    // await this.aaa();
  }

  async loadSchool() {
    super.loadSchool();
    const { ctx } = this;
    this.schoolNum = 2835;
    const size = this.size;
    const page = this.page;
    if (!this.pageCount) {
      this.pageCount = Math.ceil(this.schoolNum / size);
    }
    const url = 'https://api.eol.cn/gh5/api';
    const params = {
      page, size,
      uri: 'apigkcx/api/school/hotlists',
    };
    const result = await ctx.basePost(url, params);
    // console.log(result.data);
    if (result.data && result.data.item && result.data.item.length !== 0) {
      this.initSchool(result.data.item, ctx);
    }
    if (page <= this.pageCount) {
      this.page = this.page + 1;
      console.log('学校爬取进度', { page, size }, '已爬取' + (page * size));
      await this.loadSchool();
    }
  }

  async initSchool(schoolList, ctx) {
    schoolList = schoolList.map(item => {
      return {
        id: item.school_id,
        school_id: item.school_id,
        name: item.name,
      };
    });
    await ctx.model.School.bulkCreate(schoolList);
    return;
  }

  async compareSchool() {
    const { ctx } = this;
    const schoolArr = await ctx.model.School.findAll({
      where: {
        // id:{
        // 	$gt:minId
        // },
        // isHave: {
        // 	$ne:456
        // },
        status: 0,
      },
      order: [[ 'id' ]],
      limit: 10,
    });
    console.log(schoolArr);
    let loadNum = 0;
    for (let i = 0; i < schoolArr.length; i++) {
      const schoolItem = schoolArr[i];
      let rSchoolItem = null;
      rSchoolJson.forEach(async item => {
        if (schoolItem.name === item.xue_xiao_ming_cheng) {
          rSchoolItem = item;
          console.log(schoolItem.id);
        }
      });
      if (rSchoolItem) {
        await ctx.model.School.update({
          status: 1,
          r_school_id: rSchoolItem.id,
          r_school_name: rSchoolItem.xue_xiao_ming_cheng,
        }, {
          where: {
            id: schoolItem.id,
          },
        });
      } else {
        await ctx.model.School.update({
          status: 404,
        }, {
          where: {
            id: schoolItem.id,
          },
        });
      }
      loadNum++;
      if (loadNum === 10) {
        await this.compareSchool();
      }
    }
  }

  async loadProvince() {
    super.loadProvince();
    const provinceList = [
      {
        name: '北京',
        id: 834,
      },
      {
        name: '安徽',
        id: 844,
      },
      {
        name: '澳门',
        id: 19340,
      },
      {
        name: '福建',
        id: 845,
      },
      {
        name: '甘肃',
        id: 860,
      },
      {
        name: '广东',
        id: 851,
      },
      {
        name: '广西',
        id: 852,
      },
      {
        name: '贵州',
        id: 856,
      },
      {
        name: '海南',
        id: 853,
      },
      {
        name: '河北',
        id: 1128,
      },
      {
        name: '河南',
        id: 848,
      },
      {
        name: '黑龙江',
        id: 841,
      },
      {
        name: '湖北',
        id: 849,
      },
      {
        name: '湖南',
        id: 850,
      },
      {
        name: '吉林',
        id: 840,
      },
      {
        name: '江苏',
        id: 1,
      },
      {
        name: '江西',
        id: 846,
      },
      {
        name: '辽宁',
        id: 839,
      },
      {
        name: '内蒙古',
        id: 838,
      },
      {
        name: '宁夏',
        id: 862,
      },
      {
        name: '青海',
        id: 861,
      },
      {
        name: '山东',
        id: 847,
      },
      {
        name: '山西',
        id: 837,
      },
      {
        name: '陕西',
        id: 859,
      },
      {
        name: '上海',
        id: 842,
      },
      {
        name: '四川',
        id: 855,
      },
      {
        name: '天津',
        id: 835,
      },
      {
        name: '西藏',
        id: 858,
      },
      {
        name: '香港',
        id: 16733,
      },
      {
        name: '新疆',
        id: 1120,
      },
      {
        name: '云南',
        id: 857,
      },
      {
        name: '浙江',
        id: 843,
      },
      {
        name: '重庆',
        id: 854,
      },
    ];
    return provinceList;
  }

  async compareProvince() {
    const { ctx } = this;
    const provinceArr = await this.loadProvince();
    console.log(provinceArr.length);
    const nProvinceArr = provinceArr.map(item => {
      const nProvinceItem = {
        status: 0,
        id: item.id,
        name: item.name,
        r_province_id: null,
        r_province_name: null,
      };
      rProvinceJson.forEach(itemR => {
        if (itemR.name === item.name) {
          nProvinceItem.r_province_id = itemR.id;
          nProvinceItem.r_province_name = itemR.name;
          nProvinceItem.status = 1;
        }
      });
      return nProvinceItem;
    });
    await ctx.model.Province.bulkCreate(nProvinceArr);
  }

  async loadSubject() {
    super.loadSubject();
  }

  async loadBatch() {
    super.loadBatch();
  }

  async initSchoolAdmissionTable() {
    super.initSchoolAdmissionTable();
    const { ctx } = this;
    this.provinceList = await this.loadProvince();
    this.schoolList = await ctx.model.School.findAll();
    const schoolAdmissionJson = [];
    this.schoolList.forEach(item => {
      this.provinceList.forEach(item2 => {
        const schoolAdmissionJsonItem = {
          school_id: item.school_id || item.id,
          school_name: item.name,
          province_id: item2.id,
          province_name: item2.name,
        };
        schoolAdmissionJson.push(schoolAdmissionJsonItem);
      });
    });
    await ctx.model.SchoolAdmissionJson.bulkCreate(schoolAdmissionJson);
  }

  async loadSchoolAdmission(offsetNum) {
    const { ctx } = this;

    const provList = [
      {
        name: '安徽',
        value: 34,
      },
      {
        name: '北京',
        value: 11,
      },
      {
        name: '重庆',
        value: 50,
      },
      {
        name: '福建',
        value: 35,
      },
      {
        name: '广东',
        value: 44,
      },
      {
        name: '广西',
        value: 45,
      },
      {
        name: '甘肃',
        value: 62,
      },
      {
        name: '贵州',
        value: 52,
      },
      {
        name: '河北',
        value: 13,
      },
      {
        name: '河南',
        value: 41,
      },
      {
        name: '海南',
        value: 46,
      },
      {
        name: '湖北',
        value: 42,
      },
      {
        name: '湖南',
        value: 43,
      },
      {
        name: '黑龙江',
        value: 23,
      },
      {
        name: '吉林',
        value: 22,
      },
      {
        name: '江苏',
        value: 32,
      },
      {
        name: '江西',
        value: 36,
      },
      {
        name: '辽宁',
        value: 21,
      },
      {
        name: '内蒙古',
        value: 15,
      },
      {
        name: '宁夏',
        value: 64,
      },
      {
        name: '青海',
        value: 63,
      },
      {
        name: '上海',
        value: 31,
      },
      {
        name: '四川',
        value: 51,
      },
      {
        name: '山东',
        value: 37,
      },
      {
        name: '山西',
        value: 14,
      },
      {
        name: '陕西',
        value: 61,
      },
      {
        name: '天津',
        value: 12,
      },
      {
        name: '新疆',
        value: 65,
      },
      {
        name: '云南',
        value: 53,
      },
      {
        name: '浙江',
        value: 33,
      },
      {
        name: '西藏',
        value: 54,
      },
    ];
    const schoolProvinceArr = await ctx.model.SchoolAdmissionJson.findAll({
      where: {
        // id:{
        // 	$gt:minId
        // },
        // isHave: {
        // 	$ne:456
        // },
        // id: {
        //   $in: [ 45 ],
        // },
        status: {
          $in: [ 600, 1 ],
        },
      },
      order: [[ 'id' ]],
      limit: 40,
      offset: offsetNum,
    });
    let loadNum = 0;
    for (let i = 0; i < schoolProvinceArr.length; i++) {
      const item = schoolProvinceArr[i];
      let provItem = null;
      provList.forEach(itemProv => {
        if (itemProv.name === item.province_name) {
          provItem = itemProv.value;
        }
      });
      const url = 'https://www.youzy.cn/Data/ScoreLines/Fractions/Colleges/Query';
      const data = {
        provinceNumId: item.province_id,
        ucode: provItem + '_' + item.school_id + '_0_0',
      };
      console.log(data);
      const text = JSON.stringify(data);
      const textBytes = youzyEptService.utils.utf8.toBytes(text);
      const aesCtr = new youzyEptService.ModeOfOperation.ctr([ 11, 23, 32, 43, 45, 46, 67, 8, 9, 10, 11, 12, 13, 14, 15, 16 ], new youzyEptService.Counter(5));
      const encryptedBytes = aesCtr.encrypt(textBytes);
      const encryptedHex = youzyEptService.utils.hex.fromBytes(encryptedBytes);
      if (encryptedHex === 'af4f744668a5050fcb34bb14315cd7515a6958d1aa99709bef22b56843a041d0dfed3f27cef85d2ef3e2') {
        console.log('相同');
      }
      const params = {
        data: encryptedHex,
        // data: 'af4f744668a5050fcb34bb14315cd7515a6958d1aa99709bef22b56843a041d0dfed3f27cef85d2ef3e2',
      };
      const CurrentVersion = {
        Name: item.province_name,
        EnName: 'hubei',
        ProvinceId: item.province_id,
        Domain: 'http://hubei.youzy.cn',
        Description: '',
        QQGroup: '428487411',
        QQGroupUrl: null,
        IsOpen: true,
        Sort: 12,
        Province: { Name: item.province_name, Id: item.province_id },
        Id: 11,
      };
      // const other = 'connect.sid=s%3AVoz4bdDZrrHIipjyTdYTK4yLJtlak6NO.DM1Gk1BltiV2aTaO5SjumaZlsq1XfSGHYmh%2BGP%2F3u5k; Youzy2CCurrentProvince=%7B%22provinceId%22%3A850%2C%22provinceName%22%3A%22%E6%B9%96%E5%8D%97%22%2C%22isGaokaoVersion%22%3Atrue%7D; Youzy2CCurrentScore=%7B%22numId%22%3A0%2C%22provinceNumId%22%3A0%2C%22provinceName%22%3Anull%2C%22total%22%3A0%2C%22courseTypeId%22%3A0%2C%22rank%22%3A0%2C%22chooseLevelOrSubjects%22%3Anull%2C%22scoreType%22%3A0%2C%22chooseLevelFormat%22%3A%5B%5D%2C%22chooseSubjectsFormat%22%3A%5B%5D%7D; Youzy2CUser=%7B%22numId%22%3A11461160%2C%22realName%22%3A%22%E5%BC%A0%E4%B8%89%22%2C%22avatarUrl%22%3Anull%2C%22gender%22%3A0%2C%22provinceId%22%3A850%2C%22cityId%22%3A1140%2C%22countyId%22%3A10018%2C%22schoolId%22%3A-10%2C%22class%22%3A%22%E9%AB%98%E4%B8%89%22%2C%22gkYear%22%3A2018%2C%22isZZUser%22%3Afalse%2C%22zzCount%22%3A0%2C%22isElective%22%3Afalse%2C%22active%22%3Atrue%2C%22courseType%22%3A1%2C%22secretName%22%3A%22%E5%BC%A0%E5%90%8C%E5%AD%A6%22%2C%22userPermissionId%22%3A3%2C%22identityExpirationTime%22%3A%222019-10-22T08%3A13%3A05.943Z%22%2C%22username%22%3A%2218602756630%22%2C%22mobilePhone%22%3A%2218602756630%22%2C%22provinceName%22%3Anull%2C%22cityName%22%3Anull%2C%22countyName%22%3Anull%2C%22schoolName%22%3A%22%22%2C%22updateGaoKaoCount%22%3A0%2C%22lastLoginDate%22%3A%220001-01-01T00%3A00%3A00%22%2C%22creationTime%22%3A%222018-04-16T09%3A49%3A03.773%2B08%3A00%22%2C%22id%22%3A%225cf584aa9e742b1f884ed01b%22%2C%22vipPermission%22%3Atrue%7D';
      // const cookie = 'Youzy.FirstSelectVersion=1; Youzy.CurrentVersion=' + urlencode(JSON.stringify(CurrentVersion)) + other;
      // const cookie = 'Youzy.FirstSelectVersion=1; Youzy.CurrentVersion=%7b%22Name%22%3a%22%e6%b9%96%e5%8c%97%22%2c%22EnName%22%3a%22hubei%22%2c%22ProvinceId%22%3a849%2c%22Domain%22%3a%22http%3a%2f%2fhubei.youzy.cn%22%2c%22Description%22%3a%22%22%2c%22QQGroup%22%3a%22428487411%22%2c%22QQGroupUrl%22%3anull%2c%22IsOpen%22%3atrue%2c%22Sort%22%3a12%2c%22Province%22%3a%7b%22Name%22%3a%22%e6%b9%96%e5%8c%97%22%2c%22Id%22%3a849%7d%2c%22Id%22%3a11%7d; connect.sid=s%3AVoz4bdDZrrHIipjyTdYTK4yLJtlak6NO.DM1Gk1BltiV2aTaO5SjumaZlsq1XfSGHYmh%2BGP%2F3u5k; Youzy2CCurrentProvince=%7B%22provinceId%22%3A850%2C%22provinceName%22%3A%22%E6%B9%96%E5%8D%97%22%2C%22isGaokaoVersion%22%3Atrue%7D; Youzy2CCurrentScore=%7B%22numId%22%3A0%2C%22provinceNumId%22%3A0%2C%22provinceName%22%3Anull%2C%22total%22%3A0%2C%22courseTypeId%22%3A0%2C%22rank%22%3A0%2C%22chooseLevelOrSubjects%22%3Anull%2C%22scoreType%22%3A0%2C%22chooseLevelFormat%22%3A%5B%5D%2C%22chooseSubjectsFormat%22%3A%5B%5D%7D; Youzy2CUser=%7B%22numId%22%3A11461160%2C%22realName%22%3A%22%E5%BC%A0%E4%B8%89%22%2C%22avatarUrl%22%3Anull%2C%22gender%22%3A0%2C%22provinceId%22%3A850%2C%22cityId%22%3A1140%2C%22countyId%22%3A10018%2C%22schoolId%22%3A-10%2C%22class%22%3A%22%E9%AB%98%E4%B8%89%22%2C%22gkYear%22%3A2018%2C%22isZZUser%22%3Afalse%2C%22zzCount%22%3A0%2C%22isElective%22%3Afalse%2C%22active%22%3Atrue%2C%22courseType%22%3A1%2C%22secretName%22%3A%22%E5%BC%A0%E5%90%8C%E5%AD%A6%22%2C%22userPermissionId%22%3A3%2C%22identityExpirationTime%22%3A%222019-10-22T08%3A13%3A05.943Z%22%2C%22username%22%3A%2218602756630%22%2C%22mobilePhone%22%3A%2218602756630%22%2C%22provinceName%22%3Anull%2C%22cityName%22%3Anull%2C%22countyName%22%3Anull%2C%22schoolName%22%3A%22%22%2C%22updateGaoKaoCount%22%3A0%2C%22lastLoginDate%22%3A%220001-01-01T00%3A00%3A00%22%2C%22creationTime%22%3A%222018-04-16T09%3A49%3A03.773%2B08%3A00%22%2C%22id%22%3A%225cf584aa9e742b1f884ed01b%22%2C%22vipPermission%22%3Atrue%7D';
      // const referer = 'https://www.youzy.cn/tzy/search/colleges/homepage/cfrationIndex?cid=1009';
      const other = ';connect.sid=s:wcTG8AinKEEmpikF4_5yAMhfp06v9ywH.FjaeuHzKyVjMWe6OiFZ7DglHwMaGjnwaF92K5wIyvgs';
      // const other = ';connect.sid=s:wcTG8AinKEEmpikF4_5yAMhfp06v9ywH.FjaeuHzKyVjMWe6OiFZ7DglHwMaGjnwaF92K5wIyvgs;';
      const Youzy2CUser = {
        numId: 11461160,
        realName: '张三',
        avatarUrl: null,
        gender: 0,
        provinceId: item.province_id,
        cityId: 1140,
        countyId: 10018,
        schoolId: -10,
        class: '高三',
        gkYear: 2018,
        isZZUser: false,
        zzCount: 0,
        isElective: false,
        active: true,
        courseType: 1,
        secretName: '张同学',
        userPermissionId: 3,
        identityExpirationTime: '2019-10-22T08:13:05.943Z',
        username: '18602756630',
        mobilePhone: '18602756630',
        provinceName: null,
        cityName: null,
        countyName: null,
        schoolName: '',
        updateGaoKaoCount: 0,
        lastLoginDate: '0001-01-01T00:00:00',
        creationTime: '2018-04-16T09:49:03.773+08:00',
        id: '5cf584aa9e742b1f884ed01b',
        vipPermission: true,
      };
      const Youzy2CCurrentProvince = {
        provinceId: item.province_id,
        provinceName: item.province_name,
        isGaokaoVersion: true,
      };
      const Youzy2CCurrentScore = {
        numId: 0,
        provinceNumId: item.province_id,
        provinceName: item.province_name,
        total: 0,
        courseTypeId: 0,
        rank: 0,
        chooseLevelOrSubjects: null,
        scoreType: 0,
        chooseLevelFormat: [],
        chooseSubjectsFormat: [],
      };
      const cookie = ''
          // + 'Youzy.FirstSelectVersion=1'
          + other;
      +';Youzy.CurrentVersion=' + urlencode(JSON.stringify(CurrentVersion))
      + ';Youzy2CUser=' + urlencode(JSON.stringify(Youzy2CUser))
      + ';Youzy2CCurrentProvince=' + urlencode(JSON.stringify(Youzy2CCurrentProvince))
      + ';Youzy2CCurrentScore=' + urlencode(JSON.stringify(Youzy2CCurrentScore));
      // const cookieCommon = 'connect.sid=s%3AwcTG8AinKEEmpikF4_5yAMhfp06v9ywH.FjaeuHzKyVjMWe6OiFZ7DglHwMaGjnwaF92K5wIyvgs; Youzy2CUser=%7B%22numId%22%3A11461160%2C%22realName%22%3A%22%E5%BC%A0%E4%B8%89%22%2C%22avatarUrl%22%3A%22%2Fcontent%2Fdefault%2Fusercenter%2Fheadimg.jpg%22%2C%22gender%22%3A0%2C%22provinceId%22%3A841%2C%22cityId%22%3A1140%2C%22countyId%22%3A10026%2C%22schoolId%22%3A10038%2C%22class%22%3A%22%E9%AB%98%E4%B8%89-%E9%AB%98%E4%B8%89%E7%8F%AD%22%2C%22gkYear%22%3A2018%2C%22isZZUser%22%3Afalse%2C%22zzCount%22%3A0%2C%22isElective%22%3Afalse%2C%22active%22%3Atrue%2C%22courseType%22%3A1%2C%22secretName%22%3A%22%E5%BC%A0%E5%90%8C%E5%AD%A6%22%2C%22userPermissionId%22%3A3%2C%22identityExpirationTime%22%3A%222019-10-22T08%3A13%3A05.943Z%22%2C%22username%22%3A%2218602756630%22%2C%22mobilePhone%22%3A%2218602756630%22%2C%22provinceName%22%3Anull%2C%22cityName%22%3Anull%2C%22countyName%22%3Anull%2C%22schoolName%22%3A%22%22%2C%22updateGaoKaoCount%22%3A0%2C%22lastLoginDate%22%3A%220001-01-01T00%3A00%3A00%22%2C%22creationTime%22%3A%222018-04-16T09%3A49%3A03.773%2B08%3A00%22%2C%22id%22%3A%225cf584aa9e742b1f884ed01b%22%2C%22vipPermission%22%3Atrue%7D; Youzy2CCurrentProvince=%7B%22provinceId%22%3A841%2C%22provinceName%22%3A%22%E9%BB%91%E9%BE%99%E6%B1%9F%22%2C%22isGaokaoVersion%22%3Atrue%7D; Youzy2CCurrentScore=%7B%22numId%22%3A0%2C%22provinceNumId%22%3A0%2C%22provinceName%22%3Anull%2C%22total%22%3A0%2C%22courseTypeId%22%3A0%2C%22rank%22%3A0%2C%22chooseLevelOrSubjects%22%3Anull%2C%22scoreType%22%3A0%2C%22chooseLevelFormat%22%3A%5B%5D%2C%22chooseSubjectsFormat%22%3A%5B%5D%7D';
      const referer = `https://www.youzy.cn/tzy/search/colleges/homepage/cfrationIndex?cid=${item.school_id}`;


      const schoolProvinceResult = await ctx.basePost(url, params, cookie, referer);
      if (schoolProvinceResult && schoolProvinceResult.result) {
        const result = await ctx.model.SchoolAdmissionJson.update({
          status: 666,
          json: JSON.stringify(schoolProvinceResult.result),
          num: schoolProvinceResult.result.length,
          code: schoolProvinceResult.code,
          message: schoolProvinceResult.message,
          is_success: schoolProvinceResult.isSuccess,
        }, {
          where: {
            id: item.id,
          },
        });
        if (result) {
          loadNum++;
          if (loadNum === 40) {
            await this.loadSchoolAdmission(offsetNum);
          }
        }
      } else {
        const result = await ctx.model.SchoolAdmissionJson.update({
          status: 404,
        }, {
          where: {
            id: item.id,
          },
        });
        if (result) {
          loadNum++;
          if (loadNum === 40) {
            await this.loadSchoolAdmission(offsetNum);
          }
        }
      }
    }
  }


  async initSchoolAdmission() {
    super.initSchoolAdmission();

    const { ctx } = this;
    const schoolProvinceArr = await ctx.model.SchoolAdmissionJson.findAll({
      where: {
        status: 600,
        // id: 45,
      },
      order: [[ 'id' ]],
      limit: 35,
    });
    let loadNum = 0;
    const schoolAdmissionArr = [];
    const idsArr = [];
    for (let i = 0; i < schoolProvinceArr.length; i++) {
      const item = schoolProvinceArr[i];
      idsArr.push(item.id);
      if (item.json) {
        const schoolProvinceItem = await this.jiemiSchoolData(JSON.parse(item.json));

        schoolProvinceItem.forEach(itemJson => {
          schoolAdmissionArr.push({
            school_id: item.school_id,
            r_school_id: item.r_school_id,
            school_name: item.school_name,
            r_school_name: item.r_school_name,
            province_id: item.province_id,
            r_province_id: item.r_province_id,
            province_name: item.province_name,
            r_province_name: item.r_province_name,

            year: itemJson.year,

            batch_id: itemJson.batch,
            batch_name: itemJson.batchName,
            subject_type: parseInt(itemJson.course),

            min_score: itemJson.minScore,
            max_score: itemJson.maxScore,
            avg_score: itemJson.avgScore,


            count: itemJson.enterNum,
            min_score_rank: parseInt(itemJson.lowSort),

            prov_score: itemJson.prvControlLines,
          });
          console.log('prov_score', itemJson.lowSort);
        });
      }
      loadNum++;
    }
    console.log(schoolAdmissionArr);
    await ctx.model.SchoolAdmission.bulkCreate(schoolAdmissionArr);
    await ctx.model.SchoolAdmissionJson.update({
      status: 666,
    }, {
      where: {
        id: {
          $in: idsArr,
        },
      },
    });
    if (loadNum === 35) {
      this.initSchoolAdmission();
    }
  }

  async aaa(p, a, c, k, e, d) {
    [ p, a, c, k, e, d ] = [ '4 5=3(2){4 1="";2.7("|").6(3(0){0=0.b(/[c-d]/8,"");1+="&#9"+0+";"});a 1}', 14, 14, 'value|number|myNumbers|function|var|showNumber|forEach|split|ig|x|return|replace|g|t'.split('|'), 0, {}];
    e = function(c) {
      return (c < a ? '' : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36));
    };
    if (!''.replace(/^/, String)) {
      while (c--) d[e(c)] = k[c] || e(c);
      k = [ function(e) {
        return d[e];
      } ];
      e = function() {
        return '\\w+';
      };
      c = 1;
    }
    while (c--) {
      if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
    }
    console.log(p);
    return p;
  }

  showNumber(myNumbers) {
    let number = '';
    myNumbers.split('|').forEach(function(value) {
      value = value.replace(/[g-t]/ig, '');
      number += '&#x' + value + ';';
    });
    return this.decodeSr(number);
    // return number;
  }

  decodeSr(str) {
    const fontArr = [
      {
        name: '&#xa8f2e;',
        value: '0',
      },
      {
        name: '&#xc15f9;',
        value: '1',
      },
      {
        name: '&#x7d3ae;',
        value: '2',
      },
      {
        name: '&#xf8b41;',
        value: '3',
      },
      {
        name: '&#xc2e7a;',
        value: '4',
      },
      {
        name: '&#xe7f11;',
        value: '5',
      },
      {
        name: '&#x6f732;',
        value: '6',
      },
      {
        name: '&#xaa86e;',
        value: '7',
      },
      {
        name: '&#xfc6a6;',
        value: '8',
      },
      {
        name: '&#x72ef1;',
        value: '9',
      },
    ];
    fontArr.forEach(item => {
      str = str.replace(item.name, item.value);
      str = str.replace(item.name, item.value);
      str = str.replace(item.name, item.value);
      str = str.replace(item.name, item.value);
      str = str.replace(item.name, item.value);
      str = str.replace(item.name, item.value);
    });
    return str;
  }

  async jiemiSchoolData(result) {
    for (let index = 0; index < result.length; index++) {
      const element = result[index];
      if (element.maxScore !== 0) {
        element.maxScore = this.showNumber(element.maxScore.substring(0, element.maxScore.length - 1), 14, 14, 'value|number|myNumbers|function|var|showNumber|forEach|split|ig|x|return|replace|g|t'.split('|'), 0, {});
      }
      if (element.avgScore !== 0) {
        element.avgScore = this.showNumber(element.avgScore.substring(0, element.avgScore.length - 1), 14, 14, 'value|number|myNumbers|function|var|showNumber|forEach|split|ig|x|return|replace|g|t'.split('|'), 0, {});
      }
      if (element.minScore !== 0) {
        element.minScore = this.showNumber(element.minScore.substring(0, element.minScore.length - 1), 14, 14, 'value|number|myNumbers|function|var|showNumber|forEach|split|ig|x|return|replace|g|t'.split('|'), 0, {});
      }
      if (element.lowSort !== 0) {
        element.lowSort = this.showNumber(element.lowSort.substring(0, element.lowSort.length - 1), 14, 14, 'value|number|myNumbers|function|var|showNumber|forEach|split|ig|x|return|replace|g|t'.split('|'), 0, {});
      }
      if (element.enterNum !== 0) {
        element.enterNum = this.showNumber(element.enterNum.substring(0, element.enterNum.length - 1), 14, 14, 'value|number|myNumbers|function|var|showNumber|forEach|split|ig|x|return|replace|g|t'.split('|'), 0, {});
      }
    }
    console.log('result', result);
    return result;
  }


  async initSchoolMajorAdmissionTable() {
    const { ctx } = this;
    this.provinceList = await this.loadProvince();
    this.schoolList = await ctx.model.School.findAll();
    const schoolMajorAdmissionJson = [];
    this.schoolList.forEach(item => {
      this.provinceList.forEach(item2 => {
        this.subjectTypeList.forEach(item4 => {
          const schoolMajorAdmissionJsonItem = {
            school_id: item.school_id || item.id,
            school_name: item.name,
            province_id: item2.id,
            province_name: item2.name,
            subject_type: item4,
          };
          schoolMajorAdmissionJson.push(schoolMajorAdmissionJsonItem);
        });
      });
    });
    await ctx.model.SchoolMajorAdmissionJson.bulkCreate(schoolMajorAdmissionJson);
  }

  async loadSchoolMajorAdmission() {
    const { ctx } = this;
    const schoolProvinceArr = await ctx.model.SchoolMajorAdmissionJson.findAll({
      where: {
        // id:{
        // 	$gt:minId
        // },
        // isHave: {
        // 	$ne:456
        // },
        status: 0,
      },
      order: [[ 'id' ]],
      limit: 18,
    });
    if (schoolProvinceArr) {
      let loadNum = 0;
      for (let i = 0; i < schoolProvinceArr.length; i++) {
        const item = schoolProvinceArr[i];

        const url = 'https://www.youzy.cn/Data/ScoreLines/Fractions/Professions/Query';
        const data = {
          ucode: '43_' + item.school_id + '_0_0',
          courseType: item.subject_type === 'WEN' ? 0 : 1,
        };
        const text = JSON.stringify(data);
        const textBytes = youzyEptService.utils.utf8.toBytes(text);
        const aesCtr = new youzyEptService.ModeOfOperation.ctr([ 11, 23, 32, 43, 45, 46, 67, 8, 9, 10, 11, 12, 13, 14, 15, 16 ], new youzyEptService.Counter(5));
        const encryptedBytes = aesCtr.encrypt(textBytes);
        const params = {
          data: youzyEptService.utils.hex.fromBytes(encryptedBytes),
        };
        const other = 'connect.sid=s:s9vPCDWoZmy3pWdxbsOYD83X6ZZfbTgz.Qr2PlEMdYqrC+Va46Vw5vXPLeCklWA1UClr+hsB2esM;';
        const Youzy2CUser = {
          numId: 11461160,
          realName: '张三',
          avatarUrl: null,
          gender: 0,
          provinceId: item.province_id,
          cityId: 1140,
          countyId: 10018,
          schoolId: -10,
          class: '高三',
          gkYear: 2018,
          isZZUser: false,
          zzCount: 0,
          isElective: false,
          active: true,
          courseType: 1,
          secretName: '张同学',
          userPermissionId: 3,
          identityExpirationTime: '2019-10-22T08:13:05.943Z',
          username: '18602756630',
          mobilePhone: '18602756630',
          provinceName: null,
          cityName: null,
          countyName: null,
          schoolName: '',
          updateGaoKaoCount: 0,
          lastLoginDate: '0001-01-01T00:00:00',
          creationTime: '2018-04-16T09:49:03.773+08:00',
          id: '5cf584aa9e742b1f884ed01b',
          vipPermission: true,
        };
        const Youzy2CCurrentProvince = {
          provinceId: item.province_id,
          provinceName: item.province_name,
          isGaokaoVersion: true,
        };
        const Youzy2CCurrentScore = {
          numId: 0,
          provinceNumId: item.province_id,
          provinceName: item.province_name,
          total: 0,
          courseTypeId: 0,
          rank: 0,
          chooseLevelOrSubjects: null,
          scoreType: 0,
          chooseLevelFormat: [],
          chooseSubjectsFormat: [],
        };
        const cookie = other + 'Youzy2CUser=' + urlencode(JSON.stringify(Youzy2CUser))
                    + ';Youzy2CCurrentProvince=' + urlencode(JSON.stringify(Youzy2CCurrentProvince))
                    + ';Youzy2CCurrentScore=' + urlencode(JSON.stringify(Youzy2CCurrentScore));
        const referer = `https://www.youzy.cn/tzy/search/colleges/homepage/cfrationIndex?cid=${item.school_id}`;

        console.log({ cookie });
        ctx.body = cookie;

        const schoolProvinceResult = await ctx.basePost(url, params, cookie, referer);
        if (schoolProvinceResult && schoolProvinceResult.result) {
          const result = await ctx.model.SchoolMajorAdmissionJson.update({
            status: 1,
            json: JSON.stringify(schoolProvinceResult.result),
            num: schoolProvinceResult.result.length,
            code: schoolProvinceResult.code,
            message: schoolProvinceResult.message,
            is_success: schoolProvinceResult.isSuccess,
          }, {
            where: {
              id: item.id,
            },
          });
          if (result) {
            loadNum++;
            if (loadNum === 18) {
              await this.loadSchoolMajorAdmission();
            }
          }
        } else {
          loadNum = loadNum + 1;
        }
      }
    } else {
      this.loadSchoolMajorAdmission();
    }
  }


  async initSchoolMajorAdmission() {
    super.initSchoolMajorAdmission();
    const { ctx } = this;
    const schoolProvinceArr = await ctx.model.SchoolMajorAdmissionJson.findAll({
      where: {
        status: 1,
      },
      order: [[ 'id' ]],
      limit: 35,
    });
    let loadNum = 0;
    const schoolMajorAdmissionArr = [];
    const idsArr = [];
    for (let i = 0; i < schoolProvinceArr.length; i++) {
      const item = schoolProvinceArr[i];
      idsArr.push(item.id);
      if (item.json) {
        const schoolProvinceItem = await this.jiemiSchoolData(JSON.parse(item.json));

        schoolProvinceItem.forEach(itemJson => {
          schoolMajorAdmissionArr.push({
            school_id: item.school_id,
            r_school_id: item.r_school_id,
            school_name: item.school_name,
            r_school_name: item.r_school_name,
            province_id: item.province_id,
            r_province_id: item.r_province_id,
            province_name: item.province_name,
            r_province_name: item.r_province_name,

            year: itemJson.year,

            batch_id: itemJson.batch,
            batch_name: itemJson.batchName,
            subject_type_name: parseInt(itemJson.course) === 0 ? '理科' : '文科',
            r_subject_type: parseInt(itemJson.course) === 0 ? 'LI' : 'WEN',

            min_score: itemJson.minScore,
            max_score: itemJson.maxScore,
            avg_score: itemJson.avgScore,


            count: itemJson.enterNum,
            min_score_rank: itemJson.lowSort,

            prov_score: itemJson.prvControlLines,
          });
        });
      }
      loadNum++;
    }
    console.log(schoolMajorAdmissionArr);
    // await ctx.model.SchoolMajorAdmission.bulkCreate(schoolMajorAdmissionArr);
    // await ctx.model.SchoolMajorAdmissionJson.update({
    //   status: 600,
    // }, {
    //   where: {
    //     id: {
    //       $in: idsArr,
    //     },
    //   },
    // });
    // if (loadNum === 35) {
    //   this.initSchoolMajorAdmission();
    // }
  }
}


module.exports = YouzyController;