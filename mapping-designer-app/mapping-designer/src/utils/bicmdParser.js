export function parseBICMD(text) {
    const rules = [];
    const errors = [];

    const blocks = text.split("RULE ").slice(1);

    blocks.forEach((block, idx) => {
        const ruleErrors = [];
        const lines = block
            .split("\n")
            .map(l => l.trim())
            .filter(Boolean);

        const id = lines[0];

        let rule = {
            id,
            sourcePath: null,
            targetPath: null,
            loopContext: null,
            loopScope: "*",
            transform: { type: "DIRECT" }
        };

        lines.forEach(line => {
            if (line.startsWith("FROM ")) {
                rule.sourcePath = line.replace("FROM ", "");
            } else if (line.startsWith("CONST ")) {
                rule.transform = {
                    type: "CONSTANT",
                    value: line.replace("CONST ", "").replace(/"/g, "")
                };
            } else if (line.startsWith("TO ")) {
                rule.targetPath = line.replace("TO ", "");
            } else if (line.startsWith("TYPE ")) {
                rule.transform.type = line.replace("TYPE ", "");
            } else if (line.startsWith("IF ")) {
                rule.transform = {
                    type: "CONDITIONAL",
                    expression: line.replace("IF ", "")
                };
            } else if (line.startsWith("LOOP ")) {
                const loop = line.replace("LOOP ", "");
                const match = loop.match(/(.*)\[(.*)\]/);
                if (match) {
                    rule.loopContext = match[1];
                    rule.loopScope = match[2];
                } else {
                    ruleErrors.push(`Invalid LOOP syntax in ${id}`);
                }
            }
        });

        if (!rule.sourcePath && rule.transform.type !== "CONSTANT") {
            ruleErrors.push(`Missing FROM in ${id}`);
        }

        if (!rule.targetPath) {
            ruleErrors.push(`Missing TO in ${id}`);
        }

        if (rule.transform.type === "CONDITIONAL" && !rule.transform.expression) {
            ruleErrors.push(`Missing IF expression in ${id}`);
        }

        if (ruleErrors.length > 0) {
            errors.push(...ruleErrors);
        } else {
            rules.push(rule);
        }
    });

    return { rules, errors };
}
