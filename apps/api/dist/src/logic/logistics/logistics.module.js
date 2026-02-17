"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogisticsModule = void 0;
const common_1 = require("@nestjs/common");
const data_module_1 = require("../../data/data.module");
const vehicles_service_1 = require("./vehicles/vehicles.service");
const vehicles_controller_1 = require("./vehicles/vehicles.controller");
const drivers_service_1 = require("./drivers/drivers.service");
const drivers_controller_1 = require("./drivers/drivers.controller");
const shipments_service_1 = require("./shipments/shipments.service");
const shipments_controller_1 = require("./shipments/shipments.controller");
let LogisticsModule = class LogisticsModule {
};
exports.LogisticsModule = LogisticsModule;
exports.LogisticsModule = LogisticsModule = __decorate([
    (0, common_1.Module)({
        imports: [data_module_1.DataModule],
        controllers: [vehicles_controller_1.VehiclesController, drivers_controller_1.DriversController, shipments_controller_1.ShipmentsController],
        providers: [vehicles_service_1.VehiclesService, drivers_service_1.DriversService, shipments_service_1.ShipmentsService],
        exports: [vehicles_service_1.VehiclesService, drivers_service_1.DriversService, shipments_service_1.ShipmentsService],
    })
], LogisticsModule);
//# sourceMappingURL=logistics.module.js.map