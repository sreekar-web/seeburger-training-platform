export const mappingRegistry = {
    MAP_850_IN: [
        {
            version: 1,
            status: "ACTIVE",
            bicmd: `
RULE RULE_1
  FROM /X12_850/GS/ST/PO1_LOOP/PO1/PO101
  TO   /Order/Items/Item/SKU
  TYPE DIRECT
  LOOP PO1[*]
END
`,
            activatedAt: new Date().toISOString()
        }
    ]
};
