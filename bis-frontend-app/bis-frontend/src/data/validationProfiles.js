export const validationProfiles = {
    Amazon: {
        "850": {
            PO1: {
                PO101: {
                    mandatory: true,
                    severity: "ERROR"
                },
                PO102: {
                    mandatory: true,
                    type: "NUMBER",
                    severity: "ERROR"
                },
                PO103: {
                    mandatory: true,
                    codeList: ["EA"],
                    severity: "WARNING" // 👈 key change
                }
            }
        }
    }
};
