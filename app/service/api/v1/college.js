'use strict';
const Service = require('../../../care/base_api_service');

class CollegeService extends Service {
  constructor(ctx) {
    super(ctx);
    this.tableId = 232;
  }

  async index(page, pageSize) {
    const { ctx } = this;
    // 获取数据
    const result = await ctx.curl(`${this.apiHeader}/datasets/${this.tableId}/items`, {
      method: 'get',
      dataType: 'json',
      contentType: 'json',
      data: {
        page, pageSize,
      },
    });
    return result;
  }

  async show(id) {
    const { ctx } = this;
    // 获取数据
    const result = await ctx.curl(`${this.apiHeader}/datasets/${this.tableId}/items/${id}`, {
      method: 'get',
      dataType: 'json',
      contentType: 'json',
    });
    return result;
  }

  async create() {
    super.create();
  }

  async update() {
    super.update();
  }

  async destroy() {
    super.destroy();
  }

}

module.exports = CollegeService;
