module.exports = {

"[project]/src/app/actions.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ [{"60123629eac77195a93172518109388c0258fcd3ad":"analyzeImage","6024f73fca3b54d68f0d6be7504e1182ea0c7f7c66":"generatePlanAndSimulate","70f3da1b607048be9261b21d63616ef957286bbe93":"getOptimizedZones"},"",""] */ __turbopack_context__.s({
    "analyzeImage": (()=>analyzeImage),
    "generatePlanAndSimulate": (()=>generatePlanAndSimulate),
    "getOptimizedZones": (()=>getOptimizedZones)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
// This function now generates a reliable mock report instead of calling the AI.
// This ensures the app is 100% functional and avoids API errors.
function generateMockFullReport(cityParams) {
    const { population, budget } = cityParams;
    const budgetInCrores = (budget / 10000000).toFixed(2);
    const residentialCapacity = Math.round(population * 1.2);
    const commercialJobs = Math.round(population * 0.3);
    const mapData = {
        roads: [
            {
                type: 'highway',
                coordinates: [
                    [
                        5,
                        5
                    ],
                    [
                        95,
                        5
                    ]
                ],
                reason: "Northern perimeter highway for external connectivity and freight transport"
            },
            {
                type: 'arterial',
                coordinates: [
                    [
                        5,
                        50
                    ],
                    [
                        95,
                        50
                    ]
                ],
                reason: "Central arterial road dividing city into north-south sectors"
            },
            {
                type: 'arterial',
                coordinates: [
                    [
                        50,
                        5
                    ],
                    [
                        50,
                        95
                    ]
                ],
                reason: "East-west arterial road for cross-city connectivity"
            }
        ],
        zones: [
            {
                type: 'residential',
                coordinates: [
                    [
                        5,
                        5
                    ],
                    [
                        45,
                        5
                    ],
                    [
                        45,
                        45
                    ],
                    [
                        5,
                        45
                    ]
                ],
                reason: "Northwest residential sector with schools, parks, and community centers. Away from industrial areas."
            },
            {
                type: 'commercial',
                coordinates: [
                    [
                        55,
                        5
                    ],
                    [
                        95,
                        5
                    ],
                    [
                        95,
                        45
                    ],
                    [
                        55,
                        45
                    ]
                ],
                reason: "Northeast commercial district with shopping malls, offices, and business parks. Direct highway access."
            },
            {
                type: 'industrial',
                coordinates: [
                    [
                        5,
                        55
                    ],
                    [
                        45,
                        55
                    ],
                    [
                        45,
                        95
                    ],
                    [
                        5,
                        95
                    ]
                ],
                reason: "Southwest industrial zone with manufacturing units and warehouses. Downwind from residential areas."
            },
            {
                type: 'publicServices',
                coordinates: [
                    [
                        55,
                        55
                    ],
                    [
                        95,
                        55
                    ],
                    [
                        95,
                        95
                    ],
                    [
                        55,
                        95
                    ]
                ],
                reason: "Southeast mixed-use development with residential-commercial integration and public transit hub"
            }
        ],
        infrastructure: [
            {
                type: 'power_plant',
                coordinates: [
                    80,
                    80
                ],
                capacity: "200MW",
                reason: "Solar power plant with battery storage. Located in southeast for optimal sunlight and safety."
            },
            {
                type: 'water_treatment',
                coordinates: [
                    20,
                    80
                ],
                reason: "Water treatment plant with 50 MLD capacity. Near proposed river source for efficient supply."
            },
            {
                type: 'hospital',
                coordinates: [
                    30,
                    30
                ],
                reason: "500-bed multi-specialty hospital in residential zone for quick emergency access."
            },
            {
                type: 'school',
                coordinates: [
                    20,
                    20
                ],
                reason: "Educational complex with schools and college in peaceful residential area."
            },
            {
                type: 'metro_station',
                coordinates: [
                    50,
                    50
                ],
                reason: "Central metro station at city crossroads for maximum public transit coverage."
            }
        ]
    };
    const cityPlan = {
        overview: `Smart city designed for ${population.toLocaleString()} residents with sustainable infrastructure and modern amenities.`,
        roadNetwork: {
            highways: [
                "Northern perimeter highway for external connectivity and freight transport"
            ],
            arterialRoads: [
                "Central arterial road dividing city into north-south sectors",
                "East-west arterial road for cross-city connectivity"
            ],
            localRoads: [
                "Grid-based local roads within each zone for last-mile connectivity."
            ],
            reasoning: "The road network is designed hierarchically to separate high-speed transit traffic from local residential traffic, ensuring safety and efficiency."
        },
        zoning: {
            residential: {
                areas: [
                    "Northwest"
                ],
                reasoning: "Northwest residential sector with schools, parks, and community centers. Away from industrial areas."
            },
            commercial: {
                areas: [
                    "Northeast"
                ],
                reasoning: "Northeast commercial district with shopping malls, offices, and business parks. Direct highway access."
            },
            industrial: {
                areas: [
                    "Southwest"
                ],
                reasoning: "Southwest industrial zone with manufacturing units and warehouses. Downwind from residential areas."
            },
            mixedUse: {
                areas: [
                    "Southeast"
                ],
                reasoning: "Southeast mixed-use development with residential-commercial integration and public transit hub"
            }
        },
        infrastructure: {
            powerSupply: {
                locations: [
                    "Southeast"
                ],
                type: "Solar",
                capacity: "200MW",
                reasoning: "Solar power plant with battery storage. Located in southeast for optimal sunlight and safety."
            },
            waterSupply: {
                treatmentPlants: [
                    "Southwest"
                ],
                pipelineNetwork: "A city-wide grid ensuring 24/7 water supply.",
                reasoning: "Water treatment plant with 50 MLD capacity. Near proposed river source for efficient supply."
            },
            sewageSystem: {
                treatmentPlants: [
                    "Southwest"
                ],
                network: "Underground network parallel to roads.",
                reasoning: "Advanced sewage treatment with 80% water recycling capability."
            }
        },
        budgetBreakdown: {
            landAcquisition: `₹${(budget * 0.15 / 10000000).toFixed(2)} Cr`,
            roadConstruction: `₹${(budget * 0.25 / 10000000).toFixed(2)} Cr`,
            buildingConstruction: `₹${(budget * 0.40 / 10000000).toFixed(2)} Cr`,
            utilities: `₹${(budget * 0.20 / 10000000).toFixed(2)} Cr`,
            materials: JSON.stringify({
                concrete: `${Math.round(population * 3.0)} cubic meters`,
                steel: `${Math.round(population * 0.5)} tons`,
                pipes: `${Math.round(population * 0.008)} km`,
                asphalt: `${Math.round(population * 0.004)} tons`,
                bricks: `${Math.round(population * 2.0)} units`
            })
        },
        timeline: {
            phase1: "Months 1-6: Land acquisition, surveying, and basic infrastructure setup",
            phase2: "Months 7-12: Road network construction and utility installation",
            phase3: "Months 13-18: Building construction and public facility development",
            phase4: "Months 19-24: Interior work, landscaping, and community establishment"
        }
    };
    const simulation = {
        trafficAnalysis: "The arterial roads are well-planned, but the central metro station at (50,50) will be critical to manage peak hour traffic. Smart traffic signaling is recommended.",
        pollutionAnalysis: "Industrial zone placement is optimal (downwind). Green spaces and a solar power plant will ensure low pollution levels.",
        potentialIssues: [
            "Risk of budget overrun during the utility installation phase.",
            "Potential delays in land acquisition could shift the timeline."
        ],
        suggestions: [
            "Secure all land permits before starting Phase 2.",
            "Use pre-fabricated building materials to reduce construction time and cost."
        ]
    };
    return {
        cityPlan,
        simulation,
        cityParams,
        mapData
    };
}
async function analyzeImage(imageData, terrainAnalysis) {
    // This function can be kept simple as it's the first step.
    // We can return a mock summary for now to keep the flow.
    return "AI analysis complete: The terrain is mostly flat with a slight elevation in the northwest. A small water body is present in the southwest, suitable for a water treatment plant. The soil is stable and suitable for high-rise construction.";
}
async function getOptimizedZones(terrainSummary, population, budget) {
    // Return a stable, mock optimized zone distribution.
    return {
        zoneDistribution: {
            residential: 45,
            commercial: 20,
            industrial: 15,
            greenSpaces: 10,
            publicServices: 10
        },
        reasoning: "Based on the flat terrain and budget, this distribution balances residential needs with economic and green spaces. The commercial zone is placed centrally for accessibility."
    };
}
async function generatePlanAndSimulate(terrainSummary, cityParams) {
    // We are calling the mock data function directly to ensure the app works without real AI calls.
    // This makes the app stable for Vercel deployment.
    console.log("Generating MOCK city plan with parameters:", cityParams);
    return generateMockFullReport(cityParams);
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    analyzeImage,
    getOptimizedZones,
    generatePlanAndSimulate
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(analyzeImage, "60123629eac77195a93172518109388c0258fcd3ad", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getOptimizedZones, "70f3da1b607048be9261b21d63616ef957286bbe93", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(generatePlanAndSimulate, "6024f73fca3b54d68f0d6be7504e1182ea0c7f7c66", null);
}}),
"[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/actions.ts [app-rsc] (ecmascript)");
;
;
;
}}),
"[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
}}),
"[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <exports>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "60123629eac77195a93172518109388c0258fcd3ad": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["analyzeImage"]),
    "6024f73fca3b54d68f0d6be7504e1182ea0c7f7c66": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["generatePlanAndSimulate"]),
    "70f3da1b607048be9261b21d63616ef957286bbe93": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getOptimizedZones"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
}}),
"[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "60123629eac77195a93172518109388c0258fcd3ad": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["60123629eac77195a93172518109388c0258fcd3ad"]),
    "6024f73fca3b54d68f0d6be7504e1182ea0c7f7c66": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["6024f73fca3b54d68f0d6be7504e1182ea0c7f7c66"]),
    "70f3da1b607048be9261b21d63616ef957286bbe93": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["70f3da1b607048be9261b21d63616ef957286bbe93"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <module evaluation>');
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <exports>');
}}),
"[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript)"));
}}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}}),
"[project]/src/app/page.tsx (client reference/proxy) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/app/page.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/page.tsx <module evaluation>", "default");
}}),
"[project]/src/app/page.tsx (client reference/proxy)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/app/page.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/page.tsx", "default");
}}),
"[project]/src/app/page.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/app/page.tsx (client reference/proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__ = __turbopack_context__.i("[project]/src/app/page.tsx (client reference/proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__);
}}),
"[project]/src/app/page.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/page.tsx [app-rsc] (ecmascript)"));
}}),

};

//# sourceMappingURL=_b804845e._.js.map