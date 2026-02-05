import { validationProfiles } from "../data/validationProfiles";

export function executeValidation(input, partner, docType) {
    const errors = [];

    // 1️⃣ Mandatory segment: N1 (always ERROR)
    if (!input.N1 || input.N1.length === 0) {
        errors.push({
            stage: "VALIDATION",
            severity: "ERROR",
            code: "VAL_MISSING_SEGMENT",
            message: "Mandatory segment N1 missing"
        });
    }

    // 2️⃣ Loop cardinality: PO1 >= 1 (always ERROR)
    if (!input.PO1 || input.PO1.length < 1) {
        errors.push({
            stage: "VALIDATION",
            severity: "ERROR",
            code: "VAL_LOOP_CARDINALITY",
            message: "PO1 loop must occur at least once"
        });
    }

    // 3️⃣ Partner + document validation profile
    const profile = validationProfiles?.[partner]?.[docType];

    // BIS rule: no profile → no validation
    if (!profile) {
        return { isValid: true, errors: [] };
    }

    // 4️⃣ Element-level validation
    if (input.PO1 && profile.PO1) {
        input.PO1.forEach((po1, index) => {
            Object.entries(profile.PO1).forEach(([element, rule]) => {
                const value = po1[element];
                const severity = rule.severity || "ERROR";

                // Mandatory element
                if (rule.mandatory && !value) {
                    errors.push({
                        stage: "VALIDATION",
                        severity,
                        segment: "PO1",
                        element,
                        code: "VAL_MISSING_ELEMENT",
                        message: `${partner} PO1[${index + 1}] missing ${element}`
                    });
                    return;
                }

                // Type check
                if (value && rule.type === "NUMBER" && isNaN(value)) {
                    errors.push({
                        stage: "VALIDATION",
                        severity,
                        segment: "PO1",
                        element,
                        code: "VAL_TYPE",
                        message: `${partner} PO1[${index + 1}] ${element} must be numeric`
                    });
                }

                // Code list
                if (
                    value &&
                    rule.codeList &&
                    !rule.codeList.includes(value)
                ) {
                    errors.push({
                        stage: "VALIDATION",
                        severity,
                        segment: "PO1",
                        element,
                        code: "VAL_CODELIST",
                        message: `${partner} PO1[${index + 1}] ${element} invalid value '${value}'`
                    });
                }
            });
        });
    }

    // 5️⃣ Severity-aware validation result
    const hasBlockingError = errors.some(
        (e) => e.severity === "ERROR"
    );

    return {
        isValid: !hasBlockingError,
        errors
    };
}
