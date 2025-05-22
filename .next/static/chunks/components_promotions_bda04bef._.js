(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/components/promotions/edit-sale-modal.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "EditSaleModal": (()=>EditSaleModal)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$libs$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/libs/api/index.ts [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$libs$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/libs/api/index.ts [app-client] (ecmascript) <locals>");
;
var _s = __turbopack_context__.k.signature();
;
;
function EditSaleModal({ sale, onClose, onSave }) {
    _s();
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        ...sale,
        start_date: new Date(sale.start_date).toISOString().split("T")[0],
        end_date: new Date(sale.end_date).toISOString().split("T")[0]
    });
    const handleChange = (e)=>{
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        try {
            const salePayload = {
                ...formData,
                start_date: new Date(formData.start_date),
                end_date: new Date(formData.end_date),
                image_url: formData.image_url.map((url)=>url.trim()),
                product_ids: formData.product_ids.map((id)=>id.trim()),
                category_ids: formData.category_ids.map((id)=>id.trim()),
                subcategory_ids: formData.subcategory_ids.map((id)=>id.trim()),
                meta_data: JSON.parse(formData.meta_data),
                created_at: sale.created_at,
                updated_at: new Date()
            };
            if (salePayload.id) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$libs$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APISDK"].getInstance().updateSale(salePayload.id, salePayload);
            } else {
                await __TURBOPACK__imported__module__$5b$project$5d2f$libs$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APISDK"].getInstance().createSale(salePayload);
            }
            onSave();
            onClose();
        } catch (error) {
            console.error("Failed to save sale:", error);
            alert("Invalid meta_data JSON.");
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 999,
            overflowY: "auto"
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                backgroundColor: "#fff",
                padding: "30px",
                margin: "50px auto",
                width: "500px",
                borderRadius: "10px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    style: {
                        marginBottom: "20px",
                        color: "#333",
                        fontWeight: "600"
                    },
                    children: formData.id ? "Edit Sale" : "Create Sale"
                }, void 0, false, {
                    fileName: "[project]/components/promotions/edit-sale-modal.tsx",
                    lineNumber: 80,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSubmit,
                    children: [
                        [
                            {
                                label: "Name",
                                name: "name",
                                type: "text"
                            },
                            {
                                label: "Description",
                                name: "description",
                                type: "text"
                            },
                            {
                                label: "Discount (%)",
                                name: "discount_percentage",
                                type: "number"
                            },
                            {
                                label: "Image URLs (comma separated)",
                                name: "image_url",
                                type: "text"
                            },
                            {
                                label: "Product IDs (comma separated)",
                                name: "product_ids",
                                type: "text"
                            },
                            {
                                label: "Category IDs (comma separated)",
                                name: "category_ids",
                                type: "text"
                            },
                            {
                                label: "Subcategory IDs (comma separated)",
                                name: "subcategory_ids",
                                type: "text"
                            }
                        ].map(({ label, name, type })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginBottom: "15px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        style: {
                                            display: "block",
                                            marginBottom: "5px",
                                            color: "#444"
                                        },
                                        children: label
                                    }, void 0, false, {
                                        fileName: "[project]/components/promotions/edit-sale-modal.tsx",
                                        lineNumber: 95,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: type,
                                        name: name,
                                        value: Array.isArray(formData[name]) ? formData[name].join(", ") : formData[name],
                                        onChange: handleChange,
                                        required: name === "name" || name === "discount_percentage",
                                        style: {
                                            width: "100%",
                                            padding: "10px",
                                            borderRadius: "6px",
                                            border: "1px solid #ccc",
                                            outlineColor: "#4CAF50",
                                            color: "#333"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/components/promotions/edit-sale-modal.tsx",
                                        lineNumber: 96,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, name, true, {
                                fileName: "[project]/components/promotions/edit-sale-modal.tsx",
                                lineNumber: 94,
                                columnNumber: 13
                            }, this)),
                        [
                            "start_date",
                            "end_date"
                        ].map((name)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginBottom: "15px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        style: {
                                            display: "block",
                                            marginBottom: "5px",
                                            color: "#444"
                                        },
                                        children: [
                                            name.replace("_", " ").toUpperCase(),
                                            ":"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/promotions/edit-sale-modal.tsx",
                                        lineNumber: 121,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "date",
                                        name: name,
                                        value: formData[name],
                                        onChange: handleChange,
                                        required: true,
                                        style: {
                                            width: "100%",
                                            padding: "10px",
                                            borderRadius: "6px",
                                            border: "1px solid #ccc",
                                            outlineColor: "#4CAF50",
                                            color: "#333"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/components/promotions/edit-sale-modal.tsx",
                                        lineNumber: 124,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, name, true, {
                                fileName: "[project]/components/promotions/edit-sale-modal.tsx",
                                lineNumber: 120,
                                columnNumber: 13
                            }, this)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginBottom: "15px"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    style: {
                                        display: "block",
                                        marginBottom: "5px",
                                        color: "#444"
                                    },
                                    children: "Sale Type:"
                                }, void 0, false, {
                                    fileName: "[project]/components/promotions/edit-sale-modal.tsx",
                                    lineNumber: 144,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    name: "sale_type",
                                    value: formData.sale_type,
                                    onChange: handleChange,
                                    style: {
                                        width: "100%",
                                        padding: "10px",
                                        borderRadius: "6px",
                                        border: "1px solid #ccc",
                                        outlineColor: "#4CAF50",
                                        color: "#333"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "product",
                                            children: "Product"
                                        }, void 0, false, {
                                            fileName: "[project]/components/promotions/edit-sale-modal.tsx",
                                            lineNumber: 158,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "category",
                                            children: "Category"
                                        }, void 0, false, {
                                            fileName: "[project]/components/promotions/edit-sale-modal.tsx",
                                            lineNumber: 159,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "subcategory",
                                            children: "Subcategory"
                                        }, void 0, false, {
                                            fileName: "[project]/components/promotions/edit-sale-modal.tsx",
                                            lineNumber: 160,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/promotions/edit-sale-modal.tsx",
                                    lineNumber: 145,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/promotions/edit-sale-modal.tsx",
                            lineNumber: 143,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginBottom: "20px"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    style: {
                                        display: "block",
                                        marginBottom: "5px",
                                        color: "#444"
                                    },
                                    children: "Meta Data (JSON):"
                                }, void 0, false, {
                                    fileName: "[project]/components/promotions/edit-sale-modal.tsx",
                                    lineNumber: 166,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                    name: "meta_data",
                                    value: JSON.stringify(formData.meta_data, null, 2),
                                    onChange: handleChange,
                                    rows: 5,
                                    style: {
                                        width: "100%",
                                        padding: "10px",
                                        borderRadius: "6px",
                                        border: "1px solid #ccc",
                                        outlineColor: "#4CAF50",
                                        color: "#333",
                                        fontFamily: "monospace"
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/components/promotions/edit-sale-modal.tsx",
                                    lineNumber: 167,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/promotions/edit-sale-modal.tsx",
                            lineNumber: 165,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                textAlign: "right"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    style: {
                                        backgroundColor: "#4CAF50",
                                        color: "white",
                                        padding: "10px 20px",
                                        border: "none",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                        marginRight: "10px"
                                    },
                                    children: "Save"
                                }, void 0, false, {
                                    fileName: "[project]/components/promotions/edit-sale-modal.tsx",
                                    lineNumber: 186,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: onClose,
                                    style: {
                                        backgroundColor: "#f44336",
                                        color: "white",
                                        padding: "10px 20px",
                                        border: "none",
                                        borderRadius: "6px",
                                        cursor: "pointer"
                                    },
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/components/promotions/edit-sale-modal.tsx",
                                    lineNumber: 200,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/promotions/edit-sale-modal.tsx",
                            lineNumber: 185,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/promotions/edit-sale-modal.tsx",
                    lineNumber: 83,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/promotions/edit-sale-modal.tsx",
            lineNumber: 70,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/promotions/edit-sale-modal.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
_s(EditSaleModal, "70XzBu0WLKMJnd1SBeOXb5LW+7M=");
_c = EditSaleModal;
var _c;
__turbopack_context__.k.register(_c, "EditSaleModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/promotions/sales-management.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "SalesManagement": (()=>SalesManagement)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$libs$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/libs/api/index.ts [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$libs$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/libs/api/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$promotions$2f$edit$2d$sale$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/promotions/edit-sale-modal.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function SalesManagement() {
    _s();
    const [sales, setSales] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [editingSale, setEditingSale] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SalesManagement.useEffect": ()=>{
            loadSales();
        }
    }["SalesManagement.useEffect"], []);
    const emptySale = {
        id: "",
        name: "",
        image_url: [],
        description: "",
        start_date: new Date(),
        end_date: new Date(),
        discount_percentage: 0,
        sale_type: "product",
        product_ids: [],
        category_ids: [],
        subcategory_ids: [],
        meta_data: {},
        created_at: new Date(),
        updated_at: new Date()
    };
    const loadSales = async ()=>{
        try {
            const salesData = await __TURBOPACK__imported__module__$5b$project$5d2f$libs$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APISDK"].getInstance().getSales();
            setSales(salesData);
        } catch (error) {
            console.error("Failed to load sales:", error);
        }
    };
    const handleDeleteSale = async (saleId)=>{
        if (!window.confirm("Are you sure you want to delete this sale?")) {
            return;
        }
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$libs$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APISDK"].getInstance().deleteSale(saleId);
            loadSales();
        } catch (error) {
            console.error("Failed to delete sale:", error);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: '20px',
            backgroundColor: '#f9f9f9'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                style: {
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    padding: '10px 20px',
                    marginBottom: '20px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                },
                onClick: ()=>setEditingSale(emptySale),
                children: "Create New Sale"
            }, void 0, false, {
                fileName: "[project]/components/promotions/sales-management.tsx",
                lineNumber: 54,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                style: {
                    width: '100%',
                    borderCollapse: 'collapse'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                            style: {
                                backgroundColor: '#f2f2f2'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                    style: {
                                        padding: '10px',
                                        borderBottom: '1px solid #ddd',
                                        color: "black"
                                    },
                                    children: "Name"
                                }, void 0, false, {
                                    fileName: "[project]/components/promotions/sales-management.tsx",
                                    lineNumber: 72,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                    style: {
                                        padding: '10px',
                                        borderBottom: '1px solid #ddd',
                                        color: "black"
                                    },
                                    children: "Start Date"
                                }, void 0, false, {
                                    fileName: "[project]/components/promotions/sales-management.tsx",
                                    lineNumber: 73,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                    style: {
                                        padding: '10px',
                                        borderBottom: '1px solid #ddd',
                                        color: "black"
                                    },
                                    children: "End Date"
                                }, void 0, false, {
                                    fileName: "[project]/components/promotions/sales-management.tsx",
                                    lineNumber: 74,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                    style: {
                                        padding: '10px',
                                        borderBottom: '1px solid #ddd',
                                        color: "black"
                                    },
                                    children: "Actions"
                                }, void 0, false, {
                                    fileName: "[project]/components/promotions/sales-management.tsx",
                                    lineNumber: 75,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/promotions/sales-management.tsx",
                            lineNumber: 71,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/promotions/sales-management.tsx",
                        lineNumber: 70,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                        children: sales.map((sale)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        style: {
                                            padding: '10px',
                                            borderBottom: '1px solid #ddd'
                                        },
                                        children: sale.name
                                    }, void 0, false, {
                                        fileName: "[project]/components/promotions/sales-management.tsx",
                                        lineNumber: 81,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        style: {
                                            padding: '10px',
                                            borderBottom: '1px solid #ddd'
                                        },
                                        children: new Date(sale.start_date).toLocaleDateString()
                                    }, void 0, false, {
                                        fileName: "[project]/components/promotions/sales-management.tsx",
                                        lineNumber: 82,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        style: {
                                            padding: '10px',
                                            borderBottom: '1px solid #ddd'
                                        },
                                        children: new Date(sale.end_date).toLocaleDateString()
                                    }, void 0, false, {
                                        fileName: "[project]/components/promotions/sales-management.tsx",
                                        lineNumber: 83,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        style: {
                                            padding: '10px',
                                            borderBottom: '1px solid #ddd'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                style: {
                                                    backgroundColor: '#008CBA',
                                                    color: 'white',
                                                    padding: '5px 10px',
                                                    marginRight: '5px',
                                                    border: 'none',
                                                    borderRadius: '5px',
                                                    cursor: 'pointer'
                                                },
                                                onClick: ()=>setEditingSale(sale),
                                                children: "Edit"
                                            }, void 0, false, {
                                                fileName: "[project]/components/promotions/sales-management.tsx",
                                                lineNumber: 85,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                style: {
                                                    backgroundColor: '#f44336',
                                                    color: 'white',
                                                    padding: '5px 10px',
                                                    border: 'none',
                                                    borderRadius: '5px',
                                                    cursor: 'pointer'
                                                },
                                                onClick: ()=>handleDeleteSale(sale.id),
                                                children: "Delete"
                                            }, void 0, false, {
                                                fileName: "[project]/components/promotions/sales-management.tsx",
                                                lineNumber: 99,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/promotions/sales-management.tsx",
                                        lineNumber: 84,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, sale.id, true, {
                                fileName: "[project]/components/promotions/sales-management.tsx",
                                lineNumber: 80,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/promotions/sales-management.tsx",
                        lineNumber: 78,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/promotions/sales-management.tsx",
                lineNumber: 69,
                columnNumber: 7
            }, this),
            editingSale && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$promotions$2f$edit$2d$sale$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EditSaleModal"], {
                sale: editingSale,
                onClose: ()=>setEditingSale(null),
                onSave: loadSales
            }, void 0, false, {
                fileName: "[project]/components/promotions/sales-management.tsx",
                lineNumber: 118,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/promotions/sales-management.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
_s(SalesManagement, "8BIlRbYa7HrpGCzulcMpWHOxgBA=");
_c = SalesManagement;
var _c;
__turbopack_context__.k.register(_c, "SalesManagement");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=components_promotions_bda04bef._.js.map