"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogicModule = void 0;
const common_1 = require("@nestjs/common");
const data_module_1 = require("../data/data.module");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const tenants_module_1 = require("./tenants/tenants.module");
const warehouses_module_1 = require("./warehouses/warehouses.module");
const products_module_1 = require("./products/products.module");
const inventory_module_1 = require("./inventory/inventory.module");
const orders_module_1 = require("./orders/orders.module");
const logistics_module_1 = require("./logistics/logistics.module");
const analytics_module_1 = require("./analytics/analytics.module");
let LogicModule = class LogicModule {
};
exports.LogicModule = LogicModule;
exports.LogicModule = LogicModule = __decorate([
    (0, common_1.Module)({
        imports: [data_module_1.DataModule, users_module_1.UsersModule, auth_module_1.AuthModule, tenants_module_1.TenantsModule, warehouses_module_1.WarehousesModule, products_module_1.ProductsModule, inventory_module_1.InventoryModule, orders_module_1.OrdersModule, logistics_module_1.LogisticsModule, analytics_module_1.AnalyticsModule],
        providers: [],
        exports: [],
    })
], LogicModule);
//# sourceMappingURL=logic.module.js.map