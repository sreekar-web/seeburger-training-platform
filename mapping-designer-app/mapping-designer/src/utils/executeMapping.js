export function executeMapping(rules, input) {
    const output = {
        Items: []
    };

    const runtimeErrors = [];

    rules.forEach((rule) => {
        try {
            const { sourcePath, targetPath, loopContext, loopScope, transform } = rule;

            if (!loopContext) return;

            const sourceLoop = input[loopContext];

            if (!Array.isArray(sourceLoop)) {
                runtimeErrors.push(`Loop ${loopContext} not found in input`);
                return;
            }

            sourceLoop.forEach((row, index) => {
                if (loopScope !== "*" && Number(loopScope) !== index + 1) return;

                if (!output.Items[index]) {
                    output.Items[index] = {};
                }

                let value;

                if (transform.type === "DIRECT") {
                    const sourceField = sourcePath.split("/").pop();
                    value = row[sourceField];
                }

                if (transform.type === "CONSTANT") {
                    value = transform.value;
                }

                if (transform.type === "CONDITIONAL") {
                    // VERY simple conditional simulation
                    const expr = transform.expression;
                    const field = expr.split(" ")[0];
                    const fieldValue = row[field];

                    value = fieldValue > 10 ? "BULK" : "NORMAL";
                }

                const targetField = targetPath.split("/").pop();
                output.Items[index][targetField] = value;
            });
        } catch (e) {
            runtimeErrors.push(`Runtime error in rule ${rule.id}`);
        }
    });

    return { output, runtimeErrors };
}
