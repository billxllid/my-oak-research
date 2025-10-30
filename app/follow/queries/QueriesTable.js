"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var button_1 = require("@/components/ui/button");
var lucide_react_1 = require("lucide-react");
var common_1 = require("@/components/common");
var QueryDialog_1 = require("./QueryDialog");
var QueryDeleteAlert_1 = require("./QueryDeleteAlert");
var QueriesTable = function (_a) {
    var queries = _a.queries, keywords = _a.keywords, sources = _a.sources;
    var _b = (0, react_1.useState)(), editingQuery = _b[0], setEditingQuery = _b[1];
    var handleEdit = function (query) {
        setEditingQuery(query);
    };
    var handleCloseDialog = function () {
        setEditingQuery(undefined);
    };
    var columns = [
        {
            key: "name",
            label: "Name",
            render: function (query) { return query.name; },
        },
        {
            key: "description",
            label: "Description",
            className: "max-w-xs",
            render: function (query) { return (<div className="whitespace-normal">{query.description || "-"}</div>); },
        },
        {
            key: "frequency",
            label: "Frequency",
            render: function (query) { return query.frequency; },
        },
        {
            key: "keywordsCount",
            label: "Keywords",
            render: function (query) { var _a; return query.keywordsCount || ((_a = query.keywords) === null || _a === void 0 ? void 0 : _a.length) || 0; },
        },
        {
            key: "sourcesCount",
            label: "Sources",
            render: function (query) { var _a; return query.sourcesCount || ((_a = query.sources) === null || _a === void 0 ? void 0 : _a.length) || 0; },
        },
        {
            key: "enabled",
            label: "Enabled",
            render: function (query) { return (query.enabled ? "Yes" : "No"); },
        },
    ];
    var actions = [
        {
            type: "edit",
            render: function (query) { return (<button_1.Button size="sm" variant="outline" onClick={function () { return handleEdit(query); }}>
          <lucide_react_1.PencilIcon className="size-3"/>
        </button_1.Button>); },
        },
        {
            type: "delete",
            render: function (query) { return (<QueryDeleteAlert_1.default query={query} triggerButton={<button_1.Button size="sm" variant="outline">
              <lucide_react_1.TrashIcon className="size-3"/>
            </button_1.Button>}/>); },
        },
    ];
    return (<>
      <QueryDialog_1.default query={editingQuery} keywords={keywords} sources={sources} open={!!editingQuery} onOpenChange={function (open) { return !open && handleCloseDialog(); }}/>
      <common_1.DataTable data={queries} columns={columns} actions={actions} emptyMessage="No queries found. Add your first query to get started."/>
    </>);
};
exports.default = QueriesTable;
