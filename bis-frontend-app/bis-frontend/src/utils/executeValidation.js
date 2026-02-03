import { validationRules } from "../data/validationRules";

export function executeValidation(input) {
    const errors = [];

    // 1️⃣ Mandatory segment: N1
    if (!input.N1 || input.N1.length === 0) {
        errors.push({
            stage: "VALIDATION",
            code: "VAL_MISSING_SEGMENT",
            message: "Mandatory segment N1 missing"
        });
    }

    // 2️⃣ Loop cardinality: PO1 >= 1
    if (!input.PO1 || input.PO1.length < 1) {
        errors.push({
            stage: "VALIDATION",
            code: "VAL_LOOP_CARDINALITY",
            message: "PO1 loop must occur at least once"
        });
    }

    // 3️⃣ Element-level validation
    if (input.PO1 && validationRules.PO1) {
        input.PO1.forEach((po1, index) => {
            Object.entries(validationRules.PO1).forEach(
                ([element, rule]) => {

                    const value = po1[element];

                    // Mandatory
                    if (rule.mandatory && !value) {
                        errors.push({
                            stage: "VALIDATION",
                            code: "VAL_MISSING_ELEMENT",
                            message: `PO1[${index + 1}] missing mandatory element ${element}`
                        });
                        return;
                    }

                    // Length
                    if (value && rule.minLength && value.length < rule.minLength) {
                        errors.push({
                            stage: "VALIDATION",
                            code: "VAL_MIN_LENGTH",
                            message: `PO1[${index + 1}] ${element} below minimum length`
                        });
                    }

                    if (value && rule.maxLength && value.length > rule.maxLength) {
                        errors.push({
                            stage: "VALIDATION",
                            code: "VAL_MAX_LENGTH",
                            message: `PO1[${index + 1}] ${element} exceeds maximum length`
                        });
                    }

                    // Type
                    if (value && rule.type === "NUMBER" && isNaN(value)) {
                        errors.push({
                            stage: "VALIDATION",
                            code: "VAL_TYPE",
                            message: `PO1[${index + 1}] ${element} must be numeric`
                        });
                    }

                    // Code list
                    if (value && rule.codeList && !rule.codeList.includes(value)) {
                        errors.push({
                            stage: "VALIDATION",
                            code: "VAL_CODELIST",
                            message: `PO1[${index + 1}] ${element} invalid value '${value}'`
                        });
                    }
                }
            );
        });
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}
