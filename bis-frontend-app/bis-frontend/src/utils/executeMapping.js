export function executeMapping(rules, input) {
    const runtimeErrors = [];
    const output = {};

    try {
        rules.forEach(rule => {
            if (!rule.from || !rule.to) {
                runtimeErrors.push(
                    `Invalid rule ${rule.id}: FROM/TO missing`
                );
            }
        });

        if (runtimeErrors.length > 0) {
            return {
                output: null,
                runtimeErrors,
                ackCode: "999",
                ackMessage: "Mapping failed"
            };
        }

        // Simulated success output
        output.Items = input.Items.map(i => ({
            SKU: i.SKU
        }));

        return {
            output,
            runtimeErrors: [],
            ackCode: "997",
            ackMessage: "Accepted"
        };

    } catch (e) {
        return {
            output: null,
            runtimeErrors: [e.message],
            ackCode: "999",
            ackMessage: "Runtime error"
        };
    }
}
