export const sampleInput = {
    ISA: {
        sender: "SENDER",
        receiver: "RECEIVER"
    },

    GS: {
        functionalId: "PO"
    },

    ST: {
        transactionSet: "850"
    },

    // Mandatory N1 segment
    N1: [
        {
            entityId: "ST",
            name: "Ship To"
        }
    ],

    // PO1 loop (mandatory, >=1)
    PO1: [
        {
            PO101: "SKU-001",
            PO102: 2,
            PO103: "KG",
            PO104: 10
        },
        {
            PO101: "SKU-002",
            PO102: 1,
            PO103: "EA",
            PO104: 5
        }
    ]
};
