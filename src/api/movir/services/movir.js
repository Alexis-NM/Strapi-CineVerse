'use strict';

/**
 * movir service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::movir.movir');
