"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var csv_parse_1 = __importDefault(require("csv-parse"));
var ImportContactService = /** @class */ (function () {
    function ImportContactService() {
        this.contacts = [];
        this.nameTester = /(?:"?([^"]*)"?\s)?(?:<?([a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)>?)/;
        this.emailTester = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    }
    ImportContactService.prototype.getEmail = function (data) {
        return data.toLowerCase().match(this.emailTester);
    };
    ImportContactService.prototype.getName = function (data) {
        return data.match(this.nameTester);
    };
    ImportContactService.prototype.capitalize = function (data) {
        console.log('__test__', data, data.length);
        if (!data.length)
            return data;
        return data
            .split(' ')
            .map(function (word) { return "" + word[0].toUpperCase() + word.substr(1); })
            .join(' ');
    };
    ImportContactService.prototype.run = function (contactsFileStream) {
        return __awaiter(this, void 0, void 0, function () {
            var parser, parseCSV;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parser = csv_parse_1.default({
                            delimiter: ';',
                            columns: ['data', 'origin', 'nameFromCSV'],
                        });
                        parseCSV = contactsFileStream.pipe(parser);
                        parseCSV.on('data', function (line) {
                            var data = line.data, origin = line.origin, nameFromCSV = line.nameFromCSV;
                            var emailMatch = _this.getEmail(data);
                            var nameMatch = _this.getName(data);
                            if (!emailMatch)
                                return;
                            var email = emailMatch[0];
                            var name = nameMatch && nameMatch[1] ? nameMatch[1] : nameFromCSV;
                            var tags = [origin];
                            _this.contacts.push({
                                email: email,
                                name: _this.capitalize(name),
                                tags: tags,
                            });
                        });
                        return [4 /*yield*/, new Promise(function (resolve) { return parseCSV.on('end', resolve); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return ImportContactService;
}());
exports.default = ImportContactService;
