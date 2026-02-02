export const sourceStructure = {
    name: "X12_850",
    type: "ROOT",
    children: [
        {
            name: "GS",
            type: "SEGMENT",
            children: [
                {
                    name: "ST",
                    type: "SEGMENT",
                    children: [
                        {
                            name: "N1_LOOP",
                            type: "LOOP",
                            children: [
                                {
                                    name: "N1",
                                    type: "SEGMENT",
                                    children: [
                                        { name: "N101", type: "ELEMENT", mandatory: true },
                                        { name: "N102", type: "ELEMENT" },
                                        { name: "N103", type: "ELEMENT" },
                                        { name: "N104", type: "ELEMENT" }
                                    ]
                                }
                            ]
                        },
                        {
                            name: "PO1_LOOP",
                            type: "LOOP",
                            children: [
                                {
                                    name: "PO1",
                                    type: "SEGMENT",
                                    children: [
                                        { name: "PO101", type: "ELEMENT", mandatory: true },
                                        { name: "PO102", type: "ELEMENT" },
                                        { name: "PO103", type: "ELEMENT" },
                                        { name: "PO104", type: "ELEMENT" }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};

export const targetStructure = {
    name: "Order",
    type: "ROOT",
    children: [
        {
            name: "Items",
            type: "NODE",
            children: [
                {
                    name: "Item",
                    type: "NODE",
                    children: [
                        { name: "SKU", type: "FIELD" },
                        { name: "Quantity", type: "FIELD" },
                        { name: "UOM", type: "FIELD" }
                    ]
                }
            ]
        }
    ]
};
