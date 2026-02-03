export const validationRules = {
    PO1: {
        PO101: {
            mandatory: true,
            minLength: 1,
            maxLength: 20,
            type: "ALPHANUM"
        },
        PO102: {
            mandatory: true,
            type: "NUMBER"
        },
        PO103: {
            mandatory: true,
            codeList: ["EA", "KG", "LB"]
        }
    }
};
