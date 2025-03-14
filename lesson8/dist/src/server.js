"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const typeorm_1 = require("typeorm");
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
let Farm = class Farm {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Farm.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Farm.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Farm.prototype, "location", void 0);
Farm = __decorate([
    (0, typeorm_1.Entity)()
], Farm);
const AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.POSTGRESDB_HOST,
    port: Number.parseInt(process.env.POSTGRESDB_LOCAL_PORT || '5432', 10),
    username: process.env.POSTGRESDB_USER,
    password: process.env.POSTGRESDB_ROOT_PASSWORD,
    database: process.env.POSTGRESDB_DATABASE,
    entities: [Farm],
    synchronize: false,
});
AppDataSource.initialize()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Database connected");
    yield AppDataSource.query(`
            CREATE TABLE IF NOT EXISTS farm (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                location VARCHAR(255) NOT NULL
            );
        `);
    console.log("Farm table ensured");
}))
    .catch((error) => console.log(error));
const farmRepository = () => AppDataSource.getRepository("Farm");
app.post("/farms", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, location } = req.body;
    const farm = farmRepository().create({ name, location });
    yield farmRepository().save(farm);
    res.status(201).json(farm);
}));
app.get("/farms", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    const farms = yield farmRepository().find();
    res.json(farms);
}));
app.get("/farms/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const farm = yield farmRepository().findOneBy({ id: parseInt(req.params.id) });
    if (farm)
        res.json(farm);
    else
        res.status(404).json({ message: "Farm not found" });
}));
app.put("/farms/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const farm = yield farmRepository().findOneBy({ id: parseInt(req.params.id) });
    if (!farm)
        return res.status(404).json({ message: "Farm not found" });
    const { name, location } = req.body;
    farm.name = name;
    farm.location = location;
    yield farmRepository().save(farm);
    res.json(farm);
}));
app.delete("/farms/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield farmRepository().delete(req.params.id);
    if (result.affected === 0) {
        return res.status(404).json({ message: "Farm not found" });
    }
    res.status(204).send();
}));
app.listen(8080, function () {
    console.log(`Express App running at http://127.0.0.1:${process.env.NODE_DOCKER_PORT}/`);
});
